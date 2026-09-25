import { useCallback, useEffect, useState } from 'react';
import { CalendarState, connectCalendar, disconnectCalendar, fetchCalendar } from './api';

// The person's Google Calendar, refreshed every minute
export function useCalendar() {
  const [state, setState] = useState<CalendarState>({ connected: false, events: [] });
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setState(await fetchCalendar());
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(() => !document.hidden && refresh(), 60_000);
    return () => clearInterval(id);
  }, [refresh]);

  const connect = useCallback(async (url: string) => {
    setState(await connectCalendar(url));
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectCalendar();
    setState({ connected: false, events: [] });
  }, []);

  return { ...state, loaded, connect, disconnect, refresh };
}
