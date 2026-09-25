import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Beacon, FriendOrbit } from '../types';
import { LatLng } from '../lib/travel';
import { computeNudge } from '../lib/nudge';
import { CalendarEvent } from '../lib/api';
import { MascotFace } from './Mascot';

interface NextUpCardProps {
  userName: string;
  calendarConnected: boolean;
  calendarLoaded: boolean;
  calendarEvents: CalendarEvent[];
  beacons: Beacon[];
  friends: FriendOrbit[];
  me: LatLng;
  onOpenEvent: (beacon: Beacon) => void;
  onJoin: (beaconId: string) => void;
}

const DISMISS_KEY = 'down.nudge.dismissed';
const DISMISS_DISTANCE = 90; // px, like a phone notification
const readDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISS_KEY);
  } catch {
    return null;
  }
};

// A frosted-glass nudge. Swipe it sideways to dismiss it, like a notification.
export const NextUpCard: React.FC<NextUpCardProps> = ({
  userName,
  calendarConnected,
  calendarLoaded,
  calendarEvents,
  beacons,
  friends,
  me,
  onOpenEvent,
  onJoin,
}) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);

  const minute = Math.floor(now / 60_000);
  const nudge = useMemo(
    () => computeNudge({ now: minute * 60_000, userName, calendarConnected, calendarEvents, beacons, friends, me }),
    [minute, userName, calendarConnected, calendarEvents, beacons, friends, me]
  );

  // Swipe to dismiss
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState<-1 | 0 | 1>(0);
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState<string | null>(readDismissed);
  const start = useRef<{ x: number; t: number; id: number } | null>(null);
  const moved = useRef(false);
  const card = useRef<HTMLDivElement>(null);

  const signature = `${nudge.kind}:${nudge.event?.id ?? ''}`;

  const dismiss = (dir: -1 | 1) => {
    setLeaving(dir);
    setTimeout(() => setCollapsed(true), 180);
    setTimeout(() => {
      try {
        sessionStorage.setItem(DISMISS_KEY, signature);
      } catch {
        /* ignore */
      }
      setDismissed(signature);
    }, 480);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    start.current = { x: e.clientX, t: performance.now(), id: e.pointerId };
    moved.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const delta = e.clientX - s.x;
    if (!dragging && Math.abs(delta) > 6) {
      setDragging(true);
      moved.current = true;
      card.current?.setPointerCapture(e.pointerId);
    }
    if (dragging || Math.abs(delta) > 6) setDx(delta);
  };
  const endDrag = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    if (dragging) {
      const velocity = Math.abs(e.clientX - s.x) / Math.max(1, performance.now() - s.t);
      if (Math.abs(dx) > DISMISS_DISTANCE || velocity > 0.6) dismiss(dx < 0 ? -1 : 1);
      else setDx(0);
    }
    setDragging(false);
  };

  if (!calendarLoaded) return <div className="mt-6 h-[120px] animate-pulse rounded-card bg-white/40" aria-hidden />;
  if (dismissed === signature) return null;

  const event = nudge.event;
  const offset = leaving ? leaving * 460 : dx;
  const opacity = leaving ? 0 : 1 - Math.min(Math.abs(dx) / 260, 0.55);

  return (
    <div
      className={`mt-6 transition-[max-height,margin] duration-300 ease-out ${leaving || collapsed ? 'overflow-clip' : ''}`}
      style={{ maxHeight: collapsed ? 0 : undefined, marginTop: collapsed ? 0 : undefined }}
    >
      <section
        ref={card}
        aria-label="A nudge for you. Swipe sideways to dismiss"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (moved.current) {
            e.stopPropagation();
            e.preventDefault();
            moved.current = false;
          }
        }}
        className="relative rounded-card border border-white/70 bg-white/35 p-4 shadow-[0_10px_34px_-10px_rgba(24,17,26,0.28),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl backdrop-saturate-150"
        style={{
          transform: `translateX(${offset}px)`,
          opacity,
          transition: dragging ? 'none' : 'transform 0.25s ease-out, opacity 0.25s ease-out',
          touchAction: 'pan-y',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      >
        <button
          type="button"
          onClick={() => dismiss(1)}
          className="sr-only focus:not-sr-only focus:absolute focus:right-3 focus:top-3 focus:rounded-full focus:bg-white focus:px-3 focus:py-1 focus:text-sm focus:text-ink"
        >
          Dismiss
        </button>

        <div className="flex items-center gap-3">
          <MascotFace color={nudge.friendsGoing.length ? 'green' : 'pink'} size={40} />
          <div className="min-w-0 flex-1">
            <h2 className="font-headline text-[17px] font-bold leading-snug text-ink">{nudge.headline}</h2>
            {nudge.detail && <p className="mt-0.5 truncate text-sm text-ink/70">{nudge.detail}</p>}
          </div>
        </div>

        {event && (
          <div className="mt-3 flex gap-2">
            {event.joined ? (
              <button type="button" onClick={() => onOpenEvent(event)} className="min-h-[44px] flex-1 rounded-full bg-berry text-base text-white">
                You're down
              </button>
            ) : (
              <button type="button" onClick={() => onJoin(event.id)} className="min-h-[44px] flex-1 rounded-full bg-lime text-base font-semibold text-ink active:scale-[0.98]">
                I'm Down
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenEvent(event)}
              className="min-h-[44px] rounded-full border border-white/80 bg-white/55 px-5 text-base text-ink backdrop-blur-md active:scale-[0.98]"
            >
              Details
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
