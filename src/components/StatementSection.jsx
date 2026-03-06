import { useRef } from 'react';
import { T } from '../data/tokens';
import { useScrollProgress } from '../hooks/useScrollProgress';

export function StatementSection() {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef);
  const words = ["Vision.", "Strategy.", "Production.", "Experience."];
  // progress 0 = section enters bottom of viewport, 1 = leaves top
  // We want reveals to happen in the 0.15–0.55 range (early-to-mid scroll)
  const labelOpacity = Math.max(0, Math.min(1, (progress - 0.1) * 6));
  const pOpacity = Math.max(0, Math.min(1, (progress - 0.35) * 5));
  const pY = Math.max(0, 20 * (1 - pOpacity));
  const lineWidth = Math.max(0, Math.min(80, (progress - 0.4) * 400));

  return (
    <section ref={sectionRef} style={{
      padding: "clamp(80px, 12vw, 160px) clamp(24px, 5vw, 64px)",
      textAlign: "center", position: "relative", zIndex: 1,
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 50%, rgba(255,77,0,0.04) 0%, transparent 60%)",
      }} />
      <div style={{ opacity: labelOpacity, transform: `translateY(${(1 - labelOpacity) * 15}px)`, marginBottom: 24 }}>
        <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: T.accent }}>What I Lead</span>
      </div>
      <h2 style={{ fontFamily: T.serif, fontSize: "clamp(36px, 8vw, 120px)", fontWeight: 300, lineHeight: 1.15, color: T.text, margin: 0 }}>
        {words.map((word, i) => {
          const wordStart = 0.12 + i * 0.07;
          const wordOpacity = Math.max(0, Math.min(1, (progress - wordStart) * 6));
          const wordY = Math.max(0, 35 * (1 - wordOpacity));
          return (
            <span key={i} style={{
              display: "inline-block", margin: "0 0.15em",
              opacity: wordOpacity, transform: `translateY(${wordY}px)`,
              color: i === words.length - 1 ? T.accent : T.text,
              fontStyle: i === words.length - 1 ? "italic" : "normal",
            }}>{word}</span>
          );
        })}
      </h2>
      <div style={{
        width: lineWidth, height: 2, background: T.accent,
        margin: "32px auto 0", borderRadius: 1,
      }} />
    </section>
  );
}
