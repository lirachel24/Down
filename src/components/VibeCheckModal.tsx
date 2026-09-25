import React, { useState } from 'react';
import { PendingVibeCheck } from '../types';
import { X, Heart, Sparkles, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VibeCheckModalProps {
  vibeCheck: PendingVibeCheck | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteVibeCheck: (vibeCheckId: string, matched: boolean) => void;
}

export const VibeCheckModal: React.FC<VibeCheckModalProps> = ({
  vibeCheck,
  isOpen,
  onClose,
  onCompleteVibeCheck,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [voteChoice, setVoteChoice] = useState<'yes' | 'no' | null>(null);

  if (!isOpen || !vibeCheck) return null;

  const handleVote = (choice: 'yes' | 'no') => {
    setVoteChoice(choice);
    setSubmitted(true);

    if (choice === 'yes') {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#CCFF00', '#18111A', '#9B004F'],
      });
    }

    setTimeout(() => {
      onCompleteVibeCheck(vibeCheck.id, choice === 'yes');
    }, 2800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vibe-check-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="bg-white w-full max-w-md rounded-card p-6 border border-line shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150 relative">
        <button
          onClick={onClose}
          aria-label="Close Vibe Check"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-sand border border-line text-neutral-600 hover:text-black flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-control bg-sand text-ink">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 id="vibe-check-title" className="font-header text-xl text-[#18111A]">
                  Post-Event Vibe Check
                </h3>
                <span className="text-xs text-neutral-500">
                  100% Anonymous & Double-Blind
                </span>
              </div>
            </div>

            <div className="p-4 bg-sand rounded-card border border-line flex items-center gap-3">
              <img
                src={vibeCheck.partnerAvatar}
                alt={vibeCheck.partnerName}
                className="w-14 h-14 rounded-full object-cover border-2 border-line"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-[#9B004F] uppercase tracking-wider">
                  Recent Hangout
                </span>
                <h4 className="font-headline text-base font-bold text-[#18111A]">
                  {vibeCheck.eventTitle}
                </h4>
                <p className="text-xs text-neutral-500 truncate">
                  With {vibeCheck.partnerName} · {vibeCheck.location}
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold text-[#18111A] text-center my-1">
              "Would you be down to hang out or run another errand with {vibeCheck.partnerName}?"
            </p>
            <p className="text-xs text-neutral-500 text-center -mt-2">
              They will only find out if you BOTH vote yes. Zero social awkwardness or obligation.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={() => handleVote('no')}
                className="min-h-[48px] py-3 px-4 rounded-control bg-sand border border-line text-neutral-700 hover:bg-neutral-200 text-xs font-bold transition-all active:scale-95"
              >
                Keep it low-key (No)
              </button>
              <button
                onClick={() => handleVote('yes')}
                className="min-h-[48px] py-3 px-4 rounded-control bg-cta hover:opacity-90 text-cream text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Heart className="w-4 h-4 fill-cta text-cta" />
                <span>Yes, Down Again!</span>
              </button>
            </div>

            {/* Anti-flake refund note */}
            <div className="p-3 bg-sand rounded-control border border-line flex items-center gap-2.5 text-xs text-[#18111A]">
              <ShieldCheck className="w-4 h-4 text-[#9B004F] shrink-0" />
              <span>
                <strong>GPS Verified:</strong> Your $5 attendance deposit has been cleared and unlocked.
              </span>
            </div>
          </>
        ) : (
          <div className="py-6 flex flex-col items-center text-center gap-3">
            {voteChoice === 'yes' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-sand text-ink flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-header text-2xl text-[#18111A]">
                  It's a Mutual Down!
                </h3>
                <p className="text-xs text-neutral-600 max-w-xs leading-relaxed">
                  Both of you voted Down! We added <strong>+{vibeCheck.hoursSpent} hours</strong> to your 200-Hour Rule tracker with {vibeCheck.partnerName}.
                </p>
                <div className="p-3.5 bg-sand rounded-control border border-line text-xs text-left w-full mt-2">
                  <div className="flex items-center gap-1.5 text-[#9B004F] font-bold mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Unlocked: Day 2 Callback</span>
                  </div>
                  <p className="text-neutral-600">
                    "Still thinking about Bento stealing the tennis ball! Hope your Friday is chill."
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-sand border border-line text-neutral-500 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-header text-xl text-[#18111A]">
                  Feedback Saved Privately
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Your response is 100% private. We'll adjust your future event recommendations accordingly.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
