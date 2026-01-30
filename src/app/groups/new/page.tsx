'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import { createGroup } from '@/lib/storage';

export default function NewGroupPage() {
  return (
    <RequireAuth>
      <NewGroupInner />
    </RequireAuth>
  );
}

function NewGroupInner() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Create group</h1>

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

        <button
          className="rounded bg-zinc-900 px-3 py-2 text-sm text-white"
          onClick={() => {
            if (!name.trim()) return;
            createGroup({ name: name.trim(), description: description.trim(), visibility });
            router.push('/groups');
            router.refresh();
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}
