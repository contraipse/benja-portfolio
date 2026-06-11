import { useContext } from 'react';
import { T, monoLabel } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { useInView } from '../hooks/useInView';
import { featured } from '../data/projects';
import { ProjectContext } from '../context/ProjectContext';

function CaseRow({ project, index }) {
  const isMobile = useIsMobile();
  const [ref, visible] = useInView({ threshold: 0.12 });
  const { setActiveProject } = useContext(ProjectContext);
  const flipped = index % 2 === 1;
  const keyStat = project.stats?.[0];

  return (
    <article ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
      borderTop: `1px solid ${T.border}`,
      padding: isMobile ? "36px 0" : "clamp(48px, 6vh, 80px) 0",
    }}>
      <button
        onClick={() => setActiveProject(project)}
        aria-label={`Open case study: ${project.title}`}
        style={{
          all: "unset", cursor: "pointer", display: "grid", width: "100%",
          gridTemplateColumns: isMobile ? "1fr" : flipped ? "5fr 7fr" : "7fr 5fr",
          gap: isMobile ? 24 : "clamp(32px, 4vw, 72px)",
          alignItems: "center",
        }}
        onMouseEnter={(e) => {
          const img = e.currentTarget.querySelector("img");
          if (img) img.style.transform = "scale(1.025)";
        }}
        onMouseLeave={(e) => {
          const img = e.currentTarget.querySelector("img");
          if (img) img.style.transform = "scale(1)";
        }}
      >
        {/* Image */}
        <div style={{
          order: isMobile ? 0 : flipped ? 2 : 1,
          borderRadius: T.r.md, overflow: "hidden",
          aspectRatio: isMobile ? "16/10" : "16/10.5",
          background: T.surface,
        }}>
          <img
            src={project.image}
            alt={`${project.title} — ${project.category} for ${project.client}`}
            loading={index > 0 ? "lazy" : "eager"}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              objectPosition: project.cropHint || "center",
              transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
              display: "block",
            }}
          />
        </div>

        {/* Text */}
        <div style={{ order: isMobile ? 1 : flipped ? 1 : 2 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 }}>
            <span style={{ ...monoLabel, fontSize: 10, color: T.accent }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>
              {project.client} · {project.year} · {project.category}
            </span>
          </div>
          <h3 style={{
            fontFamily: T.serif, fontWeight: 400,
            fontSize: isMobile ? 28 : "clamp(30px, 3.2vw, 52px)",
            lineHeight: 1.08, letterSpacing: "-0.01em",
            color: T.text, margin: 0,
          }}>
            {project.title}
          </h3>
          <p style={{
            fontFamily: T.sans, fontSize: isMobile ? 14 : 15, lineHeight: 1.65,
            color: T.textMuted, margin: "16px 0 0", maxWidth: 440,
            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {project.desc}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 24, flexWrap: "wrap" }}>
            {keyStat && (
              <div>
                <span style={{ fontFamily: T.serif, fontWeight: 500, fontSize: isMobile ? 24 : 30, color: T.accent }}>
                  {keyStat.stat}
                </span>
                <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint, marginLeft: 10 }}>
                  {keyStat.label}
                </span>
              </div>
            )}
            <span style={{ ...monoLabel, fontSize: 10, color: T.textMuted, display: "inline-flex", alignItems: "center", gap: 6 }}>
              View case <span aria-hidden="true" style={{ color: T.accent }}>→</span>
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}

export function CaseStudies() {
  const isMobile = useIsMobile();
  return (
    <section id="work" aria-label="Selected case studies" style={{
      position: "relative", zIndex: 1,
      padding: isMobile ? `72px ${T.mobilePadX}px 0` : `clamp(100px, 14vh, 180px) ${T.padX} 0`,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: isMobile ? 28 : 48 }}>
        <h2 style={{
          fontFamily: T.serif, fontWeight: 400, letterSpacing: "-0.01em",
          fontSize: isMobile ? 34 : "clamp(40px, 4.5vw, 72px)", color: T.text, margin: 0,
        }}>
          Selected work
        </h2>
        <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>
          01—{String(featured.length).padStart(2, "0")}
        </span>
      </div>
      {featured.map((p, i) => (
        <CaseRow key={p.title} project={p} index={i} />
      ))}
    </section>
  );
}
export default CaseStudies;
