import { useState, useEffect } from 'react';

/*
 * Shared scroll subscription.
 * Previously every component that used useScrollProgress attached its own
 * window "scroll" listener + its own requestAnimationFrame loop. With ~40
 * project cards plus several sections, that meant ~40 listeners all firing
 * each frame. Here we keep ONE window listener and ONE rAF for the whole app
 * and fan out to every subscriber. Each subscriber still measures its own
 * element and sets its own progress, so per-component behavior is unchanged.
 */
const subscribers = new Set();
let rafId = null;
let listening = false;

function flush() {
  rafId = null;
  for (const fn of subscribers) fn();
}

function onScroll() {
  if (rafId) return;
  rafId = requestAnimationFrame(flush);
}

function subscribe(fn) {
  subscribers.add(fn);
  if (!listening) {
    window.addEventListener('scroll', onScroll, { passive: true });
    listening = true;
  }
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && listening) {
      window.removeEventListener('scroll', onScroll);
      listening = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }
  };
}

export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const raw = (windowH - rect.top) / (windowH + rect.height);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    compute(); // initial position
    return subscribe(compute);
  }, [ref]);
  return progress;
}
