'use client';

import Link from 'next/link';
import React from 'react';
import GlowButton from '@/components/ui/GlowButton';
import GlowCard from '@/components/ui/GlowCard';
import { DEV_BYPASS_AUTH, loadDB, resetDB } from '@/lib/storage';

export default function HomePage() {
  const db = loadDB();
  const meId = db.session.currentUserId;
  const isAuthed = Boolean(meId);
  const me = db.users.find((u) => u.id === meId);

  return (
    <div className="space-y-8">
      {!isAuthed ? (
        <Landing />
      ) : (
        <Dashboard name={me?.profile.name ?? me?.email ?? 'Rider'} />
      )}

      {DEV_BYPASS_AUTH ? (
        <GlowCard className="p-6">
          <div className="text-sm text-zinc-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-medium">Dev mode: auth bypass + seed data</div>
                <div className="mt-1 text-zinc-400">
                  If you don’t see demo trips/groups, you probably have an old local DB.
                </div>
              </div>
              <GlowButton
                variant="secondary"
                onClick={() => {
                  resetDB();
                  window.location.reload();
                }}
              >
                Reset demo data
              </GlowButton>
            </div>
          </div>
        </GlowCard>
      ) : null}
    </div>
  );
}

function Landing() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-xs text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Local demo • stored in your browser
        </div>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Moto Trip Planner
          <span className="block text-orange-400">Your rides, organized.</span>
        </h1>

        <p className="max-w-2xl text-sm text-zinc-400">
          Plan trips, coordinate groups, and keep your bike profile ready to roll. Built as a local/dev demo (localStorage)
          with a dark, native-app feel.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <GlowCard className="p-6">
          <div className="text-sm text-zinc-400">Dashboard</div>
          <div className="mt-1 text-lg font-semibold">Upcoming rides</div>
          <div className="mt-2 text-sm text-zinc-400">See what’s next at a glance (and who’s going).</div>
        </GlowCard>
        <GlowCard className="p-6">
          <div className="text-sm text-zinc-400">Groups</div>
          <div className="mt-1 text-lg font-semibold">Ride together</div>
          <div className="mt-2 text-sm text-zinc-400">Public and private groups, simple membership.</div>
        </GlowCard>
        <GlowCard className="p-6">
          <div className="text-sm text-zinc-400">Profile</div>
          <div className="mt-1 text-lg font-semibold">Bike compatibility</div>
          <div className="mt-2 text-sm text-zinc-400">Track your motorcycles for engine-size rules.</div>
        </GlowCard>
      </div>

      <GlowCard className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold">Sign in to continue</div>
            <div className="mt-1 text-sm text-zinc-400">Access your dashboard, trips, and groups.</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/auth">
              <GlowButton>Go to Auth</GlowButton>
            </Link>
            <Link href="/trips">
              <GlowButton variant="secondary">Preview trips</GlowButton>
            </Link>
          </div>
        </div>
      </GlowCard>
    </div>
  );
}

function Dashboard({ name }: { name: string }) {
  const db = loadDB();
  const me = db.session.currentUserId!;

  // Keep "now" stable for this render session (avoids react-hooks/purity lint).
  const [now] = React.useState(() => Date.now());
  const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;

  const myGroups = db.groups.filter((g) => g.memberIds.includes(me));
  const myTrips = db.trips.filter((t) => t.ownerId === me || t.participantIds.includes(me));

  const upcomingTrips = db.trips
    .filter((t) => {
      const tripDate = new Date(t.startDateTime).getTime();
      return tripDate >= now && tripDate <= sevenDaysFromNow;
    })
    .filter((t) => t.visibility === 'public' || t.ownerId === me)
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm text-zinc-400">Welcome back</div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{name}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/trips/new">
            <GlowButton>Create trip</GlowButton>
          </Link>
          <Link href="/groups/new">
            <GlowButton variant="secondary">Create group</GlowButton>
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-3">
        <GlowCard className="p-5">
          <div className="text-xs text-zinc-400">Upcoming (7d)</div>
          <div className="mt-1 text-2xl font-semibold">{upcomingTrips.length}</div>
          <div className="mt-1 text-sm text-zinc-400">Trips starting soon</div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="text-xs text-zinc-400">My trips</div>
          <div className="mt-1 text-2xl font-semibold">{myTrips.length}</div>
          <div className="mt-1 text-sm text-zinc-400">Owned or joined</div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="text-xs text-zinc-400">My groups</div>
          <div className="mt-1 text-2xl font-semibold">{myGroups.length}</div>
          <div className="mt-1 text-sm text-zinc-400">Communities you’re in</div>
        </GlowCard>
      </div>

      {/* Table */}
      <GlowCard className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">Upcoming trips</div>
            <div className="text-sm text-zinc-400">Next 7 days • quick view</div>
          </div>
          <Link href="/trips">
            <GlowButton variant="secondary">View all</GlowButton>
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/40">
          {upcomingTrips.length === 0 ? (
            <div className="p-4 text-sm text-zinc-400">No upcoming trips in the next 7 days.</div>
          ) : (
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="border-b border-zinc-800">
                <tr className="text-xs text-zinc-400">
                  <th className="px-4 py-3 font-medium">Trip</th>
                  <th className="px-4 py-3 font-medium">Start</th>
                  <th className="px-4 py-3 font-medium">Visibility</th>
                  <th className="px-4 py-3 font-medium">Group</th>
                  <th className="px-4 py-3 font-medium">Going</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTrips.slice(0, 6).map((t) => {
                  const group = t.groupId ? db.groups.find((g) => g.id === t.groupId) : null;
                  return (
                    <tr key={t.id} className="border-t border-zinc-900/80">
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          <Link className="hover:text-orange-300" href={`/trips/${t.id}`}>
                            {t.title}
                          </Link>
                        </div>
                        <div className="text-xs text-zinc-400 truncate max-w-[360px]">{t.description || '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{new Date(t.startDateTime).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-300">
                          {t.visibility}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{group ? group.name : '—'}</td>
                      <td className="px-4 py-3 text-zinc-300">{t.participantIds.length}</td>
                      <td className="px-4 py-3">
                        <Link href={`/trips/${t.id}`}>
                          <GlowButton variant="secondary">Open</GlowButton>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </GlowCard>

      {/* Quick actions */}
      <div className="grid gap-3 lg:grid-cols-3">
        <GlowCard className="p-6 lg:col-span-2">
          <div className="text-lg font-semibold">Quick actions</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Link
              href="/trips/new"
              className="group rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition hover:border-orange-500/40"
            >
              <div className="font-medium">Create trip</div>
              <div className="text-sm text-zinc-400">Plan a new ride</div>
              <div className="mt-2 text-xs text-orange-400 opacity-0 transition group-hover:opacity-100">Open →</div>
            </Link>
            <Link
              href="/groups/new"
              className="group rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition hover:border-orange-500/40"
            >
              <div className="font-medium">Create group</div>
              <div className="text-sm text-zinc-400">Start a crew</div>
              <div className="mt-2 text-xs text-orange-400 opacity-0 transition group-hover:opacity-100">Open →</div>
            </Link>
            <Link
              href="/profile"
              className="group rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition hover:border-orange-500/40"
            >
              <div className="font-medium">Profile</div>
              <div className="text-sm text-zinc-400">Rider + motorcycles</div>
              <div className="mt-2 text-xs text-orange-400 opacity-0 transition group-hover:opacity-100">Open →</div>
            </Link>
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="text-lg font-semibold">Shortcuts</div>
          <div className="mt-4 grid gap-2">
            <Link href="/trips" className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300 hover:border-orange-500/40">
              Browse all trips
            </Link>
            <Link href="/groups" className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300 hover:border-orange-500/40">
              Browse groups
            </Link>
            <Link href="/auth" className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300 hover:border-orange-500/40">
              Auth settings
            </Link>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
