import React, { useEffect, useLayoutEffect, useRef } from 'react';

const ITEM = 40; // px height of one wheel row
const HEIGHT = ITEM * 5; // five visible rows, the middle one is selected
const DAYS = 366;
const MINUTE_STEP = 5;

interface WheelColumnProps {
  label: string;
  items: string[];
  index: number;
  onChange: (i: number) => void;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const WheelColumn: React.FC<WheelColumnProps> = ({ label, items, index, onChange, className = '', align = 'center' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useLayoutEffect(() => {
    if (ref.current) ref.current.scrollTop = index * ITEM;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the wheel in sync when the value changes from outside (e.g. keyboard, or the end time shifting)
  useEffect(() => {
    const el = ref.current;
    if (el && Math.abs(el.scrollTop - index * ITEM) > 1) el.scrollTo({ top: index * ITEM, behavior: 'smooth' });
  }, [index]);

  const handleScroll = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const i = Math.min(items.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM)));
      if (i !== index) onChange(i);
    }, 100);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') onChange(Math.min(items.length - 1, index + 1));
    else if (e.key === 'ArrowUp') onChange(Math.max(0, index - 1));
    else return;
    e.preventDefault();
  };

  const justify = align === 'left' ? 'justify-start pl-3' : align === 'right' ? 'justify-end pr-3' : 'justify-center';

  return (
    <div
      ref={ref}
      role="listbox"
      tabIndex={0}
      aria-label={label}
      aria-activedescendant={`${label}-${index}`}
      onScroll={handleScroll}
      onKeyDown={handleKey}
      className={`no-scrollbar snap-y snap-mandatory overflow-y-auto rounded-control focus-visible:bg-ink/5 focus-visible:outline-none ${className}`}
      style={{
        height: HEIGHT,
        maskImage: 'linear-gradient(to bottom, transparent 0, #000 30%, #000 70%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 30%, #000 70%, transparent 100%)',
      }}
    >
      <div style={{ paddingTop: ITEM * 2, paddingBottom: ITEM * 2 }}>
        {items.map((text, i) => (
          <div
            key={i}
            id={`${label}-${i}`}
            role="option"
            aria-selected={i === index}
            onClick={() => {
              ref.current?.scrollTo({ top: i * ITEM, behavior: 'smooth' });
              onChange(i);
            }}
            className={`flex cursor-pointer snap-center items-center whitespace-nowrap text-lg transition-colors ${justify} ${
              i === index ? 'font-semibold text-ink' : 'text-ink/45'
            }`}
            style={{ height: ITEM }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

interface WheelDateTimePickerProps {
  value: number;
  onChange: (ts: number) => void;
}

// iOS-style scroll wheels: day, hour, minute, AM/PM
export const WheelDateTimePicker: React.FC<WheelDateTimePickerProps> = ({ value, onChange }) => {
  const today = startOfToday();
  const d = new Date(value);

  const dayItems = Array.from({ length: DAYS }, (_, i) => {
    if (i === 0) return 'Today';
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    return day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });
  const hourItems = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minuteItems = Array.from({ length: 60 / MINUTE_STEP }, (_, i) => String(i * MINUTE_STEP).padStart(2, '0'));

  const dayIndex = Math.min(DAYS - 1, Math.max(0, Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - today.getTime()) / 86400000)));
  const hour12 = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
  const minuteIndex = Math.min(minuteItems.length - 1, Math.round(d.getMinutes() / MINUTE_STEP));
  const pm = d.getHours() >= 12;

  const emit = (next: { day?: number; hour12?: number; minuteIdx?: number; pm?: boolean }) => {
    const day = next.day ?? dayIndex;
    const h12 = next.hour12 ?? hour12;
    const isPm = next.pm ?? pm;
    const minutes = (next.minuteIdx ?? minuteIndex) * MINUTE_STEP;
    const hours24 = (h12 % 12) + (isPm ? 12 : 0);
    const out = new Date(today);
    out.setDate(out.getDate() + day);
    out.setHours(hours24, minutes, 0, 0);
    onChange(out.getTime());
  };

  return (
    <div className="relative px-3 py-2">
      {/* Selection band behind the middle row */}
      <div aria-hidden className="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-control bg-ink/[0.07]" style={{ height: ITEM }} />
      <div className="relative flex">
        <WheelColumn label="Day" items={dayItems} index={dayIndex} onChange={(i) => emit({ day: i })} className="flex-[2.4]" align="left" />
        <WheelColumn label="Hour" items={hourItems} index={hour12 - 1} onChange={(i) => emit({ hour12: i + 1 })} className="flex-1" />
        <WheelColumn label="Minute" items={minuteItems} index={minuteIndex} onChange={(i) => emit({ minuteIdx: i })} className="flex-1" />
        <WheelColumn label="AM or PM" items={['AM', 'PM']} index={pm ? 1 : 0} onChange={(i) => emit({ pm: i === 1 })} className="flex-1" />
      </div>
    </div>
  );
};
