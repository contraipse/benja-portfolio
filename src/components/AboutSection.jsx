import React, { useRef, useState } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useIsMobile';
import { T } from '../data/tokens';


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
      padding: isMobile ? "60px 20px" : "clamp(80px, 12vw, 160px) clamp(24px, 5vw, 64px) 80px",
      position: "relative", overflow: "hidden", zIndex: 1,
      minHeight: "auto", display: "flex", alignItems: "center",
    }}>
      <div style={{
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 32 : "clamp(40px, 6vw, 100px)", alignItems: "center",
        width: "100%",
      }}>
        {/* Image side — clip-path wipe reveal */}
        <div style={{
          transform: `translateY(${imageY}px)`,
          animation: visible ? "clipRevealLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both" : "none",
          opacity: visible ? 1 : 0,
        }}>
          <div style={{
            overflow: "hidden", aspectRatio: "4/3.7",
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
          </div>
        </div>

        {/* Text side — staggered reveal */}
        <div style={{ transform: `translateY(${textY}px)` }}>
          {/* Label with animated ink rule */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              height: 1, width: 40, background: T.text,
              transformOrigin: "left", transform: visible ? undefined : "scaleX(0)",
              animation: visible ? "accentWipe 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both" : "none",
            }} />
            <span style={{
              fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.textMuted,
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
                display: "inline-block", fontStyle: "italic", color: T.text,
                animation: visible ? `splitReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both` : "none",
                opacity: visible ? undefined : 0,
              }}>remember.</span>
            </span>
          </h2>

          {/* Body text — fade up */}
          <p style={{
            fontFamily: T.sans, fontSize: "clamp(14px, 1.2vw, 16px)", color: T.textMuted,
            lineHeight: 1.75, marginTop: 24, maxWidth: 480,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.85s",
          }}>
            Fifteen years leading experiential creative for the world's most ambitious brands. I've managed multidisciplinary teams of 50+ across five continents and budgets exceeding $30M, from large-scale activations to intimate immersive moments that turn complex narratives into human stories. I also serve on the Board of Directors for Take 3 Presents, a nonprofit nurturing creativity through experiential art.
          </p>
        </div>
      </div>
    </section>
  );
}
