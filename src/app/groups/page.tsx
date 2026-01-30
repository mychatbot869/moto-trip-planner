'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RequireAuth from '@/components/RequireAuth';
import GlowCard from '@/components/ui/GlowCard';
import GlowButton from '@/components/ui/GlowButton';
import Badge from '@/components/ui/Badge';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';
import Avatar from '@/components/ui/Avatar';
import { joinGroup, loadDB } from '@/lib/storage';
import type { Group } from '@/lib/models';

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
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'public'>('all');

  const myGroups = useMemo(
    () => db.groups.filter((g) => g.memberIds.includes(me)),
    [db.groups, me]
  );

  const publicGroups = useMemo(
    () => db.groups.filter((g) => !g.memberIds.includes(me) && g.visibility === 'public'),
    [db.groups, me]
  );

  const filteredMyGroups = useMemo(() => {
    return myGroups.filter((g) => {
      if (search && !g.name.toLowerCase().includes(search.toLowerCase()) &&
          !g.description.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [myGroups, search]);

  const filteredPublicGroups = useMemo(() => {
    return publicGroups.filter((g) => {
      if (search && !g.name.toLowerCase().includes(search.toLowerCase()) &&
          !g.description.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [publicGroups, search]);

  const displayMyGroups = filter === 'public' ? [] : filteredMyGroups;
  const displayPublicGroups = filter === 'mine' ? [] : filteredPublicGroups;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Groups</h1>
          <p className="mt-1 text-sm text-zinc-500">Join riding groups or create your own</p>
        </div>
        <Link href="/groups/new">
          <GlowButton>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Group
          </GlowButton>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search groups..."
          className="flex-1 sm:max-w-xs"
        />
        <div className="flex gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterButton>
          <FilterButton active={filter === 'mine'} onClick={() => setFilter('mine')}>
            My Groups ({myGroups.length})
          </FilterButton>
          <FilterButton active={filter === 'public'} onClick={() => setFilter('public')}>
            Discover ({publicGroups.length})
          </FilterButton>
        </div>
      </div>

      {/* My Groups Section */}
      {filter !== 'public' && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-zinc-200">Your Groups</h2>
            <Badge variant="orange">{filteredMyGroups.length}</Badge>
          </div>

          {displayMyGroups.length === 0 ? (
            <GlowCard hover={false} glow={false}>
              <EmptyState
                icon={
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                title={search ? 'No groups match your search' : "You haven't joined any groups yet"}
                description={search ? 'Try a different search term' : 'Create your own group or join a public one below'}
                action={
                  !search && (
                    <Link href="/groups/new">
                      <GlowButton size="sm">Create your first group</GlowButton>
                    </Link>
                  )
                }
              />
            </GlowCard>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {displayMyGroups.map((group, i) => (
                  <GroupCard key={group.id} group={group} db={db} me={me} index={i} isMember />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      )}

      {/* Public Groups Section */}
      {filter !== 'mine' && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-zinc-200">Discover Public Groups</h2>
            <Badge variant="info">{filteredPublicGroups.length}</Badge>
          </div>

          {displayPublicGroups.length === 0 ? (
            <GlowCard hover={false} glow={false}>
              <EmptyState
                icon={
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                title={search ? 'No public groups match your search' : 'No public groups available'}
                description={search ? 'Try a different search term' : 'Check back later or create your own!'}
              />
            </GlowCard>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {displayPublicGroups.map((group, i) => (
                  <GroupCard key={group.id} group={group} db={db} me={me} index={i} isMember={false} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function GroupCard({
  group,
  db,
  me,
  index,
  isMember,
}: {
  group: Group;
  db: ReturnType<typeof loadDB>;
  me: string;
  index: number;
  isMember: boolean;
}) {
  const owner = db.users.find((u) => u.id === group.ownerId);
  const isOwner = group.ownerId === me;
  const tripCount = db.trips.filter((t) => t.groupId === group.id).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlowCard className="h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Link
                href={`/groups/${group.id}`}
                className="block text-lg font-semibold text-zinc-100 hover:text-orange-400 transition-colors truncate"
              >
                {group.name}
              </Link>
              <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                {group.description || 'No description'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant={group.visibility === 'public' ? 'success' : 'default'}>
                {group.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
              </Badge>
              {isOwner && <Badge variant="orange">Owner</Badge>}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>{group.memberIds.length} {group.memberIds.length === 1 ? 'member' : 'members'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>{tripCount} {tripCount === 1 ? 'trip' : 'trips'}</span>
            </div>
          </div>

          {/* Owner info */}
          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
            <Avatar name={owner?.profile.name || 'Unknown'} size="sm" />
            <span>Created by {owner?.profile.name || 'Unknown'}</span>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2 pt-3 border-t border-zinc-800/50">
            <Link href={`/groups/${group.id}`} className="flex-1">
              <GlowButton variant="secondary" size="sm" className="w-full">
                View
              </GlowButton>
            </Link>
            {!isMember && (
              <GlowButton
                size="sm"
                onClick={() => joinGroup(group.id)}
              >
                Join
              </GlowButton>
            )}
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200
        ${active
          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent'
        }
      `}
    >
      {children}
    </button>
  );
}
