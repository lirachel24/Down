import React, { useEffect, useRef, useState } from 'react';
import { Check, Crosshair, Loader2, MapPin, Plus, Search } from 'lucide-react';
import { EventDraft } from './types';
import { Card, CircleButton, Divider, PageHeader, PageShell, Toggle } from './ui';
import { LocationMap } from './LocationMap';
import { Place, reversePlace, searchPlaces } from '../../lib/api';

type DraftPlace = NonNullable<EventDraft['place']>;

interface LocationPageProps {
  place: EventDraft['place'];
  onSave: (place: DraftPlace | null) => void;
  onBack: () => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({ place, onSave, onBack }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [current, setCurrent] = useState<DraftPlace | null>(place);
  const abort = useRef<AbortController | null>(null);

  // Debounced search as the user types
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      setSearchError(null);
      return;
    }
    const t = setTimeout(async () => {
      abort.current?.abort();
      const ctrl = new AbortController();
      abort.current = ctrl;
      setSearching(true);
      setSearchError(null);
      try {
        setResults(await searchPlaces(q, ctrl.signal));
      } catch (err: any) {
        if (err.name !== 'AbortError') setSearchError(err.message);
      } finally {
        if (!ctrl.signal.aborted) setSearching(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const choose = (p: Place) => {
    setCurrent({ ...p, instructions: current?.instructions ?? '', exactOnlyApproved: current?.exactOnlyApproved ?? false });
    setQuery('');
    setResults([]);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return setSearchError('Your browser does not support location.');
    setLocating(true);
    setSearchError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          choose(await reversePlace(pos.coords.latitude, pos.coords.longitude));
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setSearchError('Could not get your location. Check your browser permissions or search instead.');
      },
      { timeout: 10000 }
    );
  };

  const moveMarker = async (lat: number, lng: number) => {
    setCurrent((c) => (c ? { ...c, lat, lng } : c)); // move the pin immediately
    const p = await reversePlace(lat, lng); // then resolve a friendly name and address
    setCurrent((c) => (c ? { ...c, ...p } : c));
  };

  const trimmed = query.trim();

  return (
    <PageShell label="Choose location">
      <PageHeader
        title="Location"
        onBack={onBack}
        right={
          <CircleButton label="Save location" variant="lime" onClick={() => onSave(current)} disabled={!current}>
            <Check className="h-5 w-5 stroke-[2.5]" />
          </CircleButton>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 pb-10">
        {/* Search */}
        <Card>
          <label className="flex min-h-[56px] items-center gap-3 px-5">
            <Search className="h-5 w-5 shrink-0 text-muted" />
            <span className="sr-only">Search for a place or address</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a place or address"
              autoFocus={!current}
              className="w-full bg-transparent text-base text-ink placeholder:text-ink/40 focus:outline-none"
            />
            {searching && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted" />}
          </label>
        </Card>

        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="mt-3 flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-white/70 px-4 text-sm font-semibold text-ink active:scale-95"
        >
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4 text-cta" />}
          Use my current location
        </button>

        {searchError && <p role="alert" className="mt-3 px-1 text-sm text-berry">{searchError}</p>}

        {trimmed.length >= 3 && (
          <Card className="mt-3">
            <ul aria-label="Search results">
              {results.map((r, i) => (
                <React.Fragment key={`${r.lat},${r.lng},${i}`}>
                  {i > 0 && <Divider />}
                  <li>
                    <button type="button" onClick={() => choose(r)} className="flex min-h-[56px] w-full items-center gap-4 px-5 py-3 text-left">
                      <MapPin className="h-5 w-5 shrink-0 text-cta" />
                      <span className="min-w-0">
                        <span className="block truncate text-base text-ink">{r.name}</span>
                        <span className="block truncate text-sm text-muted">{r.address}</span>
                      </span>
                    </button>
                  </li>
                </React.Fragment>
              ))}
              {!searching && results.length === 0 && !searchError && (
                <li className="px-5 py-3 text-sm text-muted">No places found. You can still use your own text below.</li>
              )}
              {results.length > 0 && <Divider />}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCurrent({ name: trimmed, address: trimmed, lat: NaN, lng: NaN, instructions: current?.instructions ?? '', exactOnlyApproved: current?.exactOnlyApproved ?? false });
                    setQuery('');
                  }}
                  className="flex min-h-[56px] w-full items-center gap-4 px-5 py-3 text-left"
                >
                  <Plus className="h-5 w-5 shrink-0 text-muted" />
                  <span className="truncate text-base text-ink">Use “{trimmed}” as the location</span>
                </button>
              </li>
            </ul>
          </Card>
        )}

        {/* Selected place */}
        {current && trimmed.length < 3 && (
          <div className="mt-4 flex flex-col gap-3">
            <Card>
              <div className="flex min-h-[64px] items-center gap-4 px-5 py-3">
                <MapPin className="h-5 w-5 shrink-0 text-cta" />
                <div className="min-w-0">
                  <p className="truncate text-lg text-ink">{current.name}</p>
                  <p className="text-sm text-muted">{current.address}</p>
                </div>
              </div>
              <Divider />
              <label className="flex min-h-[56px] items-center gap-4 px-5">
                <Plus className="h-5 w-5 shrink-0 text-muted" />
                <span className="sr-only">Further instructions</span>
                <input
                  type="text"
                  value={current.instructions}
                  onChange={(e) => setCurrent({ ...current, instructions: e.target.value })}
                  placeholder="Add Further Instructions…"
                  className="w-full bg-transparent text-base text-ink placeholder:text-ink/40 focus:outline-none"
                />
              </label>
            </Card>

            {Number.isFinite(current.lat) && Number.isFinite(current.lng) ? (
              <div className="overflow-hidden rounded-card border border-line">
                <LocationMap lat={current.lat} lng={current.lng} onPick={moveMarker} className="h-56 w-full" />
                <p className="bg-white/70 px-4 py-2 text-xs text-muted">Tap the map to move the pin.</p>
              </div>
            ) : (
              <p className="px-2 text-sm text-muted">This place has no pin on the map. Guests will see the text you entered.</p>
            )}

            <Card>
              <div className="flex min-h-[64px] items-center gap-4 px-5 py-3">
                <span className="flex-1 text-base text-ink">Only show exact location to approved guests</span>
                <Toggle
                  checked={current.exactOnlyApproved}
                  onChange={(v) => setCurrent({ ...current, exactOnlyApproved: v })}
                  label="Only show exact location to approved guests"
                />
              </div>
            </Card>

            <button
              type="button"
              onClick={() => {
                setCurrent(null);
                onSave(null);
              }}
              className="min-h-[44px] self-start px-2 text-sm text-muted underline underline-offset-4"
            >
              Remove location
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
};
