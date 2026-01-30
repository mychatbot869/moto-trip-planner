'use client';

import React from 'react';

/**
 * Background grid boxes inspired by Aceternity.
 * Pure CSS; low-cost and "expensive" looking.
 */
export default function BackgroundBoxes({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 opacity-[0.35]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(60% 55% at 50% 30%, black, transparent)',
          }}
        />
        <div
          className="absolute -top-32 left-1/2 h-[520px] w-[860px] -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, rgba(249,115,22,0.22), transparent 70%), radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 65%)',
            filter: 'blur(12px)',
          }}
        />
      </div>
    </div>
  );
}
