import { useState, useEffect } from 'react';
import { T, monoLabel } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Index", href: "#index" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "mailto:benjajuster@gmail.com" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <a href="#work" style={{
        position: "fixed", top: -100, left: 16, zIndex: 9999,
        padding: "12px 24px", background: T.accent, color: "#fff",
        fontFamily: T.sans, fontSize: 14, fontWeight: 600,
        borderRadius: T.r.md, textDecoration: "none",
        transition: "top 0.2s ease",
      }} onFocus={(e) => { e.target.style.top = "12px"; }}
         onBlur={(e) => { e.target.style.top = "-100px"; }}>
        Skip to content
      </a>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: isMobile ? `0 ${T.mobilePadX}px` : `0 ${T.padX}`,
        height: isMobile ? 60 : 76,
        background: scrolled ? "rgba(13,11,9,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(1.3)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.3)" : "none",
        borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: T.serif, fontSize: isMobile ? 19 : 22, fontWeight: 500, color: T.text }}>
            Benja Juster
          </span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 16 : 28 }}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} style={{
              ...monoLabel,
              fontSize: isMobile ? 10 : 11,
              color: l.label === "Contact" ? T.accent : T.textMuted,
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
              onMouseEnter={(e) => { e.target.style.color = l.label === "Contact" ? T.accentDark : T.text; }}
              onMouseLeave={(e) => { e.target.style.color = l.label === "Contact" ? T.accent : T.textMuted; }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
