import React, { useState } from 'react';
import { Beacon } from '../types';
import { X, Check, ShieldCheck, ChevronRight, Smartphone, Lock, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DepositModalProps {
  beacon: Beacon | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSuccess: (beaconId: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  beacon,
  isOpen,
  onClose,
  onConfirmSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'apple-pay' | 'card'>('apple-pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen || !beacon) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#CCFF00', '#18111A', '#9B004F'],
      });
      setTimeout(() => {
        onConfirmSuccess(beacon.id);
        setIsConfirmed(false);
      }, 1600);
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apple-pay-sheet-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 select-none animate-in fade-in duration-200"
    >
      {/* Container simulating high-fidelity iOS Apple Pay / Payment Sheet */}
      <div className="bg-[#F2F2F7] w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-black/10 animate-in slide-in-from-bottom duration-200">
        
        {/* iOS Grab bar */}
        <div className="w-10 h-1 bg-[#C7C7CC] rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Apple Pay Sheet Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-black">
            <span className="text-xl font-bold tracking-tight">Pay</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Cancel deposit"
            className="w-8 h-8 rounded-full bg-[#E5E5EA] text-[#8E8E93] hover:text-black flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Main Body */}
        <div className="px-4 pb-6 flex flex-col gap-3">
          
          {/* Hangout Summary Item Box */}
          <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-black/5 flex items-center gap-3">
            <img
              src={beacon.image}
              alt={beacon.title}
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-black/5"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B004F] block">
                {beacon.categoryLabel}
              </span>
              <h4 className="text-xs font-bold text-black truncate">
                {beacon.title}
              </h4>
              <p className="text-[11px] text-[#8E8E93] truncate">
                With {beacon.author.name} · {beacon.locationName}
              </p>
            </div>
          </div>

          {/* Payment Card / Method Selection */}
          <div className="bg-white rounded-2xl shadow-xs border border-black/5 divide-y divide-black/5 overflow-hidden">
            <div
              onClick={() => setSelectedMethod('apple-pay')}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-black/[0.02]"
            >
              <div className="flex items-center gap-3">
                {/* Styled Payment Card Graphic */}
                <div className="w-10 h-6 rounded-md bg-gradient-to-r from-neutral-900 to-black p-1 flex items-center justify-center text-[#CCFF00] text-[9px] font-bold shadow-xs border border-neutral-700">
                  VISA
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-black">Apple Card</span>
                    <span className="text-[11px] text-[#8E8E93]">•••• 4823</span>
                  </div>
                  <span className="text-[10px] text-[#8E8E93]">Default Payment</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
            </div>

            {/* Refundable Guarantee Row */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#CCFF00]/30 text-[#9B004F] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-black block">Anti-Flake Commitment</span>
                  <span className="text-[10px] text-[#9B004F] font-medium">100% Refunded upon GPS Check-in</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#8E8E93] bg-[#F2F2F7] px-2 py-0.5 rounded-full">
                Guaranteed
              </span>
            </div>
          </div>

          {/* Total Due Section */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-black/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8E8E93] block">Hold Deposit Today</span>
              <span className="text-[11px] text-[#9B004F] font-medium">Refunded after arrival</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-black tabular-nums tracking-tight">
                $5.00
              </span>
            </div>
          </div>

          {/* Side Button / Double Click Prompt & Interactive Trigger */}
          <div className="mt-2 flex flex-col items-center gap-2 text-center">
            {isConfirmed ? (
              <div className="w-full py-4 rounded-2xl bg-[#34C759] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md animate-in zoom-in-95">
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Deposit Authorized! You're Down</span>
              </div>
            ) : isProcessing ? (
              <div className="w-full py-4 rounded-2xl bg-black text-white font-medium text-xs flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Contacting Card Issuer...</span>
              </div>
            ) : (
              <button
                onClick={handlePay}
                className="w-full py-3.5 px-4 rounded-2xl bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-md focus-visible:ring-2 focus-visible:ring-black"
              >
                {/* FaceID / Touch prompt icon */}
                <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center">
                  <Smartphone className="w-3 h-3 text-[#CCFF00]" />
                </div>
                <span>Pay $5.00 with Pay</span>
              </button>
            )}

            {/* Subtle instructional sub-text matching iOS Apple Pay modal style */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#8E8E93] mt-1">
              <Lock className="w-3 h-3" />
              <span>Double-click side button or tap button to confirm</span>
            </div>
          </div>

          {/* Social Proof note */}
          <p className="text-[10px] text-center text-[#8E8E93] mt-1 px-3">
            Both attendees place a $5 hold. When you meet up, the app verifies location and returns both deposits immediately.
          </p>

        </div>
      </div>
    </div>
  );
};
