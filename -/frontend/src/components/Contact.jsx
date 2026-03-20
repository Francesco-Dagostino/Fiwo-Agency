import { useState } from "react";
import { SectionLabel, useInView } from "../utils";

const inputClass =
  "w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors bg-white";

export default function Contact() {
  const [ref, visible] = useInView();
  const [form, setForm] = useState({
    name: "",
    email: "",
    project: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    // TODO: conectar con tu backend o servicio de email (EmailJS, Resend, etc.)
    console.log("Form submitted:", form);
    setSent(true);
  };

  return (
    <section id="contacto" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: info */}
            <div>
              <SectionLabel>Trabajemos juntos</SectionLabel>
              <h2 className="text-4xl font-bold text-stone-900 tracking-tight mb-6">
                Contanos tu proyecto
              </h2>
              <p className="text-stone-500 leading-relaxed mb-8">
                Respondemos en menos de 24 horas. Sin compromisos: la primera
                consulta es siempre gratis.
              </p>
              <div className="space-y-4 text-sm text-stone-500">
                <p>✉ hola@studiolab.dev</p>
                <p>📍 Rosario, Argentina · Remoto mundial</p>
                <p>🕐 Lun – Vie, 9 – 18 hs (GMT‑3)</p>
              </div>
            </div>

            {/* Right: form */}
            <div>
              {sent ? (
                <div className="h-full flex flex-col justify-center items-start">
                  <p className="text-4xl mb-4">✓</p>
                  <p className="font-semibold text-stone-900 text-lg">
                    ¡Mensaje enviado!
                  </p>
                  <p className="text-stone-500 text-sm mt-2">
                    Te respondemos pronto. Gracias por escribirnos.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      name="name"
                      required
                      placeholder="Tu nombre"
                      value={form.name}
                      onChange={handle}
                      className={inputClass}
                    />
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handle}
                      className={inputClass}
                    />
                  </div>
                  <input
                    name="project"
                    placeholder="¿Qué tipo de proyecto tenés?"
                    value={form.project}
                    onChange={handle}
                    className={inputClass}
                  />
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Contanos de qué se trata, con qué urgencia y cualquier detalle relevante…"
                    value={form.message}
                    onChange={handle}
                    className={inputClass + " resize-none"}
                  />
                  <button
                    type="submit"
                    className="w-full bg-stone-900 text-white rounded-full py-3.5 text-sm font-medium hover:bg-stone-700 transition-colors"
                  >
                    Enviar mensaje
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
