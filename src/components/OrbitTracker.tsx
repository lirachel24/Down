import React, { useState } from 'react';
import { FriendOrbit, FriendTier } from '../types';
import { MessageCircle } from 'lucide-react';
import { ThreadSummary } from '../lib/api';
import { MascotFace } from './Mascot';
import { SuggestableEvent, suggestEvents, shortWhen } from '../lib/suggest';

interface OrbitTrackerProps {
  friends: FriendOrbit[];
  threads: Record<string, ThreadSummary>;
  events: SuggestableEvent[];
  onOpenChat: (friend: FriendOrbit) => void;
}

const DOTS = 7;
const filledDots = (f: FriendOrbit) => Math.min(DOTS, Math.round((f.hoursTogether / f.nextMilestoneHours) * DOTS));
const TIER_ORDER: Record<FriendTier, number> = { villager: 0, orbit: 1, spark: 2 };

export const OrbitTracker: React.FC<OrbitTrackerProps> = ({
  friends,
  threads,
  events,
  onOpenChat,
}) => {
  const [selectedTier, setSelectedTier] = useState<FriendTier | 'all'>('all');

  // Tiers are assigned automatically from hours together: closest friends first
  const filteredFriends = (selectedTier === 'all' ? friends : friends.filter((f) => f.tier === selectedTier))
    .slice()
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || b.hoursTogether - a.hoursTogether);

  return (
    <div className="flex flex-col gap-5 px-4 py-4 max-w-md mx-auto pb-24">
      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-1 bg-[#FAF6EE] p-1 rounded-control border border-[#E7DFD1]">
        <button
          onClick={() => setSelectedTier('all')}
          className={`min-h-[40px] flex-1 py-1.5 text-xs font-bold rounded-control transition-all ${
            selectedTier === 'all'
              ? 'bg-cta text-cream shadow-xs'
              : 'text-[#5C4F5A] hover:text-[#18111A]'
          }`}
        >
          All ({friends.length})
        </button>
        <button
          onClick={() => setSelectedTier('villager')}
          className={`min-h-[40px] flex-1 py-1.5 text-xs font-bold rounded-control transition-all ${
            selectedTier === 'villager'
              ? 'bg-cta text-cream shadow-xs'
              : 'text-[#5C4F5A] hover:text-[#18111A]'
          }`}
        >
          Tier 1: Villagers
        </button>
        <button
          onClick={() => setSelectedTier('orbit')}
          className={`min-h-[40px] flex-1 py-1.5 text-xs font-bold rounded-control transition-all ${
            selectedTier === 'orbit'
              ? 'bg-cta text-cream shadow-xs'
              : 'text-[#5C4F5A] hover:text-[#18111A]'
          }`}
        >
          Tier 2: Orbit
        </button>
      </div>

      {/* Friends List with Hour Gauges */}
      <div className="flex flex-col gap-3">
        {filteredFriends.map((friend) => {
          const progressPercent = Math.min(
            100,
            Math.round((friend.hoursTogether / friend.nextMilestoneHours) * 100)
          );

          return (
            <div
              key={friend.id}
              className="bg-white rounded-card p-4 border border-[#E7DFD1] shadow-xs flex flex-col gap-3"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#FAF6EE]"
                    />
                    {friend.sweatpantsApproved && (
                      <span
                        title="Sweatpants Approved: Can see you with zero makeup"
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sand border-2 border-white flex items-center justify-center text-[10px] font-bold text-ink"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <h4 className="font-headline text-lg font-bold text-[#18111A]">
                    {friend.name}
                  </h4>
                </div>

                <button
                  onClick={() => onOpenChat(friend)}
                  aria-label={`Message ${friend.name}${threads[friend.id]?.unread ? `, ${threads[friend.id].unread} unread` : ''}`}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#E7DFD1] bg-[#FAF6EE] text-[#18111A] active:scale-95 transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  {threads[friend.id]?.unread ? (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cta px-1 text-xs font-bold text-cream">
                      {threads[friend.id].unread}
                    </span>
                  ) : null}
                </button>
              </div>

              {/* Friendship hours as dots */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#5C4F5A]">Friendship Hours</span>
                  <span className="font-mono font-bold text-[#18111A] tabular-nums">
                    {friend.hoursTogether} / {friend.nextMilestoneHours} hrs
                  </span>
                </div>
                <div
                  className="flex gap-1"
                  role="group"
                  aria-label={`${friend.hoursTogether} of ${friend.nextMilestoneHours} hours together`}
                >
                  {Array.from({ length: DOTS }).map((_, i) => (
                    <MascotFace
                      key={i}
                      color={i < filledDots(friend) ? 'pink' : 'green'}
                      size={26}
                      label={i < filledDots(friend) ? 'Pink mascot: time already spent together. Tap to say hi' : 'Green mascot: time still to go. Tap to say hi'}
                    />
                  ))}
                </div>
              </div>

              {/* Event ideas and the hours they would add */}
              {(() => {
                const ideas = suggestEvents(friend, events);
                if (ideas.length === 0) return null;
                return (
                  <div className="rounded-control bg-[#FAF6EE] p-3">
                    <p className="text-xs font-bold text-[#18111A]">Take {friend.name.split(' ')[0]} to</p>
                    <ul className="mt-1.5 flex flex-col gap-1">
                      {ideas.map((e) => (
                        <li key={e.id} className="text-xs leading-snug text-[#3E3340]">
                          {e.title} · {shortWhen(e.startsAt)} ·{' '}
                          <span className="font-bold text-[#9B004F]">+{e.hours} hrs together</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
};
