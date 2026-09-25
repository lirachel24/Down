import { Beacon, FriendOrbit, PendingVibeCheck, UserProfile } from '../types';

export const currentUser: UserProfile = {
  id: 'user-kylie',
  name: 'Kylie',
  handle: '@kylie',
  avatar: '/avatar-kylie.jpg',
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
    lat: 37.8720713,
    lng: -122.2676078,
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
    lat: 37.8687,
    lng: -122.2662,
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
    lat: 37.8578,
    lng: -122.2588,
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
    lat: 37.8722,
    lng: -122.2606,
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
    hoursTogether: 90,
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
    hoursTogether: 50,
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
    hoursTogether: 154,
    nextMilestoneHours: 200,
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
    hoursTogether: 168,
    nextMilestoneHours: 200,
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
    hoursTogether: 20,
    nextMilestoneHours: 200,
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

// ---------- Seeded events (real, joinable events that fill the home page and map) ----------
const MIN = 60_000;
const IMG = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
const friendById = (id: string) => initialFriendOrbits.find((f) => f.id === id)!;
const friendAttendee = (id: string) => {
  const f = friendById(id);
  return { id: f.id, name: f.name, avatar: f.avatar };
};

// Days until the coming Saturday (next weekend = the one after that)
const daysToSaturday = (6 - new Date().getDay() + 7) % 7 || 7;
const atHour = (daysFromNow: number, hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
};

const HOSTS = {
  jess: { id: 'host-jess', name: 'Jess Park', avatar: IMG('1438761681033-6461ffad8d80'), role: 'Community host', companyOrSchool: 'Berkeley' },
  marcus: { id: 'host-marcus', name: 'Marcus Bell', avatar: IMG('1500648767791-00dcc994a43e'), role: 'Community host', companyOrSchool: 'Berkeley' },
};

interface SeedOpts {
  id: string;
  title: string;
  image: string;
  startsAt: number;
  minutes: number;
  place: string;
  address: string;
  lat: number;
  lng: number;
  section: 'tonight' | 'weekend';
  friends: string[]; // friend ids who are going
  host?: keyof typeof HOSTS;
  reason: string;
  wearing?: string;
  capacity?: number;
}

function seedEvent(o: SeedOpts): Beacon {
  const hostFriend = o.host ? null : o.friends[0] ? friendById(o.friends[0]) : null;
  const host = hostFriend
    ? { id: hostFriend.id, name: hostFriend.name, avatar: hostFriend.avatar, role: 'Friend', companyOrSchool: 'Berkeley' }
    : HOSTS[o.host ?? 'jess'];
  const attendees = [...(o.host || !hostFriend ? [{ id: host.id, name: host.name, avatar: host.avatar }] : []), ...o.friends.map(friendAttendee)];
  const capacity = o.capacity ?? 8;
  return {
    id: o.id,
    title: o.title,
    author: { ...host, tier: 'orbit', sweatpantsApproved: true },
    activityCategory: 'after-work',
    categoryLabel: 'Hangout',
    locationName: o.place,
    address: o.address,
    distance: '',
    lat: o.lat,
    lng: o.lng,
    coords: { x: 50, y: 50 },
    startTime: o.startsAt,
    durationMinutes: o.minutes,
    expiresAt: o.startsAt + o.minutes * MIN,
    spotsTotal: capacity,
    spotsFilled: attendees.length,
    attendees,
    whatAreWeWearing: o.wearing ?? 'Come as you are (sweatpants fully approved)',
    convinceMeReason: o.reason,
    icebreakerQuestions: [
      "What's the funniest thing that went wrong with your week so far?",
      'If you could teleport anywhere for one hour right now, where would you go?',
      "What's a small win you haven't told anyone about yet?",
    ],
    depositRequired: true,
    image: o.image,
    section: o.section,
    capacity,
    priceCents: 0,
    visibility: 'public',
  };
}

const now = Date.now();
const seeded: Beacon[] = [
  seedEvent({ id: 'seed-rooftop', title: 'Rooftop drinks', image: IMG('1517457373958-b7bdd4587205'), startsAt: now + 50 * MIN, minutes: 90, place: 'Jupiter', address: '2181 Shattuck Ave, Berkeley', lat: 37.8697, lng: -122.2683, section: 'tonight', friends: ['friend-maya', 'friend-sam'], reason: 'Golden hour, good company and zero planning. One drink and you are home by nine feeling human again.' }),
  seedEvent({ id: 'seed-lake', title: 'Walk around the lake', image: IMG('1529156069898-49953e39b3ac'), startsAt: now + 110 * MIN, minutes: 60, place: 'Aquatic Park', address: 'Aquatic Park, Berkeley', lat: 37.8635, lng: -122.2989, section: 'tonight', friends: ['friend-nicki'], reason: 'Twenty minutes of walking beats an hour of scrolling. Bring headphones or bring a friend.' }),
  seedEvent({ id: 'seed-lunch', title: 'Lunch with friends', image: IMG('1517486808906-6ca8b3f04846'), startsAt: now + 170 * MIN, minutes: 75, place: 'Comal', address: '2020 Shattuck Ave, Berkeley', lat: 37.8713, lng: -122.2685, section: 'tonight', friends: ['friend-alyssa', 'friend-zain'], reason: 'You have been meaning to see these two for weeks. This is the low-effort way to finally do it.' }),
  seedEvent({ id: 'seed-wine', title: 'Wine night', image: IMG('1519671482749-fd09be7ccebf'), startsAt: now + 230 * MIN, minutes: 120, place: 'Vintage Berkeley', address: '2113 Vine St, Berkeley', lat: 37.8809, lng: -122.2695, section: 'tonight', friends: [], host: 'marcus', reason: 'A small table, a good bottle, and people who are also just glad to be out of the house.' }),
  seedEvent({ id: 'seed-hill', title: 'Sunset hang on the hill', image: IMG('1511632765486-a01980e01a18'), startsAt: now + 290 * MIN, minutes: 60, place: 'Indian Rock Park', address: 'Indian Rock Park, Berkeley', lat: 37.8925, lng: -122.2727, section: 'tonight', friends: ['friend-sam', 'friend-nicki'], reason: 'The best free view in the East Bay. Bring a layer and a snack.' }),
  seedEvent({ id: 'seed-music', title: 'Live music & drinks', image: IMG('1470229722913-7c0e2dbbafd3'), startsAt: now + 350 * MIN, minutes: 150, place: 'Cornerstone Berkeley', address: '2367 Shattuck Ave, Berkeley', lat: 37.8664, lng: -122.2673, section: 'tonight', friends: [], host: 'jess', reason: 'Loud enough that nobody needs to make small talk. Come for the band, stay for whoever you meet.' }),

  seedEvent({ id: 'seed-pool', title: 'Pool party', image: IMG('1523301343968-6a6ebf63c672'), startsAt: atHour(daysToSaturday + 7, 13), minutes: 180, place: 'Strawberry Canyon Rec Area', address: 'Strawberry Canyon, Berkeley', lat: 37.8757, lng: -122.2455, section: 'weekend', friends: ['friend-maya', 'friend-alyssa'], capacity: 20, reason: 'Sun, water and a playlist somebody actually curated. The easiest way to spend a Saturday.' }),
  seedEvent({ id: 'seed-brunch', title: 'Brunch crawl', image: IMG('1528605105345-5344ea20e269'), startsAt: atHour(daysToSaturday + 8, 11), minutes: 150, place: 'Fourth Street', address: 'Fourth Street, Berkeley', lat: 37.8697, lng: -122.3018, section: 'weekend', friends: ['friend-zain'], capacity: 12, reason: 'Three stops, small plates, no commitment. Leave whenever you are full or done.' }),
  seedEvent({ id: 'seed-thrift', title: 'Thrift & boba', image: IMG('1543807535-eceef0bc6599'), startsAt: atHour(daysToSaturday + 8, 14), minutes: 120, place: 'Telegraph Ave', address: 'Telegraph Ave, Berkeley', lat: 37.8656, lng: -122.2586, section: 'weekend', friends: ['friend-nicki'], reason: 'You need an outfit for that birthday anyway. Come with a budget, leave with a story.' }),
  seedEvent({ id: 'seed-bday', title: 'Birthday party', image: IMG('1530103862676-de8c9debad1d'), startsAt: atHour(daysToSaturday + 7, 20), minutes: 180, place: 'Live Oak Park', address: 'Live Oak Park, Berkeley', lat: 37.8801, lng: -122.2693, section: 'weekend', friends: ['friend-maya', 'friend-sam', 'friend-alyssa'], capacity: 25, reason: 'Balloons, cake and half your friends in one place. You will not regret going.' }),
  seedEvent({ id: 'seed-dinner', title: 'Dinner out', image: IMG('1528605248644-14dd04022da1'), startsAt: atHour(daysToSaturday + 7, 18), minutes: 120, place: 'Chez Panisse', address: '1517 Shattuck Ave, Berkeley', lat: 37.8796, lng: -122.2694, section: 'weekend', friends: [], host: 'marcus', capacity: 10, reason: 'A long table and a slow dinner. Worth getting dressed for, just this once.' }),
  seedEvent({ id: 'seed-cowork', title: 'Co-working morning', image: IMG('1523240795612-9a054b0db644'), startsAt: atHour(daysToSaturday + 8, 9), minutes: 180, place: 'Caffe Strada', address: '2300 College Ave, Berkeley', lat: 37.8672, lng: -122.2545, section: 'weekend', friends: ['friend-zain', 'friend-alyssa'], reason: 'Body-double your to-do list with people who are also avoiding theirs.' }),
];

// Friends who are going to the four original events
const addFriends = (beaconId: string, ids: string[]) => {
  const b = initialBeacons.find((x) => x.id === beaconId);
  if (!b) return;
  ids.forEach((id) => {
    if (!b.attendees.some((a) => a.id === id)) b.attendees.push(friendAttendee(id));
  });
  b.spotsTotal = Math.max(b.spotsTotal, b.attendees.length + 1);
  b.spotsFilled = b.attendees.length;
};
addFriends('beacon-2', ['friend-maya']);
addFriends('beacon-3', ['friend-nicki', 'friend-sam']);
addFriends('beacon-4', ['friend-zain']);

initialBeacons.push(...seeded);

// Which vibe filter each seeded event belongs to (an event can fit more than one)
const TAGS_BY_ID: Record<string, string[]> = {
  'beacon-1': ['coffee'],
  'beacon-3': ['working-out'],
  'beacon-4': ['coffee'],
  'seed-rooftop': ['party', 'music'],
  'seed-lake': ['working-out'],
  'seed-lunch': ['brunch'],
  'seed-wine': ['brunch'],
  'seed-hill': ['working-out'],
  'seed-music': ['music'],
  'seed-pool': ['party', 'music'],
  'seed-brunch': ['brunch'],
  'seed-thrift': ['coffee'],
  'seed-bday': ['party'],
  'seed-dinner': ['brunch'],
  'seed-cowork': ['coffee'],
};
initialBeacons.forEach((b) => {
  if (TAGS_BY_ID[b.id]) b.tags = TAGS_BY_ID[b.id];
});
