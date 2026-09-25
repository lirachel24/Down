import React from 'react';

// Soft yellow / pink / peach glow in the top-right corner, shared by every screen
export const GradientBackdrop: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-[460px] overflow-hidden ${className}`}>
    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#EBE7A8] opacity-80 blur-3xl" />
    <div className="absolute -right-16 top-4 h-60 w-60 rounded-full bg-[#E8A4C8] opacity-70 blur-3xl" />
    <div className="absolute -right-10 top-24 h-40 w-40 rounded-full bg-[#E0A48C] opacity-50 blur-3xl" />
  </div>
);
