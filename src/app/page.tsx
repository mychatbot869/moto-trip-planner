'use client';

import Link from 'next/link';
import React from 'react';
import GlowButton from '@/components/ui/GlowButton';
import GlowCard from '@/components/ui/GlowCard';
import Badge from '@/components/ui/Badge';
import Spotlight from '@/components/aceternity/Spotlight';
import TracingBeam from '@/components/aceternity/TracingBeam';
import InfiniteMovingCards from '@/components/aceternity/InfiniteMovingCards';
import LampEffect from '@/components/aceternity/LampEffect';
import { BentoGrid, BentoGridItem } from '@/components/aceternity/BentoGrid';
import { HeroHighlight, Highlight } from '@/components/aceternity/HeroHighlight';
import GlowingStars from '@/components/aceternity/GlowingStars';
import Meteors from '@/components/aceternity/Meteors';
import MovingBorder from '@/components/aceternity/MovingBorder';
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

  const features = [
    {
      title: 'Create Trips',
      description: 'Plan rides with routes, dates, and visibility controls. Share with your crew instantly.',
      className: 'md:col-span-2',
      header: (
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 via-zinc-900 to-zinc-950">
          <Meteors number={12} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-16 w-16 text-orange-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>
      ),
    },
    {
      title: 'Organize Groups',
      description: 'Build riding crews with member lists and linked trips.',
      className: 'md:col-span-1',
      header: (
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950">
          <GlowingStars number={20} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-12 w-12 text-orange-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      ),
    },
    {
      title: 'Your Garage',
      description: 'Showcase your bikes and build your rider profile.',
      className: 'md:col-span-1',
      header: (
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-12 w-12 text-orange-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
        </div>
      ),
    },
    {
      title: 'Privacy Controls',
      description: 'Set trips and groups as public or private. You control who sees what.',
      className: 'md:col-span-2',
      header: (
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800/50 to-zinc-950">
          <Meteors number={8} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-14 w-14 text-orange-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative -mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
      {/* Hero Section with Lamp Effect */}
      <section className="relative overflow-hidden">
        <LampEffect className="min-h-[85vh] sm:min-h-screen">
          <HeroHighlight containerClassName="w-full max-w-5xl mx-auto text-center px-4">
            <div className="space-y-6">
              <Badge variant="orange" className="mx-auto">MVP STATUS: LIVE</Badge>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Plan rides.{' '}
                <Highlight className="text-orange-300">
                  Coordinate crews.
                </Highlight>
              </h1>

              <p className="mx-auto max-w-2xl text-base text-zinc-300 sm:text-lg md:text-xl">
                A premium MVP for motorcycle trip planning. Create trips, manage groups, and keep a garage-ready profile.
              </p>

              <nav className="flex flex-wrap items-center justify-center gap-3 pt-4" aria-label="Primary navigation">
                <MovingBorder
                  as={Link}
                  href="/auth"
                  containerClassName="rounded-full"
                  className="bg-zinc-950 hover:bg-zinc-900 transition-colors"
                >
                  Get started
                </MovingBorder>
                <Link href="/trips">
                  <GlowButton variant="secondary" size="lg">Browse trips</GlowButton>
                </Link>
                <Link href="/groups">
                  <GlowButton variant="secondary" size="lg">Browse groups</GlowButton>
                </Link>
              </nav>

              <div className="mx-auto grid max-w-lg grid-cols-3 gap-3 pt-6">
                <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-3 text-center">
                  <div className="text-lg font-semibold text-white">Fast</div>
                  <div className="text-xs text-zinc-500">No friction</div>
                </div>
                <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-3 text-center">
                  <div className="text-lg font-semibold text-white">Premium</div>
                  <div className="text-xs text-zinc-500">Dark + orange</div>
                </div>
                <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-3 text-center">
                  <div className="text-lg font-semibold text-white">Local</div>
                  <div className="text-xs text-zinc-500">Demo-ready</div>
                </div>
              </div>
            </div>
          </HeroHighlight>
        </LampEffect>
      </section>

      {/* Features Section with BentoGrid */}
      <section className="relative overflow-hidden bg-zinc-950 px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="features-heading">
        <GlowingStars number={40} />
        <Spotlight color="rgba(249, 115, 22, 0.2)" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="mb-12 text-center">
            <h2 id="features-heading" className="text-xs font-medium uppercase tracking-[0.18em] text-orange-400">
              What it does
            </h2>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              Everything your crew needs
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
              Clean flows for trips, groups, and profiles. Designed to look and feel like a real product from day one.
            </p>
          </header>

          <BentoGrid>
            {features.map((feature) => (
              <BentoGridItem
                key={feature.title}
                title={feature.title}
                description={feature.description}
                header={feature.header}
                className={feature.className}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="preview-heading">
        <Meteors number={15} />

        <div className="relative z-10 mx-auto max-w-6xl">
          <header className="mb-10 text-center">
            <h2 id="preview-heading" className="text-xs font-medium uppercase tracking-[0.18em] text-orange-400">
              Product Preview
            </h2>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              See it in action
            </p>
          </header>

          <div className="relative mx-auto max-w-4xl">
            <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-orange-500/15 via-white/5 to-transparent blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[32px] border border-zinc-800/70 bg-zinc-950/60 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-4">
                <span className="text-sm font-medium text-white">Live demo</span>
                <span className="font-mono text-[11px] text-zinc-400">VIDEO: ON</span>
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
                    aria-label="Product demonstration video"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-black/30" aria-hidden="true" />
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials + FAQ Section with TracingBeam */}
      <section className="relative overflow-hidden bg-zinc-950 px-4 py-16 sm:px-6 sm:py-24">
        <GlowingStars number={30} />

        <div className="relative z-10 mx-auto max-w-6xl">
          <TracingBeam>
            <div className="space-y-16">
              {/* Testimonials */}
              <div>
                <header className="mb-8">
                  <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-orange-400">
                    Testimonials
                  </h2>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Built to feel real
                  </p>
                  <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                    A premium UI shell that communicates product quality—perfect for an MVP demo.
                  </p>
                </header>

                <InfiniteMovingCards items={testimonials} speed="normal" />
              </div>

              {/* FAQ */}
              <div>
                <header className="mb-8">
                  <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-orange-400">
                    FAQ
                  </h2>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Questions, answered
                  </p>
                  <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                    Quick clarity on what this MVP is (and what it isn&apos;t yet).
                  </p>
                </header>

                <FAQ items={faqs} />
              </div>

              {/* CTA */}
              <div className="relative overflow-hidden rounded-3xl border border-zinc-800/70 bg-zinc-900/40">
                <Meteors number={10} />
                <div className="relative z-10 flex flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row sm:gap-4">
                  <div className="text-center sm:text-left">
                    <h2 className="text-lg font-semibold text-white sm:text-xl">Ready to try it?</h2>
                    <p className="mt-1 text-sm text-zinc-400">Create an account and start a trip in seconds.</p>
                  </div>
                  <nav className="flex flex-wrap items-center justify-center gap-3" aria-label="CTA navigation">
                    <Link href="/auth">
                      <GlowButton>Get started</GlowButton>
                    </Link>
                    <Link href="/trips/new">
                      <GlowButton variant="secondary">Create a trip</GlowButton>
                    </Link>
                  </nav>
                </div>
              </div>

              {/* Footer */}
              <footer className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <span className="font-mono text-[11px] text-zinc-500">Moto Trip Planner • MVP</span>
                <span className="font-mono text-[11px] text-zinc-500">SYSTEM STATUS: OPERATIONAL</span>
              </footer>
            </div>
          </TracingBeam>
        </div>
      </section>
    </div>
  );
}

function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="grid gap-3" role="list">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        const itemId = `faq-item-${idx}`;
        const answerId = `faq-answer-${idx}`;
        return (
          <div key={it.q} role="listitem">
            <button
              type="button"
              onClick={() => setOpen((prev) => (prev === idx ? null : idx))}
              className="w-full text-left rounded-2xl border border-zinc-800/70 bg-zinc-950/50 px-5 py-4 hover:bg-zinc-950/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
              aria-expanded={isOpen}
              aria-controls={answerId}
              id={itemId}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-white">{it.q}</span>
                <span className="font-mono text-xs text-zinc-500" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </div>
              {isOpen && (
                <div id={answerId} className="mt-2 text-sm text-zinc-400 leading-relaxed" role="region" aria-labelledby={itemId}>
                  {it.a}
                </div>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard({ name }: { name: string }) {
  const db = loadDB();
  const me = db.session.currentUserId!;

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
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <GlowingStars number={25} />
      </div>

      <div className="space-y-6">
        <HeroHighlight containerClassName="rounded-2xl" className="p-6 sm:p-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-zinc-400">Welcome back</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                <Highlight>{name}</Highlight>
              </h1>
            </div>

            <nav className="flex flex-wrap items-center gap-2" aria-label="Quick actions">
              <Link href="/trips/new">
                <GlowButton>Create trip</GlowButton>
              </Link>
              <Link href="/groups/new">
                <GlowButton variant="secondary">Create group</GlowButton>
              </Link>
            </nav>
          </header>
        </HeroHighlight>

        <div className="grid gap-3 sm:grid-cols-3">
          <GlowCard className="relative overflow-hidden p-5">
            <Meteors number={5} />
            <div className="relative z-10">
              <div className="text-xs text-zinc-400">Upcoming (7d)</div>
              <div className="mt-1 text-2xl font-semibold text-white">{upcomingTrips.length}</div>
              <div className="mt-1 text-sm text-zinc-400">Trips starting soon</div>
            </div>
          </GlowCard>
          <GlowCard className="relative overflow-hidden p-5">
            <GlowingStars number={8} />
            <div className="relative z-10">
              <div className="text-xs text-zinc-400">My trips</div>
              <div className="mt-1 text-2xl font-semibold text-white">{myTrips.length}</div>
              <div className="mt-1 text-sm text-zinc-400">Owned or joined</div>
            </div>
          </GlowCard>
          <GlowCard className="relative overflow-hidden p-5">
            <Meteors number={5} />
            <div className="relative z-10">
              <div className="text-xs text-zinc-400">My groups</div>
              <div className="mt-1 text-2xl font-semibold text-white">{myGroups.length}</div>
              <div className="mt-1 text-sm text-zinc-400">Communities you&apos;re in</div>
            </div>
          </GlowCard>
        </div>

        <GlowCard className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Upcoming trips</h2>
              <p className="text-sm text-zinc-400">Next 7 days • quick view</p>
            </div>
            <Link href="/trips">
              <GlowButton variant="secondary">View all</GlowButton>
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/40">
            {upcomingTrips.length === 0 ? (
              <p className="p-4 text-sm text-zinc-400">No upcoming trips in the next 7 days.</p>
            ) : (
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="border-b border-zinc-800">
                  <tr className="text-xs text-zinc-400">
                    <th scope="col" className="px-4 py-3 font-medium">Trip</th>
                    <th scope="col" className="px-4 py-3 font-medium">Start</th>
                    <th scope="col" className="px-4 py-3 font-medium">Visibility</th>
                    <th scope="col" className="px-4 py-3 font-medium">Group</th>
                    <th scope="col" className="px-4 py-3 font-medium">Going</th>
                    <th scope="col" className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTrips.slice(0, 6).map((t) => {
                    const group = t.groupId ? db.groups.find((g) => g.id === t.groupId) : null;
                    return (
                      <tr key={t.id} className="border-t border-zinc-900/80">
                        <td className="px-4 py-3">
                          <div className="font-medium">
                            <Link className="hover:text-orange-300 transition-colors" href={`/trips/${t.id}`}>
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
    </div>
  );
}
