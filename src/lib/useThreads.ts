import { useCallback, useEffect, useState } from 'react';
import { fetchThreads, ThreadSummary } from './api';

// Conversation summaries (last message + unread count), refreshed every few seconds
export function useThreads(intervalMs = 4000) {
  const [threads, setThreads] = useState<Record<string, ThreadSummary>>({});

  const refresh = useCallback(async () => {
    setThreads(await fetchThreads());
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(() => {
      if (!document.hidden) refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [refresh, intervalMs]);

  const totalUnread = Object.values(threads).reduce((sum, t) => sum + t.unread, 0);
  return { threads, totalUnread, refresh };
}
