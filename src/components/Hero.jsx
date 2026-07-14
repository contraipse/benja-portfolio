import { useState, useEffect } from 'react';
import { T } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { SnakeGame } from './SnakeGame';

const STATS = [
  { num: "15+", label: "Years" },
  { num: "100+", label: "Projects" },
  { num: "25+", label: "Brands" },
];

export default function Hero() {
  const isMobile = useIsMobile();
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [showSnake, setShowSnake] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Track mouse position for kinetic "movements" text
  useEffect(() => {
    const onMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

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
              color: "transparent",
              WebkitTextStroke: `1.5px ${T.accent}`,
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
          const yOff = influence * dy * -50;
          const xOff = influence * dx * -20;
          const rotate = influence * dx * 18;
          const scale = 1 + influence * 0.15;
          const strokeWidth = 1.5 + influence * 1.5;

          return (
            <span key={i} style={{
              display: "inline-block",
              color: influence > 0.3 ? `rgba(255,77,0,${influence * 0.4})` : "transparent",
              WebkitTextStroke: `${strokeWidth}px ${T.accent}`,
              transform: loaded
                ? `translate(${xOff}px, ${yOff}px) rotate(${rotate}deg) scale(${scale})`
                : "none",
              transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease, -webkit-text-stroke 0.2s ease",
              transformOrigin: "center bottom",
            }}>{ch}</span>
          );
        })
      )}
    </span>
  );

  return (
    <section style={{
      position: "relative",
      zIndex: 1,
      padding: isMobile
        ? `108px ${T.mobilePadX}px 0`
        : `clamp(140px, 18vh, 200px) ${T.padX} 0`,
    }}>

      {/* Overline */}
      <div style={{ ...reveal(0.1), display: "flex", alignItems: "center", gap: 14, marginBottom: isMobile ? 20 : 28 }}>
        <span style={{ width: 36, height: 1, background: T.accent, display: "inline-block" }} />
        <span style={{
          fontFamily: T.sans,
          fontSize: isMobile ? 11 : 13,
          fontWeight: 700,
          letterSpacing: isMobile ? "3px" : "5px",
          textTransform: "uppercase",
          color: T.accent,
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
      }}>
        {isMobile ? (
          <>I create experiences that turn moments into {kineticWord}.</>
        ) : (
          <>I create experiences that<br />turn moments into {kineticWord}.</>
        )}
      </h1>

      {/* Stats row above the line */}
      <div style={{
        ...reveal(0.38),
        display: "flex",
        gap: isMobile ? T.s.xl : "clamp(40px, 6vw, 96px)",
        marginTop: isMobile ? 28 : "clamp(36px, 5vh, 64px)",
        paddingBottom: isMobile ? 32 : 48,
        borderBottom: `1px solid ${T.border}`,
      }}>
        {STATS.map((s) => (
          <div key={s.label} style={{
            display: "flex",
            alignItems: "baseline",
            gap: isMobile ? T.s.xs : T.s.sm,
          }}>
            <span style={{
              fontFamily: T.sans,
              fontSize: isMobile ? 22 : "clamp(28px, 2.6vw, 44px)",
              fontWeight: 700,
              color: T.text,
            }}>{s.num}</span>
            <span style={{
              fontFamily: T.sans,
              fontSize: isMobile ? 9 : 11,
              fontWeight: 500,
              color: T.textMuted,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Showreel — framed below the line */}
      <figure style={{ ...reveal(0.5), margin: 0, paddingTop: isMobile ? 32 : 48 }}>
        <div style={{
          position: "relative",
          borderRadius: isMobile ? T.r.md : T.r.lg,
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
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            boxShadow: `inset 0 0 0 1px ${T.borderLight}`,
            borderRadius: isMobile ? T.r.md : T.r.lg,
          }} />
        </div>
      </figure>

      {showSnake && <SnakeGame onClose={() => setShowSnake(false)} />}
    </section>
  );
}
