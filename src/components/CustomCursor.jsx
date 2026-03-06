import React, { useState, useRef, useEffect } from 'react';
import { T } from '../data/tokens';
import { useIsMobile } from '../hooks/useIsMobile';

export function CustomCursor() {
  const isMobile = useIsMobile();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [label, setLabel] = useState("");
  const smoothPos = useRef({ x: -100, y: -100 });
  const frameRef = useRef(null);

  useEffect(() => {
    const move = (e) => { setPos({ x: e.clientX, y: e.clientY }); };
    window.addEventListener("mousemove", move, { passive: true });
    const over = (e) => {
      const el = e.target.closest("a, button, [data-cursor]");
      if (el) { setIsHovering(true); setLabel(el.dataset.cursor || ""); }
    };
    const out = (e) => {
      const el = e.target.closest("a, button, [data-cursor]");
      if (el) { setIsHovering(false); setLabel(""); }
    };
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  // Smooth follow â FASTER lerp factor (was 0.15, now 0.54)
  useEffect(() => {
    const animate = () => {
      smoothPos.current.x += (pos.x - smoothPos.current.x) * 0.54;
      smoothPos.current.y += (pos.y - smoothPos.current.y) * 0.54;
      const el = document.getElementById("custom-cursor");
      const ring = document.getElementById("cursor-ring");
      if (el) {
        el.style.transform = `translate(${smoothPos.current.x}px, ${smoothPos.current.y}px) translate(-50%, -50%)`;
      }
      if (ring) {
        // Ring follows slightly slower for nice trailing effect
        const ringEl = ring;
        const rx = parseFloat(ringEl.dataset.x || smoothPos.current.x);
        const ry = parseFloat(ringEl.dataset.y || smoothPos.current.y);
        const nx = rx + (pos.x - rx) * 0.24;
        const ny = ry + (pos.y - ry) * 0.24;
        ringEl.dataset.x = nx;
        ringEl.dataset.y = ny;
        ringEl.style.transform = `translate(${nx}px, ${ny}px) translate(-50%, -50%) scale(${isHovering ? 1 : 0.5})`;
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [pos, isHovering]);

  // Hide custom cursor on touch/mobile â restore default cursor
  useEffect(() => {
    document.body.style.cursor = isMobile ? "auto" : "none";
    return () => { document.body.style.cursor = "auto"; };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Inner dot */}
      <div id="custom-cursor" style={{
        position: "fixed", top: 0, left: 0, width: 8, height: 8, borderRadius: "50%",
        background: T.accent,
        pointerEvents: "none", zIndex: 9999, mixBlendMode: "difference",
      }} />
      {/* Outer ring â expands on hover, follows slightly behind */}
      <div id="cursor-ring" data-x="-100" data-y="-100" style={{
        position: "fixed", top: 0, left: 0, width: 48, height: 48, borderRadius: "50%",
        border: `1.5px solid ${isHovering ? T.accent : "rgba(255,255,255,0.2)"}`,
        background: "transparent",
        pointerEvents: "none", zIndex: 9998,
        opacity: isHovering ? 1 : 0.4,
        transition: "border 0.3s, opacity 0.3s, width 0.3s, height 0.3s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {label && <span style={{
          fontFamily: T.sans, fontSize: 9, fontWeight: 600, color: T.accent,
          letterSpacing: "1px", textTransform: "uppercase", whiteSpace: "nowrap",
          opacity: isHovering ? 1 : 0, transition: "opacity 0.2s",
        }}>{label}</span>}
      </div>
    </>
  );
}

export default CustomCursor;