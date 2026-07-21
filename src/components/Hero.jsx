import { useState, useEffect, useRef } from 'react';
import { T } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { SnakeGame } from './SnakeGame';

export default function Hero() {
  const isMobile = useIsMobile();
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [showSnake, setShowSnake] = useState(false);
  const sectionRef = useRef(null);
  const inViewRef = useRef(true);
  const rafRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Track mouse position for the kinetic "movements." word —
  // rAF-throttled, and only while the hero is in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { inViewRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const onMove = (e) => {
      if (!inViewRef.current || rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setMousePos({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Secret trigger: press S to find the snake (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const onKey = (e) => {
      if (showSnake) return;
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "s" || e.key === "S") setShowSnake(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, showSnake]);

  const reveal = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  const kineticWord = (
    <span
      onClick={!isMobile ? () => setShowSnake(true) : undefined}
      style={{ fontStyle: "italic", cursor: isMobile ? "default" : "pointer", whiteSpace: "nowrap" }}
    >
      {isMobile ? (
        <span style={{ display: "inline-flex" }}>
          {"movements".split("").map((ch, i) => (
            <span key={i} style={{
              display: "inline-block",
              color: T.text,
              animation: loaded ? `mobileLetterWave 3s ease-in-out ${i * 0.15}s infinite` : "none",
              transformOrigin: "center bottom",
            }}>{ch}</span>
          ))}
        </span>
      ) : (
        "movements".split("").map((ch, i) => {
          const letterCenter = (i / 8);
          const dx = mousePos.x - letterCenter;
          const dy = mousePos.y - 0.5;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist * 1.8);
          const yOff = influence * dy * -40;
          const xOff = influence * dx * -20;
          const rotate = influence * dx * 12;

          return (
            <span key={i} style={{
              display: "inline-block",
              color: T.text,
              transform: loaded
                ? `translate(${xOff}px, ${yOff}px) rotate(${rotate}deg)`
                : "none",
              transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
              transformOrigin: "center bottom",
            }}>{ch}</span>
          );
        })
      )}
    </span>
  );

  return (
    <section ref={sectionRef} style={{
      position: "relative",
      zIndex: 1,
      padding: isMobile
        ? `108px ${T.mobilePadX}px 48px`
        : `clamp(140px, 18vh, 200px) ${T.padX} clamp(48px, 7vw, 96px)`,
    }}>

      {/* Overline */}
      <div style={{ ...reveal(0.1), display: "flex", alignItems: "center", gap: 14, marginBottom: isMobile ? 20 : 28 }}>
        <span style={{ width: 36, height: 1, background: T.text, display: "inline-block" }} />
        <span style={{
          fontFamily: T.sans,
          fontSize: isMobile ? 11 : 13,
          fontWeight: 500,
          letterSpacing: isMobile ? "3px" : "5px",
          textTransform: "uppercase",
          color: T.textMuted,
        }}>
          Experiential Creative Leader
        </span>
      </div>

      {/* Display statement */}
      <h1 style={{
        ...reveal(0.22),
        fontFamily: T.serif,
        fontSize: isMobile ? "clamp(38px, 11vw, 58px)" : "clamp(64px, 8.6vw, 148px)",
        fontWeight: isMobile ? 400 : 600,
        lineHeight: isMobile ? 1.08 : 1.02,
        letterSpacing: "-0.02em",
        color: T.text,
        maxWidth: 1500,
        margin: 0,
        paddingBottom: isMobile ? 32 : 48,
        borderBottom: `1px solid ${T.border}`,
      }}>
        {isMobile ? (
          <>I create experiences that turn moments into {kineticWord}.</>
        ) : (
          <>I create experiences that<br />turn moments into {kineticWord}.</>
        )}
      </h1>

      {/* Showreel — square corners, below the line */}
      <figure style={{ ...reveal(0.5), margin: 0, paddingTop: isMobile ? 32 : 48 }}>
        <div style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: "16/8.2",
          background: T.surface,
        }}>
          <video
            autoPlay loop muted playsInline preload="auto"
            aria-label="Showreel of experiential work"
            poster="img/hero-poster.jpg"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          >
            <source src="img/hero-reel.mp4" type="video/mp4" />
          </video>
        </div>
      </figure>

      {showSnake && <SnakeGame onClose={() => setShowSnake(false)} />}
    </section>
  );
}
