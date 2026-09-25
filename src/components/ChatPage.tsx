import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import { FriendOrbit } from '../types';
import { PageShell, CircleButton } from './create-event/ui';
import { MascotFace } from './Mascot';
import {
  ChatMessage,
  fetchMessages,
  markThreadRead,
  requestFriendReply,
  sendMessage,
} from '../lib/api';

interface ChatPageProps {
  friend: FriendOrbit;
  onBack: () => void;
}

type Pending = { tempId: string; text: string; failed?: boolean };

const timeLabel = (ts: number) => new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const dayLabel = (ts: number) => {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const ChatPage: React.FC<ChatPageProps> = ({ friend, onBack }) => {
  const threadId = friend.id;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const merge = useCallback((incoming: ChatMessage[]) => {
    setMessages((prev) => {
      const map = new Map(prev.map((m) => [m.id, m]));
      incoming.forEach((m) => map.set(m.id, m));
      return [...map.values()].sort((a, b) => a.ts - b.ts);
    });
  }, []);

  // Load history, then poll for new messages
  useEffect(() => {
    let cancelled = false;
    const load = async (first: boolean) => {
      try {
        const list = await fetchMessages(threadId);
        if (cancelled) return;
        merge(list);
        setLoadError(null);
        if (list.some((m) => m.from === 'friend')) markThreadRead(threadId);
      } catch (e: any) {
        if (!cancelled && first) setLoadError(e.message);
      } finally {
        if (!cancelled && first) setLoading(false);
      }
    };
    load(true);
    const id = setInterval(() => !document.hidden && load(false), 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [threadId, merge]);

  // Keep the newest message in view unless the reader has scrolled up
  useEffect(() => {
    const el = scroller.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, pending, typing]);

  const onScroll = () => {
    const el = scroller.current;
    if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const deliver = async (tempId: string, text: string) => {
    try {
      const saved = await sendMessage(threadId, text);
      merge([saved]);
      setPending((p) => p.filter((x) => x.tempId !== tempId));
      // The mock friends are not real users, so the server writes their reply
      setTyping(true);
      const [reply] = await Promise.all([
        requestFriendReply(threadId, friend.name.split(' ')[0], friend.mutualInterests),
        new Promise((r) => setTimeout(r, 1100)),
      ]);
      if (reply) merge([reply]);
      setTyping(false);
    } catch {
      setPending((p) => p.map((x) => (x.tempId === tempId ? { ...x, failed: true } : x)));
    }
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const tempId = `tmp-${Date.now()}`;
    stickToBottom.current = true;
    setPending((p) => [...p, { tempId, text }]);
    setDraft('');
    deliver(tempId, text);
  };

  const retry = (p: Pending) => {
    setPending((list) => list.map((x) => (x.tempId === p.tempId ? { ...x, failed: false } : x)));
    deliver(p.tempId, p.text);
  };

  let lastDay = '';

  return (
    <PageShell label={`Chat with ${friend.name}`}>
      <header className="flex items-center gap-3 px-4 pb-3 pt-4">
        <CircleButton label="Back to friends" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </CircleButton>
        <img src={friend.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
        <div className="min-w-0">
          <h1 className="truncate font-headline text-lg font-bold leading-tight text-ink">{friend.name}</h1>
          <p className="truncate text-sm text-muted">{friend.lastSeenDaysAgo} {friend.lastSeenDaysAgo === 1 ? 'day' : 'days'} since your last hang</p>
        </div>
      </header>

      <div ref={scroller} onScroll={onScroll} className="flex-1 overflow-y-auto px-4 pb-3" role="log" aria-live="polite" aria-label={`Messages with ${friend.name}`}>
        {loading && <p className="pt-10 text-center text-sm text-muted">Loading…</p>}
        {loadError && <p role="alert" className="pt-10 text-center text-sm text-berry">{loadError}</p>}
        {!loading && !loadError && messages.length === 0 && pending.length === 0 && (
          <div className="mx-auto max-w-[260px] pt-12 text-center">
            <img src={friend.avatar} alt="" className="mx-auto h-20 w-20 rounded-full object-cover" />
            <p className="mt-4 text-lg text-ink">Say hi to {friend.name.split(' ')[0]}</p>
            <p className="mt-1 text-sm text-muted">Keep it low-key. Start with something small.</p>
          </div>
        )}

        <ul className="flex flex-col gap-1.5">
          {messages.map((m, i) => {
            const day = dayLabel(m.ts);
            const showDay = day !== lastDay;
            lastDay = day;
            const mine = m.from === 'me';
            const showTime = i === messages.length - 1 || messages[i + 1].from !== m.from || messages[i + 1].ts - m.ts > 5 * 60 * 1000;
            return (
              <React.Fragment key={m.id}>
                {showDay && <li className="py-2 text-center font-label text-xs uppercase tracking-wider text-muted">{day}</li>}
                <li className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  <span
                    className={`max-w-[80%] whitespace-pre-wrap break-words rounded-card px-4 py-2.5 text-base leading-snug ${
                      mine ? 'rounded-br-control bg-cta text-cream' : 'rounded-bl-control border border-line bg-white text-ink'
                    }`}
                  >
                    {m.text}
                  </span>
                  {showTime && <span className="mt-1 px-1 text-xs text-muted">{timeLabel(m.ts)}</span>}
                </li>
              </React.Fragment>
            );
          })}
          {pending.map((p) => (
            <li key={p.tempId} className="flex flex-col items-end">
              <span className={`max-w-[80%] whitespace-pre-wrap break-words rounded-card rounded-br-control bg-cta px-4 py-2.5 text-base leading-snug text-cream ${p.failed ? 'opacity-60' : 'opacity-80'}`}>
                {p.text}
              </span>
              {p.failed ? (
                <button onClick={() => retry(p)} className="mt-1 min-h-[32px] px-1 text-xs font-semibold text-berry underline">
                  Not sent. Tap to retry
                </button>
              ) : (
                <span className="mt-1 px-1 text-xs text-muted">Sending…</span>
              )}
            </li>
          ))}
          {typing && (
            <li className="flex items-start" aria-label={`${friend.name} is typing`}>
              <span className="flex gap-1 rounded-card rounded-bl-control border border-line bg-white px-4 py-3.5">
                {(['pink', 'green', 'pink'] as const).map((c, d) => (
                  <span key={d} className="animate-bounce" style={{ animationDelay: `${d * 0.15}s` }}>
                    <MascotFace color={c} size={16} interactive={false} />
                  </span>
                ))}
              </span>
            </li>
          )}
        </ul>
      </div>

      <div className="border-t border-line bg-cream/95 px-3 pb-4 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-end gap-2"
        >
          <label className="sr-only" htmlFor="chat-input">Message {friend.name}</label>
          <textarea
            id="chat-input"
            autoFocus
            value={draft}
            rows={1}
            maxLength={1000}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={`Message ${friend.name.split(' ')[0]}`}
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-control border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-pink/40 focus:outline-none focus:ring-4 focus:ring-pink/10"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime text-ink active:scale-95 disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </PageShell>
  );
};
