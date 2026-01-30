'use client';

import { motion } from 'motion/react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export default function GlowButton({ variant = 'primary', className = '', ...props }: Props) {
  const base =
    'relative inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-orange-400/60';
  const styles =
    variant === 'primary'
      ? 'bg-orange-500 text-black hover:bg-orange-400'
      : 'bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800';

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
      <button className={`${base} ${styles} ${className}`} {...props} />
    </motion.div>
  );
}
