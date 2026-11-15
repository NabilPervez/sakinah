/** Ported from NabilPervez/quran-recitation (Nov 2026). */
export type Ayah = { numberInSurah: number; globalNumber: number; audio: string[]; arabic: string; english: string; transliteration: string };
export type SurahInfo = { id: number; name: string; englishName: string; totalAyahs: number };
/** 0 means "loop forever". */
export type SessionSettings = { surahId: number; startAyah: number; endAyah: number; ayahReps: number; rangeReps: number; gapMs: number };
