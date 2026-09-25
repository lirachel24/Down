import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Car, Check, Crosshair, Footprints, X } from 'lucide-react';
import { Beacon, FriendOrbit } from '../types';
import { distanceKm, fmtMinutes, LatLng, travelTimes } from '../lib/travel';
import { firstName, friendsGoing, namesList, shortTitle } from '../lib/friends';
import { shortWhen } from '../lib/suggest';
import { MascotFace } from './Mascot';

interface NearbyMapProps {
  events: Beacon[];
  filterLabel: string | null;
  friends: FriendOrbit[];
  me: LatLng;
  meKnown: boolean;
  locating: boolean;
  locateError: string | null;
  onLocate: () => void;
  onOpenEvent: (beacon: Beacon) => void;
  onJoin: (beaconId: string) => void;
}

const NEARBY_KM = 25;
const FRAME_KM = 6;

const meIcon = L.divIcon({
  className: '',
  html: '<div class="me-marker"><div class="me-ring"></div><div class="me-core">me</div></div>',
  iconSize: [0, 0],
});

// Faces are small when zoomed out and grow as you zoom in
const faceSizeForZoom = (zoom: number) => Math.max(18, Math.min(66, 18 + (zoom - 11) * 7));

const faceIcon = (color: 'pink' | 'green', selected: boolean, joined: boolean) =>
  L.divIcon({
    className: '',
    html: `<div class="face-marker${selected ? ' is-selected' : ''}"><img src="/face-${color}.png" alt="" draggable="false" />${joined ? '<span class="face-check">✓</span>' : ''}</div>`,
    iconSize: [0, 0],
  });

export const NearbyMap: React.FC<NearbyMapProps> = ({ events, filterLabel, friends, me, meKnown, locating, locateError, onLocate, onOpenEvent, onJoin }) => {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const meMarker = useRef<L.Marker | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const nearby = useMemo(
    () => events.filter((e) => e.lat !== undefined && e.lng !== undefined && distanceKm(me, [e.lat, e.lng]) <= NEARBY_KM),
    [events, me]
  );
  const selected = nearby.find((e) => e.id === selectedId) ?? null;

  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, { center: me, zoom: 15, zoomControl: false, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);
    meMarker.current = L.marker(me, { icon: meIcon, keyboard: false, interactive: false, zIndexOffset: -1000 }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    m.on('click', () => setSelectedId(null));
    map.current = m;

    const applyZoomSize = () => {
      const size = faceSizeForZoom(m.getZoom());
      el.current?.style.setProperty('--face-size', `${size}px`);
      el.current?.style.setProperty('--me-size', `${Math.round(size * 2)}px`);
    };
    applyZoomSize();
    m.on('zoom', applyZoomSize);
    m.on('zoomend', applyZoomSize);

    const t = setTimeout(() => m.invalidateSize(), 50);
    return () => {
      clearTimeout(t);
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Faces for every nearby event: green when a friend is going, pink otherwise
  useEffect(() => {
    if (!map.current || !layer.current) return;
    layer.current.clearLayers();
    nearby.forEach((e) => {
      const color = friendsGoing(e, friends).length > 0 ? 'green' : 'pink';
      const marker = L.marker([e.lat!, e.lng!], {
        icon: faceIcon(color, e.id === selectedId, !!e.joined),
        title: e.title,
        alt: e.title,
        riseOnHover: true,
        zIndexOffset: e.id === selectedId ? 1000 : 0,
      });
      marker.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev);
        setSelectedId(e.id);
        map.current?.panTo([e.lat!, e.lng!], { animate: true });
      });
      marker.addTo(layer.current!);
    });
  }, [nearby, friends, selectedId]);

  // Follow the person, and frame them together with the nearby events
  const fitKey = `${nearby.map((e) => e.id).join(',')}|${meKnown}`;
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    meMarker.current?.setLatLng(me);
    // Frame the person and the events close to them. Farther ones are still on the map when zooming out.
    const close = nearby.filter((e) => distanceKm(me, [e.lat!, e.lng!]) <= FRAME_KM);
    const pts: L.LatLngExpression[] = [me, ...close.map((e) => [e.lat!, e.lng!] as L.LatLngExpression)];
    if (pts.length > 1) m.fitBounds(L.latLngBounds(pts), { padding: [46, 46], maxZoom: 16 });
    else m.setView(me, 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey]);

  useEffect(() => {
    meMarker.current?.setLatLng(me);
  }, [me]);

  const going = selected ? friendsGoing(selected, friends) : [];
  const t = selected ? travelTimes(distanceKm(me, [selected.lat!, selected.lng!])) : null;
  const spotsLeft = selected && selected.spotsTotal < 999 ? Math.max(0, selected.spotsTotal - selected.spotsFilled) : null;
  const full = spotsLeft === 0;

  return (
    <div className="relative">
      <div className="relative isolate z-0 overflow-hidden rounded-card border border-line">
        <div ref={el} className="h-[360px] w-full bg-sand" role="application" aria-label="Map of events near you. Tap a face to see the event" />

        <button
          type="button"
          onClick={onLocate}
          disabled={locating}
          aria-label="Center the map on my location"
          className="absolute right-3 top-3 z-[500] flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-md active:scale-95 disabled:opacity-60"
        >
          <Crosshair className={`h-5 w-5 ${locating ? 'animate-pulse' : ''}`} />
        </button>

        {selected && t && (
          <section
            aria-label={`${selected.title}, quick sign up`}
            className="absolute inset-x-2.5 bottom-2.5 z-[600] rounded-card border border-line bg-white p-3.5 shadow-[0_12px_32px_-8px_rgba(24,17,26,0.35)]"
          >
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Close event preview"
              className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-sand"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex gap-3">
              <img src={selected.image} alt="" className="h-[72px] w-[72px] shrink-0 rounded-control object-cover" />
              <div className="min-w-0 pr-8">
                <h3 className="truncate font-headline text-base font-bold leading-tight text-ink">{shortTitle(selected.title)}</h3>
                <p className="mt-0.5 truncate text-sm text-muted">
                  {shortWhen(selected.startTime)} · {selected.locationName.split(' · ')[0]}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-ink">
                  <span className="flex items-center gap-1"><Footprints className="h-4 w-4 text-muted" /> {fmtMinutes(t.walk)}</span>
                  <span className="flex items-center gap-1"><Car className="h-4 w-4 text-muted" /> {fmtMinutes(t.drive)}</span>
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              {going.length > 0 ? (
                <>
                  <span className="flex -space-x-2">
                    {going.slice(0, 4).map((f) => (
                      <img key={f.id} src={f.avatar} alt={f.name} className="h-7 w-7 rounded-full object-cover ring-2 ring-white" />
                    ))}
                  </span>
                  <span className="text-sm text-ink">{namesList(going.map((f) => firstName(f.name)))} {going.length === 1 ? 'is' : 'are'} going</span>
                </>
              ) : (
                <span className="text-sm text-muted">None of your friends yet. Be the first.</span>
              )}
              {spotsLeft !== null && <span className="ml-auto shrink-0 text-xs text-muted">{spotsLeft} spots left</span>}
            </div>

            <div className="mt-3 flex gap-2">
              {selected.joined ? (
                <div className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full bg-cta text-base font-semibold text-cream">
                  <Check className="h-5 w-5 stroke-[2.5]" /> You're down
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onJoin(selected.id)}
                  disabled={full}
                  className="min-h-[46px] flex-1 rounded-full border-2 border-cta bg-white text-base font-semibold text-cta active:scale-[0.98] disabled:opacity-50"
                >
                  {full ? 'Full' : "I'm Down"}
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpenEvent(selected)}
                className="min-h-[46px] rounded-full border border-line bg-white px-5 text-base text-ink active:scale-[0.98]"
              >
                Details
              </button>
            </div>
            {!meKnown && <p className="mt-2 text-xs text-muted">Times are from downtown Berkeley. Tap ⌖ to use your location.</p>}
          </section>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-sm text-muted">
        <span className="flex items-center gap-1.5"><MascotFace color="green" size={24} /> friends going</span>
        <span className="flex items-center gap-1.5"><MascotFace color="pink" size={24} /> be the first</span>
      </div>
      {filterLabel && (
        <p role="status" className="mt-1 px-1 text-sm text-ink">
          {nearby.length === 0 ? `No ${filterLabel.toLowerCase()} events nearby right now.` : `Showing ${nearby.length} ${filterLabel.toLowerCase()} ${nearby.length === 1 ? 'event' : 'events'}.`}
        </p>
      )}
      {locateError && <p role="alert" className="mt-1 px-1 text-sm text-berry">{locateError}</p>}
      {!meKnown && !locateError && <p className="mt-1 px-1 text-sm text-muted">Showing events near downtown Berkeley. Tap ⌖ to use your location.</p>}

      <img
        src="/high-five.png"
        alt="Two smiling friends giving each other a high five"
        className="pointer-events-none relative -mt-2 ml-auto mr-[-6px] block w-[140px] select-none"
        draggable={false}
      />
    </div>
  );
};
