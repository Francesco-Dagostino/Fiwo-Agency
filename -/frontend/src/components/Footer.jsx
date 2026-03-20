export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-400">
        <span>
          studio<span className="text-stone-300">·lab</span> ©{" "}
          {new Date().getFullYear()}
        </span>
        <span>Hecho con cariño en Rosario 🇦🇷</span>
        <div className="flex gap-5">
          {["LinkedIn", "GitHub", "Instagram"].map((s) => (
            <a key={s} href="#" className="hover:text-stone-700 transition-colors">
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
