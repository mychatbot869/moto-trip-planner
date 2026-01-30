'use client';

type AvatarProps = {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    'from-orange-500 to-amber-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-orange-500',
    'from-indigo-500 to-purple-500',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export default function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const initials = getInitials(name || 'U');
  const gradient = getColorFromName(name || 'User');

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full
        bg-gradient-to-br ${gradient}
        font-semibold text-white
        shadow-[0_2px_8px_rgba(0,0,0,0.3)]
        ${sizes[size]}
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
