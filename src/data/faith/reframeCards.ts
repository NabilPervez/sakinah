/**
 * Reframe Cards — situation → action, text, reframe, reward (PRD v3.1, Nabil 2026-11-18).
 * Content from Nabil's notes. `scholarRefs` are the commentary works from his source list;
 * `text.source` is always the primary collection (Qur'an / hadith book + number + grading).
 */
export interface CardText { arabic: string; translation: string; source: string; kind: 'quran' | 'hadith' }
export interface ReframeCard {
  id: string;
  title: string;
  situation: string;
  tags: string[];
  action: string;
  text: CardText;
  support?: { text: string; source: string };
  negative: string;
  positive: string;
  reward: string;
  scholarRefs?: string[];
  anchorName?: string; // key into ANCHOR_NAMES
  custom?: boolean;
}

export const NIGHT_CARD_ID = 'sleepless-nights';
export const isNight = (d = new Date()) => d.getHours() >= 21 || d.getHours() < 7;

export const REFRAME_CARDS: ReframeCard[] = [
  {
    id: 'past-mistakes',
    title: 'Past mistakes and hard turns.',
    situation: 'A memory of a mistake, or a hard thing that happened, comes back.',
    tags: ['past', 'qadar', 'tawbah'],
    action: 'Swap "Why did this happen to me?" for a line of trust in Allah’s decree, then make tawbah right away.',
    text: {
      kind: 'quran',
      arabic: 'مَا أَصَابَ مِنْ مُصِيبَةٍ فِي الْأَرْضِ وَلَا فِي أَنْفُسِكُمْ إِلَّا فِي كِتَابٍ مِنْ قَبْلِ أَنْ نَبْرَأَهَا إِنَّ ذَلِكَ عَلَى اللَّهِ يَسِيرٌ',
      translation: 'No disaster strikes upon the earth or among yourselves except that it is in a register before We bring it into being. Indeed that, for Allah, is easy.',
      source: 'Qur’an 57:22',
    },
    support: {
      text: 'What reached you was never going to miss you, and what missed you was never going to reach you.',
      source: 'Abu Dawud 4699 (ṣaḥīḥ); see also Tirmidhi 2144',
    },
    negative: 'My past is full of failures, and bad things keep happening to derail me.',
    positive: 'Every past event was decreed with wisdom to shape my humility and character. My mistakes are doors back to Allah through tawbah.',
    reward: 'Inner peace and freedom from regret. Accepting Qadar frees the heart from anxiety and self-blame.',
  },
  {
    id: 'expect-good',
    title: 'Expect good from Allah.',
    situation: 'A new trial starts and the mind jumps to the worst case.',
    tags: ['trial', 'husn al-zann', 'worry'],
    action: 'On purpose, assume relief, mercy and a good outcome the moment a trial begins.',
    text: {
      kind: 'hadith',
      arabic: 'أَنَا عِنْدَ ظَنِّ عَبْدِي بِي، إِنْ ظَنَّ بِي خَيْرًا فَلَهُ، وَإِنْ ظَنَّ شَرًّا فَلَهُ',
      translation: 'I am as My servant thinks of Me: if he thinks good of Me, it is for him; and if he thinks evil of Me, it is for him.',
      source: 'Ḥadīth qudsī — Ahmad 9076, Ibn Ḥibbān 639 (ṣaḥīḥ); opening line in Bukhari 7405, Muslim 2675',
    },
    negative: 'Everything is going wrong. I’m doomed to struggle and fail.',
    positive: 'Allah is Al-Wadūd, the Most Loving. He placed me here not to break me but to purify me, and it may raise my rank.',
    reward: 'You receive what you expect of Him. Expecting His mercy brings His help and sakīnah now, and reward in the Hereafter.',
    anchorName: 'wadud',
  },
  {
    id: NIGHT_CARD_ID,
    title: 'Sleepless nights with a sick child.',
    situation: 'Woken in the night by a sick or teething child.',
    tags: ['parenting', 'night', 'ihtisab', 'fatigue'],
    action: 'Before you get up, whisper an intention: I’m doing this for Allah’s reward (iḥtisāb).',
    text: {
      kind: 'hadith',
      arabic: 'مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ وَلَا هَمٍّ وَلَا حُزْنٍ وَلَا أَذًى وَلَا غَمٍّ، حَتَّى الشَّوْكَةِ يُشَاكُهَا، إِلَّا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ',
      translation: 'No fatigue (naṣab), illness, anxiety, sorrow, harm or distress befalls a Muslim, even the prick of a thorn, except that Allah expiates some of their sins through it.',
      source: 'Bukhari 5641–5642, Muslim 2573',
    },
    negative: 'I can’t sleep, I’m drained, and tomorrow is ruined.',
    positive: 'Every minute of tiredness right now is wiping away my sins, and I’m showing mercy to a helpless soul.',
    reward: 'Sins expiated and good deeds multiplied. Physical fatigue (naṣab) and grief (ghamm) are counted by Allah as cleansing.',
    scholarRefs: ['Mirqāt al-Mafātīḥ 3/1128', 'Irshād al-Sārī 12/374', 'al-Kawkab al-Wahhāj 12/22'],
  },
  {
    id: 'work-providing',
    title: 'Work strain and providing.',
    situation: 'Overloaded at work and resenting the grind.',
    tags: ['work', 'provision', 'niyyah'],
    action: 'Set your intention: this work is how I provide halal for my family.',
    text: {
      kind: 'hadith',
      arabic: 'إِنْ كَانَ خَرَجَ يَسْعَى عَلَى وَلَدِهِ صِغَارًا فَهُوَ فِي سَبِيلِ اللَّهِ',
      translation: 'If he went out striving to provide for his young children, then he is in the path of Allah.',
      source: 'al-Ṭabarānī, al-Kabīr 19/129 #282 (Kaʿb ibn ʿUjrah); ṣaḥīḥ — al-Albānī, Ṣaḥīḥ al-Jāmiʿ 1428, Ṣaḥīḥ al-Targhīb 1692',
    },
    negative: 'I’m exhausted from extra work, and the stress is draining my life.',
    positive: 'Honest work to provide for my family, done with the right intention, is counted as striving in the path of Allah.',
    reward: 'Providing for your family is an obligation, so its reward is greater than many voluntary acts of charity.',
    scholarRefs: ['Sharḥ Riyāḍ al-Ṣāliḥīn (Ḥuṭaybah) 12/6', 'al-Tanwīr 4/241'],
  },
];
