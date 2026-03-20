import { useState, useRef } from "react";
import { useAuth, useProjects, useImageUpload } from "../hooks/useProjects";
import { useContent, useContact } from "../hooks/useContent";

const inputClass = "w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-600 transition-colors bg-white";
const labelClass = "text-xs text-stone-500 mb-1 block";

// ── Navbar del admin ───────────────────────────────────────────────────────────
function AdminNav({ active, setActive, onLogout }) {
  const tabs = ["proyectos", "equipo", "servicios", "faq", "contacto"];
  return (
    <header className="bg-white border-b border-stone-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-stone-900">studio<span className="text-stone-400">·lab</span> <span className="text-stone-400 text-sm font-normal">/ Admin</span></span>
          <nav className="hidden md:flex gap-1">
            {tabs.map((t) => (
              <button key={t} onClick={() => setActive(t)}
                className={`capitalize text-sm px-3 py-1.5 rounded-lg transition-colors ${active === t ? "bg-stone-100 text-stone-900 font-medium" : "text-stone-400 hover:text-stone-700"}`}>
                {t}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={onLogout} className="text-sm text-stone-400 hover:text-stone-700 transition-colors">Cerrar sesión</button>
      </div>
    </header>
  );
}

// ── Image Uploader ─────────────────────────────────────────────────────────────
function ImageUploader({ value, onChange }) {
  const { upload, uploading } = useImageUpload();
  const fileRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const result = await upload(file);
    if (result.url) onChange(result.url);
    else alert("Error al subir: " + result.error);
  };

  return (
    <div>
      <div onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${drag ? "border-stone-500 bg-stone-50" : "border-stone-200 hover:border-stone-400"}`}>
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-stone-400 text-xs">Subiendo…</p>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center gap-2">
            <img src={value} alt="preview" className="h-24 w-full object-cover rounded-lg" onError={(e) => (e.target.style.display = "none")} />
            <p className="text-stone-400 text-xs">Clic o arrastrá para cambiar</p>
          </div>
        ) : (
          <div className="py-2">
            <p className="text-stone-400 text-sm">↑ Arrastrá o hacé clic</p>
            <p className="text-stone-300 text-xs mt-1">JPG, PNG, WEBP — máx. 5MB</p>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      <input type="text" placeholder="O pegá una URL" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass + " mt-2 text-xs"} />
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState("");
  const show = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const Toast = () => toast ? (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-sm px-5 py-3 rounded-full shadow-lg z-50">{toast}</div>
  ) : null;
  return { show, Toast };
}

// ── Sección: Proyectos ─────────────────────────────────────────────────────────
const emptyProject = { title: "", client: "", industry: "", description: "", tags: "", year: new Date().getFullYear(), image_url: "", live_url: "", published: true };

function ProjectsSection() {
  const { projects, loading, error, add, update, remove, togglePublished } = useProjects(true);
  const { show, Toast } = useToast();
  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyProject);

  const openAdd  = () => { setForm(emptyProject); setView("form"); setEditing(null); };
  const openEdit = (p) => { setForm({ ...p, tags: (p.tags ?? []).join(", ") }); setEditing(p); setView("form"); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form, year: parseInt(form.year), tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    const result = editing ? await update(editing.id, data) : await add(data);
    setSaving(false);
    if (result.error) { show("Error: " + result.error); return; }
    show(editing ? "Proyecto actualizado ✓" : "Proyecto agregado ✓");
    setView("list");
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Borrar este proyecto?")) return;
    const r = await remove(id);
    if (r.error) show("Error: " + r.error); else show("Eliminado");
  };

  if (view === "form") return (
    <div className="bg-white border border-stone-200 rounded-2xl p-8">
      <h2 className="text-lg font-bold text-stone-900 mb-6">{editing ? "Editar proyecto" : "Nuevo proyecto"}</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[["title","Título *",true],["client","Cliente *",true],["industry","Industria *",true],["year","Año",false]].map(([n,l,r]) => (
            <div key={n}><label className={labelClass}>{l}</label>
              <input name={n} required={r} value={form[n]} onChange={(e) => setForm({...form,[n]:e.target.value})} className={inputClass} /></div>
          ))}
        </div>
        <div><label className={labelClass}>Descripción *</label>
          <textarea name="description" required rows={3} value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} className={inputClass + " resize-none"} /></div>
        <div><label className={labelClass}>Tecnologías (separadas por coma)</label>
          <input value={form.tags} onChange={(e) => setForm({...form,tags:e.target.value})} placeholder="React, Node.js…" className={inputClass} /></div>
        <div><label className={labelClass}>Imagen</label>
          <ImageUploader value={form.image_url} onChange={(url) => setForm({...form,image_url:url})} /></div>
        <div><label className={labelClass}>Link al sitio en vivo</label>
          <input value={form.live_url} onChange={(e) => setForm({...form,live_url:e.target.value})} placeholder="https://cliente.com" className={inputClass} /></div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({...form,published:e.target.checked})} />
          <span className="text-sm text-stone-600">Publicado</span>
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors">{saving ? "Guardando…" : "Guardar"}</button>
          <button type="button" onClick={() => setView("list")} className="border border-stone-200 text-stone-600 px-6 py-2.5 rounded-full text-sm hover:border-stone-400 transition-colors">Cancelar</button>
        </div>
      </form>
      <Toast />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-stone-900">Proyectos</h1>
          <p className="text-stone-400 text-sm">{projects.length} proyecto{projects.length !== 1 ? "s" : ""}</p></div>
        <button onClick={openAdd} className="bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 transition-colors">+ Nuevo</button>
      </div>
      {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2].map((i) => <div key={i} className="h-36 border border-stone-200 rounded-2xl animate-pulse bg-stone-50" />)}</div>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && projects.length === 0 && <p className="text-stone-400 text-sm text-center py-16">No hay proyectos aún.</p>}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
              {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-32 object-cover" />}
              <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 truncate">{p.title}</p>
                    <p className="text-xs text-stone-400">{p.client} · {p.industry} · {p.year}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => togglePublished(p.id, p.published)} className={`text-xs px-3 py-1 rounded-full border transition-colors ${p.published ? "border-green-200 text-green-600" : "border-stone-200 text-stone-400"}`}>{p.published ? "Publicado" : "Oculto"}</button>
                    <button onClick={() => openEdit(p)} className="text-xs text-stone-500 border border-stone-200 px-3 py-1 rounded-full hover:border-stone-400 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 border border-red-100 px-3 py-1 rounded-full hover:bg-red-50 transition-colors">Borrar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Toast />
    </div>
  );
}

// ── Sección genérica: Equipo / Servicios / FAQ ─────────────────────────────────
function ContentSection({ resource, title, fields, emptyItem }) {
  const { items, loading, add, update, remove } = useContent(resource);
  const { show, Toast } = useToast();
  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [saving, setSaving] = useState(false);

  const openAdd  = () => { setForm(emptyItem); setEditing(null); setView("form"); };
  const openEdit = (item) => { setForm(item); setEditing(item); setView("form"); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = editing ? await update(editing.id, form) : await add(form);
    setSaving(false);
    if (result.error) { show("Error: " + result.error); return; }
    show(editing ? "Actualizado ✓" : "Agregado ✓");
    setView("list");
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Borrar este elemento?")) return;
    const r = await remove(id);
    if (r.error) show("Error: " + r.error); else show("Eliminado");
  };

  if (view === "form") return (
    <div className="bg-white border border-stone-200 rounded-2xl p-8">
      <h2 className="text-lg font-bold text-stone-900 mb-6">{editing ? `Editar` : `Nuevo`}</h2>
      <form onSubmit={handleSave} className="space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className={labelClass}>{f.label}{f.required ? " *" : ""}</label>
            {f.type === "textarea" ? (
              <textarea required={f.required} rows={f.rows ?? 3} value={form[f.name] ?? ""} onChange={(e) => setForm({...form,[f.name]:e.target.value})} placeholder={f.placeholder} className={inputClass + " resize-none"} />
            ) : f.type === "image" ? (
              <ImageUploader value={form[f.name] ?? ""} onChange={(url) => setForm({...form,[f.name]:url})} />
            ) : (
              <input required={f.required} value={form[f.name] ?? ""} onChange={(e) => setForm({...form,[f.name]:e.target.value})} placeholder={f.placeholder} className={inputClass} />
            )}
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors">{saving ? "Guardando…" : "Guardar"}</button>
          <button type="button" onClick={() => setView("list")} className="border border-stone-200 text-stone-600 px-6 py-2.5 rounded-full text-sm hover:border-stone-400 transition-colors">Cancelar</button>
        </div>
      </form>
      <Toast />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-stone-900">{title}</h1>
          <p className="text-stone-400 text-sm">{items.length} elemento{items.length !== 1 ? "s" : ""}</p></div>
        <button onClick={openAdd} className="bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 transition-colors">+ Nuevo</button>
      </div>
      {loading && <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-14 border border-stone-200 rounded-xl animate-pulse bg-stone-50" />)}</div>}
      {!loading && items.length === 0 && <p className="text-stone-400 text-sm text-center py-16">No hay elementos aún.</p>}
      {!loading && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="border border-stone-200 rounded-xl p-4 bg-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
                {item.icon && <span className="text-stone-400 text-lg flex-shrink-0">{item.icon}</span>}
                <div className="min-w-0">
                  <p className="font-medium text-stone-900 truncate">{item.name ?? item.title ?? item.question}</p>
                  <p className="text-xs text-stone-400 truncate">{item.role ?? item.description ?? item.answer}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="text-xs text-stone-500 border border-stone-200 px-3 py-1 rounded-full hover:border-stone-400 transition-colors">Editar</button>
                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 border border-red-100 px-3 py-1 rounded-full hover:bg-red-50 transition-colors">Borrar</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Toast />
    </div>
  );
}

// ── Sección: Contacto ──────────────────────────────────────────────────────────
function ContactSection() {
  const { contact, loading, update } = useContact();
  const { show, Toast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!form && contact) setTimeout(() => setForm(contact), 0);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await update(form);
    setSaving(false);
    if (result.error) show("Error: " + result.error);
    else show("Contacto actualizado ✓");
  };

  const f = form ?? contact ?? {};
  const fields = [
    ["email","Email","hola@tuagencia.com"],["address","Dirección","Ciudad, País"],
    ["hours","Horario","Lun – Vie, 9 – 18 hs"],["phone","Teléfono","+54 ..."],
    ["linkedin","LinkedIn","https://linkedin.com/company/..."],
    ["github","GitHub","https://github.com/..."],
    ["instagram","Instagram","https://instagram.com/..."],
  ];

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-stone-900">Contacto</h1>
        <p className="text-stone-400 text-sm">Información que aparece en la sección de contacto</p></div>
      {loading ? <div className="h-64 border border-stone-200 rounded-2xl animate-pulse bg-stone-50" /> : (
        <div className="bg-white border border-stone-200 rounded-2xl p-8">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(([key, label, placeholder]) => (
                <div key={key}><label className={labelClass}>{label}</label>
                  <input value={f[key] ?? ""} onChange={(e) => setForm({...f,[key]:e.target.value})} placeholder={placeholder} className={inputClass} /></div>
              ))}
            </div>
            <button type="submit" disabled={saving} className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors">{saving ? "Guardando…" : "Guardar cambios"}</button>
          </form>
        </div>
      )}
      <Toast />
    </div>
  );
}

// ── Login ──────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    const result = await login(email, password);
    if (result.error) setError("Email o contraseña incorrectos.");
    else onLogin();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="bg-white border border-stone-200 rounded-2xl p-10 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">Panel admin</h1>
        <p className="text-stone-400 text-sm mb-8">studio·lab</p>
        <form onSubmit={submit} className="space-y-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          <input type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass + (error ? " border-red-300" : "")} />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white rounded-full py-3 text-sm font-medium hover:bg-stone-700 transition-colors disabled:opacity-50">
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Panel principal ────────────────────────────────────────────────────────────
function AdminPanel({ onLogout }) {
  const { logout } = useAuth();
  const [active, setActive] = useState("proyectos");

  const teamFields = [
    { name: "name",      label: "Nombre",    required: true,  placeholder: "Ana García" },
    { name: "role",      label: "Rol",       required: true,  placeholder: "Frontend Dev" },
    { name: "bio",       label: "Bio",       type: "textarea", placeholder: "Breve descripción…" },
    { name: "image_url", label: "Foto",      type: "image" },
    { name: "linkedin",  label: "LinkedIn",  placeholder: "https://linkedin.com/in/…" },
    { name: "github",    label: "GitHub",    placeholder: "https://github.com/…" },
    { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
    { name: "order_index", label: "Orden",   placeholder: "0" },
  ];

  const servicesFields = [
    { name: "icon",        label: "Ícono",       required: true,  placeholder: "◻ ◈ ◎ ◉" },
    { name: "title",       label: "Título",      required: true,  placeholder: "Desarrollo Web" },
    { name: "description", label: "Descripción", required: true,  type: "textarea", placeholder: "Descripción del servicio…" },
    { name: "order_index", label: "Orden",       placeholder: "0" },
  ];

  const faqFields = [
    { name: "question",    label: "Pregunta",   required: true, placeholder: "¿Cuánto tarda un proyecto?" },
    { name: "answer",      label: "Respuesta",  required: true, type: "textarea", rows: 4, placeholder: "Depende del alcance…" },
    { name: "order_index", label: "Orden",      placeholder: "0" },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminNav active={active} setActive={setActive} onLogout={() => { logout(); onLogout(); }} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {active === "proyectos" && <ProjectsSection />}
        {active === "equipo"    && <ContentSection resource="team"     title="Equipo"    fields={teamFields}     emptyItem={{ name:"", role:"", bio:"", image_url:"", linkedin:"", github:"", instagram:"", order_index:0 }} />}
        {active === "servicios" && <ContentSection resource="services" title="Servicios" fields={servicesFields} emptyItem={{ icon:"◻", title:"", description:"", order_index:0 }} />}
        {active === "faq"       && <ContentSection resource="faq"      title="FAQ"       fields={faqFields}      emptyItem={{ question:"", answer:"", order_index:0 }} />}
        {active === "contacto"  && <ContactSection />}
      </div>
    </div>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────────
export default function Admin() {
  const { authed, loading } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  if (loading) return null;
  if (!authed && !loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  return <AdminPanel onLogout={() => setLoggedIn(false)} />;
}