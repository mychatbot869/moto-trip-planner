'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import GlowButton from '@/components/ui/GlowButton';
import GlowCard from '@/components/ui/GlowCard';
import { engineRuleLabel, isTripCompatible } from '@/lib/compat';
import { joinTrip, leaveTrip, loadDB } from '@/lib/storage';
import type { EngineSizeRule } from '@/lib/models';

export default function TripsPage() {
  return (
    <RequireAuth>
      <TripsInner />
    </RequireAuth>
  );
}

function TripsInner() {
  const db = loadDB();
  const me = db.session.currentUserId!;

  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'mine'>('all');
  const [engineFilter, setEngineFilter] = useState<'all' | EngineSizeRule>('all');

  const filteredTrips = useMemo(() => {
    let trips = db.trips;

    if (visibilityFilter === 'public') {
      trips = trips.filter((t) => t.visibility === 'public');
    } else if (visibilityFilter === 'mine') {
      trips = trips.filter((t) => t.ownerId === me || t.participantIds.includes(me));
    } else {
      trips = trips.filter((t) => t.visibility === 'public' || t.ownerId === me);
    }

    if (engineFilter !== 'all') {
      trips = trips.filter((t) => t.engineRule === engineFilter);
    }

    return trips;
  }, [db.trips, visibilityFilter, engineFilter, me]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trips</h1>
          <p className="mt-1 text-sm text-zinc-400">Browse upcoming rides. Join with one tap.</p>
        </div>

        <Link href="/trips/new">
          <GlowButton>Create trip</GlowButton>
        </Link>
      </div>

      <GlowCard className="p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-zinc-400">Visibility</span>
            <select
              className="h-10 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm text-zinc-100 outline-none ring-orange-400/30 focus:ring-2"
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as 'all' | 'public' | 'mine')}
            >
              <option value="all">All</option>
              <option value="public">Public only</option>
              <option value="mine">My trips</option>
            </select>
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-zinc-400">Engine rule</span>
            <select
              className="h-10 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm text-zinc-100 outline-none ring-orange-400/30 focus:ring-2"
              value={engineFilter}
              onChange={(e) => setEngineFilter(e.target.value as 'all' | EngineSizeRule)}
            >
              <option value="all">All</option>
              <option value="open">Open to all</option>
              <option value="small">Small bikes</option>
              <option value="big">Big bikes</option>
            </select>
          </label>
        </div>
      </GlowCard>

      {filteredTrips.length === 0 ? (
        <GlowCard>
          <div className="text-sm text-zinc-300">No trips match the selected filters.</div>
        </GlowCard>
      ) : (
        <ul className="grid gap-3">
          {filteredTrips.map((t) => {
            const owner = db.users.find((u) => u.id === t.ownerId);
            const group = t.groupId ? db.groups.find((g) => g.id === t.groupId) : null;

            const meUser = db.users.find((u) => u.id === me);
            const compatible = meUser ? isTripCompatible(t.engineRule, meUser) : true;

            return (
              <li key={t.id}>
                <GlowCard className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-lg font-semibold tracking-tight">{t.title}</div>
                        <span className="rounded-full border border-zinc-800 bg-zinc-950/50 px-2.5 py-1 text-xs text-zinc-300">
                          {t.visibility}
                        </span>
                        {!compatible ? (
                          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200">
                            Not compatible
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 text-sm text-zinc-400">{t.description || 'No description'}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/trips/${t.id}`}>
                        <GlowButton variant="secondary">View</GlowButton>
                      </Link>
                      {t.participantIds?.includes(me) ? (
                        <GlowButton variant="secondary" onClick={() => leaveTrip(t.id)}>
                          Leave
                        </GlowButton>
                      ) : (
                        <GlowButton onClick={() => joinTrip(t.id)}>Join</GlowButton>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
                    <div>
                      <span className="text-zinc-400">Start:</span> {new Date(t.startDateTime).toLocaleString()}
                    </div>
                    <div>
                      <span className="text-zinc-400">Starting point:</span> {t.startingPoint}
                    </div>
                    <div>
                      <span className="text-zinc-400">Engine:</span> {engineRuleLabel(t.engineRule)}
                    </div>
                    <div>
                      <span className="text-zinc-400">Owner:</span> {owner?.profile.name ?? owner?.email ?? 'Unknown'}
                    </div>
                    <div>
                      <span className="text-zinc-400">Group:</span> {group ? group.name : 'Standalone'}
                    </div>
                    <div>
                      <span className="text-zinc-400">Participants:</span> {t.participantIds?.length ?? 0}
                    </div>
                  </div>
                </GlowCard>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
