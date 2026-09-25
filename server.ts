import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import ical from 'node-ical';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// API Routes
app.post('/api/gemini/anti-lazy', async (req, res) => {
  const { beaconTitle, location, activityType, userState } = req.body;

  if (!aiClient) {
    // High-quality smart fallback based on behavioral science
    return res.json({
      text: `Your prefrontal cortex is exhausted from screens, making you fall into the 'Affective Forecasting Error'—your brain wrongly predicts that scrolling on the couch will recharge you. In reality, solitary phone doomscrolling leaves you wired and melancholy, while 30 minutes of low-stakes shared presence at ${location || 'the spot'} resets your vagus nerve and dopamine levels. Sweatpants are fully approved. Put your shoes on right now and leave in 10 minutes—future you will be so glad you went!`,
      fallback: true
    });
  }

  try {
    const prompt = `You are the 'Anti-Lazy Voice of Reason' inside "Down", an app for spontaneous adult hangouts and fighting adult isolation.
The user is at home at 6:30 PM on a weekday, tired from work/screens, experiencing the 'Affective Forecasting Error' (their tired brain falsely predicts that isolation/scrolling will soothe them, whereas low-stakes shared presence at an errand/coffee/walk actually resets their nervous system).
Beacon details:
- Title: "${beaconTitle || 'Quick Hangout'}"
- Location: "${location || 'Nearby'}"
- Activity: "${activityType || 'Errand / Sweet treat'}"
- User mood: "${userState || 'Tired, considering staying in'}"

Give them a compassionate, funny, punchy 3-sentence reality check that motivates them to get off the couch. Emphasize that sweatpants are fine, no performance or dressing up is required, and they'll be back home in an hour feeling 10x better.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({
      text: response.text || 'Put on your sneakers and walk out the door. Low-stakes presence cures screen fatigue every single time!',
      fallback: false
    });
  } catch (err: any) {
    console.error('Gemini anti-lazy error:', err);
    res.json({
      text: `Your brain is tricking you with the classic Wednesday 6:30 PM cliff. You don't need energy to show up in a hoodie for 35 minutes of chill company. Walk out the door—you'll feel lighter the moment you step outside!`,
      fallback: true
    });
  }
});

app.post('/api/gemini/icebreakers', async (req, res) => {
  const { activityType, location, mutualInterests } = req.body;

  if (!aiClient) {
    return res.json({
      icebreakers: [
        "What's one absurd hyper-fixation you had this month?",
        "If we had to buy the most unhinged item in this store right now, what is it?",
        "What outfit dilemma or life drama do you need an unbiased second opinion on?"
      ],
      fallback: true
    });
  }

  try {
    const prompt = `Generate 3 quirky, hyper-relatable, zero-awkwardness icebreaker questions for two 20-something adults meeting up for a spontaneous micro-hangout:
Activity: "${activityType || 'Coffee / Chores'}"
Location: "${location || 'Local neighborhood'}"
Mutual vibe: "${mutualInterests || 'Thrifting, sweet treats, dog watching, working girl decompress'}"

Rules:
- NOT boring corporate networking questions
- Low pressure, funny, specific, easy to answer
- Return as a clean JSON array of 3 strings: ["question 1", "question 2", "question 3"]`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let questions: string[] = [];
    try {
      questions = JSON.parse(response.text || '[]');
    } catch {
      questions = [
        "What's the funniest petty annoyance you endured today?",
        "Show me the last screenshot in your camera roll (or describe it).",
        "What's a weird grocery store snack you swear by?"
      ];
    }

    res.json({
      icebreakers: questions.length ? questions : [
        "What's the funniest petty annoyance you endured today?",
        "Show me the last screenshot in your camera roll.",
        "What's a weird grocery store snack you swear by?"
      ],
      fallback: false
    });
  } catch (err: any) {
    console.error('Gemini icebreaker error:', err);
    res.json({
      icebreakers: [
        "What's the most unhinged purchase in your online shopping cart?",
        "What's your current 3:00 PM sanity snack?",
        "Are you in a 'sweatpants forever' phase or 'dressing up for no reason' phase?"
      ],
      fallback: true
    });
  }
});

app.post('/api/gemini/callback', async (req, res) => {
  const { friendName, type, memorySnippet } = req.body;
  // type can be 'day2-callback', 'day7-chore', or 'day21-circle'

  if (!aiClient) {
    if (type === 'day2-callback') {
      return res.json({
        message: `Still laughing about what you said about ${memorySnippet || 'the oat milk scandal'}. Hope your Thursday isn't too chaotic!`,
        fallback: true
      });
    } else if (type === 'day7-chore') {
      return res.json({
        message: `I'm hitting up the bookstore / coffee spot near Mercer for ~40 mins of parallel work this afternoon. Down to body-double if you're around!`,
        fallback: true
      });
    } else {
      return res.json({
        message: `Doing a quick Trader Joe's errand run and park walk around 6:15. Pull up if you need groceries or fresh air!`,
        fallback: true
      });
    }
  }

  try {
    let typeInstructions = '';
    if (type === 'day2-callback') {
      typeInstructions = `Write a Day 2 Callback message to ${friendName}. Low-friction, referencing '${memorySnippet || 'their funny story'}'. ZERO ask to meet up. Just warmly validates the connection. 1-2 casual sentences.`;
    } else if (type === 'day7-chore') {
      typeInstructions = `Write a Day 7 Parallel Chore invite to ${friendName}. Inviting them to body-double or do an errand together (e.g. coffee shop work or bookstore for 40 mins). Super low activation energy, no pressure. 2 sentences.`;
    } else {
      typeInstructions = `Write a Day 21 Recurring Circle message to ${friendName}. Folding them into an errand run or group walk. Warm, inviting, natural. 2 sentences.`;
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: typeInstructions,
    });

    res.json({
      message: response.text?.trim() || `Thinking of ${memorySnippet || 'our hangout'}! Hope your week is treating you well.`,
      fallback: false
    });
  } catch (err: any) {
    console.error('Gemini callback error:', err);
    res.json({
      message: `Still thinking about ${memorySnippet || 'the funny story from our hangout'}! Hope you're having an awesome week.`,
      fallback: true
    });
  }
});


// ---------- Events (persisted to data/events.json) ----------
const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

function readEvents(): any[] {
  try {
    return JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeEvents(events: any[]) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

app.get('/api/events', (_req, res) => {
  const now = Date.now();
  res.json({ events: readEvents().filter((e) => e.expiresAt > now) });
});

app.post('/api/events', (req, res) => {
  const e = req.body;
  if (
    !e ||
    typeof e.id !== 'string' ||
    typeof e.title !== 'string' ||
    !e.title.trim() ||
    typeof e.startTime !== 'number' ||
    typeof e.expiresAt !== 'number' ||
    e.expiresAt <= e.startTime
  ) {
    return res.status(400).json({ error: 'Invalid event' });
  }
  const events = readEvents().filter((x) => x.id !== e.id);
  events.unshift(e);
  writeEvents(events);
  res.json({ event: e });
});

// ---------- Location search (OpenStreetMap Nominatim, proxied so we can send a User-Agent) ----------
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const nominatimHeaders = { 'User-Agent': 'DownApp/1.0 (spontaneous hangouts prototype)' };

function toPlace(r: any) {
  const display: string = r.display_name || '';
  return {
    name: r.name || display.split(',')[0] || 'Pinned location',
    address: display,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  };
}

app.get('/api/geocode', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 3) return res.json({ places: [] });
  try {
    const r = await fetch(`${NOMINATIM}/search?format=jsonv2&limit=6&q=${encodeURIComponent(q)}`, {
      headers: nominatimHeaders,
    });
    const data: any[] = await r.json();
    res.json({ places: data.map(toPlace) });
  } catch (err) {
    console.error('Geocode error:', err);
    res.status(502).json({ places: [], error: 'Location search unavailable' });
  }
});

app.get('/api/reverse', async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return res.status(400).json({ error: 'Bad coordinates' });
  try {
    const r = await fetch(`${NOMINATIM}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, { headers: nominatimHeaders });
    const data: any = await r.json();
    if (data.error) return res.json({ place: { name: 'Pinned location', address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng } });
    res.json({ place: { ...toPlace(data), lat, lng } });
  } catch (err) {
    console.error('Reverse geocode error:', err);
    res.json({ place: { name: 'Pinned location', address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng } });
  }
});

app.post('/api/gemini/event-description', async (req, res) => {
  const { title, location, when } = req.body;
  const fallback = `<p>${title ? `<strong>${String(title).replace(/[<>&]/g, '')}</strong> — ` : ''}no plans needed, you just need to be down.</p><p>Come as you are (sweatpants fully approved) and leave whenever you need to. It's a low-key hang${location ? ` at ${String(location).replace(/[<>&]/g, '')}` : ''}, and you'll head home feeling lighter than when you arrived.</p>`;
  if (!aiClient) return res.json({ html: fallback, fallback: true });
  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, warm, funny event description (2 short paragraphs, max 70 words total) for a spontaneous low-pressure hangout on the app "Down".
Title: "${title || 'Hangout'}"
Location: "${location || 'nearby'}"
When: "${when || 'soon'}"
Tone: relatable, zero pressure, sweatpants are fine. Return ONLY simple HTML using <p> and <strong> tags, no markdown, no code fences.`,
    });
    const html = (response.text || '').replace(/```html|```/g, '').trim();
    res.json({ html: html || fallback, fallback: !html });
  } catch (err) {
    console.error('Gemini event-description error:', err);
    res.json({ html: fallback, fallback: true });
  }
});


// ---------- Chat (persisted to data/chat.json) ----------
const CHAT_FILE = path.join(DATA_DIR, 'chat.json');
interface ChatMessage {
  id: string;
  threadId: string;
  from: 'me' | 'friend';
  text: string;
  ts: number;
}
interface ChatStore {
  messages: ChatMessage[];
  reads: Record<string, number>; // threadId -> timestamp the user last read up to
}

function readChat(): ChatStore {
  try {
    const data = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8'));
    return { messages: data.messages ?? [], reads: data.reads ?? {} };
  } catch {
    return { messages: [], reads: {} };
  }
}

function writeChat(store: ChatStore) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  store.messages = store.messages.slice(-2000);
  fs.writeFileSync(CHAT_FILE, JSON.stringify(store, null, 2));
}

const validThread = (id: unknown): id is string => typeof id === 'string' && /^[a-z0-9-]{1,60}$/i.test(id);

let lastTs = 0;
const nextTs = () => (lastTs = Math.max(Date.now(), lastTs + 1)); // strictly increasing, so ordering is stable

function addMessage(threadId: string, from: 'me' | 'friend', text: string): ChatMessage {
  const store = readChat();
  const msg: ChatMessage = { id: `m-${nextTs()}-${Math.random().toString(36).slice(2, 7)}`, threadId, from, text, ts: nextTs() };
  store.messages.push(msg);
  writeChat(store);
  return msg;
}

// One summary per conversation: last message + unread count
app.get('/api/threads', (_req, res) => {
  const store = readChat();
  const threads: Record<string, { last: ChatMessage; unread: number }> = {};
  for (const m of store.messages) {
    const cur = threads[m.threadId] ?? { last: m, unread: 0 };
    cur.last = m;
    if (m.from === 'friend' && m.ts > (store.reads[m.threadId] ?? 0)) cur.unread += 1;
    threads[m.threadId] = cur;
  }
  res.json({ threads });
});

app.get('/api/messages', (req, res) => {
  const threadId = req.query.thread;
  if (!validThread(threadId)) return res.status(400).json({ error: 'Bad thread' });
  res.json({ messages: readChat().messages.filter((m) => m.threadId === threadId) });
});

app.post('/api/messages', (req, res) => {
  const { threadId, text } = req.body ?? {};
  const clean = typeof text === 'string' ? text.trim() : '';
  if (!validThread(threadId) || !clean || clean.length > 1000) return res.status(400).json({ error: 'Invalid message' });
  res.json({ message: addMessage(threadId, 'me', clean) });
});

app.post('/api/messages/read', (req, res) => {
  const { threadId } = req.body ?? {};
  if (!validThread(threadId)) return res.status(400).json({ error: 'Bad thread' });
  const store = readChat();
  store.reads[threadId] = Date.now() + 1;
  writeChat(store);
  res.json({ ok: true });
});

// Demo helper: the mock friends are not real users, so this writes their side of the conversation
const CANNED_REPLIES = [
  'ha yes!! I am so down. what time?',
  'omg perfect timing, I was just about to text you',
  'I can do tonight, just say where and I will be there',
  'lol you get me. count me in',
  'ok yes, but only if there is a snack involved',
  'thinking of you too! this week has been a lot, I need this',
];

app.post('/api/messages/auto-reply', async (req, res) => {
  const { threadId, friendName, interests } = req.body ?? {};
  if (!validThread(threadId)) return res.status(400).json({ error: 'Bad thread' });
  const history = readChat().messages.filter((m) => m.threadId === threadId).slice(-8);
  let text = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];

  if (aiClient) {
    try {
      const convo = history.map((m) => `${m.from === 'me' ? 'Kylie' : String(friendName || 'Friend')}: ${m.text}`).join('\n');
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are ${String(friendName || 'a friend').slice(0, 40)}, a warm, funny 20-something friend of Kylie texting her back. Shared interests: ${String(interests || 'coffee, walks').slice(0, 120)}.
Recent messages:
${convo}
Reply with ONE short casual text message (max 25 words), lowercase-friendly, no quotes, no emojis unless natural. Return only the message text.`,
      });
      const out = (response.text || '').trim().replace(/^["']|["']$/g, '');
      if (out) text = out.slice(0, 300);
    } catch (err) {
      console.error('Gemini friend reply error:', err);
    }
  }
  res.json({ message: addMessage(threadId, 'friend', text) });
});


// ---------- Google Calendar (read-only, via the private iCal address) ----------
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function readSettings(): { calendarUrl?: string } {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeSettings(s: { calendarUrl?: string }) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(s, null, 2));
}

// Only Google Calendar's own iCal addresses are accepted, so the server can't be pointed at arbitrary hosts
function parseCalendarUrl(raw: unknown): URL | null {
  if (typeof raw !== 'string') return null;
  try {
    const u = new URL(raw.trim().replace(/^webcal:/i, 'https:'));
    if (u.protocol !== 'https:' || u.hostname !== 'calendar.google.com' || !u.pathname.startsWith('/calendar/ical/')) return null;
    return u;
  } catch {
    return null;
  }
}

interface CalEvent {
  title: string;
  start: number;
  end: number;
}

let calCache: { url: string; at: number; events: CalEvent[] } | null = null;

async function loadCalendar(url: string, force = false): Promise<CalEvent[]> {
  if (!force && calCache && calCache.url === url && Date.now() - calCache.at < 60_000) return calCache.events;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10_000);
  let text: string;
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'error' });
    if (!r.ok) throw new Error(`Google returned ${r.status}`);
    text = await r.text();
  } finally {
    clearTimeout(timer);
  }
  if (text.length > 8_000_000) throw new Error('Calendar is too large');
  if (!text.includes('BEGIN:VCALENDAR')) throw new Error('That address did not return a calendar');

  const from = new Date(Date.now() - 12 * 3600_000);
  const to = new Date(Date.now() + 7 * 24 * 3600_000);
  const events: CalEvent[] = [];
  for (const item of Object.values(ical.parseICS(text)) as any[]) {
    if (!item || item.type !== 'VEVENT' || !item.start) continue;
    const instances = item.rrule
      ? ical.expandRecurringEvent(item, { from, to, expandOngoing: true })
      : [{ start: item.start, end: item.end ?? item.start, summary: item.summary, isFullDay: item.datetype === 'date' }];
    for (const inst of instances as any[]) {
      const start = new Date(inst.start).getTime();
      const end = new Date(inst.end ?? inst.start).getTime();
      if (inst.isFullDay || end < from.getTime() || start > to.getTime()) continue; // all-day items don't block time
      const title = typeof inst.summary === 'string' ? inst.summary : (inst.summary?.val ?? 'Busy');
      events.push({ title: String(title).slice(0, 120), start, end });
    }
  }
  events.sort((a, b) => a.start - b.start);
  calCache = { url, at: Date.now(), events };
  return events;
}

app.get('/api/calendar', async (_req, res) => {
  const url = readSettings().calendarUrl;
  if (!url) return res.json({ connected: false, events: [] });
  try {
    res.json({ connected: true, events: await loadCalendar(url) });
  } catch (err: any) {
    console.error('Calendar load error:', err?.message);
    res.json({ connected: true, events: [], error: 'Could not read your calendar right now.' });
  }
});

app.post('/api/calendar', async (req, res) => {
  const u = parseCalendarUrl(req.body?.url);
  if (!u) {
    return res.status(400).json({ error: 'Paste the "Secret address in iCal format" from Google Calendar (it starts with https://calendar.google.com/calendar/ical/).' });
  }
  try {
    const events = await loadCalendar(u.toString(), true);
    writeSettings({ ...readSettings(), calendarUrl: u.toString() });
    res.json({ connected: true, events });
  } catch (err: any) {
    res.status(400).json({ error: 'Could not read that calendar. Check the address and try again.' });
  }
});

app.delete('/api/calendar', (_req, res) => {
  const s = readSettings();
  delete s.calendarUrl;
  writeSettings(s);
  calCache = null;
  res.json({ connected: false });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
