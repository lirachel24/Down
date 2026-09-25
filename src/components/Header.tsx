import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { currentUser } from '../data/mockData';

interface HeaderProps {
  onOpenDropBeacon?: () => void;
  onOpenCreateEvent?: () => void;
  onOpenVibeCheck?: () => void;
  onOpenAIAssistant: () => void;
  pendingVibeCheckCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDropBeacon,
  onOpenCreateEvent,
  onOpenAIAssistant,
}) => {
  const handleCreate = onOpenCreateEvent || onOpenDropBeacon;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-neutral-200 px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Luma-style User Avatar & Down Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-neutral-100 shadow-xs"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#CCFF00] rounded-full ring-2 ring-white"
              title="Online & down for spontaneous meetups"
            />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="font-header text-xl tracking-tight text-[#18111A]">
              down
            </span>
            <span className="text-[12px] font-bold text-[#2A6E1E] leading-none">✦</span>
          </div>
        </div>

        {/* Right: Clean action buttons */}
        <div className="flex items-center gap-2">
          {/* Plus Create Event Action Button */}
          <button
            onClick={handleCreate}
            aria-label="Create Event"
            title="Create Event"
            className="w-9 h-9 rounded-full bg-[#CCFF00] hover:bg-[#bce600] text-[#18111A] flex items-center justify-center font-bold active:scale-95 transition-all shadow-xs border border-black/5"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* AI Coach / Anti-Lazy Nudge */}
          <button
            onClick={onOpenAIAssistant}
            aria-label="Open Anti-Lazy AI Coach"
            title="Anti-Lazy AI Coach"
            className="w-9 h-9 rounded-full bg-neutral-50 hover:bg-neutral-100 text-[#18111A] border border-neutral-200 flex items-center justify-center active:scale-95 transition-all shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-[#2A6E1E]" />
          </button>
        </div>
      </div>
    </header>
  );
};
