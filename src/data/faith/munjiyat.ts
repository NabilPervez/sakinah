/**
 * The Deliverances (Rubʿ al-Munjiyāt) — al-Ghazali, Iḥyā' ʿUlūm al-Dīn, quarter 4, books 31–40 (PRD v3.2, Nabil 2026-11-18).
 * Titles and order are the Iḥyā'. `problem` / `lens` / `practice` are COMPOSED (inspired by, not quoted) — the UI says so.
 */
export interface Deliverance {
  id: string;
  n: number;
  title: string;
  translit: string;
  source: string;
  problem: string;
  lens: string;
  practice: string;
  tool: { to: string; label: string };
  cardTags: string[];
}

const ihya = (book: number) => `al-Ghazali, Iḥyā’ ʿUlūm al-Dīn, Rubʿ al-Munjiyāt, Book ${book}`;

export const DELIVERANCES: Deliverance[] = [
  { id: 'tawbah', n: 1, title: 'Repentance', translit: 'Kitāb al-Tawbah', source: ihya(31),
    problem: 'Guilt over the past that feels like a verdict.',
    lens: 'A slip is a reason to turn back to Allah, not proof you are ruined.',
    practice: 'Name it, regret it toward Allah, then follow it right away with a good deed.',
    tool: { to: '/faith/tawbah', label: 'Tawbah reset' }, cardTags: ['tawbah', 'past', 'qadar'] },
  { id: 'sabr-shukr', n: 2, title: 'Patience and Gratitude', translit: 'Kitāb al-Ṣabr wa al-Shukr', source: ihya(32),
    problem: 'Frustration in hard stretches; blessings taken for granted in easy ones.',
    lens: 'Faith has two halves: patience in discomfort, gratitude in comfort. Both are rewarded.',
    practice: 'Hold back the complaint in the hard moment. At night, name three blessings you did not earn.',
    tool: { to: '/reflect/gratitude', label: 'Gratitude' }, cardTags: ['ihtisab', 'fatigue', 'night', 'parenting'] },
  { id: 'khawf-raja', n: 3, title: 'Fear and Hope', translit: 'Kitāb al-Khawf wa al-Rajā’', source: ihya(33),
    problem: 'Swinging between worst-case dread and careless ease.',
    lens: 'Fear to hold back from wrong, hope to expect His mercy — two wings, kept level.',
    practice: 'When dread spikes, recall a specific time Allah came through for you.',
    tool: { to: '/faith/mercies', label: 'Mercies journal' }, cardTags: ['worry', 'trial', 'husn al-zann'] },
  { id: 'zuhd', n: 4, title: 'Poverty and Renunciation', translit: 'Kitāb al-Faqr wa al-Zuhd', source: ihya(34),
    problem: 'Stress when comfort, money or sleep run short.',
    lens: 'Keep the world in your hand, not in your heart.',
    practice: 'When comfort is interrupted, call it training, not a crisis. Cut one unneeded demand.',
    tool: { to: '/faith/shifts', label: 'Mindset shifts' }, cardTags: [] },
  { id: 'tawakkul', n: 5, title: 'Divine Unity and Reliance', translit: 'Kitāb al-Tawḥīd wa al-Tawakkul', source: ihya(35),
    problem: 'Feeling solely responsible for every outcome.',
    lens: 'The effort is yours; the result is His.',
    practice: 'Split the worry: what I will do, and what I hand to Al-Wakil.',
    tool: { to: '/faith/camel', label: 'Tie your camel' }, cardTags: ['provision'] },
  { id: 'mahabbah', n: 6, title: 'Love, Longing, Intimacy and Contentment', translit: 'Kitāb al-Maḥabbah wa al-Shawq wa al-Uns wa al-Riḍā', source: ihya(36),
    problem: 'Resentment toward your circumstances; feeling far from Allah.',
    lens: 'Love of Allah grows into riḍā — trust that the Beloved decrees good.',
    practice: 'Speak to Allah privately, in your own words, exactly as you feel.',
    tool: { to: '/faith/duas', label: 'Du’a by need' }, cardTags: [] },
  { id: 'niyyah', n: 7, title: 'Intention, Sincerity and Truthfulness', translit: 'Kitāb al-Niyyah wa al-Ikhlāṣ wa al-Ṣidq', source: ihya(37),
    problem: 'Routine work, chores and parenting feel spiritually empty.',
    lens: 'Intention turns the ordinary into worship.',
    practice: 'Before the task: “I do this for my family, for Allah’s sake.” Let go of wanting it seen.',
    tool: { to: '/reflect/muhasabah', label: 'Morning intention' }, cardTags: ['niyyah', 'work'] },
  { id: 'muraqabah', n: 8, title: 'Vigilance and Self-Examination', translit: 'Kitāb al-Murāqabah wa al-Muḥāsabah', source: ihya(38),
    problem: 'Autopilot, quick reactions, and spirals.',
    lens: 'Awareness of Allah before acting; a gentle audit after.',
    practice: 'Pause before reacting. At night: one thing to thank Him for, one slip to seek forgiveness for.',
    tool: { to: '/reflect/muhasabah', label: 'Muhasabah' }, cardTags: [] },
  { id: 'tafakkur', n: 9, title: 'Contemplation', translit: 'Kitāb al-Tafakkur', source: ihya(39),
    problem: 'Tunnel vision on small irritations.',
    lens: 'Reflection on His names and creation restores proportion.',
    practice: 'Five quiet minutes with one Name of Allah.',
    tool: { to: '/faith/names', label: 'Names of Allah' }, cardTags: [] },
  { id: 'mawt', n: 10, title: 'Remembrance of Death and the Hereafter', translit: 'Kitāb Dhikr al-Mawt wa mā Baʿdahu', source: ihya(40),
    problem: 'Over-investing in comfort; small setbacks feel huge.',
    lens: 'Keeping the destination in view shrinks the hardship and grows the reward of patience.',
    practice: 'In a hard moment: this is brief, and nothing borne for Him is lost.',
    tool: { to: '/faith/study', label: 'Study' }, cardTags: [] },
];

/** ISO-ish week number → this week's book (no streaks — PRD §3). */
export function weekBook(d = new Date()): Deliverance {
  const start = new Date(d.getFullYear(), 0, 1);
  const week = Math.floor((d.getTime() - start.getTime()) / 6048e5);
  return DELIVERANCES[week % DELIVERANCES.length];
}

/** First book whose cardTags overlap the card's tags (FR5). */
export const bookForTags = (tags: string[]) => DELIVERANCES.find((b) => b.cardTags.some((t) => tags.includes(t)));

/** Good-deed picker for the Tawbah reset (composed suggestions). */
export const GOOD_DEEDS = ['Give a little sadaqah', 'Pray two rak’ahs', 'Say astaghfirullah 100 times', 'Make it right with the person', 'Do a kindness at home'];
