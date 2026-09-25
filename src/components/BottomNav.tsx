import React from 'react';
import { Radio, MapPin, User } from 'lucide-react';

export type TabType = 'feed' | 'map' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenCreateEvent?: () => void;
  beaconCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  beaconCount,
}) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      {/* Floating rounded pill dock */}
      <nav
        aria-label="Primary Navigation"
        className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-neutral-200 shadow-xl rounded-full px-2 py-1.5 flex items-center gap-1.5 max-w-[260px] w-full justify-between"
      >
        {/* Tab 1: Events */}
        <button
          onClick={() => onChangeTab('feed')}
          aria-current={currentTab === 'feed' ? 'page' : undefined}
          className={`flex-1 py-1.5 px-3 rounded-full flex flex-col items-center justify-center transition-all ${
            currentTab === 'feed'
              ? 'bg-[#18111A] text-[#CCFF00] font-bold shadow-xs'
              : 'text-neutral-500 hover:text-[#18111A]'
          }`}
        >
          <div className="relative">
            <Radio
              className={`w-4 h-4 ${
                currentTab === 'feed' ? 'scale-110 stroke-[2.5] text-[#CCFF00]' : 'stroke-[1.8]'
              }`}
            />
            {beaconCount > 0 && (
              <span
                className={`absolute -top-1 -right-2 text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs ${
                  currentTab === 'feed' ? 'bg-[#CCFF00] text-[#18111A]' : 'bg-[#18111A] text-[#CCFF00]'
                }`}
                aria-label={`${beaconCount} active events`}
              >
                {beaconCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Events</span>
        </button>

        {/* Tab 2: Live Map */}
        <button
          onClick={() => onChangeTab('map')}
          aria-current={currentTab === 'map' ? 'page' : undefined}
          className={`flex-1 py-1.5 px-3 rounded-full flex flex-col items-center justify-center transition-all ${
            currentTab === 'map'
              ? 'bg-[#18111A] text-[#CCFF00] font-bold shadow-xs'
              : 'text-neutral-500 hover:text-[#18111A]'
          }`}
        >
          <MapPin
            className={`w-4 h-4 ${
              currentTab === 'map' ? 'scale-110 stroke-[2.5] text-[#CCFF00]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Map</span>
        </button>

        {/* Tab 3: Profile & 200h Orbit */}
        <button
          onClick={() => onChangeTab('profile')}
          aria-current={currentTab === 'profile' ? 'page' : undefined}
          className={`flex-1 py-1.5 px-3 rounded-full flex flex-col items-center justify-center transition-all ${
            currentTab === 'profile'
              ? 'bg-[#18111A] text-[#CCFF00] font-bold shadow-xs'
              : 'text-neutral-500 hover:text-[#18111A]'
          }`}
        >
          <User
            className={`w-4 h-4 ${
              currentTab === 'profile' ? 'scale-110 stroke-[2.5] text-[#CCFF00]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Profile</span>
        </button>
      </nav>
    </div>
  );
};
