import React, { useState } from 'react';
import { ActivityCategory, Beacon } from '../types';
import { X, Clock, Shirt, Users, ShieldCheck, MapPin, Sparkles, Image as ImageIcon } from 'lucide-react';
import { currentUser } from '../data/mockData';

interface DropBeaconModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBeacon: (newBeacon: Beacon) => void;
}

export const DropBeaconModal: React.FC<DropBeaconModalProps> = ({
  isOpen,
  onClose,
  onAddBeacon,
}) => {
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('sweet-treat');
  const [durationMinutes, setDurationMinutes] = useState(35);
  const [spotsTotal, setSpotsTotal] = useState(2);
  const [whatAreWeWearing, setWhatAreWeWearing] = useState(
    'Oversized sweater + sneakers (100% sweatpants approved)'
  );
  const [depositRequired, setDepositRequired] = useState(true);

  if (!isOpen) return null;

  const categoryPresets: Array<{
    id: ActivityCategory;
    label: string;
    suggestedTitle: string;
    suggestedLocation: string;
    image: string;
  }> = [
    {
      id: 'sweet-treat',
      label: 'Sweet Treat',
      suggestedTitle: 'Sweet treat run & outfit consultation',
      suggestedLocation: 'Blue Bottle / Boba Guys · Shattuck',
      image: '/src/assets/images/hangout_coffee_spontaneous_1790368811947.jpg',
    },
    {
      id: 'chore',
      label: 'Chore',
      suggestedTitle: 'Trader Joe\'s grocery run · 30m',
      suggestedLocation: 'Trader Joe\'s · University Ave',
      image: '/src/assets/images/hangout_errands_chore_1790368822037.jpg',
    },
    {
      id: 'body-double',
      label: 'Work / Double',
      suggestedTitle: 'Silent body-doubling & admin sprints',
      suggestedLocation: 'Mercer Co-working / Library',
      image: '/src/assets/images/hangout_coffee_spontaneous_1790368811947.jpg',
    },
    {
      id: 'dog-walk',
      label: 'Walk',
      suggestedTitle: 'Dog walk & nervous system reset',
      suggestedLocation: 'Willard Park Lawn',
      image: '/src/assets/images/hangout_park_walk_1790368831575.jpg',
    },
  ];

  const currentPreset = categoryPresets.find((c) => c.id === category) || categoryPresets[0];

  const handleApplyPreset = (preset: typeof categoryPresets[0]) => {
    setCategory(preset.id);
    if (!title) setTitle(preset.suggestedTitle);
    if (!locationName) setLocationName(preset.suggestedLocation);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim()) return;

    const matchedPreset = categoryPresets.find((c) => c.id === category) || categoryPresets[0];

    const newBeacon: Beacon = {
      id: `beacon-${Date.now()}`,
      title: title.trim(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.role,
        companyOrSchool: currentUser.companyOrSchool,
        tier: 'villager',
        sweatpantsApproved: true,
      },
      activityCategory: category,
      categoryLabel: matchedPreset.label,
      locationName: locationName.trim(),
      address: `${locationName.trim()}, Berkeley, CA`,
      distance: '0.1 mi away',
      coords: {
        x: 40 + Math.floor(Math.random() * 20),
        y: 40 + Math.floor(Math.random() * 20),
      },
      startTime: Date.now(),
      durationMinutes,
      expiresAt: Date.now() + durationMinutes * 60 * 1000,
      spotsTotal,
      spotsFilled: 1,
      attendees: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
      ],
      whatAreWeWearing,
      convinceMeReason:
        'You have a 3-hour window on a Wednesday night. Solitude scrolling will drain you; come hang out for 30 minutes in sweatpants and feel human again!',
      icebreakerQuestions: [
        'What\'s the funniest thing that went wrong with your week so far?',
        'If you could teleport anywhere for 1 hour right now, where?',
        'What outfit should I wear to my friend\'s birthday party this weekend?',
      ],
      depositRequired,
      image: matchedPreset.image,
      isHost: true,
      joined: true,
    };

    onAddBeacon(newBeacon);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drop-beacon-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4 select-none"
    >
      <div className="bg-[#18111A] text-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom duration-200">
        
        {/* iOS Grab Bar */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto my-3 sm:hidden" />

        {/* Modal Top Bar (Luma style with avatar + title + check/close) */}
        <div className="flex items-center justify-between px-5 pt-1 pb-3">
          <div className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/30"
            />
            <h2 id="drop-beacon-title" className="text-sm font-bold tracking-tight text-white">
              Create Event
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Luma-style Poster Preview Area */}
        <div className="px-5 pt-1 pb-3">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-inner group">
            <img
              src={currentPreset.image}
              alt="Event Poster Preview"
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                {currentPreset.label}
              </span>
              <span className="text-[10px] font-bold text-[#18111A] bg-[#CCFF00] px-2.5 py-1 rounded-full shadow-xs">
                {durationMinutes}m Live Timer
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-5 pb-6 flex flex-col gap-3.5">
          {/* Category Chips (Luma style) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categoryPresets.map((preset) => (
              <button
                type="button"
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`min-h-[36px] px-3 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                  category === preset.id
                    ? 'bg-white text-black font-bold shadow-xs'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Event Name Input (Luma card styling) */}
          <div className="bg-white/10 rounded-2xl p-3 border border-white/5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sweet treat run & outfit consultation"
              className="w-full bg-transparent text-sm font-semibold text-white placeholder-white/40 focus:outline-none"
            />
          </div>

          {/* Date / Time Card (Luma start/end timeline format) */}
          <div className="bg-white/10 rounded-2xl p-3 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Clock className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span className="font-semibold">Duration & Active Window</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#CCFF00]">
                {durationMinutes} mins
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[20, 30, 45, 60].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                    durationMinutes === mins
                      ? 'bg-[#CCFF00] text-black shadow-xs'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Location input card */}
          <div className="bg-white/10 rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                Location
              </label>
            </div>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Blue Bottle Coffee, Shattuck Ave"
              className="w-full bg-transparent text-xs font-medium text-white placeholder-white/40 focus:outline-none"
            />
          </div>

          {/* Micro-capacity & Dresscode */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 rounded-2xl p-2.5 border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-white/50 block">
                Open Seats
              </span>
              <div className="flex gap-1.5 mt-1.5">
                {[2, 3].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setSpotsTotal(num)}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      spotsTotal === num
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/70'
                    }`}
                  >
                    {num - 1} open
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-2.5 border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-white/50 block">
                Dress Code
              </span>
              <span className="text-[11px] font-semibold text-[#CCFF00] truncate mt-1">
                Sweatpants OK
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#CCFF00] hover:bg-[#b8e600] text-[#18111A] font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-[#CCFF00] mt-1"
          >
            <Sparkles className="w-4 h-4 text-[#18111A]" />
            <span>Create Event Now</span>
          </button>
        </form>
      </div>
    </div>
  );
};

