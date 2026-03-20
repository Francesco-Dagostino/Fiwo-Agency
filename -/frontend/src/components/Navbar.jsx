import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["servicios", "proyectos", "equipo", "faq", "contacto"];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(250,249,247,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #e7e5e4" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <span className="font-bold text-stone-900 tracking-tight text-lg">
          Orbit Dev<span className="text-stone-400">.Agency</span>
        </span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors capitalize"
            >
              {l}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contacto")}
            className="text-sm bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition-colors"
          >
            Hablemos
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-stone-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div
            className="w-5 h-px bg-current mb-1.5 transition-all"
            style={{ transform: menuOpen ? "rotate(45deg) translate(2px,2px)" : "" }}
          />
          <div
            className="w-5 h-px bg-current mb-1.5"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <div
            className="w-5 h-px bg-current transition-all"
            style={{ transform: menuOpen ? "rotate(-45deg) translate(2px,-2px)" : "" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200 px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="text-sm text-stone-600 capitalize text-left py-1"
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
