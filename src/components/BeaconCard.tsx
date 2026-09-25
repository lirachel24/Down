import React, { useState, useEffect } from 'react';
import { Beacon } from '../types';
import { Clock, MapPin, Shirt, Sparkles, Check, ChevronRight } from 'lucide-react';

interface BeaconCardProps {
  beacon: Beacon;
  onSelectConvinceMe: (beacon: Beacon) => void;
  onJoinDirect: (beaconId: string) => void;
  isJoined?: boolean;
}

export const BeaconCard: React.FC<BeaconCardProps> = ({
  beacon,
  onSelectConvinceMe,
  onJoinDirect,
  isJoined = false,
}) => {
  const [timeLeftMs, setTimeLeftMs] = useState(beacon.expiresAt - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftMs(beacon.expiresAt - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [beacon.expiresAt]);

  const totalSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const isExpiringSoon = minutes < 10;
  const isFull = beacon.spotsFilled >= beacon.spotsTotal;
  const spotsRemaining = Math.max(0, beacon.spotsTotal - beacon.spotsFilled);

  return (
    <article
      className="bg-white rounded-3xl p-4 border border-line shadow-xs hover:shadow-md transition-all flex flex-col gap-3 group"
      aria-label={`Event: ${beacon.title}`}
    >
      {/* Top Row: Luma-style layout with Poster Image on left & Metadata on right */}
      <div className="flex items-start gap-3.5">
        {/* Poster Image (Luma square rounded format) */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-sand border border-line shadow-2xs">
          <img
            src={beacon.image}
            alt={beacon.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Status badge overlaid on poster corner */}
          <div className="absolute top-1.5 left-1.5">
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md shadow-xs ${
                isExpiringSoon
                  ? 'bg-[#CCFF00] text-[#18111A] font-extrabold border border-black/10'
                  : 'bg-[#18111A]/85 text-white backdrop-blur-xs'
              }`}
            >
              {minutes}m left
            </span>
          </div>
        </div>

        {/* Content Details (Luma typography hierarchy) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          {/* Host info & Category line */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 truncate">
              <img
                src={beacon.author.avatar}
                alt={beacon.author.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="font-semibold text-[#18111A] truncate">{beacon.author.name}</span>
              <span>·</span>
              <span className="truncate">{beacon.categoryLabel}</span>
            </div>
            <span className="text-[10px] font-bold text-[#18111A] bg-[#CCFF00] px-2 py-0.5 rounded-full shrink-0">
              {spotsRemaining > 0 ? `${spotsRemaining} open` : 'Full'}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="font-headline text-base sm:text-lg font-bold text-[#18111A] leading-snug line-clamp-2 mt-1">
            {beacon.title}
          </h3>

          {/* Time & Location rows */}
          <div className="flex flex-col gap-0.5 mt-1.5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
              <Clock className="w-3.5 h-3.5 text-[#9B004F] shrink-0" />
              <span className="font-medium text-[#18111A]">Happening Now · {beacon.durationMinutes} mins</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
              <MapPin className="w-3.5 h-3.5 text-[#9B004F] shrink-0" />
              <span className="truncate">{beacon.locationName}</span>
              <span className="text-[11px] font-semibold text-neutral-400">({beacon.distance})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Go Rationale: Clean inline callout */}
      <div className="bg-sand rounded-2xl p-3 border border-line flex flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#9B004F] shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-700 leading-relaxed">
            "{beacon.convinceMeReason}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-line text-[11px]">
          <div className="flex items-center gap-1.5 text-neutral-600 truncate">
            <Shirt className="w-3 h-3 text-[#18111A]" />
            <span className="truncate">{beacon.whatAreWeWearing}</span>
          </div>
          <button
            onClick={() => onSelectConvinceMe(beacon)}
            className="text-[11px] font-bold text-[#18111A] hover:text-[#9B004F] shrink-0 flex items-center"
          >
            <span>Plan & tips</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-0.5">
        {isJoined ? (
          <div className="min-h-[44px] flex-1 px-4 py-2.5 text-xs font-bold rounded-2xl bg-[#9B004F] text-white flex items-center justify-center gap-1.5 shadow-xs">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>You're Down! Spot Claimed</span>
          </div>
        ) : (
          <button
            onClick={() => onJoinDirect(beacon.id)}
            disabled={isFull}
            className={`min-h-[44px] flex-1 px-4 py-2.5 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.98] ${
              isFull
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : 'bg-[#18111A] hover:bg-neutral-800 text-[#CCFF00]'
            }`}
          >
            <span>I'm Down</span>
          </button>
        )}
      </div>
    </article>
  );
};
