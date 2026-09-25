import { Beacon } from '../types';

export const eventLink = (id: string) => `${window.location.origin}/?event=${encodeURIComponent(id)}`;

const toIcsDate = (ts: number) => new Date(ts).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\;');

// Downloads an .ics file the user can open in Apple Calendar, Google Calendar or Outlook
export function downloadIcs(b: Beacon) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Down//Events//EN',
    'BEGIN:VEVENT',
    `UID:${b.id}@down.app`,
    `DTSTAMP:${toIcsDate(Date.now())}`,
    `DTSTART:${toIcsDate(b.startTime)}`,
    `DTEND:${toIcsDate(b.expiresAt)}`,
    `SUMMARY:${icsText(b.title)}`,
    `LOCATION:${icsText(`${b.locationName}${b.address ? `, ${b.address}` : ''}`)}`,
    `DESCRIPTION:${icsText(`You down? ${eventLink(b.id)}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${b.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'event'}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
