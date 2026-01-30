'use client';

import React from 'react';

/**
 * Lightweight Spotlight effect inspired by https://ui.aceternity.com
 * Renders an animated radial gradient that tracks the cursor.
 */
export default function Spotlight({
  className = '',
  color = 'rgba(249, 115, 22, 0.35)',
}: {
  className?: string;
  color?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0, active: false });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      });
    };

    const onLeave = () => setPos((p) => ({ ...p, active: false }));

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0,
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 40%)`,
        }}
      />
    </div>
  );
}
