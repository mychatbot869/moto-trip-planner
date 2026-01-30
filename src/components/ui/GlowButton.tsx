'use client';

import { motion } from 'motion/react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-2.5 text-base rounded-xl',
};

export default function GlowButton({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: Props) {
  const base = `
    relative inline-flex items-center justify-center font-medium
    transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-b from-orange-400 to-orange-500
      text-black font-semibold
      shadow-[0_1px_2px_rgba(0,0,0,0.3),0_2px_8px_rgba(249,115,22,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
      hover:from-orange-300 hover:to-orange-400
      active:from-orange-500 active:to-orange-600
    `,
    secondary: `
      bg-zinc-800/80 backdrop-blur-sm
      text-zinc-100
      border border-zinc-700/50
      shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]
      hover:bg-zinc-700/80 hover:border-zinc-600/50
      active:bg-zinc-800
    `,
    danger: `
      bg-gradient-to-b from-red-500 to-red-600
      text-white font-semibold
      shadow-[0_1px_2px_rgba(0,0,0,0.3),0_2px_8px_rgba(239,68,68,0.2)]
      hover:from-red-400 hover:to-red-500
      active:from-red-600 active:to-red-700
    `,
    ghost: `
      bg-transparent
      text-zinc-300
      hover:bg-zinc-800/50 hover:text-zinc-100
      active:bg-zinc-800
    `,
  };

  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className="inline-block"
    >
      <button
        className={`${base} ${sizeClasses[size]} ${variants[variant]} ${className}`}
        disabled={disabled}
        {...props}
      />
    </motion.div>
  );
}
