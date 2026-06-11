import { useState, useEffect } from 'react';
import { T, monoLabel } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';

const STATS = [
  { num: "15+", label: "Years leading" },
  { num: "$30M+", label: "Budgets owned" },
  { num: "50+", label: "Team members led" },
  { num: "5", label: "Continents" },
];

export default function Hero() {
  const isMobile = useIsMobile();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const reveal = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <header style={{
      position: "relative", zIndex: 1,
      padding: isMobile
        ? `108px ${T.mobilePadX}px 0`
        : `clamp(140px, 18vh, 200px) ${T.padX} 0`,
    }}>
      {/* Eyebrow */}
      <div style={{ ...reveal(0.1), display: "flex", alignItems: "center", gap: 14, marginBottom: isMobile ? 20 : 28 }}>
        <span style={{ width: 36, height: 1, background: T.accent, display: "inline-block" }} />
        <span style={{ ...monoLabel, color: T.textMuted }}>
          Experiential Creative Director
        </span>
      </div>

      {/* Display statement */}
      <h1 style={{
        ...reveal(0.22),
        fontFamily: T.serif,
        fontWeight: 400,
        fontSize: isMobile ? "clamp(40px, 11.5vw, 64px)" : "clamp(64px, 8.6vw, 148px)",
        lineHeight: 1.02,
        letterSpacing: "-0.02em",
        color: T.text,
        maxWidth: 1500,
        margin: 0,
      }}>
        I lead the teams behind
        <br />
        experiences people{" "}
        <em style={{ fontStyle: "italic", color: T.accent, fontWeight: 400 }}>remember.</em>
      </h1>

      {/* Subline + stats */}
      <div style={{
        ...reveal(0.38),
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "flex-end",
        gap: isMobile ? 28 : 48,
        marginTop: isMobile ? 28 : "clamp(36px, 5vh, 64px)",
        paddingBottom: isMobile ? 36 : 56,
        borderBottom: `1px solid ${T.border}`,
      }}>
        <p style={{
          fontFamily: T.sans, fontWeight: 400,
          fontSize: isMobile ? 15 : "clamp(16px, 1.25vw, 19px)",
          lineHeight: 1.6, color: T.textMuted, maxWidth: 460, margin: 0,
        }}>
          Fifteen years of creative leadership for Google, Apple, and Riot
          Games — from a 35,000&nbsp;sq&nbsp;ft AI-generated city to a billion
          dollars of pipeline from a single briefing center.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : `repeat(${STATS.length}, auto)`,
          gap: isMobile ? "20px 32px" : "clamp(28px, 3.5vw, 64px)",
        }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{
                fontFamily: T.serif, fontWeight: 500,
                fontSize: isMobile ? 26 : "clamp(28px, 2.4vw, 40px)",
                color: T.text, lineHeight: 1,
              }}>{s.num}</div>
              <div style={{ ...monoLabel, fontSize: 10, color: T.textFaint, marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Showreel — framed, not wallpaper */}
      <figure style={{ ...reveal(0.5), margin: 0, paddingTop: isMobile ? 36 : 56 }}>
        <div style={{
          position: "relative", borderRadius: isMobile ? T.r.md : T.r.lg,
          overflow: "hidden", aspectRatio: "16/8.2",
          background: T.surface,
        }}>
          <video
            autoPlay loop muted playsInline preload="auto"
            aria-label="Showreel of experiential work including Google Cloud Next, Apple WWDC, and Valorant"
            poster="img/hero-poster.jpg"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          >
            <source src="img/hero-reel.mp4" type="video/mp4" />
          </video>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            boxShadow: "inset 0 0 0 1px rgba(239,233,223,0.12)",
            borderRadius: isMobile ? T.r.md : T.r.lg,
          }} />
        </div>
        <figcaption style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 14, gap: 16, flexWrap: "wrap",
        }}>
          <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>
            Showreel — Google Cloud Next · WWDC · Valorant · ComplexCon
          </span>
          <span style={{ ...monoLabel, fontSize: 10, color: T.textFaint }}>2014—2026</span>
        </figcaption>
      </figure>
    </header>
  );
}
