import { useRef, useState, useEffect } from "react";

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

export function Tag({ text }) {
  return (
    <span className="inline-block border border-stone-300 text-stone-500 text-xs px-2 py-0.5 rounded-full">
      {text}
    </span>
  );
}

export function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 mb-4">
      {children}
    </p>
  );
}
