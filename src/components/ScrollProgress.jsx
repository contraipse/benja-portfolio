import React, { useState, useEffect } from 'react';
import { T } from '../data/tokens';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 200, background: "transparent" }}>
      <div style={{ height: "100%", width: `${progress * 100}%`, background: T.accent, transition: "width 0.1s linear" }} />
    </div>
  );
}

export default ScrollProgress;