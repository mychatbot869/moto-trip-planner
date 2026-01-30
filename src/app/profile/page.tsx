'use client';

import { useMemo, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import { addMotorcycle, loadDB, removeMotorcycle, updateProfile } from '@/lib/storage';

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileInner />
    </RequireAuth>
  );
}

function ProfileInner() {
  const db = loadDB();
  const user = useMemo(() => db.users.find((u) => u.id === db.session.currentUserId)!, [db]);

  const [name, setName] = useState(user.profile.name);
  const [bio, setBio] = useState(user.profile.bio);

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [engineCc, setEngineCc] = useState<number>(650);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="rounded border p-4 space-y-3">
        <div className="text-sm text-zinc-700">Signed in as: {user.email}</div>
        <label className="block">
          <div className="text-sm font-medium">Name</div>
          <input className="mt-1 w-full rounded border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Bio</div>
          <textarea className="mt-1 w-full rounded border px-3 py-2" value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <button
          className="rounded bg-zinc-900 px-3 py-2 text-sm text-white"
          onClick={() => updateProfile({ name, bio })}
        >
          Save profile
        </button>
      </div>

      <div className="rounded border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Motorcycles</h2>
          <span className="text-sm text-zinc-600">{user.profile.motorcycles.length} saved</span>
        </div>

        {user.profile.motorcycles.length === 0 ? (
          <div className="text-sm text-zinc-700">No bikes yet. Add one below.</div>
        ) : (
          <ul className="space-y-2">
            {user.profile.motorcycles.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded border px-3 py-2">
                <div>
                  <div className="font-medium">
                    {m.year} {m.brand} {m.model}
                  </div>
                  <div className="text-sm text-zinc-700">{m.engineCc} cc</div>
                </div>
                <button className="text-sm text-red-600" onClick={() => removeMotorcycle(m.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t pt-4">
          <h3 className="font-medium">Add motorcycle</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-4">
            <input className="rounded border px-3 py-2" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            <input className="rounded border px-3 py-2" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
            <input
              className="rounded border px-3 py-2"
              placeholder="Year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
            <input
              className="rounded border px-3 py-2"
              placeholder="Engine (cc)"
              type="number"
              value={engineCc}
              onChange={(e) => setEngineCc(Number(e.target.value))}
            />
          </div>
          <button
            className="mt-3 rounded bg-zinc-900 px-3 py-2 text-sm text-white"
            onClick={() => {
              if (!brand.trim() || !model.trim()) return;
              addMotorcycle({ brand: brand.trim(), model: model.trim(), year, engineCc });
              setBrand('');
              setModel('');
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
