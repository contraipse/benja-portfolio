import { useState, useEffect } from 'react';
import { T } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
  }, [scrolled]);

  const navLinks = ["Work", "About", "Contact"];

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isMobile ? "0 20px" : "0 clamp(24px, 5vw, 64px)",
        height: isMobile ? 60 : 72,
        background: scrolled || menuOpen ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <a href="#" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: T.serif,
            fontSize: isMobile ? 22 : 26,
            fontWeight: 400,
            color: T.text,
          }}>
            Benja
          </span>
        </a>

        {/* Desktop nav pills */}
        {!isMobile && (
          <div style={{
            display: "flex",
            gap: 0,
            alignItems: "center",
            background: scrolled ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.03)",
            borderRadius: 24,
            padding: "6px 4px",
            border: `1px solid ${scrolled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)"}`,
            transition: "all 0.5s ease",
          }}>
            {navLinks.map((item) => (
              <a
                key={item}
                href={item === "Contact" ? "mailto:benjajuster@gmail.com" : `#${item.toLowerCase()}`}
                style={{
                  fontFamily: T.sans,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "1.5px",
                  color: T.textMuted,
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.3s, background 0.3s",
                  padding: "8px 18px",
                  borderRadius: 20,
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = T.text;
                  e.target.style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = T.textMuted;
                  e.target.style.background = "transparent";
                }}
              >
                {item}
              </a>
            ))}
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: menuOpen ? 0 : 5,
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              position: "relative",
            }}
          >
            <span style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: T.text,
              borderRadius: 1,
              transform: menuOpen ? "rotate(45deg) translateY(0)" : "rotate(0) translateY(0)",
              position: menuOpen ? "absolute" : "relative",
              transition: "all 0.3s ease",
            }} />
            {!menuOpen && (
              <span style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: T.text,
                borderRadius: 1,
              }} />
            )}
            <span style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: T.text,
              borderRadius: 1,
              transform: menuOpen ? "rotate(-45deg) translateY(0)" : "rotate(0) translateY(0)",
              position: menuOpen ? "absolute" : "relative",
              transition: "all 0.3s ease",
            }} />
          </button>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {isMobile && (
        <div style={{
          position: "fixed",
          top: 60,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
          background: "rgba(10,10,10,0.96)",
          backdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          {navLinks.map((item, i) => (
            <a
              key={item}
              href={item === "Contact" ? "mailto:benjajuster@gmail.com" : `#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: T.serif,
                fontSize: 36,
                fontWeight: 300,
                color: T.text,
                textDecoration: "none",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.08}s`,
              }}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
