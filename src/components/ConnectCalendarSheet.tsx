import React, { useState } from 'react';
import { CalendarCheck, ExternalLink, Loader2 } from 'lucide-react';
import { PageHeader, PageShell, Card } from './create-event/ui';

interface ConnectCalendarSheetProps {
  connected: boolean;
  onConnect: (url: string) => Promise<void>;
  onDisconnect: () => Promise<void>;
  onClose: () => void;
}

export const ConnectCalendarSheet: React.FC<ConnectCalendarSheetProps> = ({ connected, onConnect, onDisconnect, onClose }) => {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onConnect(url.trim());
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell label="Connect Google Calendar">
      <PageHeader title="Google Calendar" onBack={onClose} />
      <div className="flex-1 overflow-y-auto px-4 pb-10">
        <p className="px-1 text-base text-ink">
          Connect your calendar and Down will show how much free time you have before your next event, then point you to something worth doing with it.
        </p>

        {connected ? (
          <Card className="mt-5 p-5">
            <p className="flex items-center gap-2 text-base text-ink"><CalendarCheck className="h-5 w-5 text-berry" /> Your calendar is connected.</p>
            <button
              type="button"
              onClick={async () => {
                setBusy(true);
                await onDisconnect();
                setBusy(false);
                onClose();
              }}
              disabled={busy}
              className="mt-4 min-h-[48px] w-full rounded-full border border-line bg-white text-base text-ink disabled:opacity-60"
            >
              Disconnect
            </button>
          </Card>
        ) : (
          <>
            <Card className="mt-5 p-5">
              <h2 className="font-label text-sm uppercase tracking-wider text-muted">How to connect</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-base text-ink">
                <li>
                  Open{' '}
                  <a href="https://calendar.google.com/calendar/u/0/r/settings" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-berry underline">
                    Google Calendar settings <ExternalLink className="h-3.5 w-3.5" />
                  </a>{' '}
                  on a computer.
                </li>
                <li>Pick your calendar in the left menu, then open <b>Integrate calendar</b>.</li>
                <li>Copy the <b>Secret address in iCal format</b> and paste it below.</li>
              </ol>
            </Card>

            <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
              <label htmlFor="ical-url" className="sr-only">Secret address in iCal format</label>
              <input
                id="ical-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://calendar.google.com/calendar/ical/…"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={!!error}
                className="min-h-[52px] w-full rounded-control border border-line bg-white/80 px-5 text-base text-ink placeholder:text-ink/35 focus:border-pink/40 focus:outline-none focus:ring-4 focus:ring-pink/10"
              />
              {error && <p role="alert" className="px-2 text-sm text-berry">{error}</p>}
              <button
                type="submit"
                disabled={!url.trim() || busy}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-cta text-base font-semibold text-cream active:scale-[0.98] disabled:opacity-50"
              >
                {busy && <Loader2 className="h-5 w-5 animate-spin" />} Connect calendar
              </button>
            </form>
            <p className="mt-4 px-2 text-sm text-muted">
              Down only reads event times to work out your free time. The address stays on this server, and you can disconnect any time. Anyone with that address can read your calendar, so keep it private.
            </p>
          </>
        )}
      </div>
    </PageShell>
  );
};
