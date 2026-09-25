import { FriendOrbit } from '../types';

export interface SuggestableEvent {
  id: string;
  title: string;
  startsAt: number;
  hours: number; // shared time the event would add
}

// "Fri 5pm" / "Fri 5:30pm"
export function shortWhen(ts: number): string {
  const d = new Date(ts);
  const day = d.toLocaleDateString('en-US', { weekday: 'short' });
  const h = d.getHours();
  const m = d.getMinutes();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${day} ${h12}${m ? `:${String(m).padStart(2, '0')}` : ''}${h >= 12 ? 'pm' : 'am'}`;
}

const stems = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 4)
    .map((w) => w.slice(0, 5));

// Pick 2-3 upcoming events that fit a friend's interests (falling back to the soonest ones)
export function suggestEvents(friend: FriendOrbit, events: SuggestableEvent[], max = 3): SuggestableEvent[] {
  const now = Date.now();
  const interestStems = new Set(friend.mutualInterests.flatMap(stems));
  const upcoming = events.filter((e) => e.startsAt + e.hours * 3600_000 > now);
  const scored = upcoming
    .map((e) => ({ e, score: stems(e.title).filter((s) => interestStems.has(s)).length }))
    .sort((a, b) => b.score - a.score || a.e.startsAt - b.e.startsAt);
  // Vary the picks between friends so everyone doesn't get the same three events
  const offset = friend.id.length % Math.max(1, scored.length);
  const matched = scored.filter((s) => s.score > 0);
  const rest = scored.filter((s) => s.score === 0);
  const rotated = [...rest.slice(offset % Math.max(1, rest.length)), ...rest.slice(0, offset % Math.max(1, rest.length))];
  return [...matched, ...rotated].slice(0, max).map((s) => s.e);
}
