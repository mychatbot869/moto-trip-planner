'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RequireAuth from '@/components/RequireAuth';
import GlowCard from '@/components/ui/GlowCard';
import GlowButton from '@/components/ui/GlowButton';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
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
  const [saved, setSaved] = useState(false);

  // Quick add motorcycle state
  const [showAddForm, setShowAddForm] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [engineCc, setEngineCc] = useState<number>(650);

  const handleSaveProfile = () => {
    updateProfile({ name, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddMotorcycle = () => {
    if (!brand.trim() || !model.trim()) return;
    addMotorcycle({ brand: brand.trim(), model: model.trim(), year, engineCc });
    setBrand('');
    setModel('');
    setYear(new Date().getFullYear());
    setEngineCc(650);
    setShowAddForm(false);
  };

  const handleRemoveMotorcycle = (motoId: string) => {
    if (confirm('Remove this motorcycle from your garage?')) {
      removeMotorcycle(motoId);
    }
  };

  // Popular motorcycle presets for quick add
  const presets = [
    { brand: 'Yamaha', model: 'MT-07', year: 2024, engineCc: 689 },
    { brand: 'Honda', model: 'CB650R', year: 2024, engineCc: 649 },
    { brand: 'Kawasaki', model: 'Z650', year: 2024, engineCc: 649 },
    { brand: 'Ducati', model: 'Monster', year: 2024, engineCc: 937 },
    { brand: 'BMW', model: 'F 900 R', year: 2024, engineCc: 895 },
    { brand: 'Triumph', model: 'Street Triple', year: 2024, engineCc: 765 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar name={user.profile.name || user.email} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">{user.profile.name || 'Rider'}</h1>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Info Card */}
        <GlowCard padding="lg">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-200">Profile Information</h2>
              <Badge variant="success" size="sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                Signed in
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Display Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Bio</label>
                <textarea
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                  rows={3}
                  placeholder="Tell others about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <GlowButton onClick={handleSaveProfile}>
                  <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </GlowButton>
                <AnimatePresence>
                  {saved && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-emerald-400"
                    >
                      Saved!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Stats Card */}
        <GlowCard padding="lg">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-zinc-200">Your Stats</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-zinc-800/30 p-4 text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {user.profile.motorcycles.length}
                </div>
                <div className="text-sm text-zinc-500 mt-1">Motorcycles</div>
              </div>
              <div className="rounded-xl bg-zinc-800/30 p-4 text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {db.trips.filter((t) => t.participantIds.includes(user.id)).length}
                </div>
                <div className="text-sm text-zinc-500 mt-1">Trips Joined</div>
              </div>
              <div className="rounded-xl bg-zinc-800/30 p-4 text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {db.groups.filter((g) => g.memberIds.includes(user.id)).length}
                </div>
                <div className="text-sm text-zinc-500 mt-1">Groups</div>
              </div>
              <div className="rounded-xl bg-zinc-800/30 p-4 text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {db.trips.filter((t) => t.ownerId === user.id).length}
                </div>
                <div className="text-sm text-zinc-500 mt-1">Trips Created</div>
              </div>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Motorcycles Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-zinc-200">My Garage</h2>
            <Badge variant="orange">{user.profile.motorcycles.length}</Badge>
          </div>
          <GlowButton
            size="sm"
            variant={showAddForm ? 'secondary' : 'primary'}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? (
              <>
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Motorcycle
              </>
            )}
          </GlowButton>
        </div>

        {/* Add motorcycle form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <GlowCard padding="lg">
                <div className="space-y-4">
                  <h3 className="font-medium text-zinc-200">Add a new motorcycle</h3>

                  {/* Quick presets */}
                  <div className="space-y-2">
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">Quick Add</div>
                    <div className="flex flex-wrap gap-2">
                      {presets.map((preset) => (
                        <button
                          key={`${preset.brand}-${preset.model}`}
                          onClick={() => {
                            setBrand(preset.brand);
                            setModel(preset.model);
                            setYear(preset.year);
                            setEngineCc(preset.engineCc);
                          }}
                          className="rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200 transition-colors border border-transparent hover:border-zinc-700"
                        >
                          {preset.brand} {preset.model}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Brand</label>
                      <input
                        type="text"
                        className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="e.g. Honda"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Model</label>
                      <input
                        type="text"
                        className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="e.g. CB650R"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Year</label>
                      <input
                        type="number"
                        className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Engine (cc)</label>
                      <input
                        type="number"
                        className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        value={engineCc}
                        onChange={(e) => setEngineCc(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <GlowButton
                      onClick={handleAddMotorcycle}
                      disabled={!brand.trim() || !model.trim()}
                    >
                      <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Add to Garage
                    </GlowButton>
                    <span className="text-xs text-zinc-500">
                      {!brand.trim() || !model.trim() ? 'Brand and model required' : `${engineCc}cc ${brand} ${model}`}
                    </span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Motorcycles list */}
        {user.profile.motorcycles.length === 0 ? (
          <GlowCard hover={false} glow={false}>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50 text-zinc-500">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-zinc-200">No motorcycles yet</h3>
              <p className="mt-1 text-sm text-zinc-500 max-w-sm">
                Add your motorcycles to see trip compatibility and let others know what you ride.
              </p>
              {!showAddForm && (
                <div className="mt-4">
                  <GlowButton size="sm" onClick={() => setShowAddForm(true)}>
                    Add your first bike
                  </GlowButton>
                </div>
              )}
            </div>
          </GlowCard>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {user.profile.motorcycles.map((moto, i) => (
                <motion.div
                  key={moto.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlowCard>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="font-semibold text-zinc-100">
                          {moto.year} {moto.brand} {moto.model}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={moto.engineCc >= 700 ? 'orange' : moto.engineCc <= 500 ? 'info' : 'default'}
                            size="sm"
                          >
                            {moto.engineCc} cc
                          </Badge>
                          <span className="text-xs text-zinc-600">
                            {moto.engineCc >= 700 ? 'Big bike' : moto.engineCc <= 500 ? 'Small bike' : 'Mid-size'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMotorcycle(moto.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        title="Remove motorcycle"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
