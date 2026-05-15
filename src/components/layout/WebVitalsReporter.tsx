'use client';

import { useEffect } from 'react';

export function WebVitalsReporter() {
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { onCLS, onLCP, onINP, onFCP, onTTFB } = await import('web-vitals');
        if (cancelled) return;
        const log = (metric: { name: string; value: number; id: string }) => {
          // Visible in console for local audits; in prod swap for analytics endpoint.
          console.log(`[web-vitals] ${metric.name}=${Math.round(metric.value)} (${metric.id})`);
        };
        onCLS(log);
        onLCP(log);
        onINP(log);
        onFCP(log);
        onTTFB(log);
      } catch {
        /* fail silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
