import React, { useState } from 'react';
import { Beacon } from '../types';
import { X, Sparkles, Shirt, Clock, ShieldCheck, Check, Brain, Loader2 } from 'lucide-react';

interface ConvinceMeModalProps {
  beacon: Beacon | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmJoin: (beaconId: string) => void;
  isAlreadyJoined?: boolean;
}

export const ConvinceMeModal: React.FC<ConvinceMeModalProps> = ({
  beacon,
  isOpen,
  onClose,
  onConfirmJoin,
  isAlreadyJoined = false,
}) => {
  const [aiPepTalk, setAiPepTalk] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'why' | 'icebreakers' | 'science'>('why');

  if (!isOpen || !beacon) return null;

  const handleFetchAiPepTalk = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/anti-lazy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beaconTitle: beacon.title,
          location: beacon.locationName,
          activityType: beacon.categoryLabel,
          userState: 'Tired, prefrontal cortex burnt, contemplating doomscrolling',
        }),
      });
      const data = await res.json();
      setAiPepTalk(data.text);
    } catch {
      setAiPepTalk(
        "Put your sneakers on right now. You don't need energy to exist in a sweatshirt beside someone who is also exhausted. Solitary scrolling will make you feel depleted, but 35 mins at " +
          beacon.locationName +
          " will reset your dopamine. Leave right now!"
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="convince-me-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-neutral-200 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle for mobile */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-3 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#CCFF00] text-[#18111A]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 id="convince-me-title" className="font-header text-xl text-[#18111A]">
                Event Details & Plan
              </h2>
              <p className="text-xs text-neutral-500">
                Anti-flake & low-friction spontaneous hangout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close event details sheet"
            className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-[#18111A] flex items-center justify-center active:scale-95 transition-all"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-5 pt-3">
          <button
            onClick={() => setActiveTab('why')}
            className={`min-h-[40px] flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'why'
                ? 'bg-[#18111A] text-[#CCFF00] shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            Why You Should Go
          </button>
          <button
            onClick={() => setActiveTab('icebreakers')}
            className={`min-h-[40px] flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'icebreakers'
                ? 'bg-[#18111A] text-[#CCFF00] shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            Icebreaker Topics
          </button>
          <button
            onClick={() => setActiveTab('science')}
            className={`min-h-[40px] flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'science'
                ? 'bg-[#18111A] text-[#CCFF00] shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            The Science
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-4">
          {activeTab === 'why' && (
            <>
              {/* Event Quick Summary */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Target Hangout
                </span>
                <h3 className="font-headline text-base font-bold text-[#18111A] mt-0.5">
                  {beacon.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {beacon.locationName} · {beacon.distance}
                </p>
              </div>

              {/* Nudge: Departure math */}
              <div className="p-3.5 rounded-2xl bg-[#CCFF00]/20 border border-[#CCFF00] text-[#18111A]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2A6E1E]" />
                  <span className="text-xs font-bold text-[#2A6E1E] uppercase tracking-wider">
                    Departure Nudge
                  </span>
                </div>
                <p className="text-sm font-semibold mt-1">
                  "Leave in 12 minutes and you'll still have {beacon.durationMinutes} full minutes there!"
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Host {beacon.author.name} ({beacon.author.companyOrSchool}) is already there with 1 seat waiting.
                </p>
              </div>

              {/* "What are we wearing?" Barrier Remover */}
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-[#18111A]" />
                    <span className="text-xs font-bold text-[#18111A]">
                      What are we wearing?
                    </span>
                  </div>
                  {beacon.author.sweatpantsApproved && (
                    <span className="text-[10px] font-bold text-[#18111A] bg-[#CCFF00] px-2 py-0.5 rounded-full">
                      Zero Makeup Expected
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-700 mt-1.5 leading-relaxed">
                  {beacon.whatAreWeWearing}
                </p>
                <p className="text-[11px] text-neutral-500 mt-1 italic">
                  Don't change into something fancy. Just throw on sneakers and go.
                </p>
              </div>

              {/* Gemini AI Anti-Lazy Pep Talk */}
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-[#2A6E1E]" />
                    <span className="text-xs font-bold text-[#18111A]">
                      Gemini Voice of Reason
                    </span>
                  </div>
                  <button
                    onClick={handleFetchAiPepTalk}
                    disabled={loadingAi}
                    className="min-h-[36px] px-3 py-1 text-xs font-bold rounded-lg bg-[#18111A] text-[#CCFF00] hover:bg-neutral-800 flex items-center gap-1 active:scale-95 transition-all"
                  >
                    {loadingAi ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Thinking...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
                        <span>{aiPepTalk ? 'Regenerate' : 'Pep Talk Me'}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#18111A] leading-relaxed font-medium">
                  {aiPepTalk || beacon.convinceMeReason}
                </p>
              </div>
            </>
          )}

          {activeTab === 'icebreakers' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-neutral-600">
                No networking jargon. Low-stakes, funny, instant conversation starters to skip the small talk:
              </p>
              {beacon.icebreakerQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-2.5"
                >
                  <span className="w-6 h-6 rounded-full bg-[#CCFF00] text-[#18111A] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-semibold text-[#18111A] leading-relaxed">
                    "{q}"
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'science' && (
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <h4 className="font-headline text-sm font-bold text-[#18111A]">
                  The "Wednesday 6:30 PM" Activation Cliff
                </h4>
                <p className="text-xs text-neutral-700 mt-1.5 leading-relaxed">
                  Behavioral science defines <strong>Affective Forecasting Error</strong>: when your prefrontal cortex is exhausted from a workday, it falsely predicts solitude will soothe you and socializing will deplete you.
                </p>
                <p className="text-xs text-neutral-700 mt-2 leading-relaxed">
                  In clinical reality, solitary doomscrolling traps your cortisol and leaves you melancholic and wired. <strong>30 minutes of low-stakes shared physical presence</strong> (even parallel grocery shopping or quiet tea drinking) immediately resets your vagus nerve.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <h4 className="font-headline text-sm font-bold text-[#18111A]">
                  The 200-Hour Rule (Prof. Jeffrey Hall)
                </h4>
                <p className="text-xs text-neutral-700 mt-1.5 leading-relaxed">
                  Kansas University research shows it takes 50 hours to make a casual friend, 90 hours for a real friend, and 200 hours for a close "Villager" (someone who can see you in sweatpants).
                </p>
                <p className="text-xs text-neutral-700 mt-2 leading-relaxed">
                  Joining this hangout adds <strong>+{beacon.durationMinutes} minutes</strong> directly to your friendship meter!
                </p>
              </div>
            </div>
          )}

          {/* Anti-Flake Deposit Info */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2A6E1E]" />
              <span>$5 Anti-Flake Commitment Deposit</span>
            </div>
            <span className="font-bold text-[#18111A] bg-[#CCFF00] px-2 py-0.5 rounded">
              100% Refunded on GPS Check-in
            </span>
          </div>

          {/* Final Primary CTA Button */}
          {isAlreadyJoined ? (
            <button
              disabled
              className="min-h-[48px] w-full py-3.5 px-4 rounded-2xl bg-[#2A6E1E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>You're Down! Spot Reserved</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onConfirmJoin(beacon.id);
                onClose();
              }}
              className="min-h-[48px] w-full py-3.5 px-4 rounded-2xl bg-[#18111A] hover:bg-neutral-800 text-[#CCFF00] font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-black"
            >
              <span>I'm Down</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
