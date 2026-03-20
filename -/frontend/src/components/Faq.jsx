import { useState } from "react";
import { SectionLabel, useInView } from "../utils";

const FAQS = [
  {
    q: "¿Cuánto tiempo toma desarrollar un proyecto?",
    a: "Depende del alcance. Un sitio institucional puede estar listo en 3–4 semanas; una plataforma SaaS más compleja puede tomar de 2 a 4 meses. Siempre arrancamos con una etapa de discovery para darte un timeline preciso.",
  },
  {
    q: "¿Trabajan con clientes fuera de Argentina?",
    a: "Sí. Trabajamos de forma 100% remota con clientes de Latinoamérica, España y Estados Unidos. La comunicación es en español o inglés según prefieras.",
  },
  {
    q: "¿Qué incluye el mantenimiento post‑lanzamiento?",
    a: "Ofrecemos planes de soporte mensual que incluyen actualizaciones de seguridad, corrección de bugs, pequeñas mejoras y monitoreo de performance.",
  },
  {
    q: "¿Puedo ser parte del proceso de diseño y desarrollo?",
    a: "Siempre. Trabajamos de manera iterativa con revisiones periódicas. Vas a ver el avance en tiempo real y podés dar feedback en cada etapa.",
  },
  {
    q: "¿Usan tecnologías open source o propietarias?",
    a: "Preferimos stacks modernos y open source (React, Next.js, Node, PostgreSQL, etc.) para que nunca quedes atado a una sola empresa o proveedor.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left gap-4"
      >
        <span className="text-stone-800 font-medium">{q}</span>
        <span
          className="text-stone-400 text-xl flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "200px" : "0px" }}
      >
        <p className="text-stone-500 text-sm leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const [ref, visible] = useInView();
  return (
    <section id="faq" className="py-28 bg-stone-50">
      <div className="max-w-3xl mx-auto px-6">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel>Preguntas frecuentes</SectionLabel>
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight mb-12">FAQ</h2>
          <div>
            {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </div>
    </section>
  );
}