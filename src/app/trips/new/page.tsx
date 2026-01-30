'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import { createTrip, loadDB } from '@/lib/storage';
import type { EngineSizeRule } from '@/lib/models';

export default function NewTripPage() {
  return (
    <RequireAuth>
      <NewTripInner />
    </RequireAuth>
  );
}

function NewTripInner() {
  const router = useRouter();
  const db = loadDB();
  const me = db.session.currentUserId!;

  const myGroups = useMemo(() => db.groups.filter((g) => g.memberIds.includes(me)), [db, me]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPoint, setStartingPoint] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [engineRule, setEngineRule] = useState<EngineSizeRule>('open');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [groupId, setGroupId] = useState<string>('');

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Create trip</h1>

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

        <button
          className="rounded bg-zinc-900 px-3 py-2 text-sm text-white"
          onClick={() => {
            if (!title.trim() || !startingPoint.trim()) return;
            const iso = new Date(startDateTime).toISOString();
            createTrip({
              title: title.trim(),
              description: description.trim(),
              startingPoint: startingPoint.trim(),
              startDateTime: iso,
              engineRule,
              visibility,
              groupId: groupId || undefined,
            });
            router.push('/trips');
            router.refresh();
          }}
        >
          Create trip
        </button>
      </div>

      <p className="text-sm text-zinc-600">
        Note: this is local-only storage. In a real app we&apos;d validate + store on a server.
      </p>
    </div>
  );
}
