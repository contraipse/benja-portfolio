import { T } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { featured } from '../data/projects';
import { ProjectCard } from './ProjectCard';

export function FeaturedShowcase() {
  const isMobile = useIsMobile();
  const gap = isMobile ? 12 : "clamp(10px, 1.2vw, 16px)";
  const pad = isMobile ? "0 16px" : "0 clamp(24px, 5vw, 64px)";
  return (
    <section id="work" style={{ position: "relative", zIndex: 1 }}>
      <div style={{
        padding: pad, marginBottom: isMobile ? 28 : "clamp(40px, 5vh, 60px)",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <div>
          <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: "3px", textTransform: "uppercase" }}>Featured</span>
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 32 : "clamp(40px, 5vw, 72px)", fontWeight: 300, color: T.text, margin: "8px 0 0", lineHeight: 1 }}>
            Selected Work
          </h2>
        </div>
      </div>
      <div style={{ padding: pad, display: "flex", flexDirection: "column", gap }}>
        <ProjectCard project={featured[0]} index={0} variant={isMobile ? "square" : "hero"} />
        {isMobile ? (
          /* Mobile: single column, all cards same ratio */
          featured.slice(1).map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i + 1} variant="square" />
          ))
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>
              <ProjectCard project={featured[1]} index={1} variant="square" />
              <ProjectCard project={featured[2]} index={2} variant="square" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap }}>
              <ProjectCard project={featured[3]} index={3} variant="tall" />
              <ProjectCard project={featured[4]} index={4} variant="tall" />
              <ProjectCard project={featured[5]} index={5} variant="tall" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
