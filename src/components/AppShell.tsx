'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavPill from '@/components/ui/NavPill';
import GlowButton from '@/components/ui/GlowButton';
import { DEV_BYPASS_AUTH, loadDB, logout } from '@/lib/storage';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const db = loadDB();
  const isAuthed = Boolean(db.session.currentUserId);
  const me = db.users.find((u) => u.id === db.session.currentUserId);

  return (
    <div className="min-h-screen text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-900/80 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">
            <span className="text-orange-500">Moto</span> Trip Planner
          </Link>

          <nav className="hidden items-center gap-2 sm:flex">
            <NavPill href="/" label="Home" />
            <NavPill href="/trips" label="Trips" />
            <NavPill href="/groups" label="Groups" />
            <NavPill href="/profile" label="Profile" />
            <NavPill href="/auth" label="Auth" />
          </nav>

          <div className="flex items-center gap-2">
            {DEV_BYPASS_AUTH && me ? (
              <div className="hidden text-xs text-zinc-400 sm:block">Signed in: {me.profile.name}</div>
            ) : null}

            {!isAuthed ? (
              <GlowButton onClick={() => router.push('/auth')}>Sign in</GlowButton>
            ) : (
              <GlowButton
                variant="secondary"
                onClick={() => {
                  logout();
                  router.push('/auth');
                  router.refresh();
                }}
              >
                Logout
              </GlowButton>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 pt-6 text-xs text-zinc-500">
        Local/dev demo • Data stored in your browser (localStorage)
      </footer>
    </div>
  );
}
