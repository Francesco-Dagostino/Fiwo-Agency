export default function Footer() {
  return (
    <footer className="border-t border-cyan-400/10 bg-[#050b1d]/60 py-10 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-400">
        {/* LEFT */}
        <span>
          Fiwo<span className="text-cyan-300/70">.Agency</span> ©{" "}
          {new Date().getFullYear()}
        </span>

        {/* CENTER */}
        <span>Hecho en Rosario 🇦🇷</span>

        {/* RIGHT (Instagram PRO) */}
        <a
          href="https://www.instagram.com/fiwo.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300"
        >
          {/* ICONO SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="18" cy="6" r="1" />
          </svg>

          {/* TEXTO */}
          <span className="relative">
            Instagram
            <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-cyan-300 transition-all duration-300 group-hover:w-full" />
          </span>
        </a>
      </div>
    </footer>
  );
}
