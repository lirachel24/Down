import React, { useState } from 'react';
import { Beacon, ActivityCategory } from '../types';
import { Clock, Users, Navigation, Shirt } from 'lucide-react';

interface BeaconMapProps {
  beacons: Beacon[];
  onSelectBeacon: (beacon: Beacon) => void;
  onSelectConvinceMe: (beacon: Beacon) => void;
  activeCategory: ActivityCategory | 'all';
  onCategoryChange: (category: ActivityCategory | 'all') => void;
}

export const BeaconMap: React.FC<BeaconMapProps> = ({
  beacons,
  onSelectBeacon,
  activeCategory,
  onCategoryChange,
}) => {
  const [selectedBeaconId, setSelectedBeaconId] = useState<string | null>(
    beacons[0]?.id || null
  );

  const filteredBeacons = activeCategory === 'all'
    ? beacons
    : beacons.filter(b => b.activityCategory === activeCategory);

  const selectedBeacon = beacons.find(b => b.id === selectedBeaconId) || beacons[0];

  const categories: Array<{ id: ActivityCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Events' },
    { id: 'sweet-treat', label: 'Sweet Treats' },
    { id: 'chore', label: 'Chores & Errands' },
    { id: 'body-double', label: 'Body-Doubling' },
    { id: 'dog-walk', label: 'Dog Walks' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] relative">
      {/* Category Filter Pills */}
      <div className="px-4 py-2 bg-white border-b border-neutral-200 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`min-h-[36px] px-3.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-[#18111A] text-[#CCFF00] font-bold shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stylized Interactive Map Canvas */}
      <div className="flex-1 relative bg-neutral-200 overflow-hidden select-none">
        {/* Map Grid & Road Lines Aesthetic */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          {/* Main Avenues */}
          <div className="absolute top-1/4 left-0 right-0 h-4 bg-neutral-300 transform -rotate-2" />
          <div className="absolute top-2/3 left-0 right-0 h-6 bg-neutral-300 transform rotate-1" />
          <div className="absolute top-0 bottom-0 left-1/3 w-5 bg-neutral-300 transform rotate-3" />
          <div className="absolute top-0 bottom-0 left-2/3 w-7 bg-neutral-300 transform -rotate-1" />

          {/* Park area */}
          <div className="absolute bottom-6 left-6 w-32 h-28 bg-[#D8E6CC] rounded-3xl opacity-70" />
          <div className="absolute top-10 right-10 w-28 h-28 bg-[#D8E6CC] rounded-3xl opacity-70" />

          {/* Street labels */}
          <span className="absolute top-[23%] left-4 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Shattuck Ave
          </span>
          <span className="absolute top-[65%] right-8 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Telegraph Ave
          </span>
          <span className="absolute bottom-10 left-12 text-[10px] font-bold text-[#2A6E1E] uppercase tracking-wider">
            Willard Park
          </span>
        </div>

        {/* You Are Here Marker */}
        <div
          className="absolute z-10 flex flex-col items-center pointer-events-none"
          style={{ left: '46%', top: '56%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-4 h-4 rounded-full bg-[#18111A] border-2 border-white shadow-md relative">
            <span className="absolute -inset-2 rounded-full bg-[#18111A]/20 animate-ping" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#18111A] text-white shadow-xs">
            You (Telegraph)
          </span>
        </div>

        {/* Live Events with Countdown Overlays */}
        {filteredBeacons.map((b) => {
          const isSelected = selectedBeacon?.id === b.id;
          const timeLeftSec = Math.max(0, Math.floor((b.expiresAt - Date.now()) / 1000));
          const mins = Math.floor(timeLeftSec / 60);

          return (
            <div
              key={b.id}
              className="absolute z-20 cursor-pointer transition-transform hover:scale-105"
              style={{
                left: `${b.coords.x}%`,
                top: `${b.coords.y}%`,
                transform: 'translate(-50%, -100%)',
              }}
              onClick={() => {
                setSelectedBeaconId(b.id);
                onSelectBeacon(b);
              }}
            >
              {/* Ticking Countdown Pill above pin */}
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md whitespace-nowrap mb-1 border ${
                  isSelected
                    ? 'bg-[#18111A] text-white border-white'
                    : 'bg-white text-[#18111A] border-neutral-200'
                }`}
              >
                <Clock className="w-3 h-3 text-[#CCFF00]" />
                <span className="font-mono">{mins}m</span>
                <span aria-hidden="true">·</span>
                <span className="text-[10px] text-[#18111A] bg-[#CCFF00] px-1 rounded font-bold">
                  {b.spotsTotal - b.spotsFilled} open
                </span>
              </div>

              {/* Pin Icon with Avatar */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full p-0.5 shadow-lg flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-4 ring-[#CCFF00] bg-[#18111A]'
                      : 'bg-white'
                  }`}
                >
                  <img
                    src={b.author.avatar}
                    alt={b.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div
                  className={`w-2.5 h-2.5 rotate-45 -mt-1.5 ${
                    isSelected ? 'bg-[#18111A]' : 'bg-white'
                  }`}
                />
              </div>
            </div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => setSelectedBeaconId(beacons[0]?.id || null)}
            aria-label="Center map on my neighborhood"
            className="w-10 h-10 rounded-full bg-white text-[#18111A] shadow-md border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all"
          >
            <Navigation className="w-4 h-4 text-[#18111A]" />
          </button>
        </div>
      </div>

      {/* Selected Event Quick Drawer */}
      {selectedBeacon && (
        <div className="p-4 bg-white border-t border-neutral-200 shadow-lg rounded-t-3xl">
          <div className="flex items-start gap-3">
            <img
              src={selectedBeacon.image}
              alt={selectedBeacon.title}
              className="w-16 h-16 rounded-2xl object-cover border border-neutral-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#18111A]">
                  {selectedBeacon.categoryLabel}
                </span>
                <span className="text-[10px] font-bold bg-[#CCFF00] text-[#18111A] px-1.5 py-0.5 rounded">
                  {selectedBeacon.distance}
                </span>
              </div>
              <h4 className="font-headline text-sm font-bold text-[#18111A] truncate mt-0.5">
                {selectedBeacon.title}
              </h4>
              <p className="text-xs text-neutral-500 truncate">
                {selectedBeacon.locationName}
              </p>
            </div>
          </div>

          {/* Quick Outfit / Sweatpants check */}
          <div className="mt-2 text-xs text-neutral-700 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200 flex items-center gap-2">
            <Shirt className="w-3.5 h-3.5 text-[#18111A] shrink-0" />
            <span className="truncate">{selectedBeacon.whatAreWeWearing}</span>
          </div>

          {/* Action CTA */}
          <div className="mt-3">
            <button
              onClick={() => onSelectBeacon(selectedBeacon)}
              className="w-full min-h-[44px] px-4 py-2 text-xs font-bold rounded-2xl bg-[#18111A] text-[#CCFF00] hover:bg-neutral-800 flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
            >
              <Users className="w-4 h-4 text-[#CCFF00]" />
              <span>I'm Down</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
