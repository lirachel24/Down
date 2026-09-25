import React, { useState } from 'react';
import { TopActions } from './TopActions';
import { Beacon } from '../types';
import { UpcomingEvent } from '../data/mockData';

interface EventHomeProps {
  userName: string;
  recommended: Beacon[];
  freeTonight: UpcomingEvent[];
  nextWeekend: UpcomingEvent[];
  onSelectBeacon: (beacon: Beacon) => void;
  avatar: string;
  onOpenProfile: () => void;
}

const VIBES = ['Brunch', 'Working Out', 'Party', 'Music', 'Coffee'];

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

interface CardItem {
  id: string;
  title: string;
  startsAt: number;
  image?: string;
}

const Section: React.FC<{ title: string; items: CardItem[]; onSelect?: (id: string) => void }> = ({
  title,
  items,
  onSelect,
}) => (
  <section className="mt-9" aria-label={title}>
    <div className="flex items-end justify-between px-4">
      <h2 className="font-header text-[26px] leading-none text-[#18111A]">{title}</h2>
      <button className="text-sm text-[#18111A] underline underline-offset-4 decoration-[#18111A]/60">
        See more
      </button>
    </div>

    <div className="no-scrollbar mt-3.5 flex gap-3 overflow-x-auto px-4 pb-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect?.(item.id)}
          className="w-[150px] shrink-0 text-left active:scale-[0.98] transition-transform"
        >
          <div className="relative aspect-[234/194] w-full overflow-hidden rounded-2xl bg-[#D9D9D9]">
            {item.image && (
              <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <span className="absolute left-2 top-2 rounded-full bg-[#FF4D94] px-3 py-1.5 text-[13px] leading-none text-white whitespace-nowrap">
              {formatEventDate(item.startsAt)}
            </span>
          </div>
          <p className="mt-2 truncate text-sm text-[#18111A]">{item.title}</p>
        </button>
      ))}
    </div>
  </section>
);

export const EventHome: React.FC<EventHomeProps> = ({
  userName,
  recommended,
  freeTonight,
  nextWeekend,
  onSelectBeacon,
  avatar,
  onOpenProfile,
}) => {
  const [vibe, setVibe] = useState('coffee');

  return (
    <div className="relative overflow-clip bg-cream pb-40">
      {/* Gradient glow blobs behind the hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#EBE7A8] opacity-80 blur-3xl" />
        <div className="absolute -right-16 top-4 h-60 w-60 rounded-full bg-[#E8A4C8] opacity-70 blur-3xl" />
        <div className="absolute -right-10 top-24 h-40 w-40 rounded-full bg-[#E0A48C] opacity-50 blur-3xl" />
        <div className="absolute -left-24 top-[330px] h-56 w-40 rounded-full bg-[#F2A6CF] opacity-60 blur-3xl" />
        <div className="absolute -left-28 top-[400px] h-40 w-32 rounded-full bg-[#D8E06A] opacity-60 blur-3xl" />
      </div>

      <div className="relative">
        {/* Hero */}
        <div className="px-4 pt-8">
          <div className="flex items-start justify-between">
            <h1 className="font-header text-[44px] leading-[1.02] tracking-tight">
              <span className="block text-[#FF4D94]">{userName},</span>
              <span className="block text-[#18111A]">You Down?</span>
            </h1>
            <TopActions avatar={avatar} name={userName} onOpenProfile={onOpenProfile} />
          </div>

          {/* Prompt bar */}
          {/* Prompt bar: the highlighted word is a real text field */}
          <label className="mt-9 flex min-h-[64px] cursor-text items-center rounded-3xl border border-white/60 bg-white/30 px-6 py-5 text-base shadow-[0_2px_20px_rgba(0,0,0,0.04)] backdrop-blur-md focus-within:border-pink/40 focus-within:ring-4 focus-within:ring-pink/10">
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
              style={{ width: `${Math.min(Math.max(vibe.length || 6, 2), 24) * 0.92}ch` }}
              className="min-w-0 max-w-full bg-transparent p-0 font-semibold text-pink placeholder:text-pink/40 focus:outline-none"
            />
            <span>?</span>
          </label>

          {/* Vibe chips */}
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {VIBES.map((v) => (
              <button
                key={v}
                onClick={() => setVibe(v.toLowerCase())}
                aria-pressed={vibe.trim().toLowerCase() === v.toLowerCase()}
                className="min-h-[36px] shrink-0 rounded-xl bg-[#FF4D94] px-3.5 text-[15px] text-white active:scale-95 transition-transform"
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-0">
          <Section
            title="Recommended"
            items={recommended.map((b) => ({ id: b.id, title: b.title, startsAt: b.startTime, image: b.image }))}
            onSelect={(id) => {
              const beacon = recommended.find((b) => b.id === id);
              if (beacon) onSelectBeacon(beacon);
            }}
          />
          <Section title="Free Tonight?" items={freeTonight} />
          <Section title="Next Weekend?" items={nextWeekend} />

        </div>
      </div>
    </div>
  );
};
