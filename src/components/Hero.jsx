import { useState, useEffect, useRef } from 'react';
import { T } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { SnakeGame } from './SnakeGame';

export default function Hero() {
  const isMobile = useIsMobile();
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);
  const scrollProg = useScrollProgress(sectionRef);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [showSnake, setShowSnake] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
  }, []);

  // Track mouse position for kinetic "Movements" text
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

  const expansionProg = Math.min(scrollProg * 6, 1);
  const frameInset = Math.max(0, 16 * (1 - expansionProg));
  const frameRadius = Math.max(0, T.r.xl * (1 - expansionProg));
  const heroOpacity = Math.max(0, 1 - Math.max(0, scrollProg - 0.55) * 4);
  const titleY = Math.max(0, scrollProg - 0.5) * -280;
  const bgScale = 1 + scrollProg * 0.12;

  return (
    <section ref={sectionRef} style={{
      height: isMobile ? "100dvh" : "100vh",
      position: "relative",
      padding: frameInset,
      zIndex: 1,
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: frameRadius,
        overflow: "hidden",
        boxShadow: frameInset > 0 ? "0 8px 60px rgba(0,0,0,0.6)" : "none",
        transition: loaded ? "none" : "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>

        {/* Video background */}
        <div style={{
          position: "absolute",
          inset: "-5%",
          transform: `scale(${bgScale})`,
        }}>
          <video
            autoPlay loop muted playsInline preload="auto"
            aria-hidden="true"
            poster="img/hero-poster.jpg"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "saturate(0.9)",
            }}
          >
            <source src="img/hero-reel.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Static dot grid texture */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          opacity: 0.04,
          pointerEvents: "none",
        }} />

        {/* Single static warm glow */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,77,0,0.10) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        {/* Gradient overlay – bottom only, above text area */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.7) 15%, rgba(10,10,10,0.4) 28%, rgba(10,10,10,0.1) 36%, transparent 42%)"
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "radial-gradient(ellipse at 30% 80%, rgba(255,77,0,0.05) 0%, transparent 60%)"
        }} />

        {/* Main hero content */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: isMobile
            ? `0 ${T.mobilePadX}px 52px`
            : `0 ${T.padX} clamp(60px, 8vh, 100px)`,
          opacity: heroOpacity,
          transform: `translateY(${titleY}px)`,
        }}>

          {/* Overline */}
          <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            marginBottom: isMobile ? T.s.sm + 4 : T.s.md,
          }}>
            <span style={{
              fontFamily: T.sans,
              fontSize: isMobile ? 12 : 18,
              fontWeight: 700,
              letterSpacing: isMobile ? "4px" : "8px",
              textTransform: "uppercase",
              color: "#FF8044",
              textShadow: "0 0 10px rgba(255,100,40,0.6), 0 0 30px rgba(255,77,0,0.3), 0 2px 8px rgba(0,0,0,0.8)",
            }}>
              Experiential Creative Leader
            </span>
          </div>

          {/* Massive title */}
          <h1 style={{
            fontFamily: T.serif,
            fontSize: isMobile ? "clamp(30px, 9vw, 46px)" : "clamp(56px, 8vw, 128px)",
            fontWeight: isMobile ? 400 : 600,
            lineHeight: isMobile ? 1.0 : 0.9,
            color: "#FFFFFF",
            margin: 0,
            textShadow: isMobile
              ? "0 0 30px rgba(255,255,255,0.2), 0 2px 20px rgba(0,0,0,0.6)"
              : "0 0 40px rgba(255,255,255,0.2), 0 0 80px rgba(255,255,255,0.1), 0 2px 20px rgba(0,0,0,0.8), 0 8px 60px rgba(0,0,0,0.5)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(60px)",
            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
          }}>
            Turning<br />Moments Into{" "}
            <span
              onClick={!isMobile ? () => setShowSnake(true) : undefined}
              style={{ fontStyle: "italic", cursor: isMobile ? "default" : "pointer" }}
            >
              {isMobile ? (
                <span style={{ whiteSpace: "nowrap", display: "inline-flex" }}>
                  {"Movements".split("").map((ch, i) => (
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
                "Movements".split("").map((ch, i) => {
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
          </h1>

          {/* Hero subline */}
          <p style={{
            fontFamily: T.sans,
            fontSize: isMobile ? 14 : "clamp(16px, 1.4vw, 20px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.5,
            maxWidth: isMobile ? "90%" : 520,
            margin: 0,
            marginTop: isMobile ? T.s.sm + 4 : T.s.lg - 4,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.65s",
            textShadow: "0 2px 12px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.5)",
          }}>
            Leading teams and creative vision behind immersive experiences for the world's most ambitious brands.
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex",
            gap: isMobile ? T.s.lg - 4 : "clamp(32px, 5vw, 80px)",
            marginTop: isMobile ? T.s.md : "clamp(24px, 3vh, 40px)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
          }}>
            {[{ num: "15+", label: "Years" }, { num: "100+", label: "Projects" }, { num: "25+", label: "Brands" }].map((s) => (
              <div key={s.label} style={{
                display: "flex",
                alignItems: "baseline",
                gap: isMobile ? T.s.xs : T.s.sm,
              }}>
                <span style={{
                  fontFamily: T.sans,
                  fontSize: isMobile ? 22 : "clamp(28px, 3vw, 48px)",
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}>{s.num}</span>
                <span style={{
                  fontFamily: T.sans,
                  fontSize: isMobile ? 9 : 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.8)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Corner frame marks */}
        {[
          { top: T.s.lg - 4, left: T.s.lg - 4 },
          { top: T.s.lg - 4, right: T.s.lg - 4 },
          { bottom: T.s.lg - 4, left: T.s.lg - 4 },
          { bottom: T.s.lg - 4, right: T.s.lg - 4 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute",
            ...pos,
            width: T.s.lg,
            height: T.s.lg,
            zIndex: 4,
            borderColor: T.borderLight,
            borderStyle: "solid",
            borderWidth: 0,
            opacity: loaded ? (1 - expansionProg * 0.5) : 0,
            transition: loaded ? "none" : `opacity 0.6s ease ${1 + i * 0.1}s`,
            ...(i === 0 ? { borderTopWidth: 1, borderLeftWidth: 1 } : {}),
            ...(i === 1 ? { borderTopWidth: 1, borderRightWidth: 1 } : {}),
            ...(i === 2 ? { borderBottomWidth: 1, borderLeftWidth: 1 } : {}),
            ...(i === 3 ? { borderBottomWidth: 1, borderRightWidth: 1 } : {}),
          }} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: T.s.lg,
        left: "50%",
        zIndex: 10,
        display: isMobile ? "none" : "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: T.s.sm,
        opacity: loaded ? Math.max(0, 1 - scrollProg * 3) : 0,
        transition: loaded ? "none" : "opacity 1s ease 1.4s",
        animation: "scrollDot 2s ease-in-out infinite",
      }}>
        <span style={{
          fontFamily: T.sans,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: T.accent,
        }}>Scroll</span>
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
          <path d="M2 2L14 13L26 2" stroke={T.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {showSnake && <SnakeGame onClose={() => setShowSnake(false)} />}
    </section>
  );
}
