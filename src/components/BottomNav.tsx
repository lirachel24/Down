import React from 'react';
import { Compass, Users, Plus } from 'lucide-react';

export type TabType = 'feed' | 'friends' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenCreateEvent: () => void;
}

const tabClass = (active: boolean) =>
  `flex-1 min-h-[52px] py-1.5 px-3 rounded-full flex flex-col items-center justify-center transition-all ${
    active ? 'bg-ink text-pink font-bold shadow-xs' : 'text-neutral-500 hover:text-ink'
  }`;

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab, onOpenCreateEvent }) => (
  <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
    <nav
      aria-label="Primary Navigation"
      className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-line shadow-xl rounded-full px-2 py-1.5 flex items-center gap-1.5 max-w-[300px] w-full justify-between"
    >
      <button
        onClick={() => onChangeTab('feed')}
        aria-current={currentTab === 'feed' ? 'page' : undefined}
        className={tabClass(currentTab === 'feed')}
      >
        <Compass className={`w-4 h-4 ${currentTab === 'feed' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Discover</span>
      </button>

      {/* Center: Create Event */}
      <button
        onClick={onOpenCreateEvent}
        aria-label="Create Event"
        className="-my-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink text-white shadow-[0_8px_20px_-6px_rgba(255,77,148,0.8)] ring-4 ring-cream active:scale-95 transition-transform"
      >
        <Plus className="h-7 w-7 stroke-[2.5]" />
      </button>

      <button
        onClick={() => onChangeTab('friends')}
        aria-current={currentTab === 'friends' ? 'page' : undefined}
        className={tabClass(currentTab === 'friends')}
      >
        <Users className={`w-4 h-4 ${currentTab === 'friends' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Friends</span>
      </button>
    </nav>
  </div>
);
