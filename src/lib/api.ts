import { Beacon } from '../types';

export interface Place {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export async function fetchEvents(): Promise<Beacon[]> {
  try {
    const res = await fetch('/api/events');
    if (!res.ok) return [];
    const data = await res.json();
    return data.events ?? [];
  } catch {
    return [];
  }
}

export async function saveEvent(event: Beacon): Promise<void> {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error('Could not save the event. Please try again.');
}

export async function searchPlaces(q: string, signal?: AbortSignal): Promise<Place[]> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`, { signal });
  if (!res.ok) throw new Error('Location search is unavailable right now.');
  const data = await res.json();
  return data.places ?? [];
}

export async function reversePlace(lat: number, lng: number): Promise<Place> {
  const res = await fetch(`/api/reverse?lat=${lat}&lng=${lng}`);
  const data = await res.json();
  return data.place;
}

export async function draftDescription(payload: { title: string; location?: string; when?: string }): Promise<string> {
  const res = await fetch('/api/gemini/event-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.html as string;
}
