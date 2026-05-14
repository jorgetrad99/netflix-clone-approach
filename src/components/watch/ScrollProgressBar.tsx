'use client';

import { useEffect, useState } from 'react';

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      setProgress(next);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Progreso de lectura"
      className="fixed inset-x-0 top-14 z-40 h-0.5 bg-transparent"
    >
      <div
        className="bg-brand h-full origin-left"
        style={{ transform: `scaleX(${progress})`, transition: 'transform 60ms linear' }}
      />
    </div>
  );
}
