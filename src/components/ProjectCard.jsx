import { useState, useRef, useContext } from 'react';
import { T } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { ProjectContext } from '../context/ProjectContext';

export function ProjectCard({ project, index, variant = "square" }) {
  const [hovered, setHovered] = useState(false);
  const { setActiveProject } = useContext(ProjectContext);
  const isMobile = useIsMobile();
  const cardRef = useRef(null);
  const progress = useScrollProgress(cardRef);
  const ref = cardRef;
  // Card fades/slides in based on scroll position — appears during 0.05–0.3 range
  const enterOpacity = Math.max(0, Math.min(1, (progress - 0.05) * 4));
  const enterY = Math.max(0, 60 * (1 - enterOpacity));
  const parallaxY = enterOpacity >= 1 ? (progress - 0.5) * -20 : 0;
  const aspectMap = { hero: "21/9", square: "4/3", tall: "3/4" };

  return (
    <div
      ref={(el) => { ref.current = el; cardRef.current = el; }}
      onClick={() => setActiveProject(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: enterOpacity,
        transform: `translateY(${enterY + parallaxY}px)`,
        cursor: "pointer",
      }}
    >
      <div data-cursor="View" style={{
        position: "relative", overflow: "hidden",
        borderRadius: 8,
        aspectRatio: aspectMap[variant],
      }}>
        <div style={{
          position: "absolute", inset: "-8%",
          backgroundImage: `url(${project.image})`,
          backgroundSize: "cover", backgroundPosition: project.cropHint || "center",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.15) 50%, transparent 70%)"
            : "linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 35%)",
          transition: "background 0.5s ease",
        }} />
        {!isMobile && <div style={{
          position: "absolute", top: 16, left: 16,
          padding: "6px 14px", borderRadius: 20,
          background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontFamily: T.sans, fontSize: 10, fontWeight: 600,
          color: "rgba(255,255,255,0.8)", letterSpacing: "1.5px", textTransform: "uppercase",
          opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          {project.category}
        </div>}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <span style={{
                fontFamily: T.sans, fontSize: 11, color: T.textFaint, letterSpacing: "1px",
                display: "block", marginBottom: 6,
                opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s",
              }}>{project.year}</span>
              <h3 style={{
                fontFamily: T.serif, fontSize: "clamp(22px, 2.5vw, 36px)",
                fontWeight: 400, color: "#fff", margin: 0, lineHeight: 1.1,
                transform: hovered ? "translateY(0)" : "translateY(4px)",
                transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}>
                {project.title}
              </h3>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: `1px solid ${hovered ? T.accent : "rgba(255,255,255,0.15)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: hovered ? T.accent : "rgba(255,255,255,0.05)",
              transform: hovered ? "rotate(-45deg) scale(1.1)" : "rotate(0deg)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
