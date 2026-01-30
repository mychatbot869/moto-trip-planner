'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import { updateTrip, loadDB } from '@/lib/storage';
import type { EngineSizeRule } from '@/lib/models';

export default function EditTripPage({ params }: { params: { tripId: string } }) {
  return (
    <RequireAuth>
      <EditTripInner tripId={params.tripId} />
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

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Edit trip</h1>

      <div className="rounded border p-4 space-y-3">
        <label className="block">
          <div className="text-sm font-medium">Title</div>
          <input className="mt-1 w-full rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Description</div>
          <textarea className="mt-1 w-full rounded border px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Starting point (location name)</div>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={startingPoint}
            onChange={(e) => setStartingPoint(e.target.value)}
            placeholder="e.g. Centro, Mérida"
          />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Start date & time</div>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium">Allowed engine size</div>
            <select
              className="mt-1 w-full rounded border px-3 py-2"
              value={engineRule}
              onChange={(e) => setEngineRule(e.target.value as EngineSizeRule)}
            >
              <option value="open">Open to all</option>
              <option value="small">Small bikes only</option>
              <option value="big">Big bikes only</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm font-medium">Visibility</div>
            <select
              className="mt-1 w-full rounded border px-3 py-2"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>

        <label className="block">
          <div className="text-sm font-medium">Group (optional)</div>
          <select className="mt-1 w-full rounded border px-3 py-2" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            <option value="">Standalone</option>
            {myGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          {myGroups.length === 0 ? <div className="mt-1 text-xs text-zinc-600">You&apos;re not in any groups yet.</div> : null}
        </label>

        <div className="flex gap-2">
          <button
            className="rounded bg-zinc-900 px-3 py-2 text-sm text-white"
            onClick={() => {
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
            }}
          >
            Save changes
          </button>
          <button
            className="rounded border px-3 py-2 text-sm"
            onClick={() => router.push(`/trips/${tripId}`)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
