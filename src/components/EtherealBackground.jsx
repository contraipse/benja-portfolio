import React from 'react';

export function EtherealBackground() {
  // Single-element approach: all gradients layered as backgrounds on one full-screen div.
  // No child divs with edges = no subpixel flicker on high-refresh monitors.
  // Animation via CSS background-position shifts on the container.
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", opacity: "var(--ethereal-opacity, 1)" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: [
          "radial-gradient(ellipse 80% 80% at 20% 15%, rgba(255,77,0,0.28) 0%, rgba(255,77,0,0.12) 25%, rgba(255,77,0,0.04) 45%, transparent 70%)",
          "radial-gradient(ellipse 70% 65% at 75% 40%, rgba(255,120,60,0.22) 0%, rgba(255,100,40,0.08) 30%, transparent 65%)",
          "radial-gradient(ellipse 75% 55% at 35% 80%, rgba(255,50,0,0.18) 0%, rgba(255,60,10,0.06) 30%, transparent 65%)",
          "radial-gradient(ellipse 55% 55% at 55% 50%, rgba(160,140,255,0.08) 0%, rgba(160,140,255,0.03) 35%, transparent 60%)",
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