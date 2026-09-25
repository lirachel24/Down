import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { GradientBackdrop } from '../GradientBackdrop';

// Full-screen page that sits over the app, like a Luma sheet
export const PageShell: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => (
  <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-50 flex justify-center bg-ink/40">
    <div data-app-frame="" className="relative flex h-full w-full max-w-[420px] flex-col overflow-clip bg-cream">
      <GradientBackdrop />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  </div>
);

export const CircleButton: React.FC<{
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'plain' | 'cta' | 'lime';
  disabled?: boolean;
}> = ({ label, onClick, children, variant = 'plain', disabled }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-transform active:scale-95 disabled:opacity-40 ${
      variant === 'cta' ? 'border-cta bg-cta text-cream' : variant === 'lime' ? 'border-lime bg-lime text-ink' : 'border-line bg-white/80 text-ink'
    }`}
  >
    {children}
  </button>
);

export const PageHeader: React.FC<{
  title: string;
  onBack: () => void;
  backIcon?: 'back' | 'close';
  right?: React.ReactNode;
}> = ({ title, onBack, backIcon = 'back', right }) => (
  <header className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
    <CircleButton label={backIcon === 'close' ? 'Close' : 'Back'} onClick={onBack}>
      {backIcon === 'close' ? <X className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
    </CircleButton>
    <h1 className="font-headline text-lg font-bold text-ink">{title}</h1>
    <div className="flex h-11 w-11 items-center justify-center">{right}</div>
  </header>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`overflow-hidden rounded-card border border-line bg-white/70 backdrop-blur-md ${className}`}>{children}</div>
);

export const Divider = () => <div className="ml-14 h-px bg-line" />;

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="px-1 pt-2 font-label text-sm font-medium uppercase tracking-wider text-muted">{children}</h2>
);

export const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors ${checked ? 'bg-pink' : 'bg-line'}`}
  >
    <span className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);
