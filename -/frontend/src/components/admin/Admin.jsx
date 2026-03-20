import { useState, useRef } from "react";
import { useAuth, useProjects, useImageUpload } from "../../../hooks/useProjects";

const emptyForm = {
  title: "", client: "", industry: "", description: "",
  tags: "", year: new Date().getFullYear(),
  image_url: "", live_url: "", published: true,
};

const inputClass =
  "w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-600 transition-colors bg-white";

// ── Login ──────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
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
          <input type="email" required placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          <input type="password" required placeholder="Contraseña" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass + (error ? " border-red-300" : "")} />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-stone-900 text-white rounded-full py-3 text-sm font-medium hover:bg-stone-700 transition-colors disabled:opacity-50">
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── ImageUploader ──────────────────────────────────────────────────────────────
function ImageUploader({ value, onChange }) {
  const { upload, uploading } = useImageUpload();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const result = await upload(file);
    if (result.url) onChange(result.url);
    else alert("Error al subir: " + result.error);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div>
      <label className="text-xs text-stone-500 mb-1 block">Imagen del proyecto</label>

      {/* Zona de drag & drop */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-stone-500 bg-stone-50"
            : "border-stone-200 hover:border-stone-400"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-stone-400 text-sm">Subiendo imagen…</p>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center gap-2">
            <img src={value} alt="preview" className="h-32 w-full object-cover rounded-lg"
              onError={(e) => (e.target.style.display = "none")} />
            <p className="text-stone-400 text-xs">Clic o arrastrá para cambiar</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <span className="text-3xl text-stone-300">↑</span>
            <p className="text-stone-500 text-sm">Arrastrá una imagen o hacé clic</p>
            <p className="text-stone-400 text-xs">JPG, PNG, WEBP — máx. 5MB</p>
          </div>
        )}
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {/* También permite pegar URL manual */}
      <input
        type="text"
        placeholder="O pegá una URL de imagen directamente"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass + " mt-2 text-xs"}
      />
    </div>
  );
}

// ── Formulario de proyecto ─────────────────────────────────────────────────────
function ProjectForm({ initial = emptyForm, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : initial.tags,
  });

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      year: parseInt(form.year, 10),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-stone-500 mb-1 block">Título *</label>
          <input name="title" required value={form.title} onChange={handle}
            placeholder="E‑commerce Florería" className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-stone-500 mb-1 block">Cliente *</label>
          <input name="client" required value={form.client} onChange={handle}
            placeholder="Flores del Sur" className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-stone-500 mb-1 block">Industria *</label>
          <input name="industry" required value={form.industry} onChange={handle}
            placeholder="Retail, Salud…" className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-stone-500 mb-1 block">Año</label>
          <input name="year" value={form.year} onChange={handle}
            placeholder="2025" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-xs text-stone-500 mb-1 block">Descripción *</label>
        <textarea name="description" required rows={3} value={form.description}
          onChange={handle} placeholder="Breve descripción del proyecto…"
          className={inputClass + " resize-none"} />
      </div>

      <div>
        <label className="text-xs text-stone-500 mb-1 block">Tecnologías (separadas por coma)</label>
        <input name="tags" value={form.tags} onChange={handle}
          placeholder="React, Node.js, Stripe" className={inputClass} />
      </div>

      {/* Uploader de imagen */}
      <ImageUploader
        value={form.image_url}
        onChange={(url) => setForm({ ...form, image_url: url })}
      />

      <div>
        <label className="text-xs text-stone-500 mb-1 block">Link al sitio en vivo</label>
        <input name="live_url" value={form.live_url} onChange={handle}
          placeholder="https://cliente.com" className={inputClass} />
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" name="published" checked={form.published}
          onChange={handle} className="rounded" />
        <span className="text-sm text-stone-600">Publicado (visible en el sitio)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 transition-colors disabled:opacity-50">
          {saving ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" onClick={onCancel}
          className="border border-stone-200 text-stone-600 px-6 py-2.5 rounded-full text-sm hover:border-stone-400 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ── Lista ──────────────────────────────────────────────────────────────────────
function ProjectList({ projects, loading, error, onEdit, onDelete, onToggle }) {
  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1,2].map((i) => <div key={i} className="border border-stone-200 rounded-2xl h-40 animate-pulse bg-stone-50" />)}
    </div>
  );
  if (error) return <p className="text-red-400 text-sm">Error: {error}</p>;
  if (projects.length === 0) return (
    <div className="text-center py-16 text-stone-400">
      <p className="text-4xl mb-3">◻</p>
      <p className="text-sm">Todavía no hay proyectos cargados.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((p) => (
        <div key={p.id} className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
          {p.image_url && (
            <img src={p.image_url} alt={p.title} className="w-full h-36 object-cover"
              onError={(e) => (e.target.style.display = "none")} />
          )}
          <div className="p-5">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-stone-900 truncate">{p.title}</p>
                <p className="text-xs text-stone-400 mt-0.5">{p.client} · {p.industry} · {p.year}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => onToggle(p.id, p.published)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    p.published
                      ? "border-green-200 text-green-600 hover:bg-green-50"
                      : "border-stone-200 text-stone-400 hover:border-stone-400"
                  }`}>
                  {p.published ? "Publicado" : "Oculto"}
                </button>
                <button onClick={() => onEdit(p)}
                  className="text-xs text-stone-500 border border-stone-200 px-3 py-1 rounded-full hover:border-stone-400 transition-colors">
                  Editar
                </button>
                <button onClick={() => onDelete(p.id)}
                  className="text-xs text-red-400 border border-red-100 px-3 py-1 rounded-full hover:bg-red-50 transition-colors">
                  Borrar
                </button>
              </div>
            </div>
            <p className="text-stone-500 text-xs mt-2 line-clamp-2">{p.description}</p>
            {p.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs border border-stone-200 text-stone-400 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Panel principal ────────────────────────────────────────────────────────────
function AdminPanel({ onLogout }) {
  const { projects, loading, error, add, update, remove, togglePublished } = useProjects(true);
  const { logout } = useAuth();

  const [view,    setView]    = useState("list");
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSave = async (data) => {
    setSaving(true);
    const result = view === "edit" ? await update(editing.id, data) : await add(data);
    setSaving(false);
    if (result.error) { showToast("Error: " + result.error); return; }
    showToast(view === "edit" ? "Proyecto actualizado ✓" : "Proyecto agregado ✓");
    setView("list");
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Borrar este proyecto?")) return;
    const result = await remove(id);
    if (result.error) showToast("Error: " + result.error);
    else showToast("Proyecto eliminado");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-bold text-stone-900">studio<span className="text-stone-400">·lab</span></span>
          <span className="text-stone-400 text-sm ml-3">/ Admin</span>
        </div>
        <button onClick={() => { logout(); onLogout(); }}
          className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
          Cerrar sesión
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Proyectos</h1>
            <p className="text-stone-400 text-sm mt-0.5">
              {projects.length} proyecto{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          {view === "list" && (
            <button onClick={() => setView("add")}
              className="bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 transition-colors">
              + Nuevo proyecto
            </button>
          )}
        </div>

        {view === "list" && (
          <ProjectList
            projects={projects} loading={loading} error={error}
            onEdit={(p) => { setEditing(p); setView("edit"); }}
            onDelete={handleDelete}
            onToggle={togglePublished}
          />
        )}

        {(view === "add" || view === "edit") && (
          <div className="bg-white border border-stone-200 rounded-2xl p-8">
            <h2 className="text-lg font-bold text-stone-900 mb-6">
              {view === "edit" ? "Editar proyecto" : "Nuevo proyecto"}
            </h2>
            <ProjectForm
              initial={view === "edit" ? editing : emptyForm}
              onSave={handleSave}
              onCancel={() => { setView("list"); setEditing(null); }}
              saving={saving}
            />
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-sm px-5 py-3 rounded-full shadow-lg">
          {toast}
        </div>
      )}
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