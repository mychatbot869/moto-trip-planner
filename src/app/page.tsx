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
        'Planned a 3-day canyon run with 12 riders in under 10 minutes. Everyone got the route, timing, and meetup spot instantly.',
      name: 'Jake M.',
      title: 'ADV Crew Lead',
    },
    {
      quote:
        'Finally an app that gets it—trips, groups, garage. No bloat, just what we actually need to coordinate rides.',
      name: 'Sarah K.',
      title: 'Sport Touring Club',
    },
    {
      quote:
        "I can check the ride details, see who's going, and share links to new riders—all from my phone at a gas stop.",
      name: 'Marcus T.',
      title: 'Weekend Warrior',
    },
  ];

  const faqs = [
    {
      q: 'What can I do with Moto Trip Planner?',
      a: "Create trips with routes and dates, organize riding groups, and build a profile with your garage. It's designed for real motorcycle crews who want a clean way to coordinate.",
    },
    {
      q: 'Is my data saved?',
      a: 'Currently data is stored locally in your browser for the demo. This keeps things fast and private. Backend sync is on the roadmap.',
    },
    {
      q: 'Can I invite my riding crew?',
      a: 'Yes. Create a group, share it with your crew, and link trips to it. Members can join or leave rides directly from the trip page.',
    },
    {
      q: "What's included right now?",
      a: 'Trips, groups, rider profiles with garage, and visibility controls (public/private). The core flows work—this is a functional MVP.',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-black/40">
      <BackgroundBoxes />
      <Spotlight color="rgba(249, 115, 22, 0.28)" />

      {/* Hero section */}
      <div className="relative px-6 py-10 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="orange">MVP STATUS: LIVE</Badge>
              <span className="font-mono text-[11px] text-zinc-400">Mobile-first • Fast UI • Local demo</span>
            </div>
            <div className="font-mono text-[11px] text-zinc-500">Moto Trip Planner</div>
          </div>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="font-mono text-xs tracking-[0.2em] text-zinc-400">BUILT FOR MOTORCYCLE CREWS</div>

              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Plan rides.
                <span className="block text-orange-400">Coordinate crews.</span>
              </h1>

              <p className="max-w-xl text-base text-zinc-300">
                A premium MVP for motorcycle trip planning: create trips, manage groups, and keep a garage-ready profile.
                Fast local demo today—ready for a real backend later.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/auth">
                  <GlowButton>Get started</GlowButton>
                </Link>
                <Link href="/trips">
                  <GlowButton variant="secondary">Browse trips</GlowButton>
                </Link>
                <Link href="/groups">
                  <GlowButton variant="secondary">Browse groups</GlowButton>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <GlowCard hover={false} glow={false} className="p-4">
                  <div className="font-mono text-[11px] text-zinc-500">FLOW</div>
                  <div className="mt-1 text-lg font-semibold text-white">Fast</div>
                  <div className="mt-1 text-xs text-zinc-500">No friction</div>
                </GlowCard>
                <GlowCard hover={false} glow={false} className="p-4">
                  <div className="font-mono text-[11px] text-zinc-500">UI</div>
                  <div className="mt-1 text-lg font-semibold text-white">Premium</div>
                  <div className="mt-1 text-xs text-zinc-500">Dark + orange</div>
                </GlowCard>
                <GlowCard hover={false} glow={false} className="p-4">
                  <div className="font-mono text-[11px] text-zinc-500">DATA</div>
                  <div className="mt-1 text-lg font-semibold text-white">Local</div>
                  <div className="mt-1 text-xs text-zinc-500">Demo-ready</div>
                </GlowCard>
              </div>
            </div>

            {/* Hero media */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-orange-500/15 via-white/5 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-zinc-800/70 bg-zinc-950/60 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-4">
                  <div className="text-sm font-medium text-white">Product preview</div>
                  <div className="font-mono text-[11px] text-zinc-400">VIDEO: ON</div>
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
                      <div className="font-mono text-[11px] text-zinc-500">TRIPS</div>
                      <div className="mt-1 text-sm text-white">Create + join</div>
                      <div className="mt-1 text-xs text-zinc-500">Visibility • rules • group link</div>
                    </GlowCard>
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="font-mono text-[11px] text-zinc-500">GROUPS</div>
                      <div className="mt-1 text-sm text-white">Organize crews</div>
                      <div className="mt-1 text-xs text-zinc-500">Members • public/private</div>
                    </GlowCard>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-zinc-800/70 bg-black/30 px-4 py-3">
                    <div className="font-mono text-[11px] text-zinc-400">Ready to ride</div>
                    <div className="font-mono text-[11px] text-zinc-500">MVP v1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mid: MVP sections */}
        <div className="mx-auto mt-14 max-w-6xl">
          <TracingBeam>
            <div className="space-y-10">
              <Section
                eyebrow="What it does"
                title="Everything your crew needs to get on the road"
                desc="Clean flows for trips + groups + profiles. Designed to look and feel like a real product from day one."
              />

              <div className="grid gap-4 lg:grid-cols-2">
                <GlowCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold text-white">Trips</div>
                    <Badge variant="orange">CORE</Badge>
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    Create rides, share them, and let people join/leave. Keep details clear and accessible.
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="font-mono text-[11px] text-zinc-500">VISIBILITY</div>
                      <div className="mt-1 text-sm text-white">Public / private</div>
                    </GlowCard>
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="font-mono text-[11px] text-zinc-500">RULES</div>
                      <div className="mt-1 text-sm text-white">Compatibility checks</div>
                    </GlowCard>
                  </div>
                </GlowCard>

                <GlowCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold text-white">Groups</div>
                    <Badge variant="orange">CORE</Badge>
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    Organize crews with member lists and group-linked trips. Keep everything in one place.
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="text-xs text-zinc-400">Members</div>
                      <div className="mt-1 text-sm text-white">Invite + manage</div>
                    </GlowCard>
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="text-xs text-zinc-400">Trips</div>
                      <div className="mt-1 text-sm text-white">Linked rides</div>
                    </GlowCard>
                    <GlowCard hover={false} glow={false} className="p-4">
                      <div className="text-xs text-zinc-400">Privacy</div>
                      <div className="mt-1 text-sm text-white">Public/private</div>
                    </GlowCard>
                  </div>
                </GlowCard>
              </div>

              <Section
                eyebrow="Testimonials"
                title="Built to feel real"
                desc="A premium UI shell that communicates product quality—perfect for an MVP demo." 
              />

              <InfiniteMovingCards items={testimonials} speed="normal" className="mt-2" />

              <Section
                eyebrow="FAQ"
                title="Questions, answered"
                desc="Quick clarity on what this MVP is (and what it isn’t yet)."
              />

              <FAQ items={faqs} />

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/70 bg-zinc-950/60 px-6 py-6">
                <div>
                  <div className="text-lg font-semibold text-white">Ready to try it?</div>
                  <div className="mt-1 text-sm text-zinc-400">Create an account and start a trip in seconds.</div>
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
                <div className="font-mono text-[11px] text-zinc-500">Moto Trip Planner • MVP</div>
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

function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="grid gap-3">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <button
            key={it.q}
            type="button"
            onClick={() => setOpen((prev) => (prev === idx ? null : idx))}
            className="text-left rounded-2xl border border-zinc-800/70 bg-zinc-950/50 px-5 py-4 hover:bg-zinc-950/60 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-semibold text-white">{it.q}</div>
              <div className="font-mono text-xs text-zinc-500">{isOpen ? '−' : '+'}</div>
            </div>
            {isOpen ? (
              <div className="mt-2 text-sm text-zinc-400 leading-relaxed">{it.a}</div>
            ) : null}
          </button>
        );
      })}
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
