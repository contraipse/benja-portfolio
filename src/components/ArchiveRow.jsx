import { useState, useRef, useCallback } from 'react';
import React from 'react';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useIsMobile';
import { T } from '../data/tokens';
import { ProjectContext } from '../context/ProjectContext';

export function ArchiveRow({ project, index, isHovered, onHover, onLeave }) {
  const [ref, visible] = useInView({ threshold: 0.1 });
  const rowRef = useRef(null);
  const [mouseX, setMouseX] = useState(0);
  const isMobile = useIsMobile();
  const { setActiveProject } = React.useContext(ProjectContext);
  const gridCols = isMobile ? "32px 1fr 28px" : "48px 1fr 140px 100px 36px";

  const handleMouseMove = useCallback((e) => {
    if (!rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  }, []);

  return (
    <div
      ref={(el) => { ref(el); rowRef.current = el; }}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title}`}
      data-cursor={isMobile ? undefined : "View"}
      onClick={() => setActiveProject(project)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveProject(project); } }}
      onMouseEnter={isMobile ? undefined : onHover}
      onMouseLeave={isMobile ? undefined : onLeave}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      style={{
        display: "grid", gridTemplateColumns: gridCols,
        gap: isMobile ? 8 : 16, padding: isMobile ? "14px 0" : "18px 0",
        borderBottom: `1px solid ${isHovered && !isMobile ? "rgba(255,77,0,0.2)" : T.border}`,
        alignItems: "center", cursor: "pointer",
        position: "relative", outline: "none",
        transition: "border-color 0.3s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionProperty: "opacity, transform, border-color",
        transitionDuration: "0.6s, 0.6s, 0.3s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${(index % 8) * 0.03}s`,
      }}
    >
      {/* Floating preview image ÃÂ¢ÃÂÃÂ desktop only */}
      {!isMobile && project.image && (
        <div style={{
          position: "absolute",
          bottom: "100%", left: Math.min(Math.max(mouseX - 110, 0), 600),
          width: 220, height: 150,
          borderRadius: 8, overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(-12px) scale(1)" : "translateY(0) scale(0.9)",
          transition: "opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none", zIndex: 20,
          border: `1px solid rgba(255,255,255,0.08)`,
        }}>
          <div role="img" aria-label={project.title} style={{
            width: "100%", height: "100%",
            backgroundImage: `url(${project.image})`,
            backgroundSize: "cover", backgroundPosition: project.cropHint || "center",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.6s ease",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
            background: "linear-gradient(to top, rgba(10,10,10,0.6), transparent)",
          }} />
        </div>
      )}

      {/* Hover accent bar on left ÃÂ¢ÃÂÃÂ desktop only */}
      {!isMobile && <div style={{
        position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)",
        width: 3, height: isHovered ? "60%" : 0,
        background: T.accent, borderRadius: 2,
        transition: "height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }} />}

      <span style={{
        fontFamily: T.sans, fontSize: isMobile ? 11 : 13, color: isHovered && !isMobile ? T.accent : T.textFaint, fontWeight: 500,
        fontVariantNumeric: "tabular-nums", transition: "color 0.3s",
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      <span style={{
        fontFamily: T.serif, fontSize: isMobile ? 18 : "clamp(20px, 2.2vw, 30px)", fontWeight: 400,
        color: isHovered && !isMobile ? T.text : "rgba(255,255,255,0.75)",
        transition: "color 0.3s ease, transform 0.3s ease",
        whiteSpace: isMobile ? "normal" : "nowrap",
        transform: isHovered && !isMobile ? "translateX(8px)" : "translateX(0)",
      }}>
        {project.title}
      </span>

      {!isMobile && <span style={{ fontFamily: T.sans, fontSize: 13, color: T.textMuted, fontWeight: 500 }}>
        {project.category}
      </span>}
      {!isMobile && <span style={{ fontFamily: T.sans, fontSize: 12, color: isHovered ? "rgba(255,255,255,0.6)" : T.textFaint, fontWeight: 400, transition: "color 0.3s", whiteSpace: "nowrap" }}>
        {project.client}
      </span>}

      <div style={{
        width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, borderRadius: "50%",
        border: `1px solid ${isHovered && !isMobile ? T.accent : T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: isHovered && !isMobile ? T.accent : "transparent",
        transform: isHovered && !isMobile ? "rotate(-45deg)" : "rotate(0deg)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke={isHovered && !isMobile ? "#fff" : "rgba(255,255,255,0.25)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
