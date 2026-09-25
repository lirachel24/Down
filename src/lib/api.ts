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

// ---------- Chat ----------
export interface ChatMessage {
  id: string;
  threadId: string;
  from: 'me' | 'friend';
  text: string;
  ts: number;
}

export interface ThreadSummary {
  last: ChatMessage;
  unread: number;
}

export async function fetchThreads(): Promise<Record<string, ThreadSummary>> {
  try {
    const res = await fetch('/api/threads');
    if (!res.ok) return {};
    return (await res.json()).threads ?? {};
  } catch {
    return {};
  }
}

export async function fetchMessages(threadId: string): Promise<ChatMessage[]> {
  const res = await fetch(`/api/messages?thread=${encodeURIComponent(threadId)}`);
  if (!res.ok) throw new Error('Could not load messages.');
  return (await res.json()).messages ?? [];
}

export async function sendMessage(threadId: string, text: string): Promise<ChatMessage> {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadId, text }),
  });
  if (!res.ok) throw new Error('Message not sent.');
  return (await res.json()).message;
}

export async function markThreadRead(threadId: string): Promise<void> {
  try {
    await fetch('/api/messages/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId }),
    });
  } catch {
    /* best effort */
  }
}

export async function requestFriendReply(threadId: string, friendName: string, interests: string[]): Promise<ChatMessage | null> {
  try {
    const res = await fetch('/api/messages/auto-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, friendName, interests: interests.join(', ') }),
    });
    if (!res.ok) return null;
    return (await res.json()).message;
  } catch {
    return null;
  }
}

export async function suggestMessage(friendName: string, type: 'day2-callback' | 'day7-chore' | 'day21-circle', memorySnippet?: string): Promise<string> {
  const res = await fetch('/api/gemini/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ friendName, type, memorySnippet }),
  });
  const data = await res.json();
  return data.message as string;
}

// ---------- Google Calendar (private iCal address) ----------
export interface CalendarEvent {
  title: string;
  start: number;
  end: number;
}

export interface CalendarState {
  connected: boolean;
  events: CalendarEvent[];
  error?: string;
}

export async function fetchCalendar(): Promise<CalendarState> {
  try {
    const res = await fetch('/api/calendar');
    if (!res.ok) return { connected: false, events: [] };
    return await res.json();
  } catch {
    return { connected: false, events: [] };
  }
}

export async function connectCalendar(url: string): Promise<CalendarState> {
  const res = await fetch('/api/calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not connect the calendar.');
  return data;
}

export async function disconnectCalendar(): Promise<void> {
  await fetch('/api/calendar', { method: 'DELETE' });
}
