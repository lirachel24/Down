import React, { useState } from 'react';
import {
  ArrowLeft,
  Share,
  Check,
  Ticket,
  MoreHorizontal,
  CalendarPlus,
  Navigation,
  Link2,
  MapPin,
  Shirt,
  Lock,
} from 'lucide-react';
import { Beacon } from '../types';
import { Card, CircleButton, Divider, PageShell } from './create-event/ui';
import { LocationMap } from './create-event/LocationMap';
import { formatPrice, safeHtml } from '../lib/format';
import { downloadIcs, eventLink } from '../lib/calendar';
import { HiddenMascot } from './Mascot';

interface EventDetailPageProps {
  beacon: Beacon;
  onBack: () => void;
  onJoin: (beaconId: string) => void;
  onToast: (message: string) => void;
}

// "Fri, Sep 25 · 4:00 PM – 5:00 PM"
const formatRange = (start: number, end: number) => {
  const s = new Date(start);
  const e = new Date(end);
  const day = s.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const sameDay = s.toDateString() === e.toDateString();
  return sameDay
    ? `${day} · ${time(s)} – ${time(e)}`
    : `${day}, ${time(s)} – ${e.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}, ${time(e)}`;
};

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ beacon, onBack, onJoin, onToast }) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const unlimited = beacon.capacity == null && beacon.spotsTotal >= 999;
  const capacity = beacon.capacity ?? (unlimited ? null : beacon.spotsTotal);
  const spotsLeft = capacity === null ? null : Math.max(0, capacity - beacon.spotsFilled);
  const isFull = spotsLeft === 0;
  const joined = !!beacon.joined;
  const canSeeExact = !beacon.exactLocationApprovedOnly || !!beacon.isHost || joined;
  const hasPin = beacon.lat !== undefined && beacon.lng !== undefined;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventLink(beacon.id));
      onToast('Event link copied.');
    } catch {
      onToast(`Copy this link: ${eventLink(beacon.id)}`);
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: beacon.title, text: `You down? ${beacon.title}`, url: eventLink(beacon.id) });
      } catch (err: any) {
        if (err?.name !== 'AbortError') copyLink();
      }
      return;
    }
    copyLink();
  };

  const directions = () => {
    const dest = hasPin ? `${beacon.lat},${beacon.lng}` : encodeURIComponent(beacon.address || beacon.locationName);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank', 'noopener,noreferrer');
  };

  const chips = [
    beacon.priceCents !== undefined ? formatPrice(beacon.priceCents) : null,
    beacon.requireApproval ? 'Host approval required' : null,
    capacity === null ? 'Open to everyone' : `${spotsLeft} of ${capacity} spots left`,
  ].filter(Boolean) as string[];

  return (
    <PageShell label={`Event: ${beacon.title}`}>
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <CircleButton label="Back" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </CircleButton>
        <CircleButton label="Share event" onClick={share}>
          <Share className="h-5 w-5" />
        </CircleButton>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-10">
        {/* Cover + host strip */}
        <div className="relative">
          <HiddenMascot id="event-cover" color="pink" message="Nice find. This one looks fun." className="-right-2 -top-5" size={46} tilt={14} />
        <div className="overflow-hidden rounded-card border border-line bg-white shadow-[0_10px_30px_-12px_rgba(24,17,26,0.35)]">
          <img src={beacon.image} alt="" className="aspect-square w-full object-cover" />
          <div className="flex items-center gap-2.5 border-t border-line bg-cream px-4 py-3">
            <img src={beacon.author.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-base text-ink">Hosted by {beacon.author.name}</span>
          </div>
        </div>
        </div>

        {/* Title + when */}
        <h1 className="mt-6 font-header text-[32px] leading-[1.1] text-ink">{beacon.title}</h1>
        <p className="mt-2 text-lg text-muted">{formatRange(beacon.startTime, beacon.expiresAt)}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          <span className="font-semibold text-berry">Why go: </span>
          {beacon.convinceMeReason}
        </p>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {joined ? (
            <div className="flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-control bg-berry px-2 text-white">
              <Check className="h-6 w-6 stroke-[2.5]" />
              <span className="text-base">You're down</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onJoin(beacon.id)}
              disabled={isFull}
              className="flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-control bg-lime px-2 text-ink active:scale-[0.98] disabled:opacity-50"
            >
              <Ticket className="h-6 w-6" />
              <span className="text-base">{isFull ? 'Full' : "I'm Down"}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            aria-expanded={moreOpen}
            className={`flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-control border border-line px-2 text-ink active:scale-[0.98] ${moreOpen ? 'bg-pink/15' : 'bg-white/70'}`}
          >
            <MoreHorizontal className="h-6 w-6" />
            <span className="text-base">More</span>
          </button>
        </div>

        {moreOpen && (
          <Card className="mt-2.5">
            <button type="button" onClick={() => downloadIcs(beacon)} className="flex min-h-[56px] w-full items-center gap-4 px-5 text-left text-base text-ink">
              <CalendarPlus className="h-5 w-5 text-muted" /> Add to calendar
            </button>
            <Divider />
            <button
              type="button"
              onClick={directions}
              disabled={!canSeeExact}
              className="flex min-h-[56px] w-full items-center gap-4 px-5 text-left text-base text-ink disabled:opacity-40"
            >
              <Navigation className="h-5 w-5 text-muted" /> Get directions
            </button>
            <Divider />
            <button type="button" onClick={copyLink} className="flex min-h-[56px] w-full items-center gap-4 px-5 text-left text-base text-ink">
              <Link2 className="h-5 w-5 text-muted" /> Copy event link
            </button>
          </Card>
        )}

        {/* Quick facts */}
        <div className="mt-5 flex flex-wrap gap-2">
          {chips.map((c) => (
            <span key={c} className="rounded-full border border-line bg-white/70 px-3.5 py-2 text-sm text-ink">
              {c}
            </span>
          ))}
        </div>

        {/* About */}
        <section className="mt-8" aria-label="About">
          <h2 className="border-b border-line pb-3 font-label text-lg text-muted">About</h2>
          {beacon.description && (
            <div className="rich-text mt-4 text-base leading-relaxed text-ink" dangerouslySetInnerHTML={{ __html: safeHtml(beacon.description) }} />
          )}
          <div className="mt-4 flex items-start gap-3 rounded-card border border-line bg-white/70 p-4">
            <Shirt className="mt-0.5 h-5 w-5 shrink-0 text-berry" />
            <div>
              <p className="text-sm font-semibold text-ink">What are we wearing?</p>
              <p className="text-base text-ink">{beacon.whatAreWeWearing}</p>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="mt-8" aria-label="Location">
          <h2 className="border-b border-line pb-3 font-label text-lg text-muted">Location</h2>
          <p className="mt-4 text-2xl text-ink">{beacon.locationName}</p>
          {canSeeExact ? (
            <>
              {beacon.address && <p className="mt-1 text-base text-muted">{beacon.address}</p>}
              {beacon.locationInstructions && <p className="mt-2 text-base text-ink">{beacon.locationInstructions}</p>}
              {hasPin && (
                <div className="mt-4 overflow-hidden rounded-card border border-line">
                  <LocationMap lat={beacon.lat!} lng={beacon.lng!} interactive={false} className="h-52 w-full" />
                </div>
              )}
            </>
          ) : (
            <p className="mt-3 flex items-center gap-2 text-base text-muted">
              <Lock className="h-4 w-4" /> The exact location is shared with approved guests.
            </p>
          )}
          {!hasPin && canSeeExact && !beacon.address && (
            <p className="mt-2 flex items-center gap-2 text-sm text-muted">
              <MapPin className="h-4 w-4" /> No map pin for this spot.
            </p>
          )}
        </section>

        {/* Going */}
        <section className="mt-8" aria-label="Who's going">
          <h2 className="border-b border-line pb-3 font-label text-lg text-muted">Going</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {beacon.attendees.slice(0, 5).map((a) => (
                <img key={a.id} src={a.avatar} alt={a.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-cream" />
              ))}
            </div>
            <p className="text-base text-ink">
              {beacon.attendees.length === 0
                ? 'Be the first to say you are down'
                : `${beacon.attendees.map((a) => a.name.split(' ')[0]).slice(0, 2).join(', ')}${beacon.attendees.length > 2 ? ` and ${beacon.attendees.length - 2} more` : ''} going`}
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
};
