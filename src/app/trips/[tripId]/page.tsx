'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import { engineRuleLabel, isTripCompatible } from '@/lib/compat';
import { deleteTrip, joinTrip, leaveTrip, loadDB } from '@/lib/storage';

export default function TripDetailPage({ params }: { params: { tripId: string } }) {
  return (
    <RequireAuth>
      <TripDetailInner tripId={params.tripId} />
    </RequireAuth>
  );
}

function TripDetailInner({ tripId }: { tripId: string }) {
  const router = useRouter();
  const db = loadDB();
  const meId = db.session.currentUserId!;
  const me = useMemo(() => db.users.find((u) => u.id === meId)!, [db, meId]);

  const trip = db.trips.find((t) => t.id === tripId);
  if (!trip) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-zinc-700">Trip not found.</div>
        <Link className="text-sm underline" href="/trips">
          Back to trips
        </Link>
      </div>
    );
  }

  const owner = db.users.find((u) => u.id === trip.ownerId);
  const group = trip.groupId ? db.groups.find((g) => g.id === trip.groupId) : null;
  const joined = trip.participantIds.includes(meId);
  const compatible = isTripCompatible(trip.engineRule, me);

  const participants = trip.participantIds
    .map((id) => db.users.find((u) => u.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{trip.title}</h1>
          <div className="text-sm text-zinc-700">{trip.description || 'No description'}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-600">{trip.visibility}</div>
          {!compatible ? (
            <div className="mt-2 inline-flex rounded bg-amber-100 px-2 py-1 text-xs text-amber-900">
              Not compatible with your bikes
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded border p-4">
        <div className="grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
          <div>
            <span className="font-medium">Start:</span> {new Date(trip.startDateTime).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Starting point:</span> {trip.startingPoint}
          </div>
          <div>
            <span className="font-medium">Engine:</span> {engineRuleLabel(trip.engineRule)}
          </div>
          <div>
            <span className="font-medium">Owner:</span> {owner?.profile.name ?? owner?.email ?? 'Unknown'}
          </div>
          <div>
            <span className="font-medium">Group:</span>{' '}
            {group ? (
              <Link className="underline" href={`/groups/${group.id}`}>
                {group.name}
              </Link>
            ) : (
              'Standalone'
            )}
          </div>
          <div>
            <span className="font-medium">Participants:</span> {trip.participantIds.length}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {trip.ownerId === meId && (
            <>
              <Link className="rounded bg-zinc-900 px-3 py-2 text-sm text-white" href={`/trips/${trip.id}/edit`}>
                Edit
              </Link>
              <button
                className="rounded border border-red-600 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  if (confirm('Delete this trip? This cannot be undone.')) {
                    deleteTrip(trip.id);
                    router.push('/trips');
                    router.refresh();
                  }
                }}
              >
                Delete
              </button>
            </>
          )}
          {!joined ? (
            <button className="rounded bg-zinc-900 px-3 py-2 text-sm text-white" onClick={() => joinTrip(trip.id)}>
              Join trip
            </button>
          ) : trip.ownerId !== meId && (
            <button className="rounded border px-3 py-2 text-sm" onClick={() => leaveTrip(trip.id)}>
              Leave trip
            </button>
          )}
          <Link className="rounded border px-3 py-2 text-sm" href="/trips">
            Back
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Participants</h2>
        {participants.length === 0 ? (
          <div className="text-sm text-zinc-700">No one has joined yet.</div>
        ) : (
          <ul className="space-y-2">
            {participants.map((u) => (
              <li key={u!.id} className="rounded border px-3 py-2">
                <div className="font-medium">{u!.profile.name}</div>
                <div className="text-sm text-zinc-700">{u!.profile.bio || u!.email}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
