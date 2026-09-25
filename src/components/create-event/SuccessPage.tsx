import React, { useState } from 'react';
import { Check, Clock, MapPin, X } from 'lucide-react';
import { Beacon } from '../../types';
import { PageShell, CircleButton } from './ui';
import { LocationMap } from './LocationMap';
import { formatWhen } from '../../lib/format';

interface SuccessPageProps {
  event: Beacon;
  onClose: () => void;
  onViewEvent: () => void;
}

export const eventLink = (id: string) => `${window.location.origin}/?event=${encodeURIComponent(id)}`;

export const SuccessPage: React.FC<SuccessPageProps> = ({ event, onClose, onViewEvent }) => {
  const [note, setNote] = useState<string | null>(null);

  const invite = async () => {
    const url = eventLink(event.id);
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text: `You down? ${event.title}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNote('Invite link copied. Send it to your people!');
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // user closed the share sheet
      setNote(`Copy this link: ${url}`);
    }
  };

  const hasPin = event.lat !== undefined && event.lng !== undefined;

  return (
    <PageShell label="Event created">
      <div className="flex justify-end px-4 pt-4">
        <CircleButton label="Close" onClick={onClose}>
          <X className="h-5 w-5" />
        </CircleButton>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-6">
        <div className="mt-2 flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-pink shadow-[0_10px_30px_-10px_rgba(255,77,148,0.7)]">
            <Check className="h-12 w-12 stroke-[3] text-white" />
          </div>
          <p className="mt-6 font-label text-sm uppercase tracking-wider text-muted">Event Created!</p>
          <h1 className="mt-1 font-header text-3xl leading-tight text-ink">{event.title}</h1>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 text-ink">
          <p className="flex items-center gap-3 text-base">
            <Clock className="h-5 w-5 shrink-0 text-muted" />
            {formatWhen(event.startTime)}
          </p>
          <p className="flex items-center gap-3 text-base">
            <MapPin className="h-5 w-5 shrink-0 text-muted" />
            <span className="min-w-0 truncate">{event.locationName}</span>
          </p>
        </div>

        {hasPin && (
          <div className="mt-4 overflow-hidden rounded-3xl border border-line">
            <LocationMap lat={event.lat!} lng={event.lng!} interactive={false} className="h-44 w-full" />
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-8">
          {note && <p role="status" className="break-all text-center text-sm text-muted">{note}</p>}
          <button type="button" onClick={onViewEvent} className="min-h-[56px] rounded-full bg-ink text-base font-semibold text-lime active:scale-[0.98]">
            View Event Page
          </button>
          <button type="button" onClick={invite} className="min-h-[56px] rounded-full border border-line bg-white/80 text-base font-semibold text-ink active:scale-[0.98]">
            Invite Guests
          </button>
        </div>
      </div>
    </PageShell>
  );
};
