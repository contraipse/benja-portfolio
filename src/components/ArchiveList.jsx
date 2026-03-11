import { useState, useRef, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useIsMobile';
import { T } from '../data/tokens';
import { selectedWork } from '../data/projects';
import { ArchiveRow } from './ArchiveRow';

export function ArchiveList() {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const listRef = useRef(null);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [fullHeight, setFullHeight] = useState(0);
  const gridCols = isMobile ? "32px 1fr 28px" : "48px 1fr 140px 100px 36px";
  const VISIBLE_ROWS = 3;

  // Measure row heights after render to calculate collapsed height
  useEffect(() => {
    if (!listRef.current) return;
    const rows = listRef.current.children;
    if (rows.length === 0) return;
    let h = 0;
    for (let i = 0; i < Math.min(VISIBLE_ROWS, rows.length); i++) {
      h += rows[i].offsetHeight;
    }
    setCollapsedHeight(h);
    let total = 0;
    for (let i = 0; i < rows.length; i++) {
      total += rows[i].offsetHeight;
    }
    setFullHeight(total);
  }, [isMobile]);

  return (
    <section style={{
      padding: isMobile ? "60px 0" : "clamp(80px, 10vw, 140px) 0",
      position: "relative", zIndex: 1,
    }}>
      <div style={{ position: "relative", zIndex: 1, padding: isMobile ? `0 ${T.mobilePadX}px` : `0 ${T.padX}` }}>
        <div style={{ marginBottom: isMobile ? 28 : 48, display: "flex", justifyContent: isMobile ? "center" : "space-between", alignItems: "flex-end", textAlign: isMobile ? "center" : "left" }}>
          <div>
            <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: "3px", textTransform: "uppercase" }}>Index</span>
            <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 28 : "clamp(32px, 4vw, 56px)", fontWeight: 300, color: T.text, margin: "8px 0 0", lineHeight: 1 }}>
              Selected Work
            </h2>
          </div>
        </div>

        {/* Header row */}
        <div style={{
          display: "grid", gridTemplateColumns: gridCols,
          gap: isMobile ? 8 : 16, padding: "0 0 16px",
          borderBottom: `1px solid ${T.border}`,
        }}>
          <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, color: T.textFaint, letterSpacing: "1.5px", textTransform: "uppercase" }}>No.</span>
          <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, color: T.textFaint, letterSpacing: "1.5px", textTransform: "uppercase" }}>Project</span>
          {!isMobile && <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, color: T.textFaint, letterSpacing: "1.5px", textTransform: "uppercase" }}>Discipline</span>}
          {!isMobile && <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, color: T.textFaint, letterSpacing: "1.5px", textTransform: "uppercase" }}>Client</span>}
          <span />
        </div>

        {/* All rows rendered in DOM for SEO - visibility controlled by max-height */}
        <div
          ref={listRef}
          style={{
            maxHeight: expanded ? "9999px" : (collapsedHeight || 200) + 200,
            paddingTop: 200,
            marginTop: -200,
            overflow: "hidden",
            transition: "max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            position: "relative",
          }}
        >
          {selectedWork.map((project, i) => (
            <ArchiveRow key={project.title + i} project={project} index={i}
              isHovered={hoveredIndex === i}
              onHover={() => setHoveredIndex(i)}
              onLeave={() => setHoveredIndex(-1)}
            />
          ))}
        </div>

        {/* Fade overlay when collapsed */}
        {!expanded && (
          <div style={{
            position: "relative", marginTop: -48, height: 48,
            background: `linear-gradient(to top, ${T.bg || "#0A0A0A"}, transparent)`,
            pointerEvents: "none",
            transition: "opacity 0.3s ease",
          }} />
        )}

        {/* Expand / Collapse button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: expanded ? 24 : 8 }}>
          <button onClick={() => setExpanded(!expanded)} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "12px 28px",
            background: expanded ? "transparent" : T.accent,
            border: `1px solid ${T.accent}`,
            borderRadius: T.r.xl,
            cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600,
            color: expanded ? T.accent : "#fff",
            letterSpacing: "0.5px",
            transition: "all 0.3s ease",
          }}
            onMouseEnter={(e) => {
              if (!expanded) {
                e.currentTarget.style.background = "#e64400";
                e.currentTarget.style.borderColor = "#e64400";
              } else {
                e.currentTarget.style.background = "rgba(255,77,0,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = expanded ? "transparent" : T.accent;
              e.currentTarget.style.borderColor = T.accent;
            }}
          >
            {expanded ? "Show Less" : `View All ${selectedWork.length} Projects`}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
              <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
