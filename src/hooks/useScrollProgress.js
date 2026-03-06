import { useState, useEffect } from 'react';

export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = el.getBoundingClientRect();
        const windowH = window.innerHeight;
        const raw = (windowH - rect.top) / (windowH + rect.height);
        setProgress(Math.max(0, Math.min(1, raw)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); if (rafId) cancelAnimationFrame(rafId); };
  }, []);
  return progress;
}
