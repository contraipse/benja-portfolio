import { useState, useEffect } from 'react';
import { T } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { useThemeContext } from '../context/ThemeContext';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { theme, toggle: toggleTheme } = useThemeContext();
  const isLight = theme === 'light';

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
  }, [scrolled]);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && menuOpen) setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const navLinks = ["Work", "About", "Contact"];

  return (
    <>
      <a href="#work" style={{
        position: "fixed", top: -100, left: 16, zIndex: 9999,
        padding: "12px 24px", background: T.accent, color: "var(--bg)",
        fontFamily: T.sans, fontSize: 14, fontWeight: 600,
        borderRadius: T.r.md, textDecoration: "none",
        transition: "top 0.2s ease",
      }} onFocus={(e) => { e.target.style.top = "12px"; }}
         onBlur={(e) => { e.target.style.top = "-100px"; }}>
        Skip to content
      </a>
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
        background: scrolled || menuOpen ? "rgba(var(--grad-base),0.92)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-bottom 0.3s ease",
      }}>
        <a href="#" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: T.serif,
            fontSize: isMobile ? 22 : 26,
            fontWeight: 400,
            color: scrolled ? T.text : "#fff",
            transition: "color 0.3s ease",
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
            background: scrolled ? "var(--border)" : "rgba(255,255,255,0.08)",
            borderRadius: T.r.xl,
            padding: "6px 4px",
            border: scrolled ? `1px solid var(--border)` : "1px solid rgba(255,255,255,0.08)",
            transition: "background 0.3s ease, border-color 0.3s ease",
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
                  color: scrolled ? T.textMuted : "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.15s, background 0.15s",
                  padding: "8px 18px",
                  borderRadius: T.r.xl,
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = scrolled ? T.text : "#fff";
                  e.target.style.background = scrolled ? "var(--border-light)" : "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = scrolled ? T.textMuted : "rgba(255,255,255,0.7)";
                  e.target.style.background = "transparent";
                }}
              >
                {item}
              </a>
            ))}
            {/* Theme toggle */}
            <button
              aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
              onClick={toggleTheme}
              data-cursor=""
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "7px 10px",
                borderRadius: T.r.xl,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s",
                marginLeft: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = scrolled ? "var(--border-light)" : "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {isLight ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={scrolled ? T.textMuted : "rgba(255,255,255,0.7)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={scrolled ? T.textMuted : "rgba(255,255,255,0.7)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
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
              background: scrolled || menuOpen ? T.text : "#fff",
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
                background: scrolled || menuOpen ? T.text : "#fff",
                borderRadius: 1,
              }} />
            )}
            <span style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: scrolled || menuOpen ? T.text : "#fff",
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
          background: "rgba(var(--grad-base),0.96)",
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
          {/* Mobile theme toggle */}
          <button
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            onClick={toggleTheme}
            style={{
              background: "var(--border)",
              border: `1px solid var(--border-light)`,
              cursor: "pointer",
              padding: "12px 24px",
              borderRadius: T.r.full,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 16,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            {isLight ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
            <span style={{
              fontFamily: T.sans, fontSize: 12, fontWeight: 500,
              color: T.text, letterSpacing: "1px", textTransform: "uppercase",
            }}>{isLight ? "Dark" : "Light"}</span>
          </button>
        </div>
      )}
    </>
  );
}
