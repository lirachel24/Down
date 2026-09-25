import { useCallback, useEffect, useState } from 'react';

// Every hidden mascot in the app. Finding one is remembered on this device.
export const HIDDEN_MASCOT_IDS = ['friends-top', 'profile-corner', 'event-cover', 'create-form'] as const;
export type HiddenMascotId = (typeof HIDDEN_MASCOT_IDS)[number];

const KEY = 'down.mascots.found';
const EVENT = 'down:mascots';

const read = (): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export function useFoundMascots() {
  const [found, setFound] = useState<string[]>(read);

  useEffect(() => {
    const sync = () => setFound(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Returns true when this mascot had not been found before
  const markFound = useCallback((id: string) => {
    const current = read();
    if (current.includes(id)) return false;
    try {
      localStorage.setItem(KEY, JSON.stringify([...current, id]));
    } catch {
      /* storage unavailable: still works for this session via the event below */
    }
    window.dispatchEvent(new Event(EVENT));
    return true;
  }, []);

  return { found, markFound, total: HIDDEN_MASCOT_IDS.length };
}
