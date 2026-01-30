'use client';

import Link from 'next/link';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import RequireAuth from '@/components/RequireAuth';
import GlowCard from '@/components/ui/GlowCard';
import GlowButton from '@/components/ui/GlowButton';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import { engineRuleLabel } from '@/lib/compat';
import { deleteGroup, joinGroup, leaveGroup, loadDB } from '@/lib/storage';

export default function GroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params);
  return (
    <RequireAuth>
      <GroupDetailInner groupId={groupId} />
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
      <div className="space-y-6">
        <GlowCard hover={false}>
          <EmptyState
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Group not found"
            description="This group may have been deleted or doesn't exist"
            action={
              <Link href="/groups">
                <GlowButton variant="secondary">Back to groups</GlowButton>
              </Link>
            }
          />
        </GlowCard>
      </div>
    );
  }

  const owner = db.users.find((u) => u.id === group.ownerId);
  const isMember = group.memberIds.includes(me);
  const isOwner = group.ownerId === me;
  const trips = db.trips.filter((t) => t.groupId === group.id && (t.visibility === 'public' || t.ownerId === me || isMember));
  const members = group.memberIds.map((id) => db.users.find((u) => u.id === id)).filter(Boolean);

  const canView = group.visibility === 'public' || isMember || isOwner;
  if (!canView) {
    return (
      <div className="space-y-6">
        <GlowCard hover={false}>
          <EmptyState
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="Private Group"
            description="This group is private. You need an invitation to view it."
            action={
              <Link href="/groups">
                <GlowButton variant="secondary">Back to groups</GlowButton>
              </Link>
            }
          />
        </GlowCard>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this group? All trips will be unlinked from it.')) {
      deleteGroup(group.id);
      router.push('/groups');
      router.refresh();
    }
  };

  const handleLeave = () => {
    try {
      leaveGroup(group.id);
      router.push('/groups');
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to leave');
    }
  };

  const handleJoin = () => {
    joinGroup(group.id);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/groups"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to groups
      </Link>

      {/* Header card */}
      <GlowCard padding="lg">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-100">{group.name}</h1>
              <Badge variant={group.visibility === 'public' ? 'success' : 'default'} size="md">
                {group.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
              </Badge>
            </div>
            <p className="text-zinc-400 max-w-xl">{group.description || 'No description provided'}</p>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{group.memberIds.length} members</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>{trips.length} trips</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Avatar name={owner?.profile.name || 'Unknown'} size="sm" />
                <span>by {owner?.profile.name || 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {isOwner && (
              <>
                <Link href={`/groups/${group.id}/edit`}>
                  <GlowButton variant="secondary" size="sm">
                    <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </GlowButton>
                </Link>
                <GlowButton variant="danger" size="sm" onClick={handleDelete}>
                  <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </GlowButton>
              </>
            )}
            {isMember && !isOwner && (
              <GlowButton variant="secondary" size="sm" onClick={handleLeave}>
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Leave group
              </GlowButton>
            )}
            {!isMember && group.visibility === 'public' && (
              <GlowButton size="sm" onClick={handleJoin}>
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Join group
              </GlowButton>
            )}
          </div>
        </div>
      </GlowCard>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trips - takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-200">Group Trips</h2>
            {isMember && (
              <Link href="/trips/new">
                <GlowButton size="sm" variant="secondary">
                  <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New trip
                </GlowButton>
              </Link>
            )}
          </div>

          {trips.length === 0 ? (
            <GlowCard hover={false} glow={false}>
              <EmptyState
                icon={
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                }
                title="No trips yet"
                description="This group doesn't have any trips scheduled"
                action={
                  isMember && (
                    <Link href="/trips/new">
                      <GlowButton size="sm">Create first trip</GlowButton>
                    </Link>
                  )
                }
              />
            </GlowCard>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {trips.map((trip, i) => {
                  const isUpcoming = new Date(trip.startDateTime) > new Date();

                  return (
                    <motion.div
                      key={trip.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlowCard>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/trips/${trip.id}`}
                                className="text-lg font-semibold text-zinc-100 hover:text-orange-400 transition-colors"
                              >
                                {trip.title}
                              </Link>
                              <Badge variant={isUpcoming ? 'success' : 'default'}>
                                {isUpcoming ? 'Upcoming' : 'Past'}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-500 line-clamp-1">
                              {trip.description || 'No description'}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                              <span>📅 {new Date(trip.startDateTime).toLocaleDateString()}</span>
                              <span>📍 {trip.startingPoint}</span>
                              <span>🏍️ {engineRuleLabel(trip.engineRule)}</span>
                              <span>👥 {trip.participantIds.length}</span>
                            </div>
                          </div>
                          <Link href={`/trips/${trip.id}`}>
                            <GlowButton variant="secondary" size="sm">
                              View
                            </GlowButton>
                          </Link>
                        </div>
                      </GlowCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Members sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-200">Members</h2>
          <GlowCard glow={false}>
            <div className="space-y-3">
              {members.map((member) => {
                const memberIsOwner = member!.id === group.ownerId;
                return (
                  <div
                    key={member!.id}
                    className="flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-zinc-800/30 transition-colors"
                  >
                    <Avatar name={member!.profile.name || member!.email} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-200 truncate">
                          {member!.profile.name || member!.email.split('@')[0]}
                        </span>
                        {memberIsOwner && (
                          <Badge variant="orange" size="sm">Owner</Badge>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 truncate">
                        {member!.profile.bio || member!.email}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
