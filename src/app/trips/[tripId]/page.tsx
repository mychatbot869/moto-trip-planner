'use client';

import Link from 'next/link';
import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import RequireAuth from '@/components/RequireAuth';
import GlowCard from '@/components/ui/GlowCard';
import GlowButton from '@/components/ui/GlowButton';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import { engineRuleLabel, isTripCompatible } from '@/lib/compat';
import { deleteTrip, joinTrip, leaveTrip, loadDB } from '@/lib/storage';

export default function TripDetailPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  return (
    <RequireAuth>
      <TripDetailInner tripId={tripId} />
    </RequireAuth>
  );
}

function TripDetailInner({ tripId }: { tripId: string }) {
  const router = useRouter();
  const db = loadDB();
  const meId = db.session.currentUserId!;
  const me = useMemo(() => db.users.find((u) => u.id === meId)!, [db, meId]);

  const trip = db.trips.find((t) => t.id === tripId);
  if (!trip) {
    return (
      <div className="space-y-6">
        <GlowCard hover={false}>
          <EmptyState
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Trip not found"
            description="This trip may have been deleted or doesn't exist"
            action={
              <Link href="/trips">
                <GlowButton variant="secondary">Back to trips</GlowButton>
              </Link>
            }
          />
        </GlowCard>
      </div>
    );
  }

  const owner = db.users.find((u) => u.id === trip.ownerId);
  const group = trip.groupId ? db.groups.find((g) => g.id === trip.groupId) : null;
  const isOwner = trip.ownerId === meId;
  const joined = trip.participantIds.includes(meId);
  const compatible = isTripCompatible(trip.engineRule, me);
  const isUpcoming = new Date(trip.startDateTime) > new Date();

  const participants = trip.participantIds
    .map((id) => db.users.find((u) => u.id === id))
    .filter(Boolean);

  const handleDelete = () => {
    if (confirm('Delete this trip? This cannot be undone.')) {
      deleteTrip(trip.id);
      router.push('/trips');
      router.refresh();
    }
  };

  const handleJoin = () => {
    joinTrip(trip.id);
    router.refresh();
  };

  const handleLeave = () => {
    leaveTrip(trip.id);
    router.refresh();
  };

  const startDate = new Date(trip.startDateTime);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/trips"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to trips
      </Link>

      {/* Hero card */}
      <GlowCard padding="lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-zinc-100">{trip.title}</h1>
                <Badge variant={trip.visibility === 'public' ? 'success' : 'default'} size="md">
                  {trip.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
                </Badge>
                <Badge variant={isUpcoming ? 'info' : 'default'} size="md">
                  {isUpcoming ? '📅 Upcoming' : '✓ Past'}
                </Badge>
              </div>
              <p className="text-zinc-400 max-w-xl">{trip.description || 'No description provided'}</p>
            </div>

            {/* Compatibility badge */}
            {!compatible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-shrink-0"
              >
                <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-2">
                  <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm font-medium text-amber-400">Not compatible with your bikes</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Info grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              label="Date & Time"
              value={formattedDate}
              subValue={formattedTime}
            />
            <InfoCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              label="Meeting Point"
              value={trip.startingPoint}
            />
            <InfoCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              label="Engine Requirement"
              value={engineRuleLabel(trip.engineRule)}
            />
            <InfoCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              label="Participants"
              value={`${trip.participantIds.length} rider${trip.participantIds.length !== 1 ? 's' : ''}`}
            />
          </div>

          {/* Owner and group info */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-zinc-800/50">
            <div className="flex items-center gap-2">
              <Avatar name={owner?.profile.name || 'Unknown'} size="sm" />
              <div className="text-sm">
                <span className="text-zinc-500">Organized by </span>
                <span className="text-zinc-200 font-medium">{owner?.profile.name || 'Unknown'}</span>
              </div>
            </div>
            {group && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <Link href={`/groups/${group.id}`} className="text-orange-400 hover:text-orange-300 transition-colors">
                  {group.name}
                </Link>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800/50">
            {isOwner && (
              <>
                <Link href={`/trips/${trip.id}/edit`}>
                  <GlowButton variant="secondary">
                    <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Trip
                  </GlowButton>
                </Link>
                <GlowButton variant="danger" onClick={handleDelete}>
                  <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Trip
                </GlowButton>
              </>
            )}
            {!joined ? (
              <GlowButton onClick={handleJoin}>
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Join Trip
              </GlowButton>
            ) : !isOwner && (
              <GlowButton variant="secondary" onClick={handleLeave}>
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Leave Trip
              </GlowButton>
            )}
          </div>
        </div>
      </GlowCard>

      {/* Participants section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-zinc-200">Participants</h2>
          <Badge variant="orange">{participants.length}</Badge>
        </div>

        {participants.length === 0 ? (
          <GlowCard hover={false} glow={false}>
            <EmptyState
              icon={
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="No participants yet"
              description="Be the first to join this trip!"
              action={
                !joined && (
                  <GlowButton size="sm" onClick={handleJoin}>
                    Join Trip
                  </GlowButton>
                )
              }
            />
          </GlowCard>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {participants.map((user, i) => {
                const isParticipantOwner = user!.id === trip.ownerId;
                const userBikes = user!.profile.motorcycles;

                return (
                  <motion.div
                    key={user!.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <GlowCard glow={false}>
                      <div className="flex items-start gap-3">
                        <Avatar name={user!.profile.name || user!.email} size="lg" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-200 truncate">
                              {user!.profile.name || user!.email.split('@')[0]}
                            </span>
                            {isParticipantOwner && (
                              <Badge variant="orange" size="sm">Organizer</Badge>
                            )}
                          </div>
                          <p className="text-sm text-zinc-500 truncate mt-0.5">
                            {user!.profile.bio || user!.email}
                          </p>
                          {userBikes.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {userBikes.slice(0, 2).map((bike) => (
                                <span key={bike.id} className="text-xs text-zinc-600">
                                  {bike.brand} {bike.model}
                                </span>
                              ))}
                              {userBikes.length > 2 && (
                                <span className="text-xs text-zinc-600">+{userBikes.length - 2} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-zinc-800/30 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 text-orange-400">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-zinc-500 uppercase tracking-wide">{label}</div>
        <div className="font-medium text-zinc-200 truncate">{value}</div>
        {subValue && <div className="text-sm text-zinc-400">{subValue}</div>}
      </div>
    </div>
  );
}
