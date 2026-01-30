'use client';

import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import { joinGroup, loadDB } from '@/lib/storage';

export default function GroupsPage() {
  return (
    <RequireAuth>
      <GroupsInner />
    </RequireAuth>
  );
}

function GroupsInner() {
  const db = loadDB();
  const me = db.session.currentUserId!;

  const myGroups = db.groups.filter((g) => g.memberIds.includes(me));
  const otherPublic = db.groups.filter((g) => !g.memberIds.includes(me) && g.visibility === 'public');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Groups</h1>
        <Link className="rounded bg-zinc-900 px-3 py-2 text-sm text-white" href="/groups/new">
          Create group
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your groups</h2>
        {myGroups.length === 0 ? (
          <p className="text-sm text-zinc-700">You haven&apos;t joined any groups yet.</p>
        ) : (
          <ul className="space-y-2">
            {myGroups.map((g) => (
              <li key={g.id} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Link className="font-medium underline" href={`/groups/${g.id}`}>
                      {g.name}
                    </Link>
                    <div className="text-sm text-zinc-700">{g.description || 'No description'}</div>
                  </div>
                  <div className="text-xs text-zinc-600">{g.visibility}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Public groups</h2>
        {otherPublic.length === 0 ? (
          <p className="text-sm text-zinc-700">No public groups to join right now.</p>
        ) : (
          <ul className="space-y-2">
            {otherPublic.map((g) => (
              <li key={g.id} className="rounded border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{g.name}</div>
                    <div className="text-sm text-zinc-700">{g.description || 'No description'}</div>
                  </div>
                  <button
                    className="shrink-0 rounded border px-3 py-2 text-sm hover:bg-zinc-50"
                    onClick={() => joinGroup(g.id)}
                  >
                    Join
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
