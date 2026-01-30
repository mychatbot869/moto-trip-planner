'use client';

import Link from 'next/link';
import React from 'react';
import GlowButton from '@/components/ui/GlowButton';
import GlowCard from '@/components/ui/GlowCard';
import Badge from '@/components/ui/Badge';
import Spotlight from '@/components/aceternity/Spotlight';
import TracingBeam from '@/components/aceternity/TracingBeam';
import BackgroundBoxes from '@/components/aceternity/BackgroundBoxes';
import InfiniteMovingCards from '@/components/aceternity/InfiniteMovingCards';
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
  const testimonials = [
    {
      quote:
        'Weekly figures now settle themselves. Our tree stays clean and we stop losing hours to spreadsheets.',
      name: 'Operator',
      title: 'Multi-tier network',
    },
    {
      quote:
        'Mobile-first is real here. Agents can move lines and adjust players instantly without friction.',
      name: 'Agent',
      title: 'Admin + Live ops',
    },
    {
      quote:
        'Everything feels like a system: fast, dark, and intentional. The UI sells the product.',
      name: 'Founder',
      title: 'Product + design',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-black/40">
      <BackgroundBoxes />
      <Spotlight color="rgba(249, 115, 22, 0.28)" />

      {/* Top: Wagerbabe-style hero */}
      <div className="relative px-6 py-10 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="orange">SYSTEM STATUS: OPERATIONAL</Badge>
              <span className="font-mono text-[11px] text-zinc-400">PROTOCOL_V2 • AUTONOMOUS • SYSTEM_SECURE</span>
            </div>
            <div className="font-mono text-[11px] text-zinc-500">ESTABLISHED 2025</div>
          </div>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="font-mono text-xs tracking-[0.2em] text-zinc-400">EMPOWERING MULTI-TIER NETWORKS</div>

              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Upgrade your <span className="text-orange-400">PPH</span>.
                <span className="block">Modernize your book.</span>
              </h1>

              <p className="max-w-xl text-base text-zinc-300">
                Legacy platforms are holding you back. Moto Trip Planner is a premium, fast UI shell for coordinating crews,
                trips, and groups — built to feel like a high-performance product.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/auth">
                  <GlowButton>Launch system</GlowButton>
                </Link>
                <Link href="/trips">
                  <GlowButton variant="secondary">View trips</GlowButton>
                </Link>
                <Link href="/groups">
                  <GlowButton variant="secondary">View groups</GlowButton>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <GlowCard hover={false} glow={false} className="p-4">
                  <div className="font-mono text-[11px] text-zinc-500">LATENCY</div>
                  <div className="mt-1 text-lg font-semibold text-white">&lt; 50ms</div>
                  <div className="mt-1 text-xs text-zinc-500">Instant flows</div>
                </GlowCard>
                <GlowCard hover={false} glow={false} className="p-4">
                  <div className="font-mono text-[11px] text-zinc-500">UPTIME</div>
                  <div className="mt-1 text-lg font-semibold text-white">99.99%</div>
                  <div className="mt-1 text-xs text-zinc-500">Always-on feel</div>
                </GlowCard>
                <GlowCard hover={false} glow={false} className="p-4">
                  <div className="font-mono text-[11px] text-zinc-500">SYSTEM</div>
                  <div className="mt-1 text-lg font-semibold text-white">LOCAL</div>
                  <div className="mt-1 text-xs text-zinc-500">Fast demo mode</div>
                </GlowCard>
              </div>
            </div>

            {/* Hero media */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-orange-500/15 via-white/5 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-zinc-800/70 bg-zinc-950/60 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-4">
                  <div className="text-sm font-medium text-white">Live Production Interface</div>
                  <div className="font-mono text-[11px] text-zinc-400">STREAM: ON</div>
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
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-black/30" />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="font-mono text-[11px] text-zinc-500">SYSTEM</div>
                      <div className="mt-1 text-sm text-white">ADMIN</div>
                      <div className="mt-1 text-xs text-zinc-500">Weekly figures • Credits • Line moves</div>
                    </GlowCard>
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="font-mono text-[11px] text-zinc-500">SYSTEM</div>
                      <div className="mt-1 text-sm text-white">LIVE</div>
                      <div className="mt-1 text-xs text-zinc-500">Mobile-first • Instant actions</div>
                    </GlowCard>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-zinc-800/70 bg-black/30 px-4 py-3">
                    <div className="font-mono text-[11px] text-zinc-400">SYSTEM_STATUS: ONLINE</div>
                    <div className="font-mono text-[11px] text-zinc-500">ALGORITHM: LINEAR_REGRESSION_V4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mid: sections (wagerbabe vibe) */}
        <div className="mx-auto mt-14 max-w-6xl">
          <TracingBeam>
            <div className="space-y-10">
              <Section
                eyebrow="Resource Allocation"
                title="Pick a hand. Play to win."
                desc="Flexible tiers designed to match your current scale. Each package unlocks the full platform with optimized workflows."
              />

              <div className="grid gap-4 lg:grid-cols-2">
                <GlowCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold text-white">Game</div>
                    <Badge variant="orange">SYSTEM_SECURE</Badge>
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    Fast UI foundations to ship high-touch flows. Smooth animation, high contrast, premium spacing.
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="font-mono text-[11px] text-zinc-500">MOBILE-FIRST CORE</div>
                      <div className="mt-1 text-sm text-white">Built for thumbs</div>
                    </GlowCard>
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="font-mono text-[11px] text-zinc-500">INSTANT ACTIONS</div>
                      <div className="mt-1 text-sm text-white">Fast, frictionless</div>
                    </GlowCard>
                  </div>
                </GlowCard>

                <GlowCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold text-white">Admin</div>
                    <Badge variant="orange">PROTOCOL_V2</Badge>
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    Stop using spreadsheets. Settle weekly figures, adjust players, and manage ops in one place.
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="text-xs text-zinc-400">Weekly figures</div>
                      <div className="mt-1 text-sm text-white">Instant totals</div>
                    </GlowCard>
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="text-xs text-zinc-400">Adjustments</div>
                      <div className="mt-1 text-sm text-white">One-click credits</div>
                    </GlowCard>
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="text-xs text-zinc-400">Line control</div>
                      <div className="mt-1 text-sm text-white">Global / local</div>
                    </GlowCard>
                  </div>
                </GlowCard>
              </div>

              <Section
                eyebrow="Automated Protection"
                title="Pattern recognition to protect your margins"
                desc="Bot detection, sharp analysis, auto hedging — presented in a clean operator-grade UI."
              />

              <div className="rounded-3xl border border-zinc-800/70 bg-zinc-950/50 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="font-mono text-xs text-zinc-400">SYSTEM ARCHITECTURE: CLASSIFIED</div>
                  <div className="font-mono text-xs text-zinc-500">REAL-TIME RISK: ACTIVE</div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <FeatureCard title="Bot Detection" desc="Detect abnormal patterns and scripted behavior." />
                  <FeatureCard title="Auto Hedging" desc="Minimize exposure with defensive actions." />
                  <FeatureCard title="Sharp Analysis" desc="Identify high-skill bettors and protect edges." />
                </div>
              </div>

              <Section
                eyebrow="Global Scale"
                title="Zero latency feel"
                desc="A decentralized vibe: the UI stays responsive and fast regardless of context."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <GlowCard className="p-6">
                  <div className="text-3xl font-semibold text-white">99.99%</div>
                  <div className="mt-1 text-sm text-zinc-400">Uptime guarantee</div>
                </GlowCard>
                <GlowCard className="p-6">
                  <div className="text-3xl font-semibold text-white">50ms</div>
                  <div className="mt-1 text-sm text-zinc-400">Global latency target</div>
                </GlowCard>
              </div>

              <div className="mt-2">
                <InfiniteMovingCards items={testimonials} speed="normal" className="mt-2" />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/70 bg-zinc-950/60 px-6 py-6">
                <div>
                  <div className="text-lg font-semibold text-white">Ready to scale?</div>
                  <div className="mt-1 text-sm text-zinc-400">
                    Join the network of crews who upgraded their infrastructure.
                  </div>
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

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="font-mono text-[11px] text-zinc-500">WagerBabe → Moto Trip Planner UI variant</div>
                <div className="font-mono text-[11px] text-zinc-500">SYSTEM STATUS: OPERATIONAL</div>
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
