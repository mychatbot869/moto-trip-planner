'use client';

import React from 'react';

/**
 * Simple Tracing Beam: a vertical accent gradient that follows scroll within a container.
 * Inspired by Aceternity UI "Tracing Beam".
 */
export default function TracingBeam({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height + viewportH;
      const current = viewportH - rect.top;
      const p = Math.min(1, Math.max(0, current / total));
      setProgress(p);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="pointer-events-none absolute left-3 top-0 h-full w-px bg-zinc-800/60" aria-hidden />
      <div
        className="pointer-events-none absolute left-3 top-0 w-px"
        style={{
          height: `${Math.max(8, progress * 100)}%`,
          background:
            'linear-gradient(to bottom, rgba(249,115,22,0.0), rgba(249,115,22,0.9), rgba(249,115,22,0.0))',
          boxShadow: '0 0 24px rgba(249,115,22,0.35)',
        }}
        aria-hidden
      />
      <div className="pl-10">{children}</div>
    </div>
  );
}
