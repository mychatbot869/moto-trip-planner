'use client';

import React from 'react';
import { motion } from 'motion/react';

/**
 * Bento Grid inspired by Aceternity UI.
 * Asymmetric grid layout for feature showcases.
 */
export function BentoGrid({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className = '',
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-none p-4 bg-zinc-900/50 border border-zinc-800/70 justify-between flex flex-col space-y-4 ${className}`}
    >
      {header && (
        <div className="h-full min-h-[6rem] rounded-xl overflow-hidden">
          {header}
        </div>
      )}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon && <div className="mb-2">{icon}</div>}
        <div className="font-semibold text-zinc-100 mb-2 mt-2 text-lg">
          {title}
        </div>
        <div className="text-zinc-400 text-sm">
          {description}
        </div>
      </div>
    </motion.div>
  );
}
