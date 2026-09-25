import React, { useState } from 'react';
import { FriendOrbit, UserProfile } from '../types';
import { OrbitTracker } from './OrbitTracker';
import { Shirt, MapPin, Flame, Compass, Heart, Users, CheckCircle2 } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  friends: FriendOrbit[];
  onAddHours: (friendId: string, hours: number) => void;
  onOpenAIAssistant: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  friends,
  onAddHours,
  onOpenAIAssistant,
  onUpdateUser,
}) => {
  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'orbits'>('orbits');
  const [sweatpants, setSweatpants] = useState(user.sweatpantsApproved);
  const [newChore, setNewChore] = useState('');
  const [choresList, setChoresList] = useState(user.favoriteChores);

  const handleToggleSweatpants = () => {
    const nextVal = !sweatpants;
    setSweatpants(nextVal);
    onUpdateUser({ sweatpantsApproved: nextVal });
  };

  const handleAddChore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChore.trim()) return;
    const updated = [...choresList, newChore.trim()];
    setChoresList(updated);
    setNewChore('');
    onUpdateUser({ favoriteChores: updated });
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-md mx-auto pb-24">
      {/* Profile Top Sub-Nav Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-2xl border border-neutral-200">
        <button
          onClick={() => setActiveProfileTab('orbits')}
          className={`min-h-[44px] flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeProfileTab === 'orbits'
              ? 'bg-[#18111A] text-[#CCFF00] shadow-xs'
              : 'text-neutral-600 hover:text-[#18111A]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>200h Orbit Tracker</span>
        </button>
        <button
          onClick={() => setActiveProfileTab('profile')}
          className={`min-h-[44px] flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeProfileTab === 'profile'
              ? 'bg-[#18111A] text-[#CCFF00] shadow-xs'
              : 'text-neutral-600 hover:text-[#18111A]'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>Settings & Chores</span>
        </button>
      </div>

      {activeProfileTab === 'orbits' ? (
        /* Section 1: The 200-Hour Orbit Tracker */
        <div className="-mx-4 -mt-2">
          <OrbitTracker
            friends={friends}
            onAddHours={onAddHours}
            onOpenAIAssistant={onOpenAIAssistant}
          />
        </div>
      ) : (
        /* Section 2: Profile, Chores, Accountability Ledger, Philosophy */
        <div className="flex flex-col gap-5">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-neutral-100 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-header text-2xl text-[#18111A] leading-tight">
                  {user.name}
                </h2>
                <p className="text-xs font-bold text-neutral-800">
                  {user.role} · {user.companyOrSchool}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2A6E1E]" />
                  <span className="truncate">{user.neighborhood}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed italic bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
              "{user.bio}"
            </p>

            {/* Sweatpants Approval Toggle */}
            <div className="p-3.5 rounded-2xl bg-[#CCFF00]/20 border border-[#CCFF00] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shirt className="w-5 h-5 text-[#2A6E1E]" />
                <div>
                  <span className="text-xs font-bold text-[#18111A] block">
                    Sweatpants & Zero Makeup Approved
                  </span>
                  <span className="text-[11px] text-neutral-600 block">
                    Allow people to invite you without getting dressed up
                  </span>
                </div>
              </div>
              <button
                onClick={handleToggleSweatpants}
                role="switch"
                aria-checked={sweatpants}
                className={`w-12 h-7 rounded-full p-1 transition-colors flex items-center ${
                  sweatpants ? 'bg-[#2A6E1E]' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    sweatpants ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Maintenance Life: Chores I'm Always Down For */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-base font-bold text-[#18111A] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#2A6E1E]" />
                <span>Maintenance Chores I'm Down For</span>
              </h3>
              <span className="text-[11px] text-neutral-500 font-medium">Zero friction</span>
            </div>

            <p className="text-xs text-neutral-600">
              Adult friendship happens when you fold people into your routine chores instead of forcing 2-hour dinners.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {choresList.map((chore, index) => (
                <span
                  key={index}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-50 text-[#18111A] border border-neutral-200 flex items-center gap-1.5"
                >
                  <Heart className="w-3 h-3 text-[#2A6E1E] fill-[#CCFF00]" />
                  <span>{chore}</span>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddChore} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add errand (e.g. Sephora run, Thrifting)"
                value={newChore}
                onChange={(e) => setNewChore(e.target.value)}
                className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-[#18111A] focus:outline-none focus:border-[#CCFF00]"
              />
              <button
                type="submit"
                className="min-h-[44px] px-4 rounded-xl bg-[#18111A] text-[#CCFF00] text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Add
              </button>
            </form>
          </div>

          {/* Anti-Flake Deposit Account Balance */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2A6E1E]" />
                <h3 className="font-headline text-base font-bold text-[#18111A]">
                  Accountability Ledger
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-[#CCFF00] text-[#18111A] px-2.5 py-0.5 rounded-full">
                $5 Refund Model
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-[11px] text-neutral-600 block">Refunded on Arrival</span>
                <span className="text-xl font-mono font-bold text-[#2A6E1E]">$25.00</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-[11px] text-neutral-600 block">Active Held Deposits</span>
                <span className="text-xl font-mono font-bold text-[#18111A]">$5.00</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500">
              Deposit is 100% refunded when GPS verifies in-person presence twice. Zero flaking, zero awkward cancellations.
            </p>
          </div>

          {/* Why Other Apps Fail (The Down Philosophy) */}
          <div className="bg-neutral-50 rounded-3xl p-5 border border-neutral-200 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#2A6E1E]">
              <Compass className="w-4 h-4" />
              <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-[#18111A]">
                Why Down is Different
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-700">
              <div>
                <strong className="text-[#18111A]">vs. Bumble BFF:</strong> Swiping induces shopping paralysis. Matches rot in chat queue because nobody wants a 2-hour drinks date with a stranger.
              </div>
              <div>
                <strong className="text-[#18111A]">vs. Timeleft:</strong> Dining with 5 strangers on Wednesday night has massive activation friction ($60 bill, getting dressed, performance anxiety).
              </div>
              <div>
                <strong className="text-[#18111A]">vs. Partiful:</strong> Great for 50-person Friday parties, useless for "Who wants to walk to Walgreens in 20 minutes?"
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
