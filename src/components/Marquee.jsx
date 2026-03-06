import React from 'react';
import { T } from '../data/tokens';

const disciplines = ["Experiential Strategy", "Creative Leadership", "Brand Experience", "Audience Engagement", "Immersive Design", "Large-Scale Production"];

export function Marquee() {
  const doubled = [...disciplines, ...disciplines, ...disciplines, ...disciplines];
  return (
    <div style={{
      overflow: "hidden", padding: "28px 0",
      borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
      margin: "0 0 clamp(60px, 8vw, 100px)", position: "relative", zIndex: 1,
    }}>
      <div style={{ display: "flex", gap: 56, animation: "marquee 40s linear infinite", width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 56 }}>
            <span style={{
              fontFamily: T.sans, fontSize: "clamp(12px, 1vw, 14px)", fontWeight: 500,
              color: T.textFaint, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "3px",
            }}>{item}</span>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent, opacity: 0.5, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;