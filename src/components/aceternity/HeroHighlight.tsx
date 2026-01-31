'use client';

import React from 'react';
import { motion } from 'motion/react';

/**
 * Hero Highlight inspired by Aceternity UI.
 * Animated hover highlight effect.
 */
export function HeroHighlight({
  children,
  className = '',
  containerClassName = '',
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent<HTMLDivElement>) => {
      const rect = currentTarget.getBoundingClientRect();
      setPos({ x: clientX - rect.left, y: clientY - rect.top });
    },
    []
  );

  return (
    <div className={`relative h-full w-full group ${containerClassName}`} onMouseMove={handleMouseMove}>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(249,115,22,0.15), transparent 40%)`,
        }}
      />
      <div className={`relative z-20 ${className}`}>{children}</div>
    </div>
  );
}

export function Highlight({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ backgroundSize: '0% 100%' }}
      whileInView={{ backgroundSize: '100% 100%' }}
      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        display: 'inline',
      }}
      className={`relative inline-block rounded-lg bg-gradient-to-r from-orange-500/40 to-orange-600/40 pb-1 px-1 ${className}`}
    >
      {children}
    </motion.span>
  );
}
