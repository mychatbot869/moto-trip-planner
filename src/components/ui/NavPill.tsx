'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavPill({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`
        relative rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200
        ${active
          ? 'bg-gradient-to-b from-orange-400 to-orange-500 text-black shadow-[0_2px_8px_rgba(249,115,22,0.3)]'
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
        }
      `}
    >
      {label}
    </Link>
  );
}
