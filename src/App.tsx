import { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { BeaconCard } from './components/BeaconCard';
import { BeaconMap } from './components/BeaconMap';
import { ConvinceMeModal } from './components/ConvinceMeModal';
import { DropBeaconModal } from './components/DropBeaconModal';
import { DepositModal } from './components/DepositModal';
import { VibeCheckModal } from './components/VibeCheckModal';
import { ProfileView } from './components/ProfileView';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

import {
  currentUser as initialUser,
  initialBeacons,
  initialFriendOrbits,
  initialPendingVibeCheck,
} from './data/mockData';
import { ActivityCategory, Beacon, FriendOrbit, UserProfile } from './types';
import { Radio, MapPin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('feed');
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [beacons, setBeacons] = useState<Beacon[]>(initialBeacons);
  const [friends, setFriends] = useState<FriendOrbit[]>(initialFriendOrbits);
  const [pendingVibeCheck, setPendingVibeCheck] = useState(initialPendingVibeCheck);

  // Filter state
  const [activeCategory, setActiveCategory] = useState<ActivityCategory | 'all'>('all');

  // Modals & Drawers
  const [selectedBeaconForConvince, setSelectedBeaconForConvince] = useState<Beacon | null>(null);
  const [selectedBeaconForDeposit, setSelectedBeaconForDeposit] = useState<Beacon | null>(null);
  const [isConvinceOpen, setIsConvinceOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isDropBeaconOpen, setIsDropBeaconOpen] = useState(false);
  const [isVibeCheckOpen, setIsVibeCheckOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenConvinceMe = (beacon: Beacon) => {
    setSelectedBeaconForConvince(beacon);
    setIsConvinceOpen(true);
  };

  // Called when user clicks "I'm Down": Opens the Apple Pay style Deposit screen
  const handleInitiateJoin = (beaconId: string) => {
    const target = beacons.find((b) => b.id === beaconId);
    if (!target) return;
    setSelectedBeaconForDeposit(target);
    setIsDepositOpen(true);
  };

  // Called after payment authorization succeeds in DepositModal
  const handleConfirmDepositSuccess = (beaconId: string) => {
    setBeacons((prev) =>
      prev.map((b) => {
        if (b.id === beaconId && b.spotsFilled < b.spotsTotal && !b.joined) {
          return {
            ...b,
            spotsFilled: b.spotsFilled + 1,
            joined: true,
            attendees: [
              ...b.attendees,
              {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
              },
            ],
          };
        }
        return b;
      })
    );

    setIsDepositOpen(false);
    setSelectedBeaconForDeposit(null);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#CCFF00', '#18111A', '#2A6E1E'],
    });

    showToast("You're down! $5 deposit authorized & spot claimed. 100% refunded on GPS check-in.");
  };

  const handleAddBeacon = (newBeacon: Beacon) => {
    setBeacons((prev) => [newBeacon, ...prev]);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#CCFF00', '#18111A', '#2A6E1E'],
    });
    showToast(`Event created at ${newBeacon.locationName}! Active for ${newBeacon.durationMinutes}m.`);
  };

  const handleAddHours = (friendId: string, hours: number) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === friendId) {
          const updatedHours = Number((f.hoursTogether + hours).toFixed(1));
          return {
            ...f,
            hoursTogether: updatedHours,
            pendingNudge: undefined,
          };
        }
        return f;
      })
    );
    setUser((prev) => ({
      ...prev,
      totalHoursLogged: Number((prev.totalHoursLogged + hours).toFixed(1)),
    }));
    showToast(`+${hours} hours logged towards the 200-Hour Rule!`);
  };

  const handleCompleteVibeCheck = (vibeCheckId: string, matched: boolean) => {
    setPendingVibeCheck((prev) => ({
      ...prev,
      voted: true,
      mutualMatch: matched,
      depositStatus: 'refunded',
    }));

    if (matched) {
      handleAddHours('friend-nicki', pendingVibeCheck.hoursSpent);
      showToast(`Mutual match! $5 deposit refunded and +${pendingVibeCheck.hoursSpent}h added.`);
    } else {
      showToast('Vibe check feedback saved. $5 deposit refunded.');
    }

    setIsVibeCheckOpen(false);
  };

  const filteredBeacons = activeCategory === 'all'
    ? beacons
    : beacons.filter((b) => b.activityCategory === activeCategory);

  const categories: Array<{ id: ActivityCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Events' },
    { id: 'sweet-treat', label: 'Sweet Treats' },
    { id: 'chore', label: 'Chores & Errands' },
    { id: 'body-double', label: 'Body-Doubling' },
    { id: 'dog-walk', label: 'Dog Walks' },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center items-start sm:py-6">
      {/* Mobile Device Frame Container */}
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[890px] sm:max-h-[920px] bg-white text-[#18111A] flex flex-col font-sans relative sm:rounded-[2.8rem] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] sm:border-[8px] sm:border-[#1E1B18] overflow-hidden overflow-y-auto">
        {/* Top Bar */}
        <Header
          onOpenDropBeacon={() => setIsDropBeaconOpen(true)}
          onOpenVibeCheck={() => setIsVibeCheckOpen(true)}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          pendingVibeCheckCount={pendingVibeCheck.voted ? 0 : 1}
        />

        {/* Floating Global Toast Notification */}
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className="absolute top-16 left-4 right-4 z-50 max-w-sm mx-auto p-3.5 bg-[#18111A] text-white rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <Sparkles className="w-4 h-4 text-[#CCFF00] shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {/* Tab 1: Events Feed */}
          {currentTab === 'feed' && (
            <div className="flex flex-col gap-3.5 px-4 py-3 pb-24">
              {/* Luma-style Editorial Section Header */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#18111A]">
                    Spontaneous Events
                  </h1>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Happening right now in Berkeley · Low-friction & anti-flake
                  </p>
                </div>

                <button
                  onClick={() => setCurrentTab('map')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs font-semibold text-[#18111A] hover:bg-neutral-100 shadow-2xs active:scale-95 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#2A6E1E]" />
                  <span>Map</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div
                role="region"
                aria-label="Filter Events by Activity"
                className="overflow-x-auto no-scrollbar flex items-center gap-1.5 py-1"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    aria-pressed={activeCategory === cat.id}
                    className={`min-h-[36px] px-3.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                      activeCategory === cat.id
                        ? 'bg-[#18111A] text-[#CCFF00] font-bold shadow-xs'
                        : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Events List */}
              <div className="flex flex-col gap-3.5">
                {filteredBeacons.map((beacon) => (
                  <BeaconCard
                    key={beacon.id}
                    beacon={beacon}
                    onSelectConvinceMe={handleOpenConvinceMe}
                    onJoinDirect={handleInitiateJoin}
                    isJoined={beacon.joined}
                  />
                ))}

                {filteredBeacons.length === 0 && (
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200 text-center flex flex-col items-center gap-3 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 text-[#2A6E1E] flex items-center justify-center">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="font-header text-lg text-[#18111A]">
                      No active events in this category
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-xs">
                      Be the one who starts something spontaneous! Create a 30-minute event for coffee, groceries, or a walk.
                    </p>
                    <button
                      onClick={() => setIsDropBeaconOpen(true)}
                      className="min-h-[40px] px-5 py-2 rounded-full bg-[#18111A] text-[#CCFF00] text-xs font-bold shadow-xs hover:bg-neutral-800"
                    >
                      Create Event
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Live Map View */}
          {currentTab === 'map' && (
            <BeaconMap
              beacons={beacons}
              onSelectBeacon={(beacon) => handleInitiateJoin(beacon.id)}
              onSelectConvinceMe={handleOpenConvinceMe}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          )}

          {/* Tab 3: Profile & 200h Orbit Tracker */}
          {currentTab === 'profile' && (
            <ProfileView
              user={user}
              friends={friends}
              onAddHours={handleAddHours}
              onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
              onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation inside mobile frame */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          onOpenCreateEvent={() => setIsDropBeaconOpen(true)}
          beaconCount={beacons.length}
        />

        {/* Modal: Convince Me Sheet */}
        <ConvinceMeModal
          beacon={selectedBeaconForConvince}
          isOpen={isConvinceOpen}
          onClose={() => {
            setIsConvinceOpen(false);
            setSelectedBeaconForConvince(null);
          }}
          onConfirmJoin={(beaconId) => {
            setIsConvinceOpen(false);
            handleInitiateJoin(beaconId);
          }}
          isAlreadyJoined={selectedBeaconForConvince?.joined}
        />

        {/* Modal: Apple Pay Style Deposit Authorization Screen */}
        <DepositModal
          beacon={selectedBeaconForDeposit}
          isOpen={isDepositOpen}
          onClose={() => {
            setIsDepositOpen(false);
            setSelectedBeaconForDeposit(null);
          }}
          onConfirmSuccess={handleConfirmDepositSuccess}
        />

        {/* Modal: Drop / Create Event Beacon */}
        <DropBeaconModal
          isOpen={isDropBeaconOpen}
          onClose={() => setIsDropBeaconOpen(false)}
          onAddBeacon={handleAddBeacon}
        />

        {/* Modal: Post-Hangout Vibe Check */}
        <VibeCheckModal
          vibeCheck={pendingVibeCheck}
          isOpen={isVibeCheckOpen}
          onClose={() => setIsVibeCheckOpen(false)}
          onCompleteVibeCheck={handleCompleteVibeCheck}
        />

        {/* Modal: Gemini AI Anti-Lazy Coach */}
        <AIAssistantDrawer
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
        />
      </div>
    </div>
  );
}


