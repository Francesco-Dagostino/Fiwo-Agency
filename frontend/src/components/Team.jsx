import { SectionLabel, useInView } from "../utils";
import { useContent } from "../hooks/useContent";

export default function Team() {
  const [ref, visible] = useInView();
  const { items: team, loading } = useContent("team");

  return (
    <section id="equipo" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <SectionLabel>Quiénes somos</SectionLabel>
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight mb-4">El equipo</h2>
          <p className="text-stone-500 max-w-xl mb-14 leading-relaxed">
            Somos un grupo de amigos apasionados por la tecnología. Nos juntamos
            para construir la agencia que siempre quisimos: pequeña, honesta y enfocada en resultados.
          </p>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1,2,3].map((i) => <div key={i} className="border border-stone-200 rounded-2xl h-48 animate-pulse bg-stone-50" />)}
            </div>
          )}

          {!loading && team.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map((m) => (
                <div key={m.id} className="border border-stone-200 rounded-2xl p-6 text-center hover:border-stone-400 transition-colors">
                  {m.image_url ? (
                    <img src={m.image_url} alt={m.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                      onError={(e) => { e.target.style.display="none"; }} />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-semibold text-lg mx-auto mb-4">
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                    </div>
                  )}
                  <p className="font-semibold text-stone-900">{m.name}</p>
                  <p className="text-stone-400 text-sm mt-1">{m.role}</p>
                  {m.bio && <p className="text-stone-500 text-xs mt-2 leading-relaxed">{m.bio}</p>}
                  <div className="flex justify-center gap-3 mt-3">
                    {m.linkedin  && <a href={m.linkedin}  target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-700 text-xs transition-colors">LinkedIn</a>}
                    {m.github    && <a href={m.github}    target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-700 text-xs transition-colors">GitHub</a>}
                    {m.instagram && <a href={m.instagram} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-700 text-xs transition-colors">Instagram</a>}
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