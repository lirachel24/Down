import React from 'react';
import { CalendarPlus } from 'lucide-react';
import { Beacon } from '../types';
import { downloadIcs } from '../lib/calendar';
import { formatWhen } from '../lib/format';
import { shortTitle } from '../lib/friends';

interface JoinSuccessPageProps {
  beacon: Beacon;
  onDone: () => void;
}

const shadow = { textShadow: '3px 3px 0 #18111A' } as React.CSSProperties;

// Shown right after someone claims a spot
export const JoinSuccessPage: React.FC<JoinSuccessPageProps> = ({ beacon, onDone }) => (
  <div role="dialog" aria-modal="true" aria-label="You're down" className="fixed inset-0 z-[65] flex justify-center bg-ink/40">
    <div className="relative flex h-full w-full max-w-[420px] flex-col items-center overflow-clip bg-cream">
      {/* Colourful glow, top and bottom */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#EBE7A8] opacity-90 blur-3xl" />
        <div className="absolute left-24 -top-10 h-56 w-64 rounded-full bg-[#F2A6CF] opacity-70 blur-3xl" />
        <div className="absolute -right-20 top-0 h-64 w-56 rounded-full bg-[#F0B38C] opacity-70 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#E4EA7A] opacity-80 blur-3xl" />
        <div className="absolute left-16 -bottom-16 h-56 w-72 rounded-full bg-[#F2A6CF] opacity-70 blur-3xl" />
        <div className="absolute -right-16 bottom-16 h-52 w-52 rounded-full bg-[#EBB6D8] opacity-60 blur-3xl" />
      </div>

      <div className="relative flex w-full flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="font-header text-[46px] leading-[1.05]" aria-label="Congrats, you're down">
          <span aria-hidden className="block text-pink">Congrats,</span>
          <span aria-hidden className="mt-2 block">
            <span className="text-pink" style={shadow}>you’re </span>
            <span className="text-lime" style={shadow}>down</span>
          </span>
        </h1>

        <img
          src="/high-five.png"
          alt="Two smiling friends giving each other a high five"
          className="mt-10 w-[300px] max-w-[80%] select-none animate-[pop-in_0.5s_ease-out]"
          draggable={false}
        />

        <p className="mt-8 text-base text-ink">
          <span className="font-semibold">{shortTitle(beacon.title)}</span>
        </p>
        <p className="mt-1 text-sm text-muted">{formatWhen(beacon.startTime)} · {beacon.locationName}</p>
      </div>

      <div className="relative flex w-full flex-col gap-3 px-6 pb-8">
        <button
          type="button"
          onClick={() => downloadIcs(beacon)}
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-line bg-white/80 text-base font-semibold text-ink active:scale-[0.98]"
        >
          <CalendarPlus className="h-5 w-5" /> Add to calendar
        </button>
        <button
          type="button"
          onClick={onDone}
          autoFocus
          className="min-h-[52px] rounded-full bg-lime text-base font-semibold text-ink active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  </div>
);
