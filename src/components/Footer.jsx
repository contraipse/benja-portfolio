import { useState } from 'react';
import { T } from '../data/tokens';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useIsMobile';

// -- FOOTER --
function Footer() {
  const [footerRef, visible] = useInView({ threshold: 0.05 });
  const [btnHover, setBtnHover] = useState(false);
  const isMobile = useIsMobile();

  return (
    <footer ref={footerRef} style={{
      paddingTop: isMobile ? 60 : "clamp(80px, 10vw, 140px)",
      paddingBottom: isMobile ? T.s.xl : "clamp(32px, 4vw, 48px)",
      position: "relative", zIndex: 1,
    }}>
      <div style={{ padding: isMobile ? `0 ${T.mobilePadX}px` : `0 ${T.padX}` }}>
        {/* Ink rule */}
        <div style={{
          width: visible ? 80 : 0, height: 2, background: T.text,
          marginBottom: T.s.lg,
          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }} />

        {/* Headline */}
        <h2 style={{
          fontFamily: T.serif, fontSize: "clamp(44px, 7vw, 100px)", fontWeight: 300,
          color: T.text, margin: 0, lineHeight: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}>
          Say{" "}
          <span style={{ display: "inline-block" }}>
            {["h","e","l","l","o","."].map((ch, i) => (
              <span key={i} style={{
                color: T.text,
                fontStyle: "italic", display: "inline-block",
                animation: visible ? `lifeWave 2.5s ease-in-out ${i * 0.18}s infinite` : "none",
              }}>{ch}</span>
            ))}
          </span>
        </h2>

        {/* CTA button */}
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s", marginTop: T.s.xxl,
        }}>
          <a
            href="mailto:benjajuster@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={isMobile ? undefined : () => setBtnHover(true)}
            onMouseLeave={isMobile ? undefined : () => setBtnHover(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: T.s.sm + 4,
              padding: isMobile ? `${T.s.md}px ${T.s.xl}px` : `${T.s.lg - 4}px ${T.s.xxl - 8}px`,
              background: T.text,
              color: T.bg, textDecoration: "none", fontFamily: T.sans,
              fontSize: isMobile ? 14 : 16, fontWeight: 600,
              opacity: btnHover ? 0.85 : 1,
              transition: "opacity 0.25s ease",
            }}
          >
            Let's connect →
          </a>
        </div>
      </div>

      {/* Footer bar */}
      <div style={{
        display: "flex", justifyContent: isMobile ? "center" : "space-between", alignItems: "center",
        flexDirection: isMobile ? "column" : "row",
        marginTop: isMobile ? T.s.xxxl : "clamp(80px, 10vw, 140px)",
        padding: isMobile ? `${T.s.lg}px ${T.mobilePadX}px 0` : `${T.s.lg}px ${T.padX} 0`,
        borderTop: `1px solid ${T.border}`, flexWrap: "wrap", gap: isMobile ? T.s.sm + 4 : T.s.md,
        position: "relative", zIndex: 1,
      }}>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.textFaint }}>
          {'©'} {new Date().getFullYear()} Benja Juster. Los Angeles, CA.
        </span>
        <a href="https://www.linkedin.com/in/benjajuster/" target="_blank" rel="noopener noreferrer"
          style={{
            fontFamily: T.sans, fontSize: 12, color: T.textFaint,
            letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = T.text}
          onMouseLeave={(e) => e.currentTarget.style.color = T.textFaint}
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}

export default Footer;
