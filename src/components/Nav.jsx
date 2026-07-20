import { useState, useEffect } from 'react';
import { T } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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
        padding: "12px 24px", background: T.text, color: T.bg,
        fontFamily: T.sans, fontSize: 14, fontWeight: 600,
        textDecoration: "none",
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
        background: "rgba(250,247,242,0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.borderLight}`,
      }}>
        <a href="#" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: T.serif,
            fontSize: isMobile ? 22 : 24,
            fontWeight: 400,
            color: T.text,
          }}>
            Benja Juster
          </span>
        </a>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{
            display: "flex",
            gap: 32,
            alignItems: "center",
          }}>
            {navLinks.map((item) => {
              const isContact = item === "Contact";
              return (
                <a
                  key={item}
                  href={isContact ? "mailto:benjajuster@gmail.com" : `#${item.toLowerCase()}`}
                  style={{
                    fontFamily: T.sans,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "1.5px",
                    color: isContact ? T.text : T.textMuted,
                    textDecoration: "none",
                    textTransform: "uppercase",
                    transition: "color 0.15s",
                    ...(isContact ? { borderBottom: `1px solid ${T.text}`, paddingBottom: 2 } : {}),
                  }}
                  onMouseEnter={(e) => { e.target.style.color = T.text; }}
                  onMouseLeave={(e) => { e.target.style.color = isContact ? T.text : T.textMuted; }}
                >
                  {item}
                </a>
              );
            })}
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
              }} />
            )}
            <span style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: T.text,
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
          background: "rgba(250,247,242,0.97)",
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
