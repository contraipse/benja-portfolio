import { useState, useRef, useContext } from 'react';
import { T } from '../data/tokens';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { ProjectContext } from '../context/ProjectContext';

export function ProjectCard({ project, index, variant = "square", compact = false, mosaic = false }) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { setActiveProject } = useContext(ProjectContext);
  const cardRef = useRef(null);
  const progress = useScrollProgress(cardRef);
  // Card fades/slides in based on scroll position — appears during 0.05–0.3 range
  const enterOpacity = Math.max(0, Math.min(1, (progress - 0.05) * 4));
  const enterY = Math.max(0, 60 * (1 - enterOpacity));
  const parallaxY = enterOpacity >= 1 ? (progress - 0.5) * -20 : 0;
  const aspectMap = { hero: "21/9", square: "4/3", tall: "3/4" };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title}`}
      onClick={() => setActiveProject(project)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveProject(project); } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: enterOpacity,
        transform: `translateY(${enterY + parallaxY}px)`,
        cursor: "pointer",
        outline: "none",
        ...(mosaic ? { height: "100%" } : {}),
      }}
    >
      <div style={{
        position: "relative", overflow: "hidden",
        aspectRatio: mosaic ? undefined : aspectMap[variant],
        ...(mosaic ? { height: "100%" } : {}),
        background: !imgLoaded ? `linear-gradient(90deg, ${T.surface} 25%, ${T.bgLight} 50%, ${T.surface} 75%)` : T.surface,
        backgroundSize: !imgLoaded ? "200% 100%" : "auto",
        animation: !imgLoaded ? "shimmer 1.5s ease-in-out infinite" : "none",
      }}>
        <img
          src={project.image}
          alt={project.title}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          style={{
            position: "absolute", inset: "-8%",
            width: "116%", height: "116%",
            objectFit: "cover", objectPosition: project.cropHint || "center",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        {/* Static bottom gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(18,15,11,0.62), transparent 38%)",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: compact ? "12px 14px 10px" : "20px 20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <span style={{
                fontFamily: T.sans, fontSize: compact ? 9 : 11, color: "rgba(255,255,255,0.75)",
                letterSpacing: "1.5px", textTransform: "uppercase",
                display: "block", marginBottom: 6,
              }}>{project.year}</span>
              <h3 style={{
                fontFamily: T.serif, fontSize: compact ? "clamp(14px, 1.6vw, 20px)" : "clamp(22px, 2.5vw, 36px)",
                fontWeight: 400, color: "#fff", margin: 0, lineHeight: 1.1,
              }}>
                {project.title}
              </h3>
            </div>
            {variant === "hero" && (
              <div style={{
                width: 36, height: 36,
                border: "1px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
