import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const WEB_STATUS_CONFIG = {
  no_web: {
    label: "Sin web",
    badge: "border-red-400/30 text-red-300 bg-red-500/10",
    priority: "🔥 Alta prioridad",
    dot: "bg-red-400",
  },
  inactive_web: {
    label: "Web inactiva",
    badge: "border-amber-400/30 text-amber-300 bg-amber-500/10",
    priority: "⚠ Media prioridad",
    dot: "bg-amber-400",
  },
  has_web: {
    label: "Tiene web",
    badge: "border-cyan-400/20 text-slate-400 bg-white/5",
    priority: "↓ Baja prioridad",
    dot: "bg-slate-500",
  },
};

const CRM_OPTIONS = [
  { value: "nuevo",             label: "Nuevo" },
  { value: "contactado",        label: "Contactado" },
  { value: "en_negociacion",    label: "En negociación" },
  { value: "propuesta_enviada", label: "Propuesta enviada" },
  { value: "cerrado_ganado",    label: "Cerrado ✓" },
  { value: "cerrado_perdido",   label: "Cerrado ✗" },
];

const QUICK_QUERIES = [
  "peluquerías Rosario", "gimnasios Rosario", "restaurantes Rosario",
  "abogados Rosario", "contadores Rosario", "dentistas Rosario",
  "inmobiliarias Rosario", "veterinarias Rosario", "psicólogos Rosario",
  "ferreterías Rosario",
];

const inputClass = "w-full rounded-2xl border border-cyan-400/12 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-300/35 transition-colors";
const labelClass = "text-xs text-slate-400 mb-1 block";

export default function Prospecting() {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [searchStats, setSearchStats] = useState(null);
  const [prospects, setProspects] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterContacted, setFilterContacted] = useState("all");
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [notes, setNotes] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [tab, setTab] = useState("search");
  const [error, setError] = useState("");

  const token = localStorage.getItem("sl_token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setSearchStats(null);
    setProspects([]);
    try {
      const res = await axios.post(`${API}/api/leads/search`, { query: query.trim(), limit }, { headers });
      setProspects(res.data.results);
      setSearchStats(res.data);
      setTab("search");
    } catch (err) {
      setError(err.response?.data?.error || "Error al buscar. Revisá la conexión.");
    } finally {
      setLoading(false);
    }
  };

  const loadSaved = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filterStatus !== "all") params.web_status = filterStatus;
      if (filterContacted !== "all") params.contacted = filterContacted;
      const res = await axios.get(`${API}/api/leads`, { headers, params });
      setProspects(res.data.data || []);
    } catch {
      setError("Error al cargar leads guardados.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterContacted]);

  useEffect(() => {
    if (tab === "saved") loadSaved();
  }, [tab, filterStatus, filterContacted, loadSaved]);

  const updateProspect = async (id, updates) => {
    try {
      const res = await axios.patch(`${API}/api/leads/${id}`, updates, { headers });
      setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, ...res.data } : p)));
      if (selectedProspect?.id === id) setSelectedProspect((prev) => ({ ...prev, ...res.data }));
    } catch {
      setError("Error al actualizar.");
    }
  };

  const saveNote = async () => {
    if (!selectedProspect) return;
    setSavingNote(true);
    await updateProspect(selectedProspect.id, { notes });
    setSavingNote(false);
  };

  const visibleProspects = filterStatus === "all"
    ? prospects
    : prospects.filter((p) => p.web_status === filterStatus);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Prospección de Clientes</h1>
          <p className="text-slate-400 text-sm mt-1">Encontrá negocios sin presencia web y convertílos en clientes.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-full border border-cyan-400/10 bg-white/5 px-2 py-2 w-fit mb-6">
        {[
          { id: "search", label: "🔍 Nueva búsqueda" },
          { id: "saved",  label: "📋 Guardados" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${tab === t.id ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-medium" : "text-slate-300 hover:text-cyan-200 hover:bg-white/6"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel búsqueda */}
      {tab === "search" && (
        <div className="rounded-[24px] border border-cyan-400/12 bg-white/5 p-6 backdrop-blur-xl mb-6">
          <div className="flex gap-3 flex-wrap">
            <input
              className={inputClass + " flex-1 min-w-[220px]"}
              placeholder='"gimnasios Rosario", "abogados Rosario"...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-2xl border border-cyan-400/12 bg-white/5 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-300/35 transition-colors cursor-pointer"
            >
              <option value={10}>10 resultados</option>
              <option value={20}>20 resultados</option>
              <option value={30}>30 resultados</option>
            </select>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-2.5 rounded-full text-sm font-medium disabled:opacity-50 transition-transform hover:scale-[1.01]"
            >
              {loading ? "Buscando…" : "Buscar"}
            </button>
          </div>

          {/* Quick queries */}
          <div className="flex flex-wrap gap-2 mt-4">
            {QUICK_QUERIES.map((q) => (
              <button key={q} onClick={() => setQuery(q)}
                className="text-xs px-3 py-1 rounded-full border border-cyan-400/12 text-slate-400 hover:text-cyan-200 hover:bg-white/6 transition-colors">
                {q}
              </button>
            ))}
          </div>

          {/* Stats */}
          {searchStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <StatCard label="Total" value={searchStats.total} color="text-slate-300" />
              <StatCard label="Sin web 🔥" value={searchStats.no_web} color="text-red-300" />
              <StatCard label="Web inactiva ⚠" value={searchStats.inactive_web} color="text-amber-300" />
              <StatCard label="Tienen web" value={searchStats.has_web} color="text-slate-400" />
            </div>
          )}
        </div>
      )}

      {/* Panel guardados - filtros */}
      {tab === "saved" && (
        <div className="rounded-[24px] border border-cyan-400/12 bg-white/5 p-6 backdrop-blur-xl mb-6">
          <div className="flex gap-3 flex-wrap items-center">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-2xl border border-cyan-400/12 bg-white/5 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-300/35 transition-colors cursor-pointer">
              <option value="all">Todos los estados</option>
              <option value="no_web">Sin web</option>
              <option value="inactive_web">Web inactiva</option>
              <option value="has_web">Tiene web</option>
            </select>
            <select value={filterContacted} onChange={(e) => setFilterContacted(e.target.value)}
              className="rounded-2xl border border-cyan-400/12 bg-white/5 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-300/35 transition-colors cursor-pointer">
              <option value="all">Todos</option>
              <option value="false">No contactados</option>
              <option value="true">Contactados</option>
            </select>
            <button onClick={loadSaved}
              className="border border-cyan-400/12 text-slate-300 px-4 py-2.5 rounded-full text-sm transition-colors hover:bg-white/6">
              ↻ Actualizar
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-300 text-sm mb-4 px-1">{error}</p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-20 gap-4">
          <div className="w-8 h-8 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Verificando webs... puede tardar unos segundos.</p>
        </div>
      )}

      {/* Contenido: lista + detalle */}
      {!loading && visibleProspects.length > 0 && (
        <div className="flex gap-5 items-start">
          {/* Lista */}
          <div className="flex-1 min-w-0">
            {/* Filtro inline */}
            <div className="flex gap-2 flex-wrap mb-4">
              {["all", "no_web", "inactive_web", "has_web"].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterStatus === s ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white border-transparent font-medium" : "border-cyan-400/12 text-slate-400 hover:text-cyan-200 hover:bg-white/6"}`}>
                  {s === "all" ? "Todos" : WEB_STATUS_CONFIG[s]?.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {visibleProspects.map((p) => {
                const cfg = WEB_STATUS_CONFIG[p.web_status] || WEB_STATUS_CONFIG.has_web;
                const isSelected = selectedProspect?.place_id === p.place_id || selectedProspect?.id === p.id;
                return (
                  <div key={p.place_id || p.id} onClick={() => { setSelectedProspect(p); setNotes(p.notes || ""); }}
                    className={`rounded-2xl p-4 border backdrop-blur-xl cursor-pointer transition-all duration-150 ${isSelected ? "border-cyan-300/35 bg-white/8" : "border-cyan-400/12 bg-white/5 hover:border-cyan-300/20 hover:bg-white/6"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <span className="font-medium text-white text-sm truncate">{p.name}</span>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full border flex-shrink-0 ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2 ml-5 text-xs text-slate-400 flex-wrap">
                      {p.category && <span>{p.category}</span>}
                      {p.address  && <span>📍 {p.address}</span>}
                      {p.rating   && <span>⭐ {p.rating} ({p.reviews})</span>}
                    </div>
                    {p.contacted && <span className="ml-5 mt-1 block text-xs text-cyan-300">✓ Contactado</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel detalle */}
          {selectedProspect && (
            <div className="w-80 flex-shrink-0 rounded-[24px] border border-cyan-400/12 bg-white/5 p-6 backdrop-blur-xl sticky top-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-bold text-white text-base leading-tight flex-1 pr-2">{selectedProspect.name}</h2>
                <button onClick={() => setSelectedProspect(null)}
                  className="text-slate-400 hover:text-slate-200 transition-colors text-lg leading-none">✕</button>
              </div>

              {/* Info rows */}
              <div className="space-y-3 mb-4">
                {[
                  ["Categoría", selectedProspect.category],
                  ["Dirección", selectedProspect.address],
                  ["Teléfono",  selectedProspect.phone],
                  ["Rating", selectedProspect.rating ? `⭐ ${selectedProspect.rating} (${selectedProspect.reviews} reseñas)` : null],
                ].map(([label, value]) => value ? (
                  <div key={label}>
                    <p className={labelClass}>{label}</p>
                    <p className="text-sm text-slate-200">{value}</p>
                  </div>
                ) : null)}

                <div>
                  <p className={labelClass}>Web</p>
                  {selectedProspect.website
                    ? <a href={selectedProspect.website} target="_blank" rel="noreferrer" className="text-sm text-cyan-300 hover:underline break-all">{selectedProspect.website}</a>
                    : <span className="text-sm text-red-300">Sin sitio web</span>}
                </div>

                <div>
                  <p className={labelClass}>Estado</p>
                  <span className={`text-xs px-3 py-1 rounded-full border ${WEB_STATUS_CONFIG[selectedProspect.web_status]?.badge}`}>
                    {WEB_STATUS_CONFIG[selectedProspect.web_status]?.priority}
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2 mb-4">
                {selectedProspect.google_maps_link && (
                  <a href={selectedProspect.google_maps_link} target="_blank" rel="noreferrer"
                    className="text-center text-xs px-4 py-2 rounded-full border border-cyan-400/12 text-cyan-200 hover:bg-white/6 transition-colors">
                    📍 Ver en Google Maps
                  </a>
                )}
                {selectedProspect.phone && (
                  <a href={`https://wa.me/${selectedProspect.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola! Te contacto desde Fiwo Agency. Vi que ${selectedProspect.web_status === "no_web" ? "no tenés sitio web" : "tu sitio web no está funcionando"} y me gustaría contarte cómo podemos ayudarte. ¿Tenés unos minutos?`)}`}
                    target="_blank" rel="noreferrer"
                    className="text-center text-xs px-4 py-2 rounded-full border border-green-400/20 text-green-300 hover:bg-green-500/10 transition-colors">
                    💬 Contactar por WhatsApp
                  </a>
                )}
              </div>

              {/* CRM Status */}
              <div className="mb-4">
                <label className={labelClass}>Estado CRM</label>
                <select value={selectedProspect.crm_status || "nuevo"}
                  onChange={(e) => updateProspect(selectedProspect.id, { status: e.target.value })}
                  className={inputClass + " cursor-pointer"}>
                  {CRM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Contactado toggle */}
              <div className="flex items-center justify-between mb-4">
                <label className={labelClass + " mb-0"}>Contactado</label>
                <button
                  onClick={() => updateProspect(selectedProspect.id, { contacted: !selectedProspect.contacted })}
                  className={`text-xs px-4 py-1.5 rounded-full border transition-colors font-medium ${selectedProspect.contacted ? "border-cyan-300/20 text-cyan-200 bg-cyan-500/10" : "border-cyan-400/12 text-slate-400 hover:bg-white/6"}`}>
                  {selectedProspect.contacted ? "✓ Sí" : "✗ No"}
                </button>
              </div>

              {/* Notas */}
              <div>
                <label className={labelClass}>Notas internas</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Llamé el lunes, quedamos en hablar el jueves..."
                  className={inputClass + " resize-none mb-2"}
                />
                <button onClick={saveNote} disabled={savingNote}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white py-2.5 rounded-full text-sm font-medium disabled:opacity-50 transition-transform hover:scale-[1.01]">
                  {savingNote ? "Guardando…" : "Guardar nota"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && visibleProspects.length === 0 && !error && (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-400 text-sm">
            {tab === "search" ? "Escribí un rubro y ciudad para buscar leads." : "No hay leads guardados con ese filtro."}
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-cyan-400/12 bg-white/5 p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
}