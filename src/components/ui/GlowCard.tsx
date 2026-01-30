'use client';

import { motion } from 'motion/react';

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function GlowCard({
  children,
  className = '',
  hover = true,
  glow = true,
  padding = 'md',
}: GlowCardProps) {
  const baseClassName = `
    relative overflow-hidden rounded-2xl
    bg-zinc-900/50 backdrop-blur-xl
    border border-zinc-800/60
    shadow-[0_0_1px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3),0_8px_16px_rgba(0,0,0,0.2)]
    ${paddingClasses[padding]}
    ${className}
  `;

  const content = (
    <>
      {/* Top highlight edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/40 to-transparent" />

      {/* Glow effects */}
      {glow && (
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-orange-500/15 blur-[80px]" />
          <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]" />
        </div>
      )}

      <div className="relative">{children}</div>
    </>
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.005 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
        className={baseClassName}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={baseClassName}>{content}</div>;
}
