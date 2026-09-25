import React from 'react';

interface TopActionsProps {
  avatar: string;
  name: string;
  onOpenProfile: () => void;
}

// Profile avatar, shown in the top right of the main screens
export const TopActions: React.FC<TopActionsProps> = ({ avatar, name, onOpenProfile }) => (
  <button
    onClick={onOpenProfile}
    aria-label={`Open ${name}'s profile`}
    className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-white shadow-xs active:scale-95 transition-transform"
  >
    <img src={avatar} alt="" className="h-full w-full object-cover" />
  </button>
);
