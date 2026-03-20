import { SectionLabel, useInView } from "../utils";

// Datos hardcodeados acá — ya no depende de data.js
const SERVICES = [
  {
    icon: "◻",
    title: "Desarrollo Web",
    desc: "Sitios y aplicaciones web de alta performance, responsivos y optimizados para SEO.",
  },
  {
    icon: "◈",
    title: "Software a Medida",
    desc: "Plataformas SaaS, ERPs, CRMs y herramientas internas adaptadas a tu negocio.",
  },
  {
    icon: "◎",
    title: "UX / UI Design",
    desc: "Interfaces limpias, intuitivas y con identidad propia que convierten visitantes en clientes.",
  },
  {
    icon: "◉",
    title: "Consultoría Tech",
    desc: "Definimos junto a vos el stack, la arquitectura y la hoja de ruta más eficiente.",
  },
];

export default function Services() {
  const [ref, visible] = useInView();

  return (
    <section id="servicios" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Qué hacemos</SectionLabel>
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight mb-14">
            Servicios
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="border border-stone-200 rounded-2xl p-6 hover:border-stone-400 hover:shadow-sm transition-all duration-200"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="text-2xl text-stone-400">{s.icon}</span>
                <h3 className="mt-4 font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-2 text-stone-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}