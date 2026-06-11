import { T, monoLabel } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { useInView } from '../hooks/useInView';

const FACTS = [
  { k: "Focus", v: "Experiential strategy, creative leadership, large-scale production" },
  { k: "Clients", v: "Google, Apple, Riot Games, Nike, Red Bull, PepsiCo, Stripe, Twitch" },
  { k: "Board", v: "Take 3 Presents — nonprofit nurturing creativity through experiential art" },
  { k: "Press", v: "Vice, LA Times, East Bay Times, SF Magazine, Laughing Squid" },
];

export function About() {
  const isMobile = useIsMobile();
  const [ref, visible] = useInView({ threshold: 0.12 });

  const reveal = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <section id="about" ref={ref} aria-label="About Benja Juster" style={{
      position: "relative", zIndex: 1,
      padding: isMobile ? `72px ${T.mobilePadX}px 0` : `clamp(100px, 14vh, 180px) ${T.padX} 0`,
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "5fr 7fr",
        gap: isMobile ? 32 : "clamp(40px, 6vw, 100px)",
        alignItems: "start",
        borderTop: `1px solid ${T.border}`,
        paddingTop: isMobile ? 36 : 64,
      }}>
        {/* Portrait */}
        <div style={{ ...reveal(0.1) }}>
          <div style={{ borderRadius: T.r.md, overflow: "hidden", aspectRatio: "4/4.6", background: T.surface }}>
            <img
              src="img/portrait.jpg"
              alt="Portrait of Benja Juster"
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 5%", display: "block" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>Benja Juster</span>
            <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>Creative Director</span>
          </div>
        </div>

        {/* Text */}
        <div>
          <div style={{ ...reveal(0.2), display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <span style={{ width: 36, height: 1, background: T.accent, display: "inline-block" }} />
            <span style={{ ...monoLabel, color: T.textMuted }}>About</span>
          </div>
          <h2 style={{
            ...reveal(0.3),
            fontFamily: T.serif, fontWeight: 400, letterSpacing: "-0.01em",
            fontSize: isMobile ? 30 : "clamp(34px, 3.6vw, 58px)",
            lineHeight: 1.1, color: T.text, margin: 0,
          }}>
            Strategic vision,
            <br />
            meticulous production,
            <br />
            teams that ship the{" "}
            <em style={{ fontStyle: "italic", color: T.accent }}>impossible.</em>
          </h2>
          <p style={{
            ...reveal(0.4),
            fontFamily: T.sans, fontSize: isMobile ? 15 : 16, lineHeight: 1.7,
            color: T.textMuted, margin: "28px 0 0", maxWidth: 560,
          }}>
            Fifteen years leading experiential creative for the world's most
            ambitious brands — managing multidisciplinary teams of 50+ across
            five continents and budgets exceeding $30M. I turn complex
            narratives into human stories, from 36,000-person conferences to
            intimate immersive moments, and build the creative organizations
            that deliver them.
          </p>

          <dl style={{ ...reveal(0.5), margin: isMobile ? "32px 0 0" : "48px 0 0" }}>
            {FACTS.map((f) => (
              <div key={f.k} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "88px 1fr" : "140px 1fr",
                gap: 16,
                padding: "14px 0",
                borderTop: `1px solid ${T.border}`,
              }}>
                <dt style={{ ...monoLabel, fontSize: 10, color: T.textFaint, paddingTop: 2 }}>{f.k}</dt>
                <dd style={{ fontFamily: T.sans, fontSize: isMobile ? 13 : 14, lineHeight: 1.6, color: T.textMuted, margin: 0 }}>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
export default About;
