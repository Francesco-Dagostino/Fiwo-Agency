import { useState, useEffect } from "react";
import { SectionLabel } from "../utils";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="inicio"
      className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-stone-50"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#d6d3d1 1px, transparent 1px), linear-gradient(90deg, #d6d3d1 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.25,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20 relative">
        {/* Main content */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <SectionLabel>Agencia de Desarrollo</SectionLabel>
          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 leading-tight tracking-tight max-w-3xl">
            Convertimos ideas en{" "}
            <span className="italic font-light text-stone-500">software</span>{" "}
            que funciona.
          </h1>
          <p className="mt-6 text-stone-500 text-lg max-w-xl leading-relaxed">
            Somos un equipo pequeño y enfocado. Desarrollamos productos digitales
            a medida con atención al detalle, código limpio y diseño que enamora.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo("proyectos")}
              className="bg-stone-900 text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-stone-700 transition-colors"
            >
              Ver proyectos
            </button>
            <button
              onClick={() => scrollTo("contacto")}
              className="border border-stone-300 text-stone-700 px-7 py-3.5 rounded-full text-sm font-medium hover:border-stone-500 transition-colors"
            >
              Contactanos
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          className="mt-20 flex flex-wrap gap-10 transition-all duration-700 delay-200"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {[
            ["10+", "Proyectos entregados"],
            ["3", "Países atendidos"],
            ["100%", "Clientes satisfechos"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="text-3xl font-bold text-stone-900">{n}</p>
              <p className="text-stone-400 text-sm mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-stone-400">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <span className="text-base animate-bounce">↓</span>
      </div>
    </section>
  );
}
