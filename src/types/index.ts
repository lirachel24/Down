export type ActivityCategory = 
  | 'chore' 
  | 'sweet-treat' 
  | 'body-double' 
  | 'coffee' 
  | 'dog-walk' 
  | 'errands' 
  | 'after-work' 
  | 'nails-pamper';

export type FriendTier = 'villager' | 'orbit' | 'spark';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  role: string;
  companyOrSchool: string;
  neighborhood: string;
  sweatpantsApproved: boolean; // "Can see you in sweatpants with zero makeup"
  favoriteChores: string[];
  totalHoursLogged: number;
  joinedAt: string; // e.g. "June 2026"
  socials?: { instagram?: string; x?: string };
}

export interface Beacon {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    companyOrSchool: string;
    tier: FriendTier;
    sweatpantsApproved: boolean;
  };
  activityCategory: ActivityCategory;
  categoryLabel: string;
  locationName: string;
  address: string;
  distance: string;
  coords: { x: number; y: number }; // Percentage 0-100 for interactive live map
  startTime: number;
  durationMinutes: number;
  expiresAt: number; // timestamp in ms
  spotsTotal: number; // 2 or 3 max
  spotsFilled: number;
  attendees: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  whatAreWeWearing: string;
  convinceMeReason: string;
  icebreakerQuestions: string[];
  depositRequired: boolean; // $5 anti-flake deposit
  image: string;
  isHost?: boolean;
  joined?: boolean;
  // Set on events created through the Create Event flow
  description?: string; // sanitized-on-render HTML from the rich text editor
  lat?: number;
  lng?: number;
  locationInstructions?: string;
  exactLocationApprovedOnly?: boolean;
  requireApproval?: boolean;
  priceCents?: number;
  visibility?: 'public' | 'friends' | 'private';
  capacity?: number | null; // null = unlimited
}

export interface FriendOrbit {
  id: string;
  name: string;
  avatar: string;
  tier: FriendTier;
  tierLabel: string;
  hoursTogether: number;
  nextMilestoneHours: number;
  metAt: string;
  lastSeenDaysAgo: number;
  mutualInterests: string[];
  sweatpantsApproved: boolean;
  notes: string;
  pendingNudge?: string;
  callbackSnippet?: string;
}

export interface PendingVibeCheck {
  id: string;
  eventTitle: string;
  partnerName: string;
  partnerAvatar: string;
  dateStr: string;
  location: string;
  hoursSpent: number;
  voted: boolean;
  mutualMatch?: boolean;
  depositStatus: 'holding' | 'refunded';
}
