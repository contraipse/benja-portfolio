import { useContext, useRef, useState } from 'react';
import { T, monoLabel } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { selectedWork, featured } from '../data/projects';
import { ProjectContext } from '../context/ProjectContext';

/* Full project index: featured first, then the rest, deduped by title. */
const indexProjects = [
  ...featured,
  ...selectedWork.filter((sw) => !featured.some((f) => f.title === sw.title)),
];

export function WorkIndex() {
  const isMobile = useIsMobile();
  const { setActiveProject } = useContext(ProjectContext);
  const [hovered, setHovered] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY });

  return (
    <section
      id="index"
      ref={sectionRef}
      aria-label="Full project index"
      onMouseMove={isMobile ? undefined : onMove}
      style={{
        position: "relative", zIndex: 1,
        padding: isMobile ? `72px ${T.mobilePadX}px 0` : `clamp(100px, 14vh, 180px) ${T.padX} 0`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: isMobile ? 24 : 40 }}>
        <h2 style={{
          fontFamily: T.serif, fontWeight: 400, letterSpacing: "-0.01em",
          fontSize: isMobile ? 34 : "clamp(40px, 4.5vw, 72px)", color: T.text, margin: 0,
        }}>
          Index
        </h2>
        <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>
          All projects ({indexProjects.length})
        </span>
      </div>

      <div role="list">
        {indexProjects.map((p, i) => {
          const isHov = hovered === i;
          return (
            <button
              key={p.title}
              role="listitem"
              onClick={() => setActiveProject(p)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`Open project: ${p.title}, ${p.client}, ${p.year}`}
              style={{
                all: "unset", cursor: "pointer", display: "grid", width: "100%",
                gridTemplateColumns: isMobile ? "auto 1fr auto" : "56px 5fr 3fr 2.5fr 64px",
                alignItems: "baseline",
                gap: isMobile ? 12 : 20,
                padding: isMobile ? "16px 0" : "20px 8px",
                borderTop: `1px solid ${T.border}`,
                borderBottom: i === indexProjects.length - 1 ? `1px solid ${T.border}` : "none",
                background: isHov ? "rgba(239,233,223,0.03)" : "transparent",
                transition: "background 0.2s ease",
              }}
            >
              <span style={{ ...monoLabel, fontSize: 10, color: isHov ? T.accent : T.textFaint, transition: "color 0.2s ease" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{
                fontFamily: T.serif, fontWeight: 400,
                fontSize: isMobile ? 18 : "clamp(20px, 1.8vw, 28px)",
                color: isHov ? T.accent : T.text,
                lineHeight: 1.2,
                transition: "color 0.2s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                transform: isHov && !isMobile ? "translateX(10px)" : "translateX(0)",
                display: "inline-block",
              }}>
                {p.title}
              </span>
              {!isMobile && (
                <span style={{ ...monoLabel, fontSize: 10, color: T.textMuted }}>{p.client}</span>
              )}
              {!isMobile && (
                <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>{p.category}</span>
              )}
              <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint, textAlign: "right" }}>{p.year}</span>
            </button>
          );
        })}
      </div>

      {/* Cursor-following preview (desktop only) */}
      {!isMobile && hovered !== null && (
        <div aria-hidden="true" style={{
          position: "fixed",
          left: mouse.x, top: mouse.y,
          transform: "translate(24px, -50%)",
          width: 300, aspectRatio: "16/10",
          borderRadius: T.r.md, overflow: "hidden",
          pointerEvents: "none", zIndex: 50,
          boxShadow: "0 20px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(239,233,223,0.1)",
          background: T.surface,
        }}>
          <img
            src={indexProjects[hovered].image}
            alt=""
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              objectPosition: indexProjects[hovered].cropHint || "center",
            }}
          />
        </div>
      )}
    </section>
  );
}
export default WorkIndex;
