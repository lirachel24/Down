import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { BeaconCard } from './components/BeaconCard';
import { ConvinceMeModal } from './components/ConvinceMeModal';
import { CreateEventFlow } from './components/create-event/CreateEventFlow';
import { fetchEvents } from './lib/api';
import { DepositModal } from './components/DepositModal';
import { VibeCheckModal } from './components/VibeCheckModal';
import { ProfileView } from './components/ProfileView';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { EventHome } from './components/EventHome';
import { FriendsList } from './components/FriendsList';
import { OrbitTracker } from './components/OrbitTracker';

import {
  currentUser as initialUser,
  initialBeacons,
  initialFriendOrbits,
  initialPendingVibeCheck,
  freeTonightEvents,
  nextWeekendEvents,
} from './data/mockData';
import { ActivityCategory, Beacon, FriendOrbit, UserProfile } from './types';
import { Sparkles } from 'lucide-react';
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
      colors: ['#CCFF00', '#18111A', '#9B004F'],
    });

    showToast("You're down! $5 deposit authorized & spot claimed. 100% refunded on GPS check-in.");
  };

  const handleEventCreated = (newEvent: Beacon) => {
    setBeacons((prev) => [newEvent, ...prev.filter((b) => b.id !== newEvent.id)]);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#CCFF00', '#FF4D94', '#9B004F'],
    });
    showToast(`"${newEvent.title}" is live! It now shows up under Recommended.`);
  };

  // Load events saved on the server, and open one if the page was reached through an invite link (?event=<id>)
  useEffect(() => {
    let cancelled = false;
    fetchEvents().then((saved) => {
      if (cancelled) return;
      const hydrated = saved.map((e) => ({ ...e, joined: e.author.id === initialUser.id }));
      setBeacons((prev) => [...hydrated, ...prev.filter((b) => !hydrated.some((h) => h.id === b.id))]);

      const params = new URLSearchParams(window.location.search);
      const linked = params.get('event');
      if (linked) {
        const target = hydrated.find((e) => e.id === linked);
        if (target) {
          setSelectedBeaconForConvince(target);
          setIsConvinceOpen(true);
        } else {
          showToast('That event has ended or could not be found.');
        }
        window.history.replaceState({}, '', window.location.pathname);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="min-h-screen bg-sand flex justify-center items-start sm:py-6">
      {/* Mobile Device Frame Container */}
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[890px] sm:max-h-[920px] bg-cream text-[#18111A] flex flex-col font-sans relative sm:rounded-[2.8rem] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] sm:border-[8px] sm:border-[#1E1B18] overflow-hidden overflow-y-auto">
        {/* Top bar on Friends (Discover has its own hero, Profile has its own back button) */}
        {currentTab === 'friends' && (
          <Header
            avatar={user.avatar}
            name={user.name}
            onOpenProfile={() => setCurrentTab('profile')}
          />
        )}

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
          {/* Tab 1: Discover */}
          {currentTab === 'feed' && (
            <EventHome
              userName={user.name}
              avatar={user.avatar}
              recommended={beacons}
              freeTonight={freeTonightEvents}
              nextWeekend={nextWeekendEvents}
              onSelectBeacon={handleOpenConvinceMe}
              onOpenProfile={() => setCurrentTab('profile')}
            />
          )}

          {/* Tab 2: Friends + 200h Orbit Tracker */}
          {currentTab === 'friends' && (
            <div className="px-4 py-6 pb-32">
              <FriendsList friends={friends} />
              <div className="-mx-4 mt-8">
                <OrbitTracker
                  friends={friends}
                  onAddHours={handleAddHours}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                />
              </div>
            </div>
          )}

          {/* Profile (opened from the avatar, top right) */}
          {currentTab === 'profile' && (
            <ProfileView
              user={user}
              beacons={beacons}
              onBack={() => setCurrentTab('feed')}
              onSelectBeacon={handleOpenConvinceMe}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation inside mobile frame */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          onOpenCreateEvent={() => setIsDropBeaconOpen(true)}
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
{isDropBeaconOpen && (
          <CreateEventFlow
            onClose={() => setIsDropBeaconOpen(false)}
            onCreated={handleEventCreated}
            onViewEvent={(event) => {
              setIsDropBeaconOpen(false);
              handleOpenConvinceMe(event);
            }}
          />
        )}

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


