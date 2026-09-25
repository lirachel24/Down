import React from 'react';
import { TopActions } from './TopActions';

interface HeaderProps {
  avatar: string;
  name: string;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => (
  <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-xl border-b border-line px-4 py-2.5">
    <div className="flex items-center justify-between">
      <div className="flex items-baseline gap-1">
        <span className="font-header text-2xl tracking-tight text-ink">down</span>
        <span className="text-[12px] font-bold text-berry leading-none">✦</span>
      </div>
      <TopActions {...props} />
    </div>
  </header>
);
