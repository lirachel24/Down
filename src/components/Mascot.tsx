import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { HiddenMascotId, useFoundMascots } from '../lib/mascots';

export type MascotColor = 'pink' | 'green';
const SRC: Record<MascotColor, string> = { pink: '/face-pink.png', green: '/face-green.png' };

interface MascotFaceProps {
  color: MascotColor;
  size?: number;
  className?: string;
  interactive?: boolean;
  label?: string;
}

// A mascot face used wherever the app used to show a plain dot. Tap it and it bounces.
export const MascotFace: React.FC<MascotFaceProps> = ({ color, size = 24, className = '', interactive = true, label }) => {
  const [taps, setTaps] = useState(0);
  const img = (
    <img
      src={SRC[color]}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className="pointer-events-none block select-none rounded-full"
      style={{ width: size, height: size }}
    />
  );
  if (!interactive) {
    return (
      <span aria-hidden className={`inline-block shrink-0 ${className}`}>
        {img}
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-label={label ?? `${color} mascot. Tap to say hi`}
      onClick={(e) => {
        e.stopPropagation();
        setTaps((n) => n + 1);
      }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{ minWidth: size, minHeight: size }}
    >
      <span key={taps} className={taps ? 'mascot-bounce' : ''}>
        {img}
      </span>
    </button>
  );
};

interface HiddenMascotProps {
  id: HiddenMascotId;
  color: MascotColor;
  message: string;
  className?: string; // positions it (parent needs to be relative)
  size?: number;
  tilt?: number;
}

// A mascot tucked into a corner of the app. Tap to find it.
export const HiddenMascot: React.FC<HiddenMascotProps> = ({ id, color, message, className = '', size = 52, tilt = 0 }) => {
  const { found, markFound, total } = useFoundMascots();
  const [bubble, setBubble] = useState<string | null>(null);
  const [taps, setTaps] = useState(0);
  const [alignRight, setAlignRight] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTaps((n) => n + 1);
    const isNew = markFound(id);
    const rect = btn.current?.getBoundingClientRect();
    // Keep the speech bubble inside the app frame: open toward the side with more room
    const frame = btn.current?.closest('[data-app-frame]')?.getBoundingClientRect();
    if (rect && frame) setAlignRight((rect.x + rect.width / 2 - frame.x) / frame.width > 0.5);
    if (rect && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({
        particleCount: isNew ? 40 : 14,
        spread: 70,
        startVelocity: 22,
        origin: { x: (rect.x + rect.width / 2) / window.innerWidth, y: (rect.y + rect.height / 2) / window.innerHeight },
        colors: ['#FF4D94', '#CCFF00', '#18111A'],
      });
    }
    const count = isNew ? found.length + 1 : found.length;
    setBubble(isNew ? `${message} · Mascot ${count} of ${total} found!` : message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setBubble(null), 2800);
  };

  return (
    <div className={`absolute z-20 ${className}`}>
      {bubble && (
        <span
          role="status"
          className={`absolute bottom-full mb-2 w-max max-w-[180px] rounded-control border border-line bg-white px-3 py-1.5 text-xs leading-snug text-ink shadow-md ${alignRight ? 'right-0 text-right' : 'left-0 text-left'}`}
        >
          {bubble}
        </span>
      )}
      <button
        ref={btn}
        type="button"
        onClick={onTap}
        aria-label="A hidden mascot. Tap to say hi"
        className="block rounded-full opacity-90 transition-opacity hover:opacity-100 focus-visible:opacity-100"
      >
        <span key={taps} className={taps ? 'mascot-pop' : ''}>
          <img src={SRC[color]} alt="" width={size} height={size} draggable={false} className="block select-none rounded-full" style={{ width: size, height: size, transform: `rotate(${tilt}deg)` }} />
        </span>
      </button>
    </div>
  );
};
