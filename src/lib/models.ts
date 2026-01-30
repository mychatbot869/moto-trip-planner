export type EngineSizeRule = 'open' | 'small' | 'big';

export type Motorcycle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  engineCc: number;
};

export type UserProfile = {
  name: string;
  bio: string;
  motorcycles: Motorcycle[];
};

export type User = {
  id: string;
  email: string;
  /** Dev-only auth. Stored locally in the browser. */
  password: string;
  profile: UserProfile;
  createdAt: string;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  ownerId: string;
  memberIds: string[];
  createdAt: string;
};

export type Trip = {
  id: string;
  title: string;
  description: string;
  startingPoint: string;
  startDateTime: string; // ISO
  engineRule: EngineSizeRule;
  visibility: 'public' | 'private';
  ownerId: string;
  /** Optional group association */
  groupId?: string;
  /** User ids who joined/RSVPed */
  participantIds: string[];
  createdAt: string;
};

export type DB = {
  version: 1;
  users: User[];
  groups: Group[];
  trips: Trip[];
  session: {
    currentUserId: string | null;
  };
};
