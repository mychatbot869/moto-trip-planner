'use client';

import type { EngineSizeRule, Trip, User } from '@/lib/models';

export function isTripCompatible(rule: EngineSizeRule, user: User): boolean {
  const bikes = user.profile.motorcycles;
  if (rule === 'open') return true;
  if (rule === 'small') return bikes.some((b) => b.engineCc <= 500);
  if (rule === 'big') return bikes.some((b) => b.engineCc >= 700);
  return true;
}

export function engineRuleLabel(rule: EngineSizeRule): string {
  switch (rule) {
    case 'open':
      return 'Open to all';
    case 'small':
      return 'Small bikes only';
    case 'big':
      return 'Big bikes only';
    default:
      return rule;
  }
}

export function canSeeTrip(trip: Trip, meId: string | null): boolean {
  if (trip.visibility === 'public') return true;
  return Boolean(meId && trip.ownerId === meId);
}
