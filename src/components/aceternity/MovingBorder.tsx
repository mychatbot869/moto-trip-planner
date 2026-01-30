'use client';

import React from 'react';
import { motion } from 'motion/react';

/**
 * Moving Border Button inspired by Aceternity UI.
 * Button with animated gradient border.
 */
export default function MovingBorder({
  children,
  duration = 2000,
  className = '',
  containerClassName = '',
  borderClassName = '',
  as: Component = 'button',
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={`relative overflow-hidden bg-transparent p-[1px] ${containerClassName}`}
      {...otherProps}
    >
      <div
        className={`absolute inset-0 rounded-full ${borderClassName}`}
        style={{
          background: `linear-gradient(90deg, transparent, transparent, rgba(249,115,22,0.8), transparent, transparent)`,
          backgroundSize: '200% 100%',
          animation: `movingBorder ${duration}ms linear infinite`,
        }}
      />
      <div
        className={`relative flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white ${className}`}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes movingBorder {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </Component>
  );
}
