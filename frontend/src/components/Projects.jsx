import { useProjects } from "../hooks/useProjects";
import { SectionLabel, Tag, useInView } from "../utils";


export default function Projects() {
  const [ref, visible] = useInView();

  // false = solo proyectos publicados (vista pública del sitio)
  const { projects, loading, error } = useProjects(false);

  return (
    <section id="proyectos" className="py-28 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Portfolio</SectionLabel>
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight mb-14">
            Proyectos
          </h2>

          {/* Skeleton mientras carga */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-stone-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-stone-100 rounded w-3/4" />
                    <div className="h-3 bg-stone-100 rounded w-1/2" />
                    <div className="h-3 bg-stone-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm">Error al cargar proyectos: {error}</p>
          )}

          {!loading && !error && projects.length === 0 && (
            <p className="text-stone-400 text-sm">Todavía no hay proyectos publicados.</p>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 group"
                >
                  {/* Imagen */}
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300 text-4xl">◻</div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      {p.industry}
                    </span>
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-stone-900"
                      >
                        Ver sitio →
                      </a>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-stone-900 text-lg">{p.title}</h3>
                      <span className="text-xs text-stone-400 font-medium">{p.year}</span>
                    </div>
                    <p className="text-xs text-stone-400 mb-3">{p.client}</p>
                    <p className="text-stone-500 text-sm leading-relaxed mb-4">{p.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(p.tags ?? []).map((t) => <Tag key={t} text={t} />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}