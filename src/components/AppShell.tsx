'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import NavPill from '@/components/ui/NavPill';
import GlowButton from '@/components/ui/GlowButton';
import Avatar from '@/components/ui/Avatar';
import { DEV_BYPASS_AUTH, loadDB, logout } from '@/lib/storage';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const db = loadDB();
  const isAuthed = Boolean(db.session.currentUserId);
  const me = db.users.find((u) => u.id === db.session.currentUserId);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Full-bleed pages (no max-width constraint)
  const isFullBleed = pathname === '/' && !isAuthed;

  return (
    <div className="min-h-screen text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="hidden sm:inline">
              <span className="text-orange-400">Moto</span>
              <span className="text-zinc-300"> Trip Planner</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 rounded-xl bg-zinc-900/50 p-1 sm:flex">
            <NavPill href="/" label="Home" />
            <NavPill href="/trips" label="Trips" />
            <NavPill href="/groups" label="Groups" />
            <NavPill href="/profile" label="Profile" />
          </nav>

          {/* User area */}
          <div className="flex items-center gap-3">
            {isAuthed && me && (
              <div className="hidden items-center gap-2 sm:flex">
                <Avatar name={me.profile.name || me.email} size="sm" />
                <span className="text-sm text-zinc-400">{me.profile.name || me.email.split('@')[0]}</span>
              </div>
            )}

            {!isAuthed ? (
              <GlowButton size="sm" onClick={() => router.push('/auth')}>
                Sign in
              </GlowButton>
            ) : (
              <GlowButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  router.push('/auth');
                  router.refresh();
                }}
              >
                Logout
              </GlowButton>
            )}

            {/* Mobile menu button */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-800/50 bg-zinc-950/95 px-4 py-3 sm:hidden">
            <nav className="flex flex-col gap-1">
              <MobileNavLink href="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/trips" label="Trips" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/groups" label="Groups" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/profile" label="Profile" onClick={() => setMobileMenuOpen(false)} />
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className={isFullBleed ? '' : 'mx-auto max-w-5xl px-4 py-8 sm:py-10'}>{children}</main>

      {/* Footer */}
      <footer className={`border-t border-zinc-900/50 ${isFullBleed ? 'bg-zinc-950' : 'bg-zinc-950/50'}`}>
        <div className={`${isFullBleed ? 'max-w-7xl' : 'max-w-5xl'} mx-auto px-4 py-6`}>
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-zinc-600 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Local demo • Data stored in your browser</span>
            </div>
            {DEV_BYPASS_AUTH && (
              <div className="rounded-full bg-amber-500/10 px-2 py-1 text-amber-500">
                Dev mode: any email/password works
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800/50 hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
}
