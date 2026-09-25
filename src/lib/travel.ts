export type LatLng = [number, number];

export const distanceKm = (a: LatLng, b: LatLng) => {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(rad(b[0] - a[0]) / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(rad(b[1] - a[1]) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

// Straight-line distance is turned into a rough street distance, then into walking / driving times
export function travelTimes(km: number) {
  const road = km * 1.3;
  return {
    walk: Math.max(1, Math.round((road / 5) * 60)),
    drive: Math.max(2, Math.round(3 + (road / 25) * 60)),
    roadKm: road,
  };
}

export const fmtMinutes = (min: number) => (min < 60 ? `${min} min` : `${Math.floor(min / 60)} hr${min % 60 ? ` ${min % 60} min` : ''}`);

// "12 min walk" for short trips, "9 min drive" for longer ones
export function travelLabel(km: number) {
  const t = travelTimes(km);
  return t.walk <= 25 ? `${fmtMinutes(t.walk)} walk` : `${fmtMinutes(t.drive)} drive`;
}

// "3 hours and 32 minutes"
export function fmtHoursMinutes(ms: number) {
  const total = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(total / 60);
  const m = total % 60;
  const parts: string[] = [];
  if (h) parts.push(`${h} ${h === 1 ? 'hour' : 'hours'}`);
  if (m || !h) parts.push(`${m} ${m === 1 ? 'minute' : 'minutes'}`);
  return parts.join(' and ');
}

// "3h 32m" / "45m"
export function fmtShortDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`;
}
