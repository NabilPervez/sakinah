import Dexie, { type Table } from 'dexie';

/** One row per calendar day, tracking which checklist task IDs are checked. */
export interface ChecklistDay {
  id?: number;
  date: string; // YYYY-MM-DD
  completedTaskIds: string[];
}

/** A single timestamped emotional check-in. */
export interface CheckIn {
  id?: number;
  timestamp: number;
  date: string; // YYYY-MM-DD, local
  mood: string;
  moodIcon: string;
  anxietyLevel: number; // 1–10
  notes: string;
}

/** Story › Reframe: one harsh thought rewritten into a merciful one. */
export interface Reframe {
  id?: number;
  timestamp: number;
  date: string;
  oldStory: string;
  intensityBefore: number;
  myPartTags: string[];
  myPart: string;
  allahsPart: string;
  newStory: string;
  intensityAfter: number;
  verseId: string;
}

/** Story › Effort Ledger: one row per night. */
export interface EffortNight {
  id?: number;
  date: string;
  entries: string[];
  handedOver: string;
  duaId: string;
  createdAt: number;
}

/** Story › Four Pillars: one row per ISO week (Monday). */
export interface PillarWeek {
  id?: number;
  weekStart: string;
  community: string;
  purpose: string;
  charity: string;
  headline: string;
  createdAt: number;
}

/** Present › one 60-second observation or body-focus session. */
export interface PracticeSession {
  id?: number;
  type: 'object' | 'food' | 'body';
  mode: 'internal' | 'external' | 'both';
  target: string;
  note: string;
  startedAt: number;
  date: string;
  durationSec: number;
}

/** Present › "Back to it": a 5-minute distraction reset. */
export interface DistractionReset {
  id?: number;
  task: string;
  createdAt: number;
  date: string;
  firesAt: number;
  outcome: 'pending' | 'started' | 'snoozed' | 'missed';
  snoozed: boolean;
}

/** Present › one judgment noticed. */
export interface Judgment {
  id?: number;
  tag: string;
  createdAt: number;
  date: string;
}

/** Present › quick positive reframe (separate from Story › Reframe). */
export interface QuickReframe {
  id?: number;
  happened: string;
  reframe: string;
  createdAt: number;
  date: string;
}

/** Reflect › Nightly gratitude: one row per night. */
export interface GratitudeNight {
  id?: number;
  date: string;
  items: string[]; // up to 3
  why: string; // why one of them mattered
  createdAt: number;
}

/** Faith › Tie your camel. */
export interface Fear { id?: number; text: string; prepSteps: { text: string; done: boolean }[]; released: string[]; spouseFlag: boolean; status: 'open' | 'prepped' | 'released'; createdAt: number; date: string }
/** Faith › one completed dhikr set. */
export interface DhikrLog { id?: number; dhikrId: string; count: number; target: number; at: number; date: string }
/** Reflect › Muhasabah: one row per day (al-Ghazali's four stages). */
export interface MuhasabahDay { id?: number; date: string; intention: string; well: string; slip: string; release: string; createdAt: number }
export interface QuranLog { id?: number; passageId: string; date: string }
export interface WeeklySigns { id?: number; weekOf: string; scores: Record<string, number>; createdAt: number }

class SerenityDB extends Dexie {
  fears!: Table<Fear>;
  dhikrLogs!: Table<DhikrLog>;
  muhasabah!: Table<MuhasabahDay>;
  quranLogs!: Table<QuranLog>;
  weeklySigns!: Table<WeeklySigns>;
  gratitudes!: Table<GratitudeNight>;
  checklistDays!: Table<ChecklistDay>;
  checkIns!: Table<CheckIn>;
  reframes!: Table<Reframe>;
  efforts!: Table<EffortNight>;
  pillarWeeks!: Table<PillarWeek>;
  practiceSessions!: Table<PracticeSession>;
  distractionResets!: Table<DistractionReset>;
  judgments!: Table<Judgment>;
  quickReframes!: Table<QuickReframe>;

  constructor() {
    super('MutmainnahDB');
    this.version(1).stores({
      checklistDays: '++id, date',
      checkIns: '++id, timestamp, date',
    });
    // v2 — additive: Story pages. v1 tables untouched.
    this.version(2).stores({
      checklistDays: '++id, date',
      checkIns: '++id, timestamp, date',
      reframes: '++id, timestamp, date',
      efforts: '++id, &date',
      pillarWeeks: '++id, &weekStart',
    });
    // v3 — additive: Present section. Earlier tables untouched.
    this.version(3).stores({
      checklistDays: '++id, date',
      checkIns: '++id, timestamp, date',
      reframes: '++id, timestamp, date',
      efforts: '++id, &date',
      pillarWeeks: '++id, &weekStart',
      practiceSessions: '++id, startedAt, date, type',
      distractionResets: '++id, createdAt, date',
      judgments: '++id, createdAt, date, tag',
      quickReframes: '++id, createdAt, date',
    });
    // v4 — additive: nightly gratitude journal.
    this.version(4).stores({
      gratitudes: '++id, &date',
    });
    // v5 — additive: Mutma'innah faith layer (Nabil, 2026-11-15).
    this.version(5).stores({
      fears: '++id, createdAt, date, status',
      dhikrLogs: '++id, at, date, dhikrId',
      muhasabah: '++id, &date',
      quranLogs: '++id, date, passageId',
      weeklySigns: '++id, &weekOf',
    });
  }
}

export const db = new SerenityDB();

// ── Helpers: Checklist ─────────────────────────────────

export async function getChecklistDay(date: string): Promise<ChecklistDay | undefined> {
  return db.checklistDays.where('date').equals(date).first();
}

export async function saveChecklistDay(
  state: Omit<ChecklistDay, 'id'>,
  existingId?: number
): Promise<number> {
  if (existingId) {
    await db.checklistDays.update(existingId, state);
    return existingId;
  }
  return db.checklistDays.add(state);
}

/** All checklist days, most recent first. */
export async function getAllChecklistDays(): Promise<ChecklistDay[]> {
  return db.checklistDays.orderBy('date').reverse().toArray();
}

// ── Helpers: Check-ins ──────────────────────────────────

export async function addCheckIn(entry: Omit<CheckIn, 'id'>): Promise<number> {
  return db.checkIns.add(entry);
}

export async function getRecentCheckIns(limit = 100): Promise<CheckIn[]> {
  return db.checkIns.orderBy('timestamp').reverse().limit(limit).toArray();
}

export async function getAllCheckIns(): Promise<CheckIn[]> {
  return db.checkIns.orderBy('timestamp').reverse().toArray();
}

// ── Helpers: Story ──────────────────────────────────────

export const addReframe = (r: Omit<Reframe, 'id'>) => db.reframes.add(r);
export const getAllReframes = () => db.reframes.orderBy('timestamp').reverse().toArray();

export const getEffortNight = (date: string) => db.efforts.where('date').equals(date).first();
export const getAllEffortNights = () => db.efforts.orderBy('date').reverse().toArray();
export async function saveEffortNight(n: Omit<EffortNight, 'id'>): Promise<void> {
  const existing = await getEffortNight(n.date);
  if (existing?.id) await db.efforts.update(existing.id, n);
  else await db.efforts.add(n);
}

export const getPillarWeek = (weekStart: string) => db.pillarWeeks.where('weekStart').equals(weekStart).first();
export const getAllPillarWeeks = () => db.pillarWeeks.orderBy('weekStart').reverse().toArray();
export async function savePillarWeek(w: Omit<PillarWeek, 'id'>): Promise<void> {
  const existing = await getPillarWeek(w.weekStart);
  if (existing?.id) await db.pillarWeeks.update(existing.id, w);
  else await db.pillarWeeks.add(w);
}

// ── Helpers: Gratitude ──────────────────────────────────

export const getGratitudeNight = (date: string) => db.gratitudes.where('date').equals(date).first();
export const getAllGratitudeNights = () => db.gratitudes.orderBy('date').reverse().toArray();
export async function saveGratitudeNight(n: Omit<GratitudeNight, 'id'>): Promise<void> {
  const existing = await getGratitudeNight(n.date);
  if (existing?.id) await db.gratitudes.update(existing.id, n);
  else await db.gratitudes.add(n);
}

// ── Helpers: Faith ──────────────────────────────────────

export const addFear = (f: Omit<Fear, 'id'>) => db.fears.add(f);
export const updateFear = (id: number, f: Partial<Fear>) => db.fears.update(id, f);
export const getAllFears = () => db.fears.orderBy('createdAt').reverse().toArray();
export const addDhikrLog = (l: Omit<DhikrLog, 'id'>) => db.dhikrLogs.add(l);
export const getAllDhikrLogs = () => db.dhikrLogs.orderBy('at').reverse().toArray();
export const getMuhasabah = (date: string) => db.muhasabah.where('date').equals(date).first();
export const getAllMuhasabah = () => db.muhasabah.orderBy('date').reverse().toArray();
export async function saveMuhasabah(m: Omit<MuhasabahDay, 'id'>): Promise<void> {
  const ex = await getMuhasabah(m.date);
  if (ex?.id) await db.muhasabah.update(ex.id, m); else await db.muhasabah.add(m);
}
export const getQuranLogs = () => db.quranLogs.orderBy('date').reverse().toArray();
export const addQuranLog = (l: Omit<QuranLog, 'id'>) => db.quranLogs.add(l);
export const getWeeklySigns = (weekOf: string) => db.weeklySigns.where('weekOf').equals(weekOf).first();
export const getAllWeeklySigns = () => db.weeklySigns.orderBy('weekOf').toArray();
export async function saveWeeklySigns(w: Omit<WeeklySigns, 'id'>): Promise<void> {
  const ex = await getWeeklySigns(w.weekOf);
  if (ex?.id) await db.weeklySigns.update(ex.id, w); else await db.weeklySigns.add(w);
}
