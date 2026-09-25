import { Beacon } from '../types';

export interface Vibe {
  key: string;
  label: string;
  words: string[]; // typed words that mean this vibe
}

export const VIBES: Vibe[] = [
  { key: 'brunch', label: 'Brunch', words: ['brunch', 'lunch', 'dinner', 'breakfast', 'food', 'wine'] },
  { key: 'working-out', label: 'Working Out', words: ['workout', 'working out', 'work out', 'yoga', 'gym', 'hike', 'hiking', 'running', 'jog', 'walk', 'fitness', 'exercise', 'pilates'] },
  { key: 'party', label: 'Party', words: ['party', 'parties', 'birthday', 'bday', 'rave'] },
  { key: 'music', label: 'Music', words: ['music', 'concert', 'band', 'karaoke', 'dj', 'gig'] },
  { key: 'coffee', label: 'Coffee', words: ['coffee', 'cafe', 'café', 'latte', 'matcha', 'boba', 'espresso'] },
];

// The vibe a typed phrase or tapped chip refers to, if any
export function vibeFromText(text: string): Vibe | null {
  const q = text.trim().toLowerCase();
  if (q.length < 3) return null;
  return VIBES.find((v) => v.key === q || v.label.toLowerCase() === q || v.words.some((w) => w === q || (q.length >= 4 && w.startsWith(q)))) ?? null;
}

// Explicit tags win. Events people create get their vibe from the words in the title.
export function eventVibes(b: Beacon): string[] {
  if (b.tags?.length) return b.tags;
  const text = `${b.title} ${b.locationName}`.toLowerCase();
  // Whole words only, so "grocery run" is not a workout and "party" is not found inside another word
  return VIBES.filter((v) => v.words.some((w) => new RegExp(`\\b${w}\\b`).test(text))).map((v) => v.key);
}

export const matchesVibe = (b: Beacon, vibe: Vibe | null) => !vibe || eventVibes(b).includes(vibe.key);
