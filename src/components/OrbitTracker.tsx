import React, { useState } from 'react';
import { FriendOrbit, FriendTier } from '../types';
import { Clock, MessageCircle, Sparkles, Check, Send, Copy, CheckCheck } from 'lucide-react';
import { ThreadSummary } from '../lib/api';
import { MascotFace, HiddenMascot } from './Mascot';
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
  const [activeFriend, setActiveFriend] = useState<FriendOrbit | null>(null);
  const [customSnippet, setCustomSnippet] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tiers are assigned automatically from hours together: closest friends first
  const filteredFriends = (selectedTier === 'all' ? friends : friends.filter((f) => f.tier === selectedTier))
    .slice()
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || b.hoursTogether - a.hoursTogether);

  const handleGenerateCallback = async (friend: FriendOrbit, type: 'day2-callback' | 'day7-chore' | 'day21-circle') => {
    setActiveFriend(friend);
    setLoadingAi(true);
    setGeneratedMessage(null);
    setCopied(false);

    try {
      const res = await fetch('/api/gemini/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          friendName: friend.name,
          type,
          memorySnippet: customSnippet || friend.callbackSnippet || 'our hangout',
        }),
      });
      const data = await res.json();
      setGeneratedMessage(data.message);
    } catch {
      if (type === 'day2-callback') {
        setGeneratedMessage(
          `Still laughing about what you said about ${friend.callbackSnippet || 'the oat milk incident'}. Hope your week is off to a peaceful start!`
        );
      } else if (type === 'day7-chore') {
        setGeneratedMessage(
          `Hey ${friend.name}! I'm heading to that coffee spot near Mercer for ~40 mins of parallel body-doubling. Down to join if you want to knock out tasks?`
        );
      } else {
        setGeneratedMessage(
          `Hey ${friend.name}! Doing a quick grocery run and Willard Park walk around 6. Let me know if you want to get fresh air together!`
        );
      }
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopyMessage = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

              {/* Maintenance Notes & Shared Interests */}
              <p className="text-xs text-[#3E3340] leading-relaxed">
                {friend.notes}
              </p>

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

              {/* 3-Step Follow-Up Playbook Quick Actions */}
              <div className="pt-2 border-t border-[#F0E9DC] flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleGenerateCallback(friend, 'day2-callback')}
                  className="min-h-[40px] flex-1 px-2.5 py-1.5 text-[11px] font-bold rounded-control bg-white border border-[#E7DFD1] text-[#18111A] hover:bg-[#FAF6EE] flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 text-[#18111A]" />
                  <span>Day 2: Callback</span>
                </button>
                <button
                  onClick={() => handleGenerateCallback(friend, 'day7-chore')}
                  className="min-h-[40px] flex-1 px-2.5 py-1.5 text-[11px] font-bold rounded-control bg-white border border-[#E7DFD1] text-[#18111A] hover:bg-[#FAF6EE] flex items-center justify-center gap-1"
                >
                  <Clock className="w-3 h-3 text-[#9B004F]" />
                  <span>Day 7: Chore</span>
                </button>
                <button
                  onClick={() => handleGenerateCallback(friend, 'day21-circle')}
                  className="min-h-[40px] flex-1 px-2.5 py-1.5 text-[11px] font-bold rounded-control bg-white border border-[#E7DFD1] text-[#18111A] hover:bg-[#FAF6EE] flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3 text-[#18111A]" />
                  <span>Day 21: Circle</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generated Follow-up Message Dialog */}
      {activeFriend && (generatedMessage || loadingAi) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white w-full max-w-md rounded-card p-5 border border-[#E7DFD1] shadow-2xl flex flex-col gap-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#9B004F]" />
                <h3 className="font-header text-lg text-[#18111A]">
                  Low-Friction Nudge
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveFriend(null);
                  setGeneratedMessage(null);
                }}
                className="text-[#5C4F5A] text-xs font-bold p-2"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-[#5C4F5A]">
              Crafted for <strong>{activeFriend.name}</strong>. Zero pressure, no awkward 2-hour dinner commitment—just authentic connection.
            </p>

            {loadingAi ? (
              <div className="p-6 bg-[#FAF6EE] rounded-control border border-[#E7DFD1] flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-[#18111A] animate-spin" />
                <span className="text-xs font-bold text-[#5C4F5A]">
                  Gemini crafting low-friction message...
                </span>
              </div>
            ) : (
              <div className="p-4 bg-[#FAF6EE] rounded-card border border-[#E7DFD1] text-xs text-[#18111A] leading-relaxed font-medium">
                "{generatedMessage}"
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Optional memory hint (e.g. oat milk, dog sprint)"
                value={customSnippet}
                onChange={(e) => setCustomSnippet(e.target.value)}
                className="flex-1 min-h-[44px] px-3 rounded-control bg-[#FAF6EE] border border-[#E7DFD1] text-xs"
              />
              <button
                onClick={handleCopyMessage}
                disabled={!generatedMessage}
                className="min-h-[44px] px-4 py-2 rounded-control bg-cta text-cream text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                {copied ? <CheckCheck className="w-4 h-4 text-cream" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
