import { useState, useEffect, useRef, useContext } from 'react';
import { T } from '../data/tokens';
import { featured, selectedWork } from '../data/projects';
import { useIsMobile } from '../hooks/useIsMobile';
import { ProjectContext } from '../context/ProjectContext';

export default function ProjectDetailOverlay() {
  const { activeProject, setActiveProject } = useContext(ProjectContext);
  const [show, setShow] = useState(false);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const overlayRef = useRef(null);
  const stripRef = useRef(null);
  const prevFocusRef = useRef(null);
  const isMobile = useIsMobile();
  const project = activeProject;
  const allProjects = [...featured, ...selectedWork.filter(sw => !featured.some(f => f.title === sw.title))];
  const currentIdx = project ? allProjects.findIndex(p => p.title === project.title) : -1;

  useEffect(() => {
    if (project) {
      // Remember what had focus so we can restore it when the modal closes.
      prevFocusRef.current = document.activeElement;
      setActiveGalleryIdx(0);
      if (overlayRef.current) overlayRef.current.scrollTop = 0;
      requestAnimationFrame(() => {
        if (overlayRef.current) {
          overlayRef.current.scrollTop = 0;
          overlayRef.current.focus();
        }
        setShow(true);
      });
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  const handleClose = () => {
    setShow(false);
    const toRestore = prevFocusRef.current;
    setTimeout(() => {
      setActiveProject(null);
      if (toRestore && typeof toRestore.focus === "function") toRestore.focus();
    }, 500);
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
      if (e.key === "Tab" && overlayRef.current) {
        // Keep Tab focus inside the modal.
        const focusables = Array.from(
          overlayRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ).filter((el) => el.offsetParent !== null);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, currentIdx]);

  if (!project) return null;

  const allMedia = [...((project.gallery && project.gallery.length > 0) ? project.gallery : [project.image])];
  const videoSrc = project.video
    ? `https://www.youtube.com/embed/${project.video}?rel=0&modestbranding=1`
    : project.vimeo
      ? `https://player.vimeo.com/video/${project.vimeo}`
      : null;
  const goNext = () => setActiveGalleryIdx((activeGalleryIdx + 1) % allMedia.length);

  const CloseButton = (
    <button onClick={handleClose} aria-label="Close project" style={{
      background: "transparent", border: `1px solid ${T.border}`,
      width: 40, height: 40,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "border-color 0.3s ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.text; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M3 3L13 13M13 3L3 13" stroke={T.text} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );

  const Counter = (
    <span style={{
      fontFamily: T.sans, fontSize: 12, color: T.textFaint,
      letterSpacing: "1px", fontVariantNumeric: "tabular-nums",
    }}>
      {String(currentIdx + 1).padStart(2, "0")} / {String(allProjects.length).padStart(2, "0")}
    </span>
  );

  return (
    <div ref={overlayRef} onClick={handleClose}
      role="dialog" aria-modal="true" aria-label={project.title} tabIndex={-1} style={{
      outline: "none",
      position: "fixed", inset: 0, zIndex: 9999,
      background: show ? "rgba(250,247,242,0.98)" : "rgba(250,247,242,0)",
      transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      display: "flex", flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "flex-start", justifyContent: "center",
      overflowY: isMobile ? "hidden" : "auto", cursor: "pointer",
    }}>
      {/* Mobile: fixed top bar OUTSIDE scroll container — never scrolls away */}
      {isMobile && (
        <div onClick={(e) => e.stopPropagation()} style={{
          flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 16px", background: "rgba(250,247,242,0.98)", zIndex: 10,
          borderBottom: `1px solid ${T.borderLight}`,
          cursor: "default",
        }}>
          {Counter}
          {CloseButton}
        </div>
      )}

      <div onClick={(e) => e.stopPropagation()} style={{
        width: isMobile ? "100%" : "min(940px, 90vw)",
        padding: isMobile ? "0 16px 60px" : "60px 0 80px",
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
        cursor: "default",
        ...(isMobile ? { flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" } : {}),
      }}>
        {/* Top bar — counter + close (desktop only; mobile version is above scroll container) */}
        {!isMobile && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 28,
          }}>
            {Counter}
            {CloseButton}
          </div>
        )}

        {/* Hero image — fixed height, shrink-wrapped width, click to advance */}
        <div style={{
          position: "relative", width: "100%",
          display: "flex", justifyContent: "center",
          marginBottom: 16,
        }}>
          <div
            onClick={allMedia.length > 1 ? goNext : undefined}
            style={{
              position: "relative",
              cursor: allMedia.length > 1 ? "pointer" : "default",
              maxWidth: "100%",
            }}
          >
            <img
              src={allMedia[activeGalleryIdx]}
              alt={`${project.title} — image ${activeGalleryIdx + 1}`}
              decoding="async"
              style={{
                height: isMobile ? "42vh" : "60vh",
                width: "auto", maxWidth: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
            {/* Image counter chip */}
            {allMedia.length > 1 && (
              <div style={{
                position: "absolute", bottom: 12, right: 14, zIndex: 3,
                fontFamily: T.sans, fontSize: 11, letterSpacing: "0.5px",
                color: T.text, background: "rgba(250,247,242,0.88)",
                padding: "4px 10px",
              }}>{activeGalleryIdx + 1} / {allMedia.length}</div>
            )}
          </div>
        </div>

        {/* Gallery thumbnails with scroll arrows */}
        {allMedia.length > 1 && (() => {
          const scrollStrip = (dir) => {
            if (stripRef.current) stripRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
          };
          const ThumbArrow = ({ dir }) => (
            <button onClick={() => scrollStrip(dir)} style={{
              position: "absolute", top: "50%", [dir === -1 ? "left" : "right"]: -4,
              transform: "translateY(-50%)", zIndex: 2,
              width: 28, height: 28,
              background: T.bg, border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", lineHeight: 1,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d={dir === -1 ? "M10 3L5 8L10 13" : "M6 3L11 8L6 13"} stroke={T.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                    width: 72, height: 48, overflow: "hidden", cursor: "pointer", flexShrink: 0,
                    border: i === activeGalleryIdx ? `2px solid ${T.text}` : `2px solid transparent`,
                    opacity: i === activeGalleryIdx ? 1 : 0.55,
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

        {/* Video embed (YouTube or Vimeo) — works on benja.art (domain-restricted on localhost) */}
        {videoSrc && (
          <div style={{
            width: "100%", aspectRatio: "16/9", overflow: "hidden",
            marginBottom: 32, background: T.surface,
          }}>
            <iframe
              src={videoSrc}
              title={`${project.title} — video`}
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
              <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: T.textFaint, display: "block", marginBottom: 4 }}>{m.label}</span>
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
                  fontFamily: T.serif, fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 600,
                  color: T.text, display: "block", lineHeight: 1.1,
                }}>{s.stat}</span>
                <span style={{
                  fontFamily: T.sans, fontSize: 10, fontWeight: 600, letterSpacing: "1.5px",
                  textTransform: "uppercase", color: T.textMuted, marginTop: 4, display: "block",
                }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 1, background: T.border, margin: "40px 0" }} />

        {/* Prev/next text links */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 0 }}>
          <button onClick={() => goToProject(-1)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center", gap: 8,
          }}
            onMouseEnter={(e) => { e.currentTarget.querySelector("span").style.color = T.text; }}
            onMouseLeave={(e) => { e.currentTarget.querySelector("span").style.color = T.textMuted; }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: T.sans, fontSize: 13, color: T.textMuted, transition: "color 0.2s ease" }}>
              {allProjects[(currentIdx - 1 + allProjects.length) % allProjects.length].title}
            </span>
          </button>
          <button onClick={() => goToProject(1)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center", gap: 8,
          }}
            onMouseEnter={(e) => { e.currentTarget.querySelector("span").style.color = T.text; }}
            onMouseLeave={(e) => { e.currentTarget.querySelector("span").style.color = T.textMuted; }}
          >
            <span style={{ fontFamily: T.sans, fontSize: 13, color: T.textMuted, transition: "color 0.2s ease" }}>
              {allProjects[(currentIdx + 1) % allProjects.length].title}
            </span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
