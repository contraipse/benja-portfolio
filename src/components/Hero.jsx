import { useState, useEffect, useRef } from 'react';
import { T } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { heroImages } from '../data/projects';

export default function Hero() {
  const isMobile = useIsMobile();
  const [loaded, setLoaded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const sectionRef = useRef(null);
  const scrollProg = useScrollProgress(sectionRef);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);

  // Track mouse position for kinetic "Movements" text
  useEffect(() => {
    const onMove = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImg(prev => (prev + 1) % heroImages.length);
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  const expansionProg = Math.min(scrollProg * 6, 1);
  const frameInset = Math.max(0, 16 * (1 - expansionProg));
  const frameRadius = Math.max(0, 20 * (1 - expansionProg));
  const heroOpacity = Math.max(0, 1 - Math.max(0, scrollProg - 0.55) * 4);
  const titleY = Math.max(0, scrollProg - 0.5) * -280;
  const bgScale = 1 + scrollProg * 0.12;

  return (
    <section ref={sectionRef} style={{
      height: isMobile ? "100dvh" : "100vh", position: "relative", padding: frameInset, zIndex: 1,
    }}>
      <div style={{
        position: "relative", width: "100%", height: "100%",
        borderRadius: frameRadius, overflow: "hidden",
        boxShadow: frameInset > 0 ? "0 8px 60px rgba(0,0,0,0.6)" : "none",
        transition: loaded ? "none" : "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>

        {/* ââ Image crossfade layers ââ */}
        {heroImages.map((img, i) => {
          const isActive = i === activeImg;
          const kbX = i % 2 === 0 ? "52%" : "48%";
          const kbY = i % 3 === 0 ? "45%" : "55%";
          const zoomIn = i % 2 === 0;
          const activeScale = zoomIn ? bgScale * 1.15 : bgScale * 0.94;
          const inactiveScale = zoomIn ? bgScale * 0.96 : bgScale * 1.12;
          return (
            <div key={i} style={{
              position: "absolute", inset: "-5%",
              overflow: "hidden",
              transform: `scale(${isActive ? activeScale : inactiveScale})`,
              opacity: isActive ? 1 : 0,
              transition: "opacity 2s cubic-bezier(0.4, 0, 0.2, 1), transform 8s linear",
            }}>
              <img
                src={img}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding={i === 0 ? "sync" : "async"}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  objectPosition: `${kbX} ${kbY}`,
                  filter: "brightness(0.7) saturate(0.9)",
                }}
              />
            </div>
          );
        })}

        {/* ââ Dot grid texture overlay ââ */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          opacity: 0.35,
          animation: "dotPulse 8s ease infinite",
          pointerEvents: "none",
        }} />

        {/* ââ Ethereal glow orbs ââ */}
        <div style={{
          position: "absolute", top: "15%", left: "10%", width: "40vw", height: "40vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,77,0,0.12) 0%, transparent 70%)",
          filter: "blur(80px)", animation: "float1 20s ease-in-out infinite",
          pointerEvents: "none", zIndex: 1,
        }} />
        <div style={{
          position: "absolute", top: "50%", right: "5%", width: "35vw", height: "35vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,120,50,0.08) 0%, transparent 70%)",
          filter: "blur(100px)", animation: "float2 25s ease-in-out infinite",
          pointerEvents: "none", zIndex: 1,
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "40%", width: "30vw", height: "30vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,200,150,0.06) 0%, transparent 70%)",
          filter: "blur(60px)", animation: "float3 18s ease-in-out infinite",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* ââ Gradient overlays ââ */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(to top, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.73) 20%, rgba(10,10,10,0.69) 35%, rgba(10,10,10,0.52) 50%, rgba(10,10,10,0.22) 65%, rgba(10,10,10,0.04) 80%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(ellipse at 30% 80%, rgba(255,77,0,0.05) 0%, transparent 60%)" }} />

        {/* ââ Image counter / slideshow indicator (FIX #4: Moved to bottom-left, away from nav) ââ */}
        <div style={{
          position: "absolute", bottom: 28, left: 28, zIndex: 5,
          display: "flex", gap: 6, alignItems: "center",
          opacity: loaded ? 0.6 : 0, transition: "opacity 0.8s ease 1s",
        }}>
          {heroImages.map((_, i) => (
            <div key={i} style={{
              width: i === activeImg ? 20 : 6, height: 3,
              borderRadius: 2,
              background: i === activeImg ? T.accent : "rgba(255,255,255,0.25)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }} />
          ))}
        </div>

        {/* ââ Main hero content ââ */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 3,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: isMobile ? "0 20px 24px" : "0 clamp(24px, 5vw, 64px) clamp(60px, 8vh, 100px)",
          opacity: heroOpacity,
          transform: `translateY(${titleY}px)`,
        }}>
          {/* Overline */}
          <div style={{
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            marginBottom: isMobile ? 12 : 16,
          }}>
            <span style={{
              fontFamily: T.sans, fontSize: isMobile ? 12 : 18, fontWeight: 700, letterSpacing: isMobile ? "4px" : "8px",
              textTransform: "uppercase", color: "#FF8044",
              textShadow: "0 0 10px rgba(255,100,40,0.6), 0 0 30px rgba(255,77,0,0.3), 0 2px 8px rgba(0,0,0,0.8)",
            }}>
              Experiential Creative Leader
            </span>
          </div>

          {/* Massive title */}
          <h1 style={{
            fontFamily: T.serif, fontSize: isMobile ? "clamp(30px, 9vw, 46px)" : "clamp(56px, 8vw, 128px)",
            fontWeight: isMobile ? 400 : 600, lineHeight: isMobile ? 1.0 : 0.9, color: "#FFFFFF", margin: 0,
            textShadow: isMobile ? "0 0 30px rgba(255,255,255,0.2), 0 2px 20px rgba(0,0,0,0.6)" : "0 0 40px rgba(255,255,255,0.2), 0 0 80px rgba(255,255,255,0.1), 0 2px 20px rgba(0,0,0,0.8), 0 8px 60px rgba(0,0,0,0.5)",
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(60px)",
            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
          }}>
            Turning<br />Moments Into{" "}
            <span style={{ fontStyle: "italic" }}>
              {isMobile ? (
                <span style={{ color: T.accent }}>Movements</span>
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
                      transform: loaded ? `translate(${xOff}px, ${yOff}px) rotate(${rotate}deg) scale(${scale})` : "none",
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
            fontFamily: T.sans, fontSize: isMobile ? 14 : "clamp(16px, 1.4vw, 20px)",
            fontWeight: 400, color: "rgba(255,255,255,0.75)", lineHeight: 1.5,
            maxWidth: isMobile ? "90%" : 520, margin: 0, marginTop: isMobile ? 12 : 20,
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.65s",
            textShadow: "0 2px 12px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.5)",
          }}>
            Leading teams and creative vision behind immersive experiences for the world's most ambitious brands.
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: isMobile ? 20 : "clamp(32px, 5vw, 80px)", marginTop: isMobile ? 16 : "clamp(24px, 3vh, 40px)",
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
          }}>
            {[{ num: "15+", label: "Years" }, { num: "100+", label: "Projects" }, { num: "25+", label: "Brands" }].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: isMobile ? 4 : 8 }}>
                <span style={{ fontFamily: T.sans, fontSize: isMobile ? 22 : "clamp(28px, 3vw, 48px)", fontWeight: 700, color: "#FFFFFF" }}>{s.num}</span>
                <span style={{ fontFamily: T.sans, fontSize: isMobile ? 9 : 11, fontWeight: 500, color: "rgba(255,255,255,0.8)", letterSpacing: "1.5px", textTransform: "uppercase" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ââ Corner frame marks ââ */}
        {[{ top: 20, left: 20 }, { top: 20, right: 20 }, { bottom: 20, left: 20 }, { bottom: 20, right: 20 }].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos, width: 24, height: 24, zIndex: 4,
            borderColor: T.borderLight, borderStyle: "solid", borderWidth: 0,
            opacity: loaded ? (1 - expansionProg * 0.5) : 0,
            transition: loaded ? "none" : `opacity 0.6s ease ${1 + i * 0.1}s`,
            ...(i === 0 ? { borderTopWidth: 1, borderLeftWidth: 1 } : {}),
            ...(i === 1 ? { borderTopWidth: 1, borderRightWidth: 1 } : {}),
            ...(i === 2 ? { borderBottomWidth: 1, borderLeftWidth: 1 } : {}),
            ...(i === 3 ? { borderBottomWidth: 1, borderRightWidth: 1 } : {}),
          }} />
        ))}
      </div>

      {/* ââ Scroll indicator â large bouncing chevron ââ */}
      <div style={{
        position: "absolute", bottom: 24, left: "50%", zIndex: 10,
        display: isMobile ? "none" : "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: loaded ? Math.max(0, 1 - scrollProg * 3) : 0,
        transition: loaded ? "none" : "opacity 1s ease 1.4s",
        animation: "scrollDot 2s ease-in-out infinite",
      }}>
        <span style={{
          fontFamily: T.sans, fontSize: 11, fontWeight: 600,
          letterSpacing: "2px", textTransform: "uppercase",
          color: T.accent,
        }}>Scroll</span>
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
          <path d="M2 2L14 13L26 2" stroke={T.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
