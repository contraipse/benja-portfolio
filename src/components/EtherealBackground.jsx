import React from 'react';

export function EtherealBackground() {
  // Single-element approach: all gradients layered as backgrounds on one full-screen div.
  // No child divs with edges = no subpixel flicker on high-refresh monitors.
  // Animation via CSS background-position shifts on the container.
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: [
          "radial-gradient(ellipse 60% 60% at 25% 20%, rgba(255,77,0,0.12) 0%, rgba(255,77,0,0.06) 25%, rgba(255,77,0,0.02) 45%, transparent 70%)",
          "radial-gradient(ellipse 55% 50% at 70% 45%, rgba(255,120,60,0.10) 0%, rgba(255,100,40,0.04) 30%, transparent 65%)",
          "radial-gradient(ellipse 65% 45% at 40% 75%, rgba(255,50,0,0.08) 0%, rgba(255,60,10,0.03) 30%, transparent 65%)",
          "radial-gradient(ellipse 45% 45% at 55% 50%, rgba(160,140,255,0.04) 0%, rgba(160,140,255,0.015) 35%, transparent 60%)",
        ].join(", "),
      }} />
      {/* Film grain */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.35,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />
    </div>
  );
}

export default EtherealBackground;