'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import { engineRuleLabel } from '@/lib/compat';
import { deleteGroup, joinGroup, leaveGroup, loadDB } from '@/lib/storage';

export default function GroupDetailPage({ params }: { params: { groupId: string } }) {
  return (
    <RequireAuth>
      <GroupDetailInner groupId={params.groupId} />
    </RequireAuth>
  );
}

function GroupDetailInner({ groupId }: { groupId: string }) {
  const router = useRouter();
  const db = loadDB();
  const me = db.session.currentUserId!;

  const group = db.groups.find((g) => g.id === groupId);
  if (!group) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-zinc-700">Group not found.</div>
        <Link className="text-sm underline" href="/groups">
          Back to groups
        </Link>
      </div>
    );
  }

  const isMember = group.memberIds.includes(me);
  const trips = db.trips.filter((t) => t.groupId === group.id && (t.visibility === 'public' || t.ownerId === me));

  const canView = group.visibility === 'public' || isMember || group.ownerId === me;
  if (!canView) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{group.name}</h1>
        <div className="rounded border bg-zinc-50 p-4 text-sm text-zinc-700">Private group.</div>
        <Link className="text-sm underline" href="/groups">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{group.name}</h1>
          <div className="text-sm text-zinc-700">{group.description || 'No description'}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-600">{group.visibility}</div>
          <div className="mt-1 text-xs text-zinc-600">Members: {group.memberIds.length}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.ownerId === me && (
          <>
            <Link className="rounded bg-zinc-900 px-3 py-2 text-sm text-white" href={`/groups/${group.id}/edit`}>
              Edit
            </Link>
            <button
              className="rounded border border-red-600 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                if (confirm('Delete this group? All trips will be unlinked from it.')) {
                  deleteGroup(group.id);
                  router.push('/groups');
                  router.refresh();
                }
              }}
            >
              Delete
            </button>
          </>
        )}
        {isMember && group.ownerId !== me && (
          <button
            className="rounded border px-3 py-2 text-sm hover:bg-zinc-50"
            onClick={() => {
              try {
                leaveGroup(group.id);
                router.push('/groups');
                router.refresh();
              } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to leave');
              }
            }}
          >
            Leave group
          </button>
        )}
        {!isMember && group.visibility === 'public' && (
          <button className="rounded bg-zinc-900 px-3 py-2 text-sm text-white" onClick={() => joinGroup(group.id)}>
            Join group
          </button>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Trips in this group</h2>
        {trips.length === 0 ? (
          <div className="rounded border bg-zinc-50 p-4 text-sm text-zinc-700">No trips in this group yet.</div>
        ) : (
          <ul className="space-y-2">
            {trips.map((t) => (
              <li key={t.id} className="rounded border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{t.title}</div>
                    <div className="text-sm text-zinc-700">{t.description || 'No description'}</div>
                  </div>
                  <div className="text-xs text-zinc-600">{t.visibility}</div>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                  <div>
                    <span className="font-medium">Start:</span> {new Date(t.startDateTime).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Starting point:</span> {t.startingPoint}
                  </div>
                  <div>
                    <span className="font-medium">Engine:</span> {engineRuleLabel(t.engineRule)}
                  </div>
                  <div>
                    <span className="font-medium">Participants:</span> {t.participantIds?.length ?? 0}
                  </div>
                </div>

                <div className="mt-4">
                  <Link className="rounded border px-3 py-2 text-sm hover:bg-zinc-50" href={`/trips/${t.id}`}>
                    View trip
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link className="text-sm underline" href="/groups">
        Back to groups
      </Link>
    </div>
  );
}
