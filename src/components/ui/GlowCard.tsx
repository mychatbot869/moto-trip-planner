'use client';

import { motion } from 'motion/react';

export default function GlowCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}
