import { T, monoLabel } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { useInView } from '../hooks/useInView';

export default function Footer() {
  const isMobile = useIsMobile();
  const [ref, visible] = useInView({ threshold: 0.2 });

  return (
    <footer ref={ref} aria-label="Contact" style={{
      position: "relative", zIndex: 1,
      padding: isMobile
        ? `96px ${T.mobilePadX}px 32px`
        : `clamp(140px, 20vh, 240px) ${T.padX} 40px`,
    }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <span style={{ ...monoLabel, color: T.textMuted }}>Next</span>
        <h2 style={{
          fontFamily: T.serif, fontWeight: 400, letterSpacing: "-0.02em",
          fontSize: isMobile ? "clamp(40px, 11vw, 60px)" : "clamp(56px, 7.5vw, 128px)",
          lineHeight: 1.02, color: T.text, margin: "20px 0 0", maxWidth: 1200,
        }}>
          Let's build what
          <br />
          people remember{" "}
          <em style={{ fontStyle: "italic", color: T.accent }}>next.</em>
        </h2>

        <div style={{
          display: "flex", flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? 16 : 32,
          marginTop: isMobile ? 36 : 56,
        }}>
          <a
            href="mailto:benjajuster@gmail.com"
            style={{
              fontFamily: T.sans, fontSize: isMobile ? 15 : 16, fontWeight: 600,
              color: "#FFF", background: T.accent, textDecoration: "none",
              padding: "16px 36px", borderRadius: T.r.full,
              transition: "background 0.2s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => { e.target.style.background = T.accentDark; }}
            onMouseLeave={(e) => { e.target.style.background = T.accent; }}
          >
            benjajuster@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/benjajuster/"
            target="_blank" rel="noopener noreferrer"
            style={{
              ...monoLabel, color: T.textMuted, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = T.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.textMuted; }}
          >
            LinkedIn <span aria-hidden="true" style={{ color: T.accent }}>↗</span>
          </a>
        </div>
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        marginTop: isMobile ? 80 : 140,
        paddingTop: 24, borderTop: `1px solid ${T.border}`,
      }}>
        <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>© 2026 Benja Juster</span>
        <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>benja.art</span>
        <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>Experiential Creative Director</span>
      </div>
    </footer>
  );
}
