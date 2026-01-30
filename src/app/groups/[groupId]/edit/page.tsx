'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import { updateGroup, loadDB } from '@/lib/storage';

export default function EditGroupPage({ params }: { params: { groupId: string } }) {
  return (
    <RequireAuth>
      <EditGroupInner groupId={params.groupId} />
    </RequireAuth>
  );
}

function EditGroupInner({ groupId }: { groupId: string }) {
  const router = useRouter();
  const db = loadDB();
  const me = db.session.currentUserId!;

  const group = db.groups.find((g) => g.id === groupId);

  useEffect(() => {
    if (!group) {
      router.push('/groups');
      return;
    }
    if (group.ownerId !== me) {
      router.push(`/groups/${groupId}`);
    }
  }, [group, me, router, groupId]);

  const [name, setName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');
  const [visibility, setVisibility] = useState<'public' | 'private'>(group?.visibility || 'public');

  if (!group) return null;
  if (group.ownerId !== me) return null;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Edit group</h1>

      <div className="rounded border p-4 space-y-3">
        <label className="block">
          <div className="text-sm font-medium">Name</div>
          <input className="mt-1 w-full rounded border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Description</div>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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

        <div className="flex gap-2">
          <button
            className="rounded bg-zinc-900 px-3 py-2 text-sm text-white"
            onClick={() => {
              if (!name.trim()) return;
              try {
                updateGroup(groupId, {
                  name: name.trim(),
                  description: description.trim(),
                  visibility,
                });
                router.push(`/groups/${groupId}`);
                router.refresh();
              } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to update group');
              }
            }}
          >
            Save changes
          </button>
          <button
            className="rounded border px-3 py-2 text-sm"
            onClick={() => router.push(`/groups/${groupId}`)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
