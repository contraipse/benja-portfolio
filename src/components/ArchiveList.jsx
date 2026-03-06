import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useIsMobile';
import { T } from '../data/tokens';
import { selectedWork } from '../data/projects';
import { ArchiveRow } from './ArchiveRow';

export function ArchiveList() {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const gridCols = isMobile ? "32px 1fr 28px" : "48px 1fr 140px 100px 36px";
  const INITIAL_COUNT = isMobile ? 7 : 5;
  const visibleWork = !expanded ? selectedWork.slice(0, INITIAL_COUNT) : selectedWork;
  const hasMore = selectedWork.length > INITIAL_COUNT;

  return (
    <section style={{
      padding: isMobile ? "60px 0" : "clamp(80px, 10vw, 140px) 0",
      position: "relative", overflow: "hidden", zIndex: 1,
    }}>
      <div style={{ position: "relative", zIndex: 1, padding: isMobile ? "0 16px" : "0 clamp(24px, 5vw, 64px)" }}>
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

        {visibleWork.map((project, i) => (
          <ArchiveRow key={project.title + i} project={project} index={i}
            isHovered={hoveredIndex === i}
            onHover={() => setHoveredIndex(i)}
            onLeave={() => setHoveredIndex(-1)}
          />
        ))}

        {/* Show More / Show Less button */}
        {hasMore || expanded ? (
          <button onClick={() => setExpanded(!expanded)} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "16px 0", marginTop: 4,
            background: "none", border: "none", borderBottom: `1px solid ${T.border}`,
            cursor: "pointer", fontFamily: T.sans, fontSize: 12, fontWeight: 600,
            color: T.accent, letterSpacing: "1.5px", textTransform: "uppercase",
          }}>
            {expanded ? "Show Less" : `Show All (${selectedWork.length})`}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
              <path d="M3 6L8 11L13 6" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>
    </section>
  );
}
