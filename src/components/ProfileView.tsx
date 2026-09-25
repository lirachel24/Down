import React from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, Instagram, MapPin, Ticket } from 'lucide-react';
import { Beacon, UserProfile } from '../types';
import { formatWhen } from '../lib/format';

interface ProfileViewProps {
  user: UserProfile;
  beacons: Beacon[];
  onBack: () => void;
  onSelectBeacon: (beacon: Beacon) => void;
  }

const EventRow: React.FC<{ beacon: Beacon; onSelect: (b: Beacon) => void; past?: boolean }> = ({ beacon, onSelect, past }) => (
  <button
    onClick={() => onSelect(beacon)}
    className="flex w-full items-center gap-4 py-3 text-left active:opacity-70"
    aria-label={`${beacon.title}, ${formatWhen(beacon.startTime)}`}
  >
    <img src={beacon.image} alt="" className={`h-[88px] w-[88px] shrink-0 rounded-2xl object-cover ${past ? 'grayscale opacity-80' : ''}`} />
    <span className="min-w-0">
      <span className="block truncate font-headline text-lg font-bold text-ink">{beacon.title}</span>
      <span className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <Clock className="h-4 w-4 shrink-0" />
        <span className="truncate">{formatWhen(beacon.startTime)}</span>
      </span>
      <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="truncate">{beacon.locationName}</span>
      </span>
    </span>
  </button>
);

export const ProfileView: React.FC<ProfileViewProps> = ({ user, beacons, onBack, onSelectBeacon }) => {
  const now = Date.now();
  const hosted = beacons.filter((b) => b.author.id === user.id);
  const hosting = hosted.filter((b) => b.expiresAt > now).sort((a, b) => a.startTime - b.startTime);
  const past = hosted.filter((b) => b.expiresAt <= now).sort((a, b) => b.startTime - a.startTime);
  const attendedCount = beacons.filter((b) => b.joined && b.author.id !== user.id).length;

  return (
    <div className="pb-32">
      <div className="px-4 pt-4">
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/80 text-ink active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Identity */}
      <section className="px-5 pt-4" aria-label="Profile">
        <img src={user.avatar} alt={user.name} className="h-[90px] w-[90px] rounded-full object-cover ring-2 ring-white shadow-xs" />
        <h1 className="mt-5 font-header text-4xl leading-none text-ink">{user.name}</h1>
        <p className="mt-1.5 text-base text-muted">{user.handle}</p>
        <p className="mt-3 text-base text-ink">{user.bio}</p>
        <p className="mt-3 flex items-center gap-2 text-base text-muted">
          <CalendarDays className="h-5 w-5" />
          Joined {user.joinedAt}
        </p>
        <p className="mt-3 text-base text-ink">
          <span className="font-semibold">{hosted.length}</span> <span className="text-muted">Hosted</span>
          <span className="ml-4 font-semibold">{attendedCount}</span> <span className="text-muted">Attended</span>
        </p>
        {user.socials && (
          <div className="mt-4 flex gap-3">
            {user.socials.instagram && (
              <a
                href={`https://instagram.com/${user.socials.instagram}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/70 text-muted"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {user.socials.x && (
              <a
                href={`https://x.com/${user.socials.x}`}
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/70 font-headline text-lg font-bold text-muted"
              >
                𝕏
              </a>
            )}
          </div>
        )}
      </section>

      <div className="mt-6 border-t border-line" />

      {/* Events */}
      <section className="px-5" aria-label="Events">
        {hosting.length === 0 && past.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <Ticket className="h-14 w-14 text-ink/25" strokeWidth={1.4} />
            <h2 className="mt-4 font-headline text-xl font-bold text-muted">Nothing Here, Yet</h2>
            <p className="mt-1 text-base text-muted">{user.name} has no public events at this time.</p>
          </div>
        ) : (
          <>
            {hosting.length > 0 && (
              <div className="pt-5">
                <h2 className="font-headline text-2xl font-bold text-ink">Hosting</h2>
                <div className="mt-1 divide-y divide-line">
                  {hosting.map((b) => (
                    <EventRow key={b.id} beacon={b} onSelect={onSelectBeacon} />
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div className="pt-5">
                <h2 className="font-headline text-2xl font-bold text-ink">Past Events</h2>
                <div className="mt-1 divide-y divide-line">
                  {past.map((b) => (
                    <EventRow key={b.id} beacon={b} onSelect={onSelectBeacon} past />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <div className="border-t border-line" />

      {/* Preferences */}
      <section className="flex flex-col gap-5 px-5 pt-6" aria-label="Preferences">
        <h2 className="font-headline text-2xl font-bold text-ink">Preferences</h2>

      {/* Anti-Flake Deposit Account Balance */}
      <div className="bg-white rounded-3xl p-5 border border-line shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#9B004F]" />
            <h3 className="font-headline text-base font-bold text-[#18111A]">
              Accountability Ledger
            </h3>
          </div>
          <span className="text-[10px] font-bold bg-[#CCFF00] text-[#18111A] px-2.5 py-0.5 rounded-full">
            $5 Refund Model
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-sand rounded-2xl border border-line">
            <span className="text-[11px] text-neutral-600 block">Refunded on Arrival</span>
            <span className="text-xl font-mono font-bold text-[#9B004F]">$25.00</span>
          </div>
          <div className="p-3 bg-sand rounded-2xl border border-line">
            <span className="text-[11px] text-neutral-600 block">Active Held Deposits</span>
            <span className="text-xl font-mono font-bold text-[#18111A]">$5.00</span>
          </div>
        </div>
      </div>
      </section>
    </div>
  );
};
