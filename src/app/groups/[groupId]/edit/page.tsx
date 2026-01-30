'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import GlowCard from '@/components/ui/GlowCard';
import GlowButton from '@/components/ui/GlowButton';
import { updateGroup, loadDB } from '@/lib/storage';

export default function EditGroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params);
  return (
    <RequireAuth>
      <EditGroupInner groupId={groupId} />
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

  const handleSave = () => {
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
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href={`/groups/${groupId}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to group
      </Link>

      <div className="mx-auto max-w-xl">
        <GlowCard padding="lg">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">Edit Group</h1>
              <p className="mt-1 text-sm text-zinc-500">Update your group details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Group Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="Enter group name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description</label>
                <textarea
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                  rows={3}
                  placeholder="Describe your group..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Visibility</label>
                <select
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                >
                  <option value="public">🌐 Public - Anyone can find and join</option>
                  <option value="private">🔒 Private - Invite only</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/50">
              <GlowButton onClick={handleSave} disabled={!name.trim()}>
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </GlowButton>
              <GlowButton variant="ghost" onClick={() => router.push(`/groups/${groupId}`)}>
                Cancel
              </GlowButton>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
