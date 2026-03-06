import { useState, useRef, useCallback } from 'react';

export function useInView(opts = {}) {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef(null);

  const ref = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (node && !visible) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        },
        { threshold: opts.threshold || 0.15 }
      );
      obs.observe(node);
      observerRef.current = obs;
    }
  }, [visible]);

  return [ref, visible];
}
