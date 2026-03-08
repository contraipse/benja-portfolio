import React from 'react';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useIsMobile';
import { T } from '../data/tokens';

export function HighlightsStrip() {
  const isMobile = useIsMobile();
  const [ref, visible] = useInView({ threshold: 0.2 });

  const highlights = [
    { stat: "$1B", label: "Pipeline Generated", detail: "Google Cloud Space" },
    { stat: "20%", label: "NPS Increase", detail: "GreenBiz VERGE" },
    { stat: "36,000+", label: "Attendees", detail: "Google Cloud Next '25" },
    { stat: "50%", label: "Social Lift", detail: "PepsiCo Sensorium" },
  ];

  const press = ["Vice", "LA Times", "East Bay Times", "SF Magazine", "Laughing Squid", "Medium"];

  return (
    <section ref={ref} style={{
      padding: isMobile ? "60px 24px" : "80px 60px",
      background: "transparent", position: "relative", overflow: "hidden",
    }}>
      {/* Highlights grid */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: isMobile ? 24 : 40,
      }}>
        {highlights.map((h, i) => (
          <div key={h.label} style={{
            textAlign: "center",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.1}s`,
          }}>
            <div style={{ fontFamily: T.serif, fontSize: isMobile ? 32 : 44, fontWeight: 600, color: T.accent, lineHeight: 1 }}>{h.stat}</div>
            <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.text, letterSpacing: "0.5px", marginTop: 8 }}>{h.label}</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMuted, marginTop: 4 }}>{h.detail}</div>
          </div>
        ))}
      </div>

      {/* Press mentions */}
      <div style={{
        maxWidth: 1200, margin: "48px auto 0", textAlign: "center",
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.6s",
      }}>
        <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: T.accent }}>Featured In</span>
        <div style={{
          marginTop: 12, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 24px",
        }}>
          {press.map(p => (
            <span key={p} style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 400, color: T.textFaint, fontStyle: "italic" }}>{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
