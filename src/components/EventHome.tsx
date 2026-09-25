import React, { useMemo, useState } from 'react';
import { TopActions } from './TopActions';
import { NearbyMap } from './NearbyMap';
import { NextUpCard } from './NextUpCard';
import { Beacon, FriendOrbit } from '../types';
import { firstName, friendsGoing, shortTitle } from '../lib/friends';
import { CalendarEvent } from '../lib/api';
import { LatLng } from '../lib/travel';
import { VIBES, matchesVibe, vibeFromText } from '../lib/vibes';

interface CalendarProps {
  connected: boolean;
  loaded: boolean;
  events: CalendarEvent[];
  error?: string;
  connect: (url: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

interface LocationProps {
  pos: LatLng;
  known: boolean;
  busy: boolean;
  error: string | null;
  locate: () => void;
}

interface EventHomeProps {
  userName: string;
  avatar: string;
  beacons: Beacon[];
  friends: FriendOrbit[];
  calendar: CalendarProps;
  location: LocationProps;
  onOpenEvent: (beacon: Beacon) => void;
  onJoin: (beaconId: string) => void;
  onOpenProfile: () => void;
}

// "Fri 10/22 at 5pm"
const formatEventDate = (ts: number) => {
  const d = new Date(ts);
  const day = d.toLocaleDateString('en-US', { weekday: 'short' });
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const suffix = hours >= 12 ? 'pm' : 'am';
  const time = minutes === 0 ? `${hour12}${suffix}` : `${hour12}:${String(minutes).padStart(2, '0')}${suffix}`;
  return `${day} ${d.getMonth() + 1}/${d.getDate()} at ${time}`;
};

const Section: React.FC<{ title: string; items: Beacon[]; friends: FriendOrbit[]; onSelect: (b: Beacon) => void }> = ({ title, items, friends, onSelect }) =>
  items.length === 0 ? null : (
    <section className="mt-9" aria-label={title}>
      <div className="flex items-end justify-between px-4">
        <h2 className="font-header text-[26px] leading-none text-ink">{title}</h2>
        <button className="text-sm text-ink underline underline-offset-4 decoration-ink/60">See more</button>
      </div>

      <div className="no-scrollbar mt-3.5 flex gap-3 overflow-x-auto px-4 pb-1">
        {items.map((item) => {
          const going = friendsGoing(item, friends);
          return (
            <button key={item.id} onClick={() => onSelect(item)} className="w-[150px] shrink-0 text-left active:scale-[0.98] transition-transform">
              <div className="relative aspect-[234/194] w-full overflow-hidden rounded-control bg-sand">
                <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute left-2 top-2 whitespace-nowrap rounded-full bg-cta px-3 py-1.5 text-[13px] leading-none text-cream">
                  {formatEventDate(item.startTime)}
                </span>
              </div>
              <p className="mt-2 truncate text-sm text-ink">{shortTitle(item.title)}</p>
              {going.length > 0 && (
                <p className="truncate text-xs text-berry">
                  {firstName(going[0].name)}
                  {going.length > 1 ? ` +${going.length - 1}` : ''} going
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );

export const EventHome: React.FC<EventHomeProps> = ({
  userName,
  avatar,
  beacons,
  friends,
  calendar,
  location,
  onOpenEvent,
  onJoin,
  onOpenProfile,
}) => {
  const [vibe, setVibe] = useState('');

  const upcoming = useMemo(() => beacons.filter((b) => b.expiresAt > Date.now()), [beacons]);
  // The chip tapped (or word typed) filters the map to matching events
  const activeVibe = vibeFromText(vibe);
  const mapEvents = useMemo(() => upcoming.filter((b) => matchesVibe(b, activeVibe)), [upcoming, activeVibe]);
  const recommended = useMemo(
    () =>
      upcoming
        .filter((b) => !b.section)
        .sort((a, b) => friendsGoing(b, friends).length - friendsGoing(a, friends).length || a.startTime - b.startTime),
    [upcoming, friends]
  );
  const tonight = useMemo(() => upcoming.filter((b) => b.section === 'tonight').sort((a, b) => a.startTime - b.startTime), [upcoming]);
  const weekend = useMemo(() => upcoming.filter((b) => b.section === 'weekend').sort((a, b) => a.startTime - b.startTime), [upcoming]);

  return (
    <div className="relative overflow-clip pb-40">
      {/* Extra soft glow on the left */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[520px] h-56 w-40 rounded-full bg-[#F2A6CF] opacity-60 blur-3xl" />
        <div className="absolute -left-28 top-[600px] h-40 w-32 rounded-full bg-[#D8E06A] opacity-60 blur-3xl" />
      </div>

      <div className="relative">
        {/* Hero */}
        <div className="px-4 pt-8">
          <div className="flex items-start justify-between">
            <h1 className="font-header text-[44px] leading-[1.02] tracking-tight">
              <span className="block text-pink">{userName},</span>
              <span className="block text-ink">You Down?</span>
            </h1>
            <TopActions avatar={avatar} name={userName} onOpenProfile={onOpenProfile} />
          </div>

          <NextUpCard
            userName={userName}
            calendarConnected={calendar.connected}
            calendarLoaded={calendar.loaded}
            calendarEvents={calendar.events}
            beacons={beacons}
            friends={friends}
            me={location.pos}
            onOpenEvent={onOpenEvent}
            onJoin={onJoin}
          />

          {/* Prompt bar: the highlighted word is a real text field */}
          <label className="mt-6 flex min-h-[64px] cursor-text items-center rounded-card border border-white/60 bg-white/30 px-6 py-5 text-base shadow-[0_2px_20px_rgba(0,0,0,0.04)] backdrop-blur-md focus-within:border-pink/40 focus-within:ring-4 focus-within:ring-pink/10">
            <span className="whitespace-pre">You down for some </span>
            <input
              type="text"
              value={vibe}
              maxLength={30}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="coffee"
              aria-label="What are you down for?"
              spellCheck={false}
              autoComplete="off"
              style={{ width: `${Math.min(Math.max(vibe.length || 6, 2), 24) * 0.92}ch`, outline: 'none' }}
              className="min-w-0 max-w-full bg-transparent p-0 font-semibold text-cta placeholder:font-normal placeholder:text-ink/35"
            />
            <span>?</span>
          </label>

          {/* Vibe chips */}
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {VIBES.map((v) => (
              <button
                key={v.key}
                onClick={() => setVibe(activeVibe?.key === v.key ? '' : v.label.toLowerCase())}
                aria-pressed={activeVibe?.key === v.key}
                className={`min-h-[36px] shrink-0 rounded-control px-3.5 text-[15px] transition-all active:scale-95 ${
                  activeVibe?.key === v.key ? 'bg-ink text-cream shadow-md' : 'bg-cta text-cream'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 px-4">
          <NearbyMap
            events={mapEvents}
            filterLabel={activeVibe?.label ?? null}
            friends={friends}
            me={location.pos}
            meKnown={location.known}
            locating={location.busy}
            locateError={location.error}
            onLocate={location.locate}
            onOpenEvent={onOpenEvent}
            onJoin={onJoin}
          />
        </div>

        <div className="pt-0">
          <Section title="Recommended" items={recommended} friends={friends} onSelect={onOpenEvent} />
          <Section title="Free Tonight?" items={tonight} friends={friends} onSelect={onOpenEvent} />
          <Section title="Next Weekend?" items={weekend} friends={friends} onSelect={onOpenEvent} />
        </div>
      </div>

    </div>
  );
};
