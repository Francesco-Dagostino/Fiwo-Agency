import { useState } from "react";
import { SectionLabel, useInView } from "../utils";
import { useContent } from "../hooks/useContent";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left gap-4">
        <span className="text-stone-800 font-medium">{q}</span>
        <span className="text-stone-400 text-xl flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </button>
      <div className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "200px" : "0px" }}>
        <p className="text-stone-500 text-sm leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const [ref, visible] = useInView();
  const { items: faqs, loading } = useContent("faq");

  return (
    <section id="faq" className="py-28 bg-stone-50">
      <div className="max-w-3xl mx-auto px-6">
        <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <SectionLabel>Preguntas frecuentes</SectionLabel>
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight mb-12">FAQ</h2>
          {loading && <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="h-14 bg-stone-100 rounded-xl animate-pulse" />)}</div>}
          {!loading && <div>{faqs.map((f) => <FaqItem key={f.id} q={f.question} a={f.answer} />)}</div>}
        </div>
      </div>
    </section>
  );
}