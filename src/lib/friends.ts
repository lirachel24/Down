import { Beacon, FriendOrbit } from '../types';

// Which of your friends are going to an event
export function friendsGoing(beacon: Beacon, friends: FriendOrbit[]): FriendOrbit[] {
  return friends.filter((f) => beacon.attendees.some((a) => a.id === f.id || a.name === f.name));
}

export const firstName = (name: string) => name.split(' ')[0];

export function namesList(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

// "Willard Park dog walk & golden hour decompress · 35 mins" -> "Willard Park dog walk"
export function shortTitle(title: string): string {
  let t = title.split(' · ')[0].trim();
  if (t.length > 32) t = t.split(/ & | - | with /)[0].trim();
  if (t.length > 32) t = `${t.slice(0, 30).replace(/\s+\S*$/, '')}…`;
  return t;
}
