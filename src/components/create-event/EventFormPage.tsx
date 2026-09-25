import React, { useEffect, useRef, useState } from 'react';
import { Check, ImagePlus, MapPin, FileText, Lock, DollarSign, Globe, Users, Loader2, Play } from 'lucide-react';
import { EventDraft } from './types';
import { Card, CircleButton, Divider, PageHeader, PageShell, SectionLabel, Toggle } from './ui';
import { fileToCoverDataUrl, formatPrice, formatWhen, htmlToText } from '../../lib/format';
import { WheelDateTimePicker } from './WheelDateTimePicker';
import { MascotFace, HiddenMascot } from '../Mascot';

// Stable remote URLs (not bundler paths) so covers saved with an event keep working after a rebuild
export const COVERS = [
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
];

interface EventFormPageProps {
  draft: EventDraft;
  update: (patch: Partial<EventDraft>) => void;
  errors: Record<string, string>;
  submitting: boolean;
  submitError: string | null;
  onOpenLocation: () => void;
  onOpenDescription: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

const DateTimeRow: React.FC<{
  label: string;
  value: number;
  onChange: (ts: number) => void;
  dot: 'filled' | 'hollow';
}> = ({ label, value, onChange, dot }) => {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`${label}: ${formatWhen(value)}. Change ${label.toLowerCase()} time`}
        className="flex min-h-[56px] w-full items-center gap-4 px-5 text-left"
      >
        <MascotFace color={dot === 'filled' ? 'pink' : 'green'} size={22} interactive={false} />
        <span className="flex-1 text-base text-muted">{label}</span>
        <span className={`rounded-control px-3 py-1.5 text-base text-ink transition-colors ${open ? 'bg-pink/15' : 'bg-sand'}`}>{formatWhen(value)}</span>
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={`Pick ${label.toLowerCase()} date and time`}
          className="absolute right-3 top-full z-40 mt-1 w-[min(340px,calc(100%-24px))] rounded-card border border-line bg-white shadow-[0_20px_50px_-12px_rgba(24,17,26,0.35)]"
        >
          <WheelDateTimePicker value={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

const SelectRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}> = ({ icon, label, value, onChange, options }) => (
  <label className="flex min-h-[56px] cursor-pointer items-center gap-4 px-5">
    <span className="text-muted">{icon}</span>
    <span className="flex-1 text-base text-ink">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-[45%] cursor-pointer rounded-control bg-transparent py-2 pl-2 text-right text-base text-ink focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

export const EventFormPage: React.FC<EventFormPageProps> = ({
  draft,
  update,
  errors,
  submitting,
  submitError,
  onOpenLocation,
  onOpenDescription,
  onSubmit,
  onClose,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [priceOpen, setPriceOpen] = useState(false);
  const descriptionText = htmlToText(draft.descriptionHtml);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      update({ cover: await fileToCoverDataUrl(file) });
      setCoverError(null);
    } catch (err: any) {
      setCoverError(err.message);
    }
  };

  const setStart = (ts: number) => {
    const duration = draft.end - draft.start;
    update({ start: ts, end: ts + (duration > 0 ? duration : 3600_000) });
  };

  return (
    <PageShell label="Create Event">
      <PageHeader
        title="Create Event"
        onBack={onClose}
        backIcon="close"
        right={
          <CircleButton label="Create event" variant="cta" onClick={onSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5 stroke-[2.5]" />}
          </CircleButton>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 pb-10">
        {/* Cover */}
        <div className="mx-auto w-[64%]">
          <div className="relative aspect-square overflow-hidden rounded-card border border-line bg-sand shadow-[0_10px_30px_-12px_rgba(24,17,26,0.35)]">
            <img src={draft.cover} alt="Event cover" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Upload a cover photo"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-ink/85 text-white backdrop-blur active:scale-95"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
          </div>
          <div className="mt-3 flex justify-center gap-2" role="group" aria-label="Preset covers">
            {COVERS.map((src, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Use preset cover ${i + 1}`}
                aria-pressed={draft.cover === src}
                onClick={() => update({ cover: src })}
                className={`h-11 w-11 overflow-hidden rounded-control border-2 ${draft.cover === src ? 'border-pink' : 'border-transparent'}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          {coverError && <p role="alert" className="mt-2 text-center text-sm text-berry">{coverError}</p>}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {/* Name */}
          <div>
            <label htmlFor="event-name" className="sr-only">Event name</label>
            <input
              id="event-name"
              type="text"
              value={draft.title}
              maxLength={80}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Event Name"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'err-title' : undefined}
              className="min-h-[64px] w-full rounded-control border border-line bg-white/70 px-5 font-headline text-2xl font-bold text-ink placeholder:text-ink/30 focus:outline-none focus:border-pink/40 focus:ring-4 focus:ring-pink/10"
            />
            {errors.title && <p id="err-title" role="alert" className="mt-1.5 px-2 text-sm text-berry">{errors.title}</p>}
          </div>

          {/* Start / End */}
          <div>
            <div className="relative z-20 rounded-card border border-line bg-white/70 py-1 backdrop-blur-md">
              <DateTimeRow label="Start" value={draft.start} onChange={setStart} dot="filled" />
              <div className="ml-14 h-px bg-line" />
              <DateTimeRow label="End" value={draft.end} onChange={(end) => update({ end })} dot="hollow" />
            </div>
            {errors.end && <p role="alert" className="mt-1.5 px-2 text-sm text-berry">{errors.end}</p>}
          </div>

          {/* Location */}
          <div>
            <Card>
              <button type="button" onClick={onOpenLocation} className="flex min-h-[56px] w-full items-center gap-4 px-5 py-3 text-left">
                <MapPin className="h-5 w-5 shrink-0 text-cta" />
                {draft.place ? (
                  <span className="min-w-0">
                    <span className="block truncate text-base text-ink">{draft.place.name}</span>
                    <span className="block truncate text-sm text-muted">{draft.place.address}</span>
                  </span>
                ) : (
                  <span className="text-base text-muted">Choose Location</span>
                )}
              </button>
            </Card>
            {errors.place && <p role="alert" className="mt-1.5 px-2 text-sm text-berry">{errors.place}</p>}
          </div>

          {/* Description */}
          <Card>
            <button type="button" onClick={onOpenDescription} className="flex min-h-[56px] w-full items-center gap-4 px-5 py-3 text-left">
              <FileText className="h-5 w-5 shrink-0 text-muted" />
              {descriptionText ? (
                <span className="min-w-0">
                  <span className="block text-xs text-muted">Description</span>
                  <span className="block truncate text-base text-ink">{descriptionText}</span>
                </span>
              ) : (
                <span className="text-base text-muted">Add Description</span>
              )}
            </button>
          </Card>

          <SectionLabel>Ticketing</SectionLabel>
          <Card>
            <div className="flex min-h-[56px] items-center gap-4 px-5">
              <Lock className="h-5 w-5 shrink-0 text-muted" />
              <span className="flex-1 text-base text-ink">Require Approval</span>
              <Toggle checked={draft.requireApproval} onChange={(v) => update({ requireApproval: v })} label="Require approval" />
            </div>
            <Divider />
            <button
              type="button"
              onClick={() => setPriceOpen((o) => !o)}
              aria-expanded={priceOpen}
              className="flex min-h-[56px] w-full items-center gap-4 px-5 text-left"
            >
              <DollarSign className="h-5 w-5 shrink-0 text-muted" />
              <span className="flex-1 text-base text-ink">Price</span>
              <span className="text-base text-ink">{formatPrice(draft.priceCents)}</span>
            </button>
            {priceOpen && (
              <div className="flex items-center gap-3 px-5 pb-4">
                <button
                  type="button"
                  aria-pressed={draft.priceCents === 0}
                  onClick={() => update({ priceCents: 0 })}
                  className={`min-h-[44px] rounded-full px-5 text-sm font-semibold ${draft.priceCents === 0 ? 'bg-cta text-cream' : 'border border-line bg-white text-ink'}`}
                >
                  Free
                </button>
                <label className="flex min-h-[44px] flex-1 items-center gap-1 rounded-full border border-line bg-white px-4">
                  <span className="text-ink">$</span>
                  <span className="sr-only">Ticket price in dollars</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={1}
                    value={draft.priceCents > 0 ? draft.priceCents / 100 : ''}
                    placeholder="0"
                    onChange={(e) => update({ priceCents: Math.max(0, Math.round(parseFloat(e.target.value || '0') * 100)) })}
                    className="w-full bg-transparent text-base text-ink focus:outline-none"
                  />
                </label>
              </div>
            )}
          </Card>

          <SectionLabel>Options</SectionLabel>
          <Card>
            <SelectRow
              icon={<Globe className="h-5 w-5" />}
              label="Visibility"
              value={draft.visibility}
              onChange={(v) => update({ visibility: v as EventDraft['visibility'] })}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'friends', label: 'Friends only' },
                { value: 'private', label: 'Private' },
              ]}
            />
            <Divider />
            <SelectRow
              icon={<Users className="h-5 w-5" />}
              label="Capacity"
              value={draft.capacity === null ? 'unlimited' : String(draft.capacity)}
              onChange={(v) => update({ capacity: v === 'unlimited' ? null : Number(v) })}
              options={[
                { value: 'unlimited', label: 'Unlimited' },
                ...[2, 3, 4, 6, 10, 20].map((n) => ({ value: String(n), label: `${n} people` })),
              ]}
            />
          </Card>

          {submitError && <p role="alert" className="px-2 text-sm text-berry">{submitError}</p>}

          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="mt-2 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-lime text-base font-semibold text-ink active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-4 w-4 fill-ink" />}
            <span>{submitting ? 'Creating…' : 'Create Event'}</span>
          </button>

          <div className="relative h-14">
            <HiddenMascot id="create-form" color="pink" message="Great plans start with one tap." className="right-6 top-1" size={44} tilt={-8} />
          </div>
        </div>
      </div>
    </PageShell>
  );
};
