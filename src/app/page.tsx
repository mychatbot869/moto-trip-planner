'use client';

import Link from 'next/link';
import React from 'react';
import GlowButton from '@/components/ui/GlowButton';
import GlowCard from '@/components/ui/GlowCard';
import Badge from '@/components/ui/Badge';
import AppleCardsCarousel from '@/components/aceternity/AppleCardsCarousel';
import Spotlight from '@/components/aceternity/Spotlight';
import TracingBeam from '@/components/aceternity/TracingBeam';
import BackgroundBoxes from '@/components/aceternity/BackgroundBoxes';
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
                <div className="font-medium">Dev mode: auth bypass</div>
                <div className="mt-1 text-zinc-400">Any email + password will sign you in (stored locally).</div>
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
  const featured = [
    {
      tag: 'Trips',
      title: 'Plan routes with rules',
      description: 'Engine-size rules, visibility, group linking, and quick join/leave flows.',
    },
    {
      tag: 'Groups',
      title: 'Build a riding community',
      description: 'Public or private groups with member lists and group-specific trips.',
    },
    {
      tag: 'Profile',
      title: 'Garage-ready profiles',
      description: 'Store bikes once and validate compatibility automatically for rides.',
    },
    {
      tag: 'Dashboard',
      title: 'A home that feels native',
      description: 'KPIs, tables, and shortcuts — clean, fast, and premium dark UI.',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-black/40">
      <BackgroundBoxes />
      <Spotlight color="rgba(249, 115, 22, 0.35)" />

      <div className="relative px-6 py-12 sm:px-10 sm:py-16">
        {/* Hero */}
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="orange">Moto Trip Planner</Badge>
              <div className="text-xs text-zinc-400">White • Orange • Black • Startup-grade UI</div>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              A premium trip planner for
              <span className="block text-orange-400">motorcycle crews</span>
            </h1>

            <p className="max-w-xl text-base text-zinc-300">
              Plan rides, coordinate groups, and keep a garage-ready profile — with a clean, expensive-looking interface.
              This build is currently local-first (browser storage) so it’s instant.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/auth">
                <GlowButton>Get started</GlowButton>
              </Link>
              <Link href="/trips">
                <GlowButton variant="secondary">Explore trips</GlowButton>
              </Link>
              <Link href="/groups">
                <GlowButton variant="secondary">Explore groups</GlowButton>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Fast local demo
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/60" />
                Clean navigation
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-zinc-600" />
                Mobile-first
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-orange-500/15 via-white/5 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-zinc-800/70 bg-zinc-950/60 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-4">
                <div className="text-sm font-medium text-white">Product preview</div>
                <div className="text-xs text-zinc-400">Video</div>
              </div>

              <div className="p-5">
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-800/60 bg-black">
                  <video
                    className="h-full w-full object-cover opacity-95"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    src="/media/hero.mp4"
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <GlowCard hover={false} glow={false} className="p-4">
                    <div className="text-xs text-zinc-400">Highlights</div>
                    <div className="mt-1 text-sm text-white">Groups • Trips • Profile</div>
                    <div className="mt-1 text-xs text-zinc-500">All in one native-feel shell</div>
                  </GlowCard>
                  <GlowCard hover={false} glow={false} className="p-4">
                    <div className="text-xs text-zinc-400">Design</div>
                    <div className="mt-1 text-sm text-white">White / Orange / Black</div>
                    <div className="mt-1 text-xs text-zinc-500">Premium contrast & spacing</div>
                  </GlowCard>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured carousel */}
        <div className="mx-auto mt-14 max-w-6xl">
          <AppleCardsCarousel cards={featured} />
        </div>

        {/* Tracing beam sections */}
        <div className="mx-auto mt-14 max-w-6xl">
          <TracingBeam>
            <div className="space-y-10">
              <Section
                eyebrow="Everything you need"
                title="Features that feel like a product, not a demo"
                desc="Trips, Groups, and Profiles are fully usable today — with a premium UI foundation you can scale into a real startup."
              />

              <div className="grid gap-4 lg:grid-cols-3">
                <FeatureCard
                  title="Trips"
                  desc="Create rides with meeting points, rules, visibility, and quick join/leave."
                />
                <FeatureCard
                  title="Groups"
                  desc="Create or join groups, manage membership, and keep group rides organized."
                />
                <FeatureCard
                  title="Profile + Garage"
                  desc="Add your motorcycles, track engine size, and match rides automatically."
                />
              </div>

              <Section
                eyebrow="Polished by default"
                title="A homepage that looks expensive"
                desc="Spotlights, beams, carousels, gradients, and clean typography—built with lightweight components inspired by Aceternity UI."
              />

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/70 bg-zinc-950/50 px-6 py-6">
                <div>
                  <div className="text-lg font-semibold text-white">Ready to ride?</div>
                  <div className="mt-1 text-sm text-zinc-400">Sign in (dev bypass supports any credentials).</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/auth">
                    <GlowButton>Get started</GlowButton>
                  </Link>
                  <Link href="/trips/new">
                    <GlowButton variant="secondary">Create a trip</GlowButton>
                  </Link>
                </div>
              </div>
            </div>
          </TracingBeam>
        </div>
      </div>
    </div>
  );
}

function Section({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-orange-400">{eyebrow}</div>
      <div className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</div>
      <div className="max-w-3xl text-sm text-zinc-400">{desc}</div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <GlowCard className="p-6">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-white">{title}</div>
        <span className="rounded-full border border-zinc-800 bg-black/30 px-2.5 py-1 text-xs text-zinc-300">Included</span>
      </div>
      <div className="mt-2 text-sm text-zinc-400">{desc}</div>
      <div className="mt-5 text-sm text-orange-400">Explore →</div>
    </GlowCard>
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
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-white">{name}</h1>
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

      <div className="grid gap-3 sm:grid-cols-3">
        <GlowCard className="p-5">
          <div className="text-xs text-zinc-400">Upcoming (7d)</div>
          <div className="mt-1 text-2xl font-semibold text-white">{upcomingTrips.length}</div>
          <div className="mt-1 text-sm text-zinc-400">Trips starting soon</div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="text-xs text-zinc-400">My trips</div>
          <div className="mt-1 text-2xl font-semibold text-white">{myTrips.length}</div>
          <div className="mt-1 text-sm text-zinc-400">Owned or joined</div>
        </GlowCard>
        <GlowCard className="p-5">
          <div className="text-xs text-zinc-400">My groups</div>
          <div className="mt-1 text-2xl font-semibold text-white">{myGroups.length}</div>
          <div className="mt-1 text-sm text-zinc-400">Communities you’re in</div>
        </GlowCard>
      </div>

      <GlowCard className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-white">Upcoming trips</div>
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
    </div>
  );
}
