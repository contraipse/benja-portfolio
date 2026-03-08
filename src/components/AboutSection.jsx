import React, { useRef, useState } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useIsMobile';
import { T } from '../data/tokens';

const disciplines = ["Experiential Strategy", "Creative Leadership", "Brand Experience", "Audience Engagement", "Immersive Design", "Large-Scale Production"];

export function AboutSection() {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef);
  const [ref, visible] = useInView({ threshold: 0.08 });
  const isMobile = useIsMobile();
  const [isWinking, setIsWinking] = useState(false);

  // Preload wink image to prevent flash on first hover
  React.useEffect(() => {
    const img = new Image();
    img.src = "img/portrait-wink.jpg";
  }, []);
  const imageY = isMobile ? 0 : (progress - 0.5) * -30;
  const textY = isMobile ? 0 : (progress - 0.5) * 15;

  // Split headline into words for staggered reveal
  const headlineWords1 = ["I", "build", "experiences"];
  const headlineWords2 = ["people"];

  return (
    <section id="about" ref={(el) => { ref(el); sectionRef.current = el; }} style={{
      padding: isMobile ? "60px 20px" : "clamp(80px, 12vw, 160px) clamp(24px, 5vw, 64px)",
      position: "relative", overflow: "hidden", zIndex: 1,
      minHeight: isMobile ? "auto" : "100vh", display: "flex", alignItems: "center",
    }}>
      {/* Large decorative accent number in background */}
      {!isMobile && <div style={{
        position: "absolute", top: "10%", right: "5%", fontFamily: T.serif,
        fontSize: "clamp(200px, 25vw, 400px)", fontWeight: 300, color: "transparent",
        WebkitTextStroke: `1px rgba(255,77,0,${visible ? 0.06 : 0})`,
        lineHeight: 0.85, userSelect: "none", pointerEvents: "none",
        transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        transform: visible ? "translateY(0)" : "translateY(40px)",
      }}>15+</div>}

      {/* Animated vertical divider line ÃÂ¢ÃÂÃÂ desktop only */}
      {!isMobile && <div style={{
        position: "absolute", left: "50%", top: "15%", bottom: "15%", width: 1,
        background: `linear-gradient(to bottom, transparent, ${T.accent}, transparent)`,
        transformOrigin: "top center",
        animation: visible ? "aboutLineGrow 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both" : "none",
        opacity: visible ? 0.3 : 0,
      }} />}

      <div style={{
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 32 : "clamp(40px, 6vw, 100px)", alignItems: "center",
        width: "100%",
      }}>
        {/* Image side ÃÂ¢ÃÂÃÂ clip-path wipe reveal */}
        <div style={{
          transform: `translateY(${imageY}px)`,
          animation: visible ? "clipRevealLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both" : "none",
          opacity: visible ? 1 : 0,
        }}>
          <div style={{
            borderRadius: T.r.md, overflow: "hidden", aspectRatio: "4/3.7",
            position: "relative", maxHeight: "70vh",
          }}>
            <img
              src={isWinking ? "img/portrait-wink.jpg" : "img/portrait.jpg"}
              alt="Portrait of Benja Juster, Creative Director and Experience Designer"
              onMouseEnter={() => setIsWinking(true)}
              onMouseLeave={() => setIsWinking(false)}
              onTouchStart={() => { setIsWinking(true); setTimeout(() => setIsWinking(false), 800); }}
              style={{
                width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 5%",
                background: T.bg, cursor: "pointer",
                transition: "opacity 0.15s ease",
              }}
            />
            {/* Accent bar at bottom */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, height: 3,
              background: T.accent,
              animation: visible ? "accentWipe 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both" : "none",
            }} />
            {/* Corner frame marks */}
            <div style={{ position: "absolute", top: 12, left: 12, width: 24, height: 24,
              borderTop: `1.5px solid ${T.accent}`, borderLeft: `1.5px solid ${T.accent}`,
              opacity: visible ? 0.5 : 0, transition: "opacity 0.6s ease 0.6s",
            }} />
            <div style={{ position: "absolute", bottom: 12, right: 12, width: 24, height: 24,
              borderBottom: `1.5px solid ${T.accent}`, borderRight: `1.5px solid ${T.accent}`,
              opacity: visible ? 0.5 : 0, transition: "opacity 0.6s ease 0.6s",
            }} />
          </div>
        </div>

        {/* Text side ÃÂ¢ÃÂÃÂ staggered reveal */}
        <div style={{ transform: `translateY(${textY}px)` }}>
          {/* Label with animated accent line */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              height: 1, background: T.accent,
              animation: visible ? "accentWipe 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both" : "none",
            }} />
            <span style={{
              fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.accent,
              letterSpacing: "3px", textTransform: "uppercase",
              opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.5s",
            }}>About</span>
          </div>

          {/* Headline with word-by-word split reveal */}
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? "clamp(28px, 8vw, 40px)" : "clamp(36px, 4.5vw, 64px)", fontWeight: 300, color: T.text, lineHeight: 1.15, overflow: "hidden" }}>
            <span style={{ display: "block", overflow: "hidden" }}>
              {headlineWords1.map((word, i) => (
                <span key={i} style={{
                  display: "inline-block", marginRight: "0.25em",
                  animation: visible ? `splitReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.08}s both` : "none",
                  opacity: visible ? undefined : 0,
                }}>{word}</span>
              ))}
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              {headlineWords2.map((word, i) => (
                <span key={i} style={{
                  display: "inline-block", marginRight: "0.25em",
                  animation: visible ? `splitReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.65 + i * 0.08}s both` : "none",
                  opacity: visible ? undefined : 0,
                }}>{word}</span>
              ))}
              <span style={{
                display: "inline-block", fontStyle: "italic", color: T.accent,
                animation: visible ? `splitReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both` : "none",
                opacity: visible ? undefined : 0,
              }}>remember.</span>
            </span>
          </h2>

          {/* Body text ÃÂ¢ÃÂÃÂ fade up */}
          <p style={{
            fontFamily: T.sans, fontSize: "clamp(14px, 1.2vw, 16px)", color: T.textMuted,
            lineHeight: 1.75, marginTop: 24, maxWidth: 480,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.85s",
          }}>
            Fifteen years leading experiential creative for the world's most ambitious brands. I've managed multidisciplinary teams of 50+ across five continents and budgets exceeding $30M, from large-scale activations to intimate immersive moments that turn complex narratives into human stories. I also serve on the Board of Directors for Take 3 Presents, a nonprofit nurturing creativity through experiential art.
          </p>

          {/* Discipline tags ÃÂ¢ÃÂÃÂ cascading entrance, evenly stacked */}
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: isMobile ? "repeat(2, auto)" : "repeat(3, auto)", gap: 8, justifyContent: isMobile ? "center" : "start", justifyItems: "start" }}>
            {disciplines.map((d, i) => (
              <span key={d} style={{
                fontFamily: T.sans, fontSize: 11, fontWeight: 500, color: T.textMuted,
                padding: "8px 16px", borderRadius: T.r.xl,
                border: `1px solid ${T.border}`,
                letterSpacing: "0.5px", textAlign: "center",
                whiteSpace: "nowrap",
                animation: visible ? `aboutTagIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${1.0 + i * 0.06}s both` : "none",
                opacity: visible ? undefined : 0,
              }}>{d}</span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
