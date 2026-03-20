import { SectionLabel, useInView } from "../utils";

const TEAM = [
  { name: "Sofía Reyes",    role: "CEO & Full‑Stack Dev", initials: "SR" },
  { name: "Mateo López",    role: "UI/UX Designer",       initials: "ML" },
  { name: "Valentina Cruz", role: "Backend Engineer",     initials: "VC" },
];

export default function Team() {
  const [ref, visible] = useInView();
  return (
    <section id="equipo" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Quiénes somos</SectionLabel>
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight mb-4">
            El equipo
          </h2>
          <p className="text-stone-500 max-w-xl mb-14 leading-relaxed">
            Somos un grupo de amigos apasionados por la tecnología. Nos juntamos
            para construir la agencia que siempre quisimos: pequeña, honesta y
            enfocada en resultados.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map((m) => (
              <div
                key={m.name}
                className="border border-stone-200 rounded-2xl p-6 text-center hover:border-stone-400 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-semibold text-lg mx-auto mb-4">
                  {m.initials}
                </div>
                <p className="font-semibold text-stone-900">{m.name}</p>
                <p className="text-stone-400 text-sm mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}