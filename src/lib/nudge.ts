import { Beacon, FriendOrbit } from '../types';
import { CalendarEvent } from './api';
import { distanceKm, fmtMinutes, fmtShortDuration, LatLng, travelLabel, travelTimes } from './travel';
import { firstName, friendsGoing, namesList, shortTitle } from './friends';

export interface Nudge {
  kind: 'event' | 'busy' | 'open' | 'connect';
  headline: string;
  detail: string;
  event: Beacon | null;
  friendsGoing: FriendOrbit[];
  travel: string | null;
  freeMs: number | null; // time until the next calendar event, when known
  nextCalendarTitle: string | null;
}

interface Input {
  now: number;
  userName: string;
  calendarConnected: boolean;
  calendarEvents: CalendarEvent[];
  beacons: Beacon[];
  friends: FriendOrbit[];
  me: LatLng;
}

const fmtClock = (ts: number) => new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export function computeNudge({ now, userName, calendarConnected, calendarEvents, beacons, friends, me }: Input): Nudge {
  const name = firstName(userName);
  const current = calendarEvents.find((e) => e.start <= now && e.end > now) ?? null;
  const next = calendarEvents.find((e) => e.start > now) ?? null;
  const windowStart = current ? current.end : now;
  const windowEnd = next ? next.start : null;
  const freeMs = calendarConnected && !current ? (next ? next.start - now : null) : null;

  // Events that can actually be reached and fit before the next thing on the calendar
  const candidates = beacons
    .filter((b) => !b.joined && b.expiresAt > windowStart && b.lat !== undefined && b.lng !== undefined)
    .map((b) => {
      const km = distanceKm(me, [b.lat!, b.lng!]);
      const t = travelTimes(km);
      const travelMin = Math.min(t.walk, t.drive);
      const leaveBy = b.startTime - travelMin * 60_000;
      const canArrive = windowStart + travelMin * 60_000 <= b.startTime + (b.expiresAt - b.startTime) * 0.5;
      const fits = windowEnd === null || b.expiresAt <= windowEnd;
      const going = friendsGoing(b, friends);
      const soon = Math.max(0, b.startTime - Math.max(now, windowStart)) / 60_000;
      const score = going.length * 12 - soon / 20 - km * 1.5 + (fits ? 6 : -20) + (canArrive ? 0 : -50) + (leaveBy < now && b.startTime > now ? -3 : 0);
      return { b, km, going, score, canArrive, fits };
    })
    .filter((c) => c.canArrive)
    .sort((a, b) => b.score - a.score);

  const top = candidates[0] ?? null;
  const going = top?.going ?? [];
  const goingShort = going.length
    ? `${going.slice(0, 2).map((f) => firstName(f.name)).join(', ')}${going.length > 2 ? ` +${going.length - 2}` : ''} going`
    : 'No friends yet';
  const travel = top ? travelLabel(top.km) : null;
  const title = top ? shortTitle(top.b.title) : '';
  const startsIn = top ? Math.max(0, Math.round((top.b.startTime - now) / 60_000)) : 0;
  const detail = top ? `${goingShort} · ${travel}` : '';

  if (!calendarConnected) {
    return {
      kind: 'connect',
      headline: top
        ? `Hey ${name}, ${title} ${top.b.startTime <= now ? 'is on now' : `starts in ${fmtMinutes(startsIn)}`}. Head over?`
        : `Hey ${name}, what are you down for today?`,
      detail: top ? detail : 'Nothing nearby right now.',
      event: top?.b ?? null,
      friendsGoing: going,
      travel,
      freeMs: null,
      nextCalendarTitle: null,
    };
  }

  if (current) {
    return {
      kind: 'busy',
      headline: `Hey ${name}, you're booked until ${fmtClock(current.end)}.`,
      detail: top ? `Then: ${title} · ${goingShort}` : 'Plan something small for after.',
      event: top?.b ?? null,
      friendsGoing: going,
      travel,
      freeMs: null,
      nextCalendarTitle: current.title,
    };
  }

  const free = next ? `you're free for ${fmtShortDuration(freeMs!)}` : "you're free all day";
  if (top) {
    return {
      kind: 'event',
      headline: `Hey ${name}, ${free}. Head to ${title}?`,
      detail,
      event: top.b,
      friendsGoing: going,
      travel,
      freeMs,
      nextCalendarTitle: next?.title ?? null,
    };
  }
  return {
    kind: 'open',
    headline: `Hey ${name}, ${free}. Start something?`,
    detail: 'Nothing nearby fits right now.',
    event: null,
    friendsGoing: [],
    travel: null,
    freeMs,
    nextCalendarTitle: next?.title ?? null,
  };
}
