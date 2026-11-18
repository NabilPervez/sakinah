import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Reframe Cards prefs: pinned to Today (max 2) and hidden cards. Backed up via LS key 'sakinah-cards'. */
interface CardState {
  pinned: string[];
  hidden: string[];
  togglePin: (id: string) => void;
  toggleHidden: (id: string) => void;
}
export const MAX_PINS = 2;
export const useCardStore = create<CardState>()(persist((set) => ({
  pinned: ['sleepless-nights'],
  hidden: [],
  togglePin: (id) => set((s) => ({ pinned: s.pinned.includes(id) ? s.pinned.filter((x) => x !== id) : [...s.pinned, id].slice(-MAX_PINS) })),
  toggleHidden: (id) => set((s) => ({ hidden: s.hidden.includes(id) ? s.hidden.filter((x) => x !== id) : [...s.hidden, id] })),
}), { name: 'sakinah-cards', version: 1 }));
