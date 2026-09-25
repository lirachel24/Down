import { Beacon, FriendOrbit, PendingVibeCheck, UserProfile } from '../types';

export const currentUser: UserProfile = {
  id: 'user-kylie',
  name: 'Kylie',
  handle: '@kylie',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  bio: 'Part-time adult, full-time snack enthusiast',
  role: 'EECS Student & Creator',
  companyOrSchool: 'UC Berkeley',
  neighborhood: 'Elmwood / Telegraph, Berkeley',
  sweatpantsApproved: true,
  favoriteChores: [
    'Trader Joe\'s grocery runs',
    'Matcha & boba afternoon walks',
    'Body-doubling at local cafes',
    'Thrifting for birthday outfits',
    'Target and Walgreens maintenance runs'
  ],
  totalHoursLogged: 148,
  joinedAt: 'June 2026',
  socials: { instagram: 'kylie', x: 'kylie' },
};

export const initialBeacons: Beacon[] = [
  {
    id: 'beacon-1',
    title: 'At Blue Bottle for 40 mins · Sit & discuss birthday outfit',
    author: {
      id: 'user-alyssa',
      name: 'Alyssa Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      role: 'Product Designer',
      companyOrSchool: 'Figma',
      tier: 'orbit',
      sweatpantsApproved: true,
    },
    activityCategory: 'sweet-treat',
    categoryLabel: 'Sweet Treat & Coffee',
    locationName: 'Blue Bottle Coffee · Shattuck Ave',
    address: '2118 Vine St, Berkeley',
    distance: '0.3 mi away',
    coords: { x: 38, y: 32 },
    startTime: Date.now() - 5 * 60 * 1000,
    durationMinutes: 40,
    expiresAt: Date.now() + 35 * 60 * 1000,
    spotsTotal: 2,
    spotsFilled: 1,
    attendees: [
      {
        id: 'user-alyssa',
        name: 'Alyssa Chen',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      }
    ],
    whatAreWeWearing: 'Oversized grey crewneck + tote bag (100% sweatpants approved)',
    convinceMeReason: 'Tired brain says stay on couch, but 35 mins of warm iced oat latte + talking outfit choices resets your nervous system immediately. You only have to walk 4 blocks!',
    icebreakerQuestions: [
      'What is the most chaotic outfit in your closet right now?',
      'If you had to pick one pastry to keep you company for the rest of 2026, which one is it?',
      'What silly workplace drama made you roll your eyes today?'
    ],
    depositRequired: true,
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'beacon-2',
    title: 'Trader Joe\'s parallel grocery run · 30 mins',
    author: {
      id: 'user-maya',
      name: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
      role: 'Bioengineering MS',
      companyOrSchool: 'UC Berkeley',
      tier: 'villager',
      sweatpantsApproved: true,
    },
    activityCategory: 'chore',
    categoryLabel: 'Parallel Chore',
    locationName: 'Trader Joe\'s · University Ave',
    address: '1885 University Ave, Berkeley',
    distance: '0.5 mi away',
    coords: { x: 62, y: 48 },
    startTime: Date.now() - 2 * 60 * 1000,
    durationMinutes: 30,
    expiresAt: Date.now() + 28 * 60 * 1000,
    spotsTotal: 2,
    spotsFilled: 1,
    attendees: [
      {
        id: 'user-maya',
        name: 'Maya Patel',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
      }
    ],
    whatAreWeWearing: 'Leggings or sweats, sneakers. Zero makeup allowed.',
    convinceMeReason: 'Making chores fun again! You need groceries anyway. Doing it as a pair cuts the adult exhaustion in half and adds 45 minutes to your 200-Hour Rule.',
    icebreakerQuestions: [
      'What\'s an unhinged seasonal Trader Joe\'s item you couldn\'t resist buying?',
      'Show me the weirdest recipe you made when you were too tired to cook.',
      'What chore are you actively avoiding right now?'
    ],
    depositRequired: true,
    image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'beacon-3',
    title: 'Willard Park dog walk & golden hour decompress · 35 mins',
    author: {
      id: 'user-nicki',
      name: 'Nicki Rivera',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      role: 'Software Engineer',
      companyOrSchool: 'Anthropic',
      tier: 'orbit',
      sweatpantsApproved: true,
    },
    activityCategory: 'dog-walk',
    categoryLabel: 'Park Walk & Fresh Air',
    locationName: 'Willard Park Lawn',
    address: '2730 Hillegass Ave, Berkeley',
    distance: '0.4 mi away',
    coords: { x: 25, y: 68 },
    startTime: Date.now() - 8 * 60 * 1000,
    durationMinutes: 35,
    expiresAt: Date.now() + 27 * 60 * 1000,
    spotsTotal: 3,
    spotsFilled: 2,
    attendees: [
      {
        id: 'user-nicki',
        name: 'Nicki Rivera',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      },
      {
        id: 'user-zain',
        name: 'Zain Malik',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      }
    ],
    whatAreWeWearing: 'Walking shoes + fleece. Golden hour breeze!',
    convinceMeReason: 'Sunlight hits your retinas, drops cortisol by 40%, and your friend\'s golden retriever wants belly rubs. Stop reading Slack.',
    icebreakerQuestions: [
      'If you could ban one buzzword from tech forever, what would it be?',
      'What hobby did you passionately start and quit after 10 days?',
      'Who is the drama king/queen of your neighborhood park?'
    ],
    depositRequired: false,
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'beacon-4',
    title: 'Parallel work / body-doubling at Mercer Library · 45 mins',
    author: {
      id: 'user-chloe',
      name: 'Chloe Kim',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'Hardware Engineer',
      companyOrSchool: 'Apple',
      tier: 'orbit',
      sweatpantsApproved: true,
    },
    activityCategory: 'body-double',
    categoryLabel: 'Body-Doubling',
    locationName: 'Mercer Co-working / Library',
    address: '2200 Bancroft Way, Berkeley',
    distance: '0.6 mi away',
    coords: { x: 74, y: 22 },
    startTime: Date.now() - 10 * 60 * 1000,
    durationMinutes: 45,
    expiresAt: Date.now() + 35 * 60 * 1000,
    spotsTotal: 2,
    spotsFilled: 1,
    attendees: [
      {
        id: 'user-chloe',
        name: 'Chloe Kim',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      }
    ],
    whatAreWeWearing: 'Noise canceling headphones + comfy knit',
    convinceMeReason: 'Body-doubling works magic for ADHD and task resistance. We sit together, knock out 40 mins of focused work or admin tasks, then high-five.',
    icebreakerQuestions: [
      'What is that one email you have been dreading replying to for a week?',
      'What is your go-to productivity track right now?',
      'After this, do we get boba or pastry?'
    ],
    depositRequired: true,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  }
];

export const initialFriendOrbits: FriendOrbit[] = [
  {
    id: 'friend-maya',
    name: 'Maya Patel',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
    tier: 'villager',
    tierLabel: 'Tier 1 · The Villagers',
    hoursTogether: 168,
    nextMilestoneHours: 200,
    metAt: 'Berkeley CS61A Lab, 2024',
    lastSeenDaysAgo: 1,
    mutualInterests: ['Trader Joe\'s', 'Matcha runs', 'EECS debugging', 'Thrifting'],
    sweatpantsApproved: true,
    notes: 'Core crew. Can come over unannounced in sweatpants without cleaning apartment.',
    callbackSnippet: 'laughing about the lab disaster',
  },
  {
    id: 'friend-sam',
    name: 'Samira Rao',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    tier: 'villager',
    tierLabel: 'Tier 1 · The Villagers',
    hoursTogether: 154,
    nextMilestoneHours: 200,
    metAt: 'Berkeley Student Co-op',
    lastSeenDaysAgo: 3,
    mutualInterests: ['Baking focaccia', 'Farmer\'s market', 'Board games'],
    sweatpantsApproved: true,
    notes: 'Emergency contact level. Shared 30+ grocery trips and cooking nights.',
  },
  {
    id: 'friend-zain',
    name: 'Zain Malik',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    tier: 'orbit',
    tierLabel: 'Tier 2 · The Orbit / Weak Ties',
    hoursTogether: 46,
    nextMilestoneHours: 90,
    metAt: 'Barry\'s Bootcamp Elmwood',
    lastSeenDaysAgo: 14,
    mutualInterests: ['Running', 'Filter coffee', 'Tech founder gossip'],
    sweatpantsApproved: true,
    notes: 'High potential friend! Met at workout class, great energy.',
    pendingNudge: 'You haven\'t followed up with Zain in 2 weeks! Invite them for a coffee body-double.',
    callbackSnippet: 'that ridiculous sprinting playlist track',
  },
  {
    id: 'friend-alyssa',
    name: 'Alyssa Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    tier: 'orbit',
    tierLabel: 'Tier 2 · The Orbit / Weak Ties',
    hoursTogether: 62,
    nextMilestoneHours: 90,
    metAt: 'Pottery Workshop on Telegraph',
    lastSeenDaysAgo: 5,
    mutualInterests: ['Ceramics', 'Design systems', 'Sweet treats', 'Nail art'],
    sweatpantsApproved: true,
    notes: 'Graduating into core friends soon! We love parallel errands.',
    pendingNudge: 'Alyssa is nearby at Blue Bottle right now—drop in!',
    callbackSnippet: 'the lopsided matcha mug we shaped',
  },
  {
    id: 'friend-nicki',
    name: 'Nicki Rivera',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    tier: 'spark',
    tierLabel: 'Tier 3 · Sparks / New Ties',
    hoursTogether: 14,
    nextMilestoneHours: 50,
    metAt: 'Willard Park Dog Meetup',
    lastSeenDaysAgo: 2,
    mutualInterests: ['Golden Retrievers', 'Sunset walks', 'AI research'],
    sweatpantsApproved: false,
    notes: 'Super sweet dog mom. Need 36 more hours to reach Casual Friend tier!',
    pendingNudge: 'Send the Day 2 Callback: zero ask to meet up, just reference her funny dog story.',
    callbackSnippet: 'how Bento stole the tennis ball from the golden doodle',
  },
];

export const initialPendingVibeCheck: PendingVibeCheck = {
  id: 'vibe-101',
  eventTitle: 'Quick Boba Run & Sanity Walk',
  partnerName: 'Nicki Rivera',
  partnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  dateStr: 'Yesterday at 6:45 PM',
  location: 'Asha Tea House · Telegraph',
  hoursSpent: 1.5,
  voted: false,
  depositStatus: 'holding',
};

export interface UpcomingEvent {
  id: string;
  title: string;
  startsAt: number;
  image?: string;
}

const atHour = (daysFromNow: number, hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
};

// Days until the coming Saturday (next weekend = the one after that)
const daysToSaturday = (6 - new Date().getDay() + 7) % 7 || 7;

export const freeTonightEvents: UpcomingEvent[] = [
  { id: 'tonight-1', title: 'Rooftop drinks', startsAt: atHour(0, 17), image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80' },
  { id: 'tonight-2', title: 'Walk around the lake', startsAt: atHour(0, 18), image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80' },
  { id: 'tonight-3', title: 'Lunch with friends', startsAt: atHour(0, 19), image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80' },
  { id: 'tonight-4', title: 'Wine night', startsAt: atHour(0, 19), image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80' },
  { id: 'tonight-5', title: 'Sunset hang on the hill', startsAt: atHour(0, 20), image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80' },
  { id: 'tonight-6', title: 'Live music & drinks', startsAt: atHour(0, 21), image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80' },
];

export const nextWeekendEvents: UpcomingEvent[] = [
  { id: 'weekend-1', title: 'Pool party', startsAt: atHour(daysToSaturday + 7, 13), image: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&w=800&q=80' },
  { id: 'weekend-2', title: 'Brunch crawl', startsAt: atHour(daysToSaturday + 8, 11), image: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=800&q=80' },
  { id: 'weekend-3', title: 'Thrift & boba', startsAt: atHour(daysToSaturday + 8, 14), image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=800&q=80' },
  { id: 'weekend-4', title: 'Birthday party', startsAt: atHour(daysToSaturday + 7, 20), image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80' },
  { id: 'weekend-5', title: 'Dinner out', startsAt: atHour(daysToSaturday + 7, 18), image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80' },
  { id: 'weekend-6', title: 'Co-working morning', startsAt: atHour(daysToSaturday + 8, 9), image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80' },
];
