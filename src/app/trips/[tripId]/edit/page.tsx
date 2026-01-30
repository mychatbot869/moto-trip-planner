'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import GlowCard from '@/components/ui/GlowCard';
import GlowButton from '@/components/ui/GlowButton';
import { updateTrip, loadDB } from '@/lib/storage';
import type { EngineSizeRule } from '@/lib/models';

export default function EditTripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  return (
    <RequireAuth>
      <EditTripInner tripId={tripId} />
    </RequireAuth>
  );
}

function EditTripInner({ tripId }: { tripId: string }) {
  const router = useRouter();
  const db = loadDB();
  const me = db.session.currentUserId!;

  const trip = db.trips.find((t) => t.id === tripId);

  useEffect(() => {
    if (!trip) {
      router.push('/trips');
      return;
    }
    if (trip.ownerId !== me) {
      router.push(`/trips/${tripId}`);
    }
  }, [trip, me, router, tripId]);

  const myGroups = db.groups.filter((g) => g.memberIds.includes(me));

  const [title, setTitle] = useState(trip?.title || '');
  const [description, setDescription] = useState(trip?.description || '');
  const [startingPoint, setStartingPoint] = useState(trip?.startingPoint || '');
  const [startDateTime, setStartDateTime] = useState(
    trip ? new Date(trip.startDateTime).toISOString().slice(0, 16) : ''
  );
  const [engineRule, setEngineRule] = useState<EngineSizeRule>(trip?.engineRule || 'open');
  const [visibility, setVisibility] = useState<'public' | 'private'>(trip?.visibility || 'public');
  const [groupId, setGroupId] = useState<string>(trip?.groupId || '');

  if (!trip) return null;
  if (trip.ownerId !== me) return null;

  const handleSave = () => {
    if (!title.trim() || !startingPoint.trim()) return;
    const iso = new Date(startDateTime).toISOString();
    try {
      updateTrip(tripId, {
        title: title.trim(),
        description: description.trim(),
        startingPoint: startingPoint.trim(),
        startDateTime: iso,
        engineRule,
        visibility,
        groupId: groupId || undefined,
      });
      router.push(`/trips/${tripId}`);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update trip');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href={`/trips/${tripId}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to trip
      </Link>

      <div className="mx-auto max-w-xl">
        <GlowCard padding="lg">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">Edit Trip</h1>
              <p className="mt-1 text-sm text-zinc-500">Update your trip details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Trip Title</label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="Give your trip a name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description</label>
                <textarea
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                  rows={3}
                  placeholder="Describe your trip..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Meeting Point</label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="e.g. Gas station on Main St"
                  value={startingPoint}
                  onChange={(e) => setStartingPoint(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Engine Requirement</label>
                  <select
                    className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    value={engineRule}
                    onChange={(e) => setEngineRule(e.target.value as EngineSizeRule)}
                  >
                    <option value="open">Open to all</option>
                    <option value="small">Small bikes only (≤500cc)</option>
                    <option value="big">Big bikes only (≥700cc)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Visibility</label>
                  <select
                    className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                  >
                    <option value="public">🌐 Public</option>
                    <option value="private">🔒 Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Group (optional)</label>
                <select
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                >
                  <option value="">No group (standalone trip)</option>
                  {myGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                {myGroups.length === 0 && (
                  <p className="mt-1.5 text-xs text-zinc-600">
                    You&apos;re not in any groups yet. Create or join a group first.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/50">
              <GlowButton onClick={handleSave} disabled={!title.trim() || !startingPoint.trim()}>
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </GlowButton>
              <GlowButton variant="ghost" onClick={() => router.push(`/trips/${tripId}`)}>
                Cancel
              </GlowButton>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
