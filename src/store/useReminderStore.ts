import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Phase } from '../data/checklist';

export type SoundId = 'bell' | 'bowl' | 'chime' | 'birds' | 'alarm' | 'none';
export type ReminderKind = 'reminder' | 'alarm';

export interface RoutineCheckIn {
  enabled: boolean;
  time: string; // HH:MM, local
  /** Second nudge if the phase still isn't done this many minutes later (0 = off). */
  followUpMin: number;
}

export interface CustomReminder {
  id: string;
  label: string;
  time: string; // HH:MM
  days: number[]; // 0=Sun … 6=Sat; empty = every day
  kind: ReminderKind;
  sound: SoundId;
  enabled: boolean;
  /** Optional in-app route opened on tap. */
  link?: string;
}

/** Reflect cadence reminders (2026-11-11). Added for existing installs via migrate. */
const REFLECT_DEFAULTS: CustomReminder[] = [
  { id: 'r_gratitude', label: 'Nightly gratitude — three things', time: '21:30', days: [], kind: 'reminder', sound: 'bowl', enabled: true, link: '/reflect/gratitude' },
  { id: 'r_pillars', label: 'Friday reflection — Four pillars', time: '17:00', days: [5], kind: 'reminder', sound: 'bell', enabled: true, link: '/reflect/pillars' },
];

/** Reframe-card reminders (v3.1, 2026-11-18). */
const CARD_DEFAULTS: CustomReminder[] = [
  { id: 'r_card_work', label: 'Before work — set your intention: providing is in Allah’s path', time: '08:30', days: [1, 2, 3, 4, 5], kind: 'reminder', sound: 'chime', enabled: true, link: '/reflect/cards/work-providing' },
  { id: 'r_card_good', label: 'Expect good from Allah today', time: '12:30', days: [], kind: 'reminder', sound: 'bowl', enabled: false, link: '/reflect/cards/expect-good' },
];

interface ReminderState {
  notificationsOn: boolean;
  soundsOn: boolean;
  volume: number; // 0–1
  routineSound: SoundId;
  routines: Record<Phase, RoutineCheckIn>;
  reminders: CustomReminder[];
  /** key → YYYY-MM-DD it last fired, so nothing fires twice a day. */
  fired: Record<string, string>;
  /** key → epoch ms of a pending snooze. */
  snoozes: Record<string, number>;

  set: (p: Partial<Pick<ReminderState, 'notificationsOn' | 'soundsOn' | 'volume' | 'routineSound'>>) => void;
  setRoutine: (phase: Phase, p: Partial<RoutineCheckIn>) => void;
  addReminder: (r: Omit<CustomReminder, 'id'>) => void;
  updateReminder: (id: string, p: Partial<CustomReminder>) => void;
  removeReminder: (id: string) => void;
  markFired: (key: string, date: string) => void;
  snooze: (key: string, minutes: number) => void;
  clearSnooze: (key: string) => void;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set) => ({
      notificationsOn: false,
      soundsOn: true,
      volume: 0.6,
      routineSound: 'bell',
      routines: {
        morning: { enabled: true, time: '07:30', followUpMin: 60 },
        afternoon: { enabled: true, time: '13:00', followUpMin: 60 },
        evening: { enabled: true, time: '20:30', followUpMin: 45 },
      },
      reminders: [
        { id: 'r_water', label: 'Drink a glass of water', time: '10:30', days: [], kind: 'reminder', sound: 'chime', enabled: false },
        ...REFLECT_DEFAULTS,
        ...CARD_DEFAULTS,
        { id: 'r_breathe', label: 'Box breathing — 2 minutes', time: '15:30', days: [1, 2, 3, 4, 5], kind: 'reminder', sound: 'bowl', enabled: false, link: '/practice' },
      ],
      fired: {},
      snoozes: {},

      set: (p) => set(p),
      setRoutine: (phase, p) => set((s) => ({ routines: { ...s.routines, [phase]: { ...s.routines[phase], ...p } } })),
      addReminder: (r) => set((s) => ({ reminders: [...s.reminders, { ...r, id: `r_${Date.now().toString(36)}` }] })),
      updateReminder: (id, p) => set((s) => ({ reminders: s.reminders.map((r) => (r.id === id ? { ...r, ...p } : r)) })),
      removeReminder: (id) => set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),
      markFired: (key, date) => set((s) => ({ fired: { ...s.fired, [key]: date } })),
      snooze: (key, minutes) => set((s) => ({ snoozes: { ...s.snoozes, [key]: Date.now() + minutes * 60_000 } })),
      clearSnooze: (key) => set((s) => {
        const next = { ...s.snoozes };
        delete next[key];
        return { snoozes: next };
      }),
    }),
    {
      name: 'serenity-v2-reminders',
      version: 2,
      migrate: (state, version) => {
        const s = state as ReminderState;
        if (version < 1 && s?.reminders) {
          const have = new Set(s.reminders.map((r) => r.id));
          s.reminders = [...s.reminders, ...REFLECT_DEFAULTS.filter((r) => !have.has(r.id))];
        }
        if (version < 2 && s?.reminders) {
          const have = new Set(s.reminders.map((r) => r.id));
          s.reminders = [...s.reminders, ...CARD_DEFAULTS.filter((r) => !have.has(r.id))];
        }
        return s;
      },
    }
  )
);
