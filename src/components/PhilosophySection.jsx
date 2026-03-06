import { useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useIsMobile';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { T } from '../data/tokens';

export function PhilosophySection() {
  const ref = useRef(null);
  const progress = useScrollProgress(ref);
  const [inViewRef, visible] = useInView({ threshold: 0.1 });
  const text = "Strategic vision meets meticulous production. I blend creative direction with emerging tools like AI-driven personalization and interactive storytelling to craft experiences that are culturally resonant at global scale. The goal is always work that moves people.";
  const words = text.split(" ");

  // Entry scale: starts at 0.95, grows to 1
  const entryScale = visible ? 1 : 0.95;
  const entryOpacity = visible ? 1 : 0;

  return (
    <section ref={(el) => { ref.current = el; inViewRef(el); }} style={{
      padding: "clamp(100px, 15vh, 180px) clamp(24px, 5vw, 64px)",
      position: "relative", zIndex: 1,
      transform: `scale(${entryScale})`,
      opacity: entryOpacity,
      transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease",
    }}>
      {/* Accent vertical line that grows in */}
      <div style={{
        position: "absolute", left: "clamp(24px, 5vw, 64px)", top: "clamp(100px, 15vh, 180px)",
        width: 2, height: visible ? 60 : 0, background: T.accent,
        transition: "height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        borderRadius: 1,
      }} />

      {/* Quotation mark accent */}
      <div style={{
        fontFamily: T.serif, fontSize: "clamp(100px, 12vw, 200px)", fontWeight: 300,
        color: T.accent, opacity: visible ? 0.08 : 0,
        position: "absolute", top: "clamp(50px, 8vh, 100px)", left: "clamp(16px, 4vw, 48px)",
        lineHeight: 1, transition: "opacity 0.8s ease 0.2s", userSelect: "none",
      }}>"</div>

      <p style={{
        fontFamily: T.serif, fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 300,
        lineHeight: 1.35, maxWidth: 1100, color: T.text, margin: 0,
        paddingLeft: 24,
      }}>
        {words.map((word, i) => {
          const wordProgress = Math.max(0, Math.min(1, (progress * words.length * 1.2 - i) / 2));
          return (
            <span key={i} style={{
              display: "inline-block", marginRight: "0.28em",
              opacity: 0.08 + wordProgress * 0.92,
              transform: `translateY(${(1 - wordProgress) * 8}px)`,
              transition: "none",
            }}>
              {word}
            </span>
          );
        })}
      </p>
    </section>
  );
}
