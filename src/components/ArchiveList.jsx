import { useState, useRef, useEffect, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { T } from '../data/tokens';
import { selectedWork, featured } from '../data/projects';
import { ProjectCard } from './ProjectCard';

/* These 4 projects get the 2x2 large treatment, alternating left→right */
const LARGE_TITLES = [
  "Red Bull Hack The Hits",
  "TwitchQuest",
  "PepsiCo Boutique Sensorium",
  "Stripe Convergence",
];

/* Show 3 rows initially (desktop & mobile) */
const INITIAL_ROWS = 3;

/* Reorder archive: place large tiles at indices 0, 5, 10, 15 so the
   mosaic pattern tiles perfectly (1 large + 4 small per block). */
function buildMosaicOrder(projects) {
  const large = [];
  const small = [];
  for (const p of projects) {
    if (LARGE_TITLES.includes(p.title)) large.push(p);
    else small.push(p);
  }
  const result = [];
  let li = 0, si = 0;
  for (let i = 0; i < projects.length; i++) {
    if (i % 5 === 0 && li < large.length) {
      result.push(large[li++]);
    } else {
      if (si < small.length) result.push(small[si++]);
    }
  }
  while (li < large.length) result.push(large[li++]);
  while (si < small.length) result.push(small[si++]);
  return result;
}

const rawArchive = selectedWork.filter(
  sw => !featured.some(f => f.title === sw.title)
);
const archiveProjects = buildMosaicOrder(rawArchive);

function isLargeTile(index) {
  return index % 5 === 0 && index / 5 < LARGE_TITLES.length;
}

/* Alternate the 2x2 tile between left (cols 1-2) and right (cols 3-4) */
function getLargeColumn(blockIndex) {
  return blockIndex % 2 === 0 ? "1 / 3" : "3 / 5";
}

export function ArchiveList() {
  const [expanded, setExpanded] = useState(false);
  const gridRef = useRef(null);
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const cols = isMobile ? 2 : 4;
  const gap = isMobile ? 6 : "clamp(6px, 0.8vw, 10px)";
  const pad = isMobile ? `0 ${T.mobilePadX}px` : `0 ${T.padX}`;
  const rowH = isMobile ? "clamp(130px, 28vw, 180px)" : "clamp(150px, 16vw, 210px)";

  /* Calculate collapsed max-height: INITIAL_ROWS * row height + gaps.
     Start with a CSS-safe fallback, then refine after mount. */
  const fallbackCollapsed = isMobile
    ? `calc(${INITIAL_ROWS} * clamp(130px, 28vw, 180px) + ${INITIAL_ROWS - 1} * 6px)`
    : `calc(${INITIAL_ROWS} * clamp(150px, 16vw, 210px) + ${INITIAL_ROWS - 1} * clamp(6px, 0.8vw, 10px))`;
  const [collapsedHeight, setCollapsedHeight] = useState(null);
  const [fullHeight, setFullHeight] = useState(null);

  const measureHeights = useCallback(() => {
    if (!gridRef.current) return;
    const grid = gridRef.current;
    const rows = grid.getGridComputedStyle
      ? null
      : window.getComputedStyle(grid).gridTemplateRows.split(" ");
    if (!rows) return;
    const gapPx = parseFloat(window.getComputedStyle(grid).rowGap) || 0;

    /* collapsed = first INITIAL_ROWS rows + gaps between them */
    let collapsed = 0;
    for (let r = 0; r < Math.min(INITIAL_ROWS, rows.length); r++) {
      collapsed += parseFloat(rows[r]);
      if (r < INITIAL_ROWS - 1) collapsed += gapPx;
    }
    setCollapsedHeight(collapsed + "px");

    /* full = all rows + all gaps */
    let full = 0;
    for (let r = 0; r < rows.length; r++) {
      full += parseFloat(rows[r]);
      if (r < rows.length - 1) full += gapPx;
    }
    setFullHeight(full + "px");
  }, [isMobile]);

  useEffect(() => {
    measureHeights();
    window.addEventListener("resize", measureHeights);
    return () => window.removeEventListener("resize", measureHeights);
  }, [measureHeights]);

  const handleToggle = () => {
    if (expanded) {
      setExpanded(false);
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const top = rect.top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      setExpanded(true);
    }
  };

  /* Count which large tile block we're on for left/right alternation */
  let largeBlockCount = 0;

  return (
    <section ref={sectionRef} aria-label="All projects" style={{
      paddingTop: isMobile ? 6 : gap,
      paddingBottom: isMobile ? 60 : "clamp(80px, 10vw, 120px)",
      position: "relative", zIndex: 1,
    }}>
      <div style={{ padding: pad }}>
        {/* Mosaic tile grid — ALL projects always in DOM for SEO */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridAutoRows: rowH,
            gridAutoFlow: "dense",
            gap,
            marginBottom: isMobile ? 24 : 36,
            maxHeight: expanded
              ? (fullHeight || "5000px")
              : (collapsedHeight || fallbackCollapsed),
            overflow: "hidden",
            transition: "max-height 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {archiveProjects.map((project, i) => {
            const large = !isMobile && isLargeTile(i);
            let colStyle = {};
            if (large) {
              const col = getLargeColumn(largeBlockCount);
              colStyle = { gridColumn: col, gridRow: "span 2" };
              largeBlockCount++;
            }
            /* If we're in the last block and it's incomplete, stretch
               the remaining small tiles to span 2 rows so there's no gap */
            const lastLargeIdx = (LARGE_TITLES.length - 1) * 5;
            const tilesAfterLastLarge = archiveProjects.length - lastLargeIdx - 1;
            const inLastBlock = !large && i > lastLargeIdx && tilesAfterLastLarge < 4;
            if (!isMobile && inLastBlock) {
              colStyle = { gridRow: "span 2" };
            }
            return (
              <div key={project.title} style={{
                ...colStyle,
                borderRadius: T.r.md,
                overflow: "hidden",
              }}>
                <ProjectCard project={project} index={i} variant="square" compact={!large} mosaic />
              </div>
            );
          })}
        </div>

        {/* Gradient fade at bottom when collapsed */}
        {!expanded && (
          <div style={{
            position: "relative",
            marginTop: -120,
            height: 120,
            background: "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.85) 40%, rgba(10,10,10,0.4) 70%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }} />
        )}

        {/* Expand / Collapse button */}
        <div style={{
          display: "flex", justifyContent: "center",
          marginTop: expanded ? 0 : -16,
          position: "relative", zIndex: 3,
        }}>
          <button onClick={handleToggle} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "16px 40px",
            background: expanded ? "transparent" : T.accent,
            border: `1px solid ${T.accent}`,
            borderRadius: T.r.xl,
            cursor: "pointer", fontFamily: T.sans, fontSize: 15, fontWeight: 600,
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
