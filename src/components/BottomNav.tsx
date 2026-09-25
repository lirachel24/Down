import React from 'react';
import { Compass, Users, Plus } from 'lucide-react';

export type TabType = 'feed' | 'friends' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenCreateEvent: () => void;
  unreadMessages?: number;
}

// White bar. Muted text is 7:1 on white and the active pink is 4.8:1. The active tab is also bolder and has a bar under it, so it never relies on colour alone.
const tabClass = (active: boolean) =>
  `relative flex min-h-[52px] flex-1 flex-col items-center justify-center rounded-full px-3 py-1.5 transition-all ${
    active ? 'font-bold text-cta' : 'font-medium text-muted'
  }`;

const ActiveBar: React.FC<{ show: boolean }> = ({ show }) =>
  show ? <span aria-hidden className="absolute bottom-1 h-[3px] w-5 rounded-full bg-cta" /> : null;

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab, onOpenCreateEvent, unreadMessages = 0 }) => (
  <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4">
    <nav
      aria-label="Primary Navigation"
      className="pointer-events-auto flex w-full max-w-[320px] items-center justify-between gap-1.5 rounded-full border border-line bg-white px-2 py-1.5 shadow-[0_12px_32px_-8px_rgba(24,17,26,0.3)]"
    >
      <button onClick={() => onChangeTab('feed')} aria-current={currentTab === 'feed' ? 'page' : undefined} className={tabClass(currentTab === 'feed')}>
        <Compass className={`h-5 w-5 ${currentTab === 'feed' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="mt-0.5 mb-1 text-xs tracking-tight">Discover</span>
        <ActiveBar show={currentTab === 'feed'} />
      </button>

      {/* Center: Create Event. The only neon green with a black plus. */}
      <button
        onClick={onOpenCreateEvent}
        aria-label="Create Event"
        className="-my-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lime text-ink shadow-[0_8px_20px_-6px_rgba(24,17,26,0.4)] ring-4 ring-white transition-transform active:scale-95"
      >
        <Plus className="h-7 w-7 stroke-[3]" />
      </button>

      <button onClick={() => onChangeTab('friends')} aria-current={currentTab === 'friends' ? 'page' : undefined} className={tabClass(currentTab === 'friends')}>
        <span className="relative">
          <Users className={`h-5 w-5 ${currentTab === 'friends' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          {unreadMessages > 0 && (
            <span
              className="absolute -right-3 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cta px-1 text-[11px] font-bold leading-none text-cream"
              aria-label={`${unreadMessages} unread messages`}
            >
              {unreadMessages}
            </span>
          )}
        </span>
        <span className="mt-0.5 mb-1 text-xs tracking-tight">Friends</span>
        <ActiveBar show={currentTab === 'friends'} />
      </button>
    </nav>
  </div>
);
