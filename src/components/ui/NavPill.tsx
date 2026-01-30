'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavPill({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`rounded-xl px-3 py-2 text-sm transition ${
        active
          ? 'bg-orange-500 text-black'
          : 'text-zinc-200 hover:bg-zinc-900/70 hover:text-white border border-transparent hover:border-zinc-800'
      }`}
    >
      {label}
    </Link>
  );
}
