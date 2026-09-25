import React, { useState } from 'react';
import { FriendOrbit, FriendTier } from '../types';
import { Clock, MessageCircle, Sparkles, Check, Send, AlertCircle, Copy, CheckCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrbitTrackerProps {
  friends: FriendOrbit[];
  onAddHours: (friendId: string, hours: number) => void;
  onOpenAIAssistant: () => void;
}

export const OrbitTracker: React.FC<OrbitTrackerProps> = ({
  friends,
  onAddHours,
}) => {
  const [selectedTier, setSelectedTier] = useState<FriendTier | 'all'>('all');
  const [activeFriend, setActiveFriend] = useState<FriendOrbit | null>(null);
  const [customSnippet, setCustomSnippet] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logHoursFriendId, setLogHoursFriendId] = useState<string | null>(null);
  const [hoursToAdd, setHoursToAdd] = useState<number>(0.75);

  const filteredFriends = selectedTier === 'all'
    ? friends
    : friends.filter((f) => f.tier === selectedTier);

  const totalLoggedAll = friends.reduce((sum, f) => sum + f.hoursTogether, 0);

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

  const handleCommitLogHours = (friendId: string) => {
    onAddHours(friendId, hoursToAdd);
    setLogHoursFriendId(null);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#CCFF00', '#18111A', '#9B004F'],
    });
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-4 max-w-md mx-auto pb-24">
      {/* 200-Hour Rule Research Banner */}
      <div className="bg-white text-[#18111A] rounded-3xl p-5 shadow-xs border border-[#E7DFD1] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B004F] bg-[#CCFF00]/40 px-2 py-0.5 rounded-full">
            The 200-Hour Rule
          </span>
          <span className="text-[11px] bg-[#FAF6EE] px-2 py-0.5 rounded-full text-[#5C4F5A] border border-[#E7DFD1]">
            Prof. Jeffrey Hall (Kansas)
          </span>
        </div>

        <h2 className="font-header text-2xl mt-2 text-[#18111A]">
          Maintenance Life &gt; Dinner Dates
        </h2>

        <p className="text-xs text-[#5C4F5A] mt-1 leading-relaxed">
          It takes <strong>50h</strong> for a casual friend, <strong>90h</strong> for a real friend, and <strong>200h</strong> for The Villagers (who can see you in sweatpants). A 2-hour monthly dinner will never get you there—fold them into your chores and errands!
        </p>

        {/* Global Progress Metric */}
        <div className="mt-4 pt-3 border-t border-[#E7DFD1] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#7A6E7B]">Total Community Hours</span>
            <div className="text-2xl font-bold font-mono text-[#18111A] tabular-nums">
              <span className="text-[#9B004F] bg-[#CCFF00]/50 px-1.5 py-0.5 rounded-md mr-1">{totalLoggedAll.toFixed(1)}</span> hrs
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#7A6E7B]">Active in Orbit</span>
            <div className="text-xl font-bold font-mono text-[#18111A]">
              {friends.length} Friends
            </div>
          </div>
        </div>
      </div>

      {/* Smart Proactive Nudges Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline text-sm font-bold text-[#18111A] flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-[#18111A]" />
            <span>Spontaneous Nudges</span>
          </h3>
          <span className="text-[11px] text-[#5C4F5A]">Prevent flaking</span>
        </div>

        {friends
          .filter((f) => f.pendingNudge)
          .map((friend) => (
            <div
              key={friend.id}
              className="bg-white rounded-2xl p-3.5 border border-[#E7DFD1] shadow-xs flex items-start gap-3"
            >
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover border border-[#FAF6EE] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#18111A] font-semibold leading-snug">
                  {friend.pendingNudge}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleGenerateCallback(friend, 'day2-callback')}
                    className="min-h-[40px] px-3 py-1 text-xs font-bold rounded-xl bg-[#FAF6EE] text-[#18111A] border border-[#E7DFD1] hover:bg-[#F3EDE2] flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-[#18111A]" />
                    <span>Send Callback</span>
                  </button>
                  <button
                    onClick={() => handleGenerateCallback(friend, 'day7-chore')}
                    className="min-h-[40px] px-3 py-1 text-xs font-bold rounded-xl bg-[#18111A] text-white hover:bg-neutral-800 flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Clock className="w-3 h-3 text-[#CCFF00]" />
                    <span>Parallel Chore Invite</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-1 bg-[#FAF6EE] p-1 rounded-2xl border border-[#E7DFD1]">
        <button
          onClick={() => setSelectedTier('all')}
          className={`min-h-[40px] flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            selectedTier === 'all'
              ? 'bg-[#18111A] text-white shadow-xs'
              : 'text-[#5C4F5A] hover:text-[#18111A]'
          }`}
        >
          All ({friends.length})
        </button>
        <button
          onClick={() => setSelectedTier('villager')}
          className={`min-h-[40px] flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            selectedTier === 'villager'
              ? 'bg-[#18111A] text-white shadow-xs'
              : 'text-[#5C4F5A] hover:text-[#18111A]'
          }`}
        >
          Tier 1: Villagers
        </button>
        <button
          onClick={() => setSelectedTier('orbit')}
          className={`min-h-[40px] flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            selectedTier === 'orbit'
              ? 'bg-[#18111A] text-white shadow-xs'
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
              className="bg-white rounded-3xl p-4 border border-[#E7DFD1] shadow-xs flex flex-col gap-3"
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
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#CCFF00] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#18111A]"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-headline text-base font-bold text-[#18111A]">
                      {friend.name}
                    </h4>
                    <span className="text-[11px] font-bold text-[#9B004F] bg-[#CCFF00]/40 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {friend.tierLabel}
                    </span>
                    <p className="text-[11px] text-[#5C4F5A] mt-0.5">{friend.metAt}</p>
                  </div>
                </div>

                <button
                  onClick={() => setLogHoursFriendId(friend.id)}
                  aria-label={`Log maintenance hours with ${friend.name}`}
                  className="min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-xl bg-[#FAF6EE] border border-[#E7DFD1] text-[#18111A] hover:bg-[#F3EDE2] flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Clock className="w-3.5 h-3.5 text-[#18111A]" />
                  <span>+ Log Hours</span>
                </button>
              </div>

              {/* 200-Hour Rule Progress Gauge */}
              <div className="bg-[#FAF6EE] p-3 rounded-2xl border border-[#E7DFD1]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#5C4F5A]">Friendship Hours</span>
                  <span className="font-mono font-bold text-[#18111A] tabular-nums">
                    {friend.hoursTogether} / {friend.nextMilestoneHours} hrs
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#E7DFD1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CCFF00] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#7A6E7B] mt-1.5">
                  <span>{progressPercent}% towards next level</span>
                  <span>
                    {Math.max(0, friend.nextMilestoneHours - friend.hoursTogether)} hrs to go
                  </span>
                </div>
              </div>

              {/* Maintenance Notes & Shared Interests */}
              <p className="text-xs text-[#3E3340] leading-relaxed">
                {friend.notes}
              </p>

              {/* 3-Step Follow-Up Playbook Quick Actions */}
              <div className="pt-2 border-t border-[#F0E9DC] flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleGenerateCallback(friend, 'day2-callback')}
                  className="min-h-[40px] flex-1 px-2.5 py-1.5 text-[11px] font-bold rounded-xl bg-white border border-[#E7DFD1] text-[#18111A] hover:bg-[#FAF6EE] flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 text-[#18111A]" />
                  <span>Day 2: Callback</span>
                </button>
                <button
                  onClick={() => handleGenerateCallback(friend, 'day7-chore')}
                  className="min-h-[40px] flex-1 px-2.5 py-1.5 text-[11px] font-bold rounded-xl bg-white border border-[#E7DFD1] text-[#18111A] hover:bg-[#FAF6EE] flex items-center justify-center gap-1"
                >
                  <Clock className="w-3 h-3 text-[#9B004F]" />
                  <span>Day 7: Chore</span>
                </button>
                <button
                  onClick={() => handleGenerateCallback(friend, 'day21-circle')}
                  className="min-h-[40px] flex-1 px-2.5 py-1.5 text-[11px] font-bold rounded-xl bg-white border border-[#E7DFD1] text-[#18111A] hover:bg-[#FAF6EE] flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3 text-[#18111A]" />
                  <span>Day 21: Circle</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Hours Drawer / Dialog */}
      {logHoursFriendId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 border border-[#E7DFD1] shadow-2xl flex flex-col gap-4 animate-in fade-in duration-150">
            <h3 className="font-header text-xl text-[#18111A]">
              Log Shared Hours
            </h3>
            <p className="text-xs text-[#5C4F5A]">
              Folded someone into maintenance life? Add the shared time to advance your 200-Hour Rule.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '30m Run', value: 0.5 },
                { label: '45m Coffee', value: 0.75 },
                { label: '1.5h Chores', value: 1.5 },
              ].map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => setHoursToAdd(slot.value)}
                  className={`min-h-[44px] py-2 text-xs font-bold rounded-xl transition-all ${
                    hoursToAdd === slot.value
                      ? 'bg-[#18111A] text-white shadow-xs'
                      : 'bg-[#FAF6EE] text-[#5C4F5A] border border-[#E7DFD1]'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setLogHoursFriendId(null)}
                className="min-h-[44px] flex-1 py-2 text-xs font-bold rounded-xl bg-[#FAF6EE] text-[#5C4F5A] border border-[#E7DFD1]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCommitLogHours(logHoursFriendId)}
                className="min-h-[44px] flex-1 py-2 text-xs font-bold rounded-xl bg-[#18111A] text-white hover:bg-neutral-800 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4 text-[#CCFF00]" />
                <span>Save +{hoursToAdd}h</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Follow-up Message Dialog */}
      {activeFriend && (generatedMessage || loadingAi) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white w-full max-w-md rounded-3xl p-5 border border-[#E7DFD1] shadow-2xl flex flex-col gap-4 animate-in fade-in duration-150">
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
              <div className="p-6 bg-[#FAF6EE] rounded-2xl border border-[#E7DFD1] flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-[#18111A] animate-spin" />
                <span className="text-xs font-bold text-[#5C4F5A]">
                  Gemini crafting low-friction message...
                </span>
              </div>
            ) : (
              <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-[#E7DFD1] text-xs text-[#18111A] leading-relaxed font-medium">
                "{generatedMessage}"
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Optional memory hint (e.g. oat milk, dog sprint)"
                value={customSnippet}
                onChange={(e) => setCustomSnippet(e.target.value)}
                className="flex-1 min-h-[44px] px-3 rounded-xl bg-[#FAF6EE] border border-[#E7DFD1] text-xs"
              />
              <button
                onClick={handleCopyMessage}
                disabled={!generatedMessage}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#18111A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                {copied ? <CheckCheck className="w-4 h-4 text-[#CCFF00]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
