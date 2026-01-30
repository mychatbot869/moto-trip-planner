'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadDB } from '@/lib/storage';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const db = loadDB();
    if (!db.session.currentUserId) {
      router.replace('/auth');
    }
  }, [router]);

  // During SSR/prerender `window` isn't available, so don't render protected content.
  if (typeof window === 'undefined') return null;

  const db = loadDB();
  // In dev bypass mode, loadDB will ensure a logged-in demo user.
  if (!db.session.currentUserId) {
    return (
      <div className="rounded border bg-zinc-50 p-4 text-sm text-zinc-700">
        Redirecting to /auth…
      </div>
    );
  }

  return <>{children}</>;
}
