import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { T } from '../data/tokens';
import { featured, selectedWork } from '../data/projects';
import { useIsMobile } from '../hooks/useIsMobile';
import { ProjectContext } from '../context/ProjectContext';

export default function ProjectDetailOverlay() {
  const { activeProject, setActiveProject } = useContext(ProjectContext);
  const [show, setShow] = useState(false);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [heroHover, setHeroHover] = useState(false);
  const [imgOrientation, setImgOrientation] = useState(null);
  const [heroOpacity, setHeroOpacity] = useState(0);
  const prevOrientationRef = useRef(null);
  const overlayRef = useRef(null);
  const stripRef = useRef(null);
  const isMobile = useIsMobile();
  const project = activeProject;
  const allProjects = [...featured, ...selectedWork.filter(sw => !featured.some(f => f.title === sw.title))];
  const currentIdx = project ? allProjects.findIndex(p => p.title === project.title) : -1;

  useEffect(() => {
    if (project) {
      setActiveGalleryIdx(0);
      setHeroOpacity(0);
      setImgOrientation(null);
      prevOrientationRef.current = null;
      if (overlayRef.current) overlayRef.current.scrollTop = 0;
      requestAnimationFrame(() => {
        if (overlayRef.current) overlayRef.current.scrollTop = 0;
        setShow(true);
      });
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => setActiveProject(null), 500);
  };

  const goToProject = (dir) => {
    const next = (currentIdx + dir + allProjects.length) % allProjects.length;
    setActiveProject(allProjects[next]);
    if (overlayRef.current) overlayRef.current.scrollTop = 0;
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") goToProject(1);
      if (e.key === "ArrowLeft") goToProject(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, currentIdx]);

  // Detect portrait vs landscape for current gallery image
  useEffect(() => {
    if (!project) return;
    const gallery = (project.gallery && project.gallery.length > 0) ? project.gallery : [project.image];
    const src = gallery[activeGalleryIdx];
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const newOrientation = img.naturalHeight > img.naturalWidth ? "portrait" : "landscape";
      if (prevOrientationRef.current !== null && newOrientation !== prevOrientationRef.current) {
        setHeroOpacity(0);
        setTimeout(() => {
          setImgOrientation(newOrientation);
          prevOrientationRef.current = newOrientation;
          setTimeout(() => setHeroOpacity(1), 50);
        }, 200);
      } else {
        setImgOrientation(newOrientation);
        prevOrientationRef.current = newOrientation;
        setHeroOpacity(1);
      }
    };
    img.src = src;
  }, [activeGalleryIdx, project]);

  if (!project) return null;

  const allMedia = [...((project.gallery && project.gallery.length > 0) ? project.gallery : [project.image])];
  const hasVideo = !!project.video;

  const NavArrow = ({ dir, onClick }) => (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} style={{
      position: "fixed", top: "50%", [dir === -1 ? "left" : "right"]: 20,
      transform: "translateY(-50%)", zIndex: 10000,
      width: 48, height: 48, borderRadius: "50%",
      background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "all 0.3s ease",
      opacity: show ? 1 : 0,
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = T.accent; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = T.border; }}
    >
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d={dir === -1 ? "M10 3L5 8L10 13" : "M6 3L11 8L6 13"} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  return (
    <div ref={overlayRef} onClick={handleClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: show ? "rgba(0,0,0,0.94)" : "rgba(0,0,0,0)",
      backdropFilter: show ? "blur(24px)" : "blur(0px)",
      transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      display: "flex", flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "flex-start", justifyContent: "center",
      overflowY: isMobile ? "hidden" : "auto", cursor: "pointer",
    }}>
      {/* Mobile: fixed top bar OUTSIDE scroll container ÃÂ¢ÃÂÃÂ never scrolls away */}
      {isMobile && (
        <div onClick={(e) => e.stopPropagation()} style={{
          flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 16px", background: "rgba(0,0,0,0.95)", zIndex: 10,
          cursor: "default",
        }}>
          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.textFaint, letterSpacing: "1px" }}>
            {String(currentIdx + 1).padStart(2, "0")} / {String(allProjects.length).padStart(2, "0")}
          </span>
          <button onClick={handleClose} style={{
            background: "rgba(255,255,255,0.1)", border: `1px solid ${T.border}`,
            borderRadius: "50%", width: 40, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.3s ease",
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* Prev / Next arrows ÃÂ¢ÃÂÃÂ desktop only */}
      {!isMobile && <NavArrow dir={-1} onClick={() => goToProject(-1)} />}
      {!isMobile && <NavArrow dir={1} onClick={() => goToProject(1)} />}

      <div onClick={(e) => e.stopPropagation()} style={{
        width: isMobile ? "100%" : "min(940px, 90vw)",
        padding: isMobile ? "0 16px 60px" : "60px 0 80px",
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
        cursor: "default",
        ...(isMobile ? { flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" } : {}),
      }}>
        {/* Top bar ÃÂ¢ÃÂÃÂ counter + close (desktop only; mobile version is above scroll container) */}
        {!isMobile && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 28,
          }}>
            <span style={{ fontFamily: T.sans, fontSize: 12, color: T.textFaint, letterSpacing: "1px" }}>
              {String(currentIdx + 1).padStart(2, "0")} / {String(allProjects.length).padStart(2, "0")}
            </span>
            <button onClick={handleClose} style={{
              background: "rgba(255,255,255,0.1)", border: `1px solid ${T.border}`,
              borderRadius: "50%", width: 40, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 3L13 13M13 3L3 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Hero image / gallery ÃÂ¢ÃÂÃÂ click to advance, hover arrows */}
        {(() => {
          const goPrev = (e) => { e.stopPropagation(); setActiveGalleryIdx((activeGalleryIdx - 1 + allMedia.length) % allMedia.length); };
          const goNext = (e) => { e.stopPropagation(); setActiveGalleryIdx((activeGalleryIdx + 1) % allMedia.length); };
          const HeroArrow = ({ dir, onClick }) => (
            <button onClick={onClick} style={{
              position: "absolute", top: "50%", [dir === -1 ? "left" : "right"]: isMobile ? 8 : 16,
              transform: "translateY(-50%)", zIndex: 3,
              width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", backdropFilter: "blur(8px)",
              opacity: isMobile ? 0.7 : (heroHover ? 1 : 0), transition: "opacity 0.3s ease, background 0.2s ease",
              pointerEvents: isMobile ? "auto" : (heroHover ? "auto" : "none"),
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d={dir === -1 ? "M10 3L5 8L10 13" : "M6 3L11 8L6 13"} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          );
          return (
            <div
              onMouseEnter={() => setHeroHover(true)}
              onMouseLeave={() => setHeroHover(false)}
              style={{ position: "relative", width: "100%", height: isMobile ? "40vh" : "60vh", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}
            >
              <div
                onClick={goNext}
                style={{
                  height: "100%", aspectRatio: imgOrientation === "portrait" ? "3/4" : "16/9", maxWidth: "100%",
                  borderRadius: 10, overflow: "hidden", background: "#0F0F0F",
                  position: "relative", cursor: allMedia.length > 1 ? "pointer" : "default",
                  opacity: heroOpacity, transition: "opacity 0.2s ease",
                }}
              >
                <div style={{
                  width: "100%", height: "100%",
                  backgroundImage: `url(${allMedia[activeGalleryIdx]})`,
                  role: "img", "aria-label": `${activeProject.title} - image ${activeGalleryIdx + 1}`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }} />
                {/* Image counter pill */}
                {allMedia.length > 1 && (
                  <div style={{
                    position: "absolute", bottom: 12, right: 14, zIndex: 3,
                    fontFamily: T.sans, fontSize: 11, letterSpacing: "0.5px",
                    color: "rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.5)",
                    padding: "4px 10px", borderRadius: 20, backdropFilter: "blur(8px)",
                  }}>{activeGalleryIdx + 1} / {allMedia.length}</div>
                )}
              </div>
              {allMedia.length > 1 && <HeroArrow dir={-1} onClick={goPrev} />}
              {allMedia.length > 1 && <HeroArrow dir={1} onClick={goNext} />}
            </div>
          );
        })()}

        {/* Gallery thumbnails with scroll arrows */}
        {allMedia.length > 1 && (() => {
              const scrollStrip = (dir) => {
            if (stripRef.current) stripRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
          };
          const ThumbArrow = ({ dir }) => (
            <button onClick={() => scrollStrip(dir)} style={{
              position: "absolute", top: "50%", [dir === -1 ? "left" : "right"]: -4,
              transform: "translateY(-50%)", zIndex: 2,
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(0,0,0,0.7)", border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff", fontSize: 14, lineHeight: 1,
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d={dir === -1 ? "M10 3L5 8L10 13" : "M6 3L11 8L6 13"} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          );
          return (
            <div style={{ position: "relative", marginBottom: 32 }}>
              {allMedia.length > 8 && <ThumbArrow dir={-1} />}
              <div ref={stripRef} style={{
                display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4,
                scrollbarWidth: "none", msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                maskImage: allMedia.length > 8 ? "linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 32px), transparent 100%)" : "none",
                WebkitMaskImage: allMedia.length > 8 ? "linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 32px), transparent 100%)" : "none",
              }}>
                {allMedia.map((img, i) => (
                  <div key={i} role="button" tabIndex={0} aria-label={`View image ${i + 1}`}
                    onClick={() => setActiveGalleryIdx(i)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveGalleryIdx(i); } }}
                    style={{
                    width: 72, height: 48, borderRadius: 6, overflow: "hidden", cursor: "pointer", flexShrink: 0,
                    border: i === activeGalleryIdx ? `2px solid ${T.accent}` : `2px solid transparent`,
                    opacity: i === activeGalleryIdx ? 1 : 0.5,
                    transition: "all 0.3s ease", outline: "none",
                  }}>
                    <div role="img" aria-label={`${activeProject.title} thumbnail ${i + 1}`} style={{ width: "100%", height: "100%", backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  </div>
                ))}
              </div>
              {allMedia.length > 8 && <ThumbArrow dir={1} />}
            </div>
          );
        })()}

        {/* YouTube video embed ÃÂ¢ÃÂÃÂ works on benja.art (domain-restricted on localhost) */}
        {hasVideo && (
          <div style={{
            width: "100%", aspectRatio: "16/9", borderRadius: 10, overflow: "hidden",
            marginBottom: 32, background: T.surface,
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${project.video}?rel=0&modestbranding=1`}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Meta row */}
        <div style={{ display: "flex", gap: 32, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Client", value: project.client },
            { label: "Role", value: project.category },
            { label: "Year", value: project.year },
          ].map((m) => (
            <div key={m.label}>
              <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: T.accent, display: "block", marginBottom: 4 }}>{m.label}</span>
              <span style={{ fontFamily: T.sans, fontSize: 14, color: T.text }}>{m.value}</span>
            </div>
          ))}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: T.serif, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300,
          color: T.text, margin: "0 0 20px", lineHeight: 1.1,
        }}>{project.title}</h2>

        {/* Description */}
        <p style={{
          fontFamily: T.sans, fontSize: 16, color: T.textMuted, lineHeight: 1.7,
          maxWidth: 640, margin: 0,
        }}>{project.desc}</p>

        {/* Stats */}
        {project.stats && project.stats.length > 0 && (
          <div style={{
            display: "flex", gap: 32, marginTop: 28, flexWrap: "wrap",
          }}>
            {project.stats.map((s, i) => (
              <div key={i} style={{ textAlign: "left" }}>
                <span style={{
                  fontFamily: T.sans, fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 700,
                  color: T.accent, display: "block", lineHeight: 1.1,
                }}>{s.stat}</span>
                <span style={{
                  fontFamily: T.sans, fontSize: 10, fontWeight: 600, letterSpacing: "1.5px",
                  textTransform: "uppercase", color: T.textMuted, marginTop: 4, display: "block",
                }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ width: 60, height: 2, background: T.accent, margin: "40px 0", borderRadius: 1 }} />

        {/* Prev/next text links */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 0 }}>
          <button onClick={() => goToProject(-1)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke={T.textFaint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: T.sans, fontSize: 13, color: T.textFaint }}>
              {allProjects[(currentIdx - 1 + allProjects.length) % allProjects.length].title}
            </span>
          </button>
          <button onClick={() => goToProject(1)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontFamily: T.sans, fontSize: 13, color: T.textFaint }}>
              {allProjects[(currentIdx + 1) % allProjects.length].title}
            </span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke={T.textFaint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
