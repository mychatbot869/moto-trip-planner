'use client';

import type { DB, Group, Trip, User } from '@/lib/models';

const STORAGE_KEY = 'motoTripPlanner.db';

// ---- Dev toggles ----
// If true, auth becomes "lenient": any email/password lets you sign in (dev-only).
// This seeds demo data but does NOT force you to stay logged in (logout should work).
export const DEV_BYPASS_AUTH = true;

function nowIso() {
  return new Date().toISOString();
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function loadDB(): DB {
  if (typeof window === 'undefined') {
    // Should never happen in client-only usage, but keep it safe.
    return emptyDB();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const db = seedDB();
    saveDB(db);
    return db;
  }

  try {
    const parsed = JSON.parse(raw) as DB;
    if (!parsed || parsed.version !== 1) throw new Error('Bad DB version');

    // In bypass mode we DO NOT force login; we just allow lenient sign-in via login().
    return parsed;
  } catch {
    const db = seedDB();
    saveDB(db);
    return db;
  }
}

export function saveDB(db: DB) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function resetDB() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function emptyDB(): DB {
  return {
    version: 1,
    users: [],
    groups: [],
    trips: [],
    session: { currentUserId: null },
  };
}

export function seedDB(): DB {
  const db = emptyDB();

  // Demo user
  const demoUser: User = {
    id: uid('user'),
    email: 'demo@local',
    password: 'demo',
    createdAt: nowIso(),
    profile: {
      name: 'Demo Rider',
      bio: 'Local demo profile (stored in your browser).',
      motorcycles: [
        { id: uid('moto'), brand: 'Yamaha', model: 'MT-07', year: 2022, engineCc: 689 },
        { id: uid('moto'), brand: 'Honda', model: 'CB500X', year: 2021, engineCc: 471 },
      ],
    },
  };

  db.users.push(demoUser);

  // Demo groups
  const g1 = {
    id: uid('group'),
    name: 'Sunday Sunrise Rides',
    description: 'Early morning rides + coffee.',
    visibility: 'public' as const,
    ownerId: demoUser.id,
    memberIds: [demoUser.id],
    createdAt: nowIso(),
  };

  const g2 = {
    id: uid('group'),
    name: 'Big Bike Crew',
    description: 'Private group for longer highway trips.',
    visibility: 'private' as const,
    ownerId: demoUser.id,
    memberIds: [demoUser.id],
    createdAt: nowIso(),
  };

  db.groups.push(g1, g2);

  // Demo trips
  db.trips.push(
    {
      id: uid('trip'),
      title: 'Coastal run',
      description: 'Easy pace. Meet up, fuel up, then roll.',
      startingPoint: 'Gas station (main highway)',
      startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      engineRule: 'open',
      visibility: 'public',
      ownerId: demoUser.id,
      groupId: g1.id,
      participantIds: [demoUser.id],
      createdAt: nowIso(),
    },
    {
      id: uid('trip'),
      title: 'Twisties practice',
      description: 'Private skills ride. Ride your ride.',
      startingPoint: 'Mountain lookout',
      startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      engineRule: 'small',
      visibility: 'private',
      ownerId: demoUser.id,
      participantIds: [demoUser.id],
      createdAt: nowIso(),
    },
    {
      id: uid('trip'),
      title: 'Highway day trip',
      description: 'Higher speed cruising, longer distance.',
      startingPoint: 'Mall parking lot',
      startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
      engineRule: 'big',
      visibility: 'public',
      ownerId: demoUser.id,
      groupId: g2.id,
      participantIds: [demoUser.id],
      createdAt: nowIso(),
    }
  );

  // NOTE: we intentionally do NOT auto-login here.
  // Bypass mode means "any credentials work" via login(), not "always logged in".

  return db;
}

export function getCurrentUser(db: DB): User | null {
  const id = db.session.currentUserId;
  if (!id) return null;
  return db.users.find((u) => u.id === id) ?? null;
}

export function requireUser(db: DB): User {
  const u = getCurrentUser(db);
  if (!u) throw new Error('Not authenticated');
  return u;
}

// ---- Auth (dev-only) ----

export function register(email: string, password: string): { ok: true } | { ok: false; error: string } {
  // In bypass mode, registration is the same as login: any credentials create/sign-in a user.
  if (DEV_BYPASS_AUTH) return login(email, password);

  const db = loadDB();
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes('@')) return { ok: false, error: 'Please use a valid email.' };
  if (password.length < 4) return { ok: false, error: 'Password must be at least 4 characters.' };

  if (db.users.some((u) => u.email === normalized)) return { ok: false, error: 'Email already registered.' };

  const user: User = {
    id: uid('user'),
    email: normalized,
    password,
    createdAt: nowIso(),
    profile: {
      name: normalized.split('@')[0] || 'Rider',
      bio: '',
      motorcycles: [],
    },
  };

  db.users.push(user);
  db.session.currentUserId = user.id;
  saveDB(db);
  return { ok: true };
}

export function login(email: string, password: string): { ok: true } | { ok: false; error: string } {
  const db = loadDB();
  const normalized = email.trim().toLowerCase();

  // Dev bypass: any email/password signs you in.
  // If the user doesn't exist yet, we create it.
  if (DEV_BYPASS_AUTH) {
    if (!normalized) return { ok: false, error: 'Please enter an email.' };

    let user = db.users.find((u) => u.email === normalized);
    if (!user) {
      user = {
        id: uid('user'),
        email: normalized,
        password: password || 'dev',
        createdAt: nowIso(),
        profile: {
          name: normalized.split('@')[0] || 'Rider',
          bio: '',
          motorcycles: [],
        },
      };
      db.users.unshift(user);
    }

    db.session.currentUserId = user.id;
    saveDB(db);
    return { ok: true };
  }

  const user = db.users.find((u) => u.email === normalized);
  if (!user) return { ok: false, error: 'No user with that email.' };
  if (user.password !== password) return { ok: false, error: 'Wrong password.' };

  db.session.currentUserId = user.id;
  saveDB(db);
  return { ok: true };
}

export function logout() {
  const db = loadDB();
  db.session.currentUserId = null;
  saveDB(db);
}

// ---- Profile ----

export function updateProfile(patch: Partial<User['profile']>) {
  const db = loadDB();
  const user = requireUser(db);
  user.profile = { ...user.profile, ...patch };
  saveDB(db);
}

export function addMotorcycle(moto: Omit<User['profile']['motorcycles'][number], 'id'>) {
  const db = loadDB();
  const user = requireUser(db);
  user.profile.motorcycles.push({ id: uid('moto'), ...moto });
  saveDB(db);
}

export function removeMotorcycle(motoId: string) {
  const db = loadDB();
  const user = requireUser(db);
  user.profile.motorcycles = user.profile.motorcycles.filter((m) => m.id !== motoId);
  saveDB(db);
}

// ---- Groups ----

export function createGroup(input: Omit<Group, 'id' | 'ownerId' | 'memberIds' | 'createdAt'>) {
  const db = loadDB();
  const user = requireUser(db);
  const g: Group = {
    id: uid('group'),
    ownerId: user.id,
    memberIds: [user.id],
    createdAt: nowIso(),
    ...input,
  };
  db.groups.unshift(g);
  saveDB(db);
}

export function joinGroup(groupId: string) {
  const db = loadDB();
  const user = requireUser(db);
  const g = db.groups.find((x) => x.id === groupId);
  if (!g) return;
  if (!g.memberIds.includes(user.id)) g.memberIds.push(user.id);
  saveDB(db);
}

// ---- Trips ----

export function createTrip(input: Omit<Trip, 'id' | 'ownerId' | 'createdAt' | 'participantIds'>) {
  const db = loadDB();
  const user = requireUser(db);

  // Validate group membership
  if (input.groupId) {
    const group = db.groups.find((g) => g.id === input.groupId);
    if (!group) throw new Error('Group not found');
    if (!group.memberIds.includes(user.id)) {
      throw new Error('You must be a member of the group to create trips for it');
    }
  }

  const t: Trip = {
    id: uid('trip'),
    ownerId: user.id,
    participantIds: [user.id],
    createdAt: nowIso(),
    ...input,
  };
  db.trips.unshift(t);
  saveDB(db);
}

export function joinTrip(tripId: string) {
  const db = loadDB();
  const user = requireUser(db);
  const t = db.trips.find((x) => x.id === tripId);
  if (!t) return;
  if (!t.participantIds.includes(user.id)) t.participantIds.push(user.id);
  saveDB(db);
}

export function leaveTrip(tripId: string) {
  const db = loadDB();
  const user = requireUser(db);
  const t = db.trips.find((x) => x.id === tripId);
  if (!t) return;
  t.participantIds = t.participantIds.filter((id) => id !== user.id);
  saveDB(db);
}

// ---- Update functions ----

export function updateTrip(tripId: string, patch: Partial<Pick<Trip, 'title' | 'description' | 'startingPoint' | 'startDateTime' | 'engineRule' | 'visibility' | 'groupId'>>) {
  const db = loadDB();
  const user = requireUser(db);
  const t = db.trips.find((x) => x.id === tripId);
  if (!t) throw new Error('Trip not found');
  if (t.ownerId !== user.id) throw new Error('Not authorized');
  Object.assign(t, patch);
  saveDB(db);
}

export function updateGroup(groupId: string, patch: Partial<Pick<Group, 'name' | 'description' | 'visibility'>>) {
  const db = loadDB();
  const user = requireUser(db);
  const g = db.groups.find((x) => x.id === groupId);
  if (!g) throw new Error('Group not found');
  if (g.ownerId !== user.id) throw new Error('Not authorized');
  Object.assign(g, patch);
  saveDB(db);
}

// ---- Delete functions (cascade: unlink trips from deleted groups) ----

export function deleteTrip(tripId: string) {
  const db = loadDB();
  const user = requireUser(db);
  const t = db.trips.find((x) => x.id === tripId);
  if (!t) throw new Error('Trip not found');
  if (t.ownerId !== user.id) throw new Error('Not authorized');
  db.trips = db.trips.filter((x) => x.id !== tripId);
  saveDB(db);
}

export function deleteGroup(groupId: string) {
  const db = loadDB();
  const user = requireUser(db);
  const g = db.groups.find((x) => x.id === groupId);
  if (!g) throw new Error('Group not found');
  if (g.ownerId !== user.id) throw new Error('Not authorized');
  // Cascade: unlink trips from this group
  db.trips.forEach((t) => {
    if (t.groupId === groupId) t.groupId = undefined;
  });
  db.groups = db.groups.filter((x) => x.id !== groupId);
  saveDB(db);
}

// ---- Leave group (owner cannot leave - must delete) ----

export function leaveGroup(groupId: string) {
  const db = loadDB();
  const user = requireUser(db);
  const g = db.groups.find((x) => x.id === groupId);
  if (!g) return;
  if (g.ownerId === user.id) throw new Error('Owner cannot leave. Delete the group instead.');
  g.memberIds = g.memberIds.filter((id) => id !== user.id);
  saveDB(db);
}
