'use client';

type Variant = 'default' | 'orange' | 'info' | 'success';
type Size = 'sm' | 'md';

type Props = {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  className?: string;
};

export default function Badge({ variant = 'default', size = 'md', children, className = '' }: Props) {
  const variantStyles: Record<Variant, string> = {
    default: 'border-zinc-800 bg-zinc-950/50 text-zinc-300',
    orange: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    info: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  };

  const sizeStyles: Record<Size, string> = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
