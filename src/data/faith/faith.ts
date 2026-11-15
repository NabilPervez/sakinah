/**
 * Sakinah — faith content.
 * Source: Qaf gameplan (Notion › Private › Islamic Gameplan), Nov 15 2026.
 * Rule (Nabil, 2026-11-15): nothing cut; every item carries a citation.
 * sourceType: quran | hadith | scholar | composed. ⚠ = verify before relying on it.
 */
import names99Raw from './names99.json';
import needDuasRaw from './needDuas.json';
import dhikrRaw from './dhikrPresets.json';

export type SourceType = 'quran' | 'hadith' | 'scholar' | 'composed';
export interface Cite { source: string; sourceType: SourceType }

/* ── 99 Names (repo: learnthenamesofallah) ─────────────────────────── */
export interface NameOfAllah {
  id: number; arabic: string; transliteration: string; meaning: string; explanation: string; audioUrl: string;
  verse?: { citation: string; arabic: string; english: string };
  hadith?: { topic?: string; arabic?: string; english: string; reference?: string };
}
export const NAMES_99 = names99Raw as NameOfAllah[];

/* ── Du'a by Need (repo: name-and-need-duaa-discovery-tool) ────────── */
export interface NeedDua { id: number; name: string; arabic: string; meaning: string; categories: string[]; meaningBlocks: string[]; dua: string; intents: string[] }
export const NEED_DUAS = needDuasRaw as NeedDua[];
export const NEEDS = ['Anxiety', 'Distress', 'Lost', 'Broken Heart', 'Patience', 'Hope', 'Strength', 'Protection', 'Healing', 'Forgiveness', 'Mercy', 'Gratitude', 'Love', 'Knowledge', 'Provision', 'Success', 'Justice'];
export const NEED_DUA_NOTE: Cite = { source: 'Composed supplication calling on this Name — not a narrated text. Calling on Allah by His Names: Qur’an 7:180.', sourceType: 'composed' };

/* ── Dhikr presets (repo: Dhikrflow) + sources ─────────────────────── */
export interface Dhikr { id: string; arabic: string; transliteration: string; translation: string; category: string; source: string }
const DHIKR_SOURCES: Record<string, string> = {
  subhanallah: 'Sahih Muslim 597 (33× after prayer)',
  alhamdulillah: 'Sahih Muslim 597 (33× after prayer)',
  allahuakbar: 'Sahih Muslim 597 (33/34× after prayer)',
  lailahaillallah: 'Jami at-Tirmidhi 3383 — “the best dhikr” (hasan)',
  astaghfirullah: 'Sahih al-Bukhari 6307 (the Prophet ﷺ, 70+ times a day)',
  hasbunallah: 'Qur’an 3:173; Sahih al-Bukhari 4563',
  salawat: 'Qur’an 33:56; Sahih Muslim 408',
  salawat2: 'Qur’an 33:56',
  bismillah: 'Qur’an 1:1',
  morning1: 'Sahih Muslim 2723',
  evening1: 'Sahih Muslim 2723',
  tasbih1: 'Sahih al-Bukhari 6405',
  tasbih2: 'Sahih al-Bukhari 6406',
  hawqala: 'Sahih al-Bukhari 6384 — “a treasure of Paradise”',
};
const CAT_SOURCE: Record<string, string> = {
  '99 Names': 'Qur’an 7:180; Sahih al-Bukhari 2736',
  Salawat: 'Qur’an 33:56',
  Morning: 'Hisn al-Muslim, morning adhkar ⚠ verify per item',
  Evening: 'Hisn al-Muslim, evening adhkar ⚠ verify per item',
  Core: 'General dhikr — Qur’an 33:41',
};
export const DHIKR: Dhikr[] = (dhikrRaw as Omit<Dhikr, 'source'>[]).map((d) => ({ ...d, source: DHIKR_SOURCES[d.id] ?? CAT_SOURCE[d.category] ?? 'Qur’an 33:41' }));

/* ── Gameplan du'as (narrated) ─────────────────────────────────────── */
export interface Dua { id: string; title: string; arabic: string; transliteration: string; translation: string; source: string; when: string; target: number }
export const GAMEPLAN_DUAS: Dua[] = [
  {
    id: 'hamm', title: 'Against anxiety and incapacity',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
    transliteration: "Allahumma inni a'udhu bika min al-hammi wa al-hazan, wa al-'ajzi wa al-kasal, wa al-bukhli wa al-jubn, wa dala'id-dayn, wa ghalabatir-rijal.",
    translation: 'O Allah, I seek refuge in You from anxiety and grief, from incapacity and laziness, from miserliness and cowardice, from the burden of debt, and from being overpowered by men.',
    source: 'Sahih al-Bukhari 6369 (from Anas)', when: '1× morning and 1× evening, as part of daily remembrance.', target: 1,
  },
  {
    id: 'hasbunallah', title: 'Sufficiency and trust',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', transliteration: "Hasbunallahu wa ni'mal-Wakil.",
    translation: 'Sufficient for us is Allah, and He is the best Disposer of affairs.',
    source: 'Qur’an 3:173; Sahih al-Bukhari 4563 (Ibn Abbas: said by Ibrahim and Muhammad ﷺ)', when: '7× when sudden future anxiety or decision overwhelm hits.', target: 7,
  },
  {
    id: 'karb', title: 'Du’a al-Karb — times of distress',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    transliteration: "La ilaha illallahul-'Adhimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Adhim, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim.",
    translation: 'There is no deity except Allah, the Magnificent, the Forbearing. There is no deity except Allah, Lord of the Magnificent Throne. There is no deity except Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.',
    source: 'Sahih al-Bukhari 6346; Sahih Muslim 2730 (from Ibn Abbas)', when: '3× when acutely stressed or overwhelmed.', target: 3,
  },
  {
    id: 'leaving', title: 'Leaving home',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: "Bismillahi tawakkaltu 'alallah, la hawla wa la quwwata illa billah.",
    translation: 'In the name of Allah, I place my trust in Allah; there is no might nor power except with Allah.',
    source: 'Sunan Abi Dawud 5095; Jami at-Tirmidhi 3426 (sahih)', when: 'Each time you step out for work or travel.', target: 1,
  },
];

/* ── Anchor Names (gameplan §2) ────────────────────────────────────── */
export interface AnchorName { key: string; name: string; title: string; meaning: string; struggle: string; mechanism: string; source: string }
export const ANCHOR_NAMES: AnchorName[] = [
  { key: 'wakil', name: 'Al-Wakil', title: 'The Ultimate Trustee', meaning: 'The Trustee who manages the affairs of creation with complete knowledge and power.', struggle: 'Over-responsibility and future dread', mechanism: 'Reflecting on Al-Wakil allows you to hand over outcomes after tying your camel, calming the need for total control.', source: 'Qur’an 3:173; 65:3; Ihya’ vol. 4 p. 280' },
  { key: 'latif', name: 'Al-Latif', title: 'The Subtly Kind', meaning: 'The One who delivers benefit and protection through subtle, imperceptible means.', struggle: 'Negative interpretations of events', mechanism: 'Reminds you that blessings often arrive disguised within unexpected disruptions.', source: 'Qur’an 12:100; 2:216' },
  { key: 'hakim', name: 'Al-Hakim', title: 'The All-Wise', meaning: 'The One whose actions are free from error, placing everything in its rightful place.', struggle: 'Second-guessing family decisions', mechanism: 'Provides confidence that after consulting (shura) and planning, the unfolding decree is grounded in infinite wisdom.', source: 'Qur’an 2:32; Minhaj al-Sunnah vol. 5 p. 365' },
  { key: 'wadud', name: 'Al-Wadud', title: 'The Loving', meaning: 'The One whose love is active, warm, and constantly extending care to His servants.', struggle: 'Self-judgment and fear of divine anger', mechanism: 'Replaces the assumption of punitive judgment with certainty of Allah’s sustained care.', source: 'Qur’an 85:14; 11:90' },
  { key: 'salam', name: 'As-Salam', title: 'The Source of Peace', meaning: 'The One free from all deficiencies, who bestows security and inner stillness.', struggle: 'Internal restlessness and distraction', mechanism: 'Invoking As-Salam stills the nervous system, drawing peace directly from its divine source.', source: 'Qur’an 59:23; Sahih Muslim 591' },
];
/** Check-in → Name suggestion (PRD F5). */
export const NAME_FOR_FEELING: Record<string, string> = { anxious: 'wakil', worried: 'wakil', sad: 'latif', overwhelmed: 'wakil', unsure: 'hakim', judging: 'wadud', restless: 'salam', distracted: 'salam' };

/* ── Mindset shifts (gameplan Part II §1) ──────────────────────────── */
export interface Shift { title: string; from: string; to: string; evidenceArabic: string; evidence: string; source: string; mechanism: string }
export const SHIFTS: Shift[] = [
  { title: 'Responsibility', from: 'I must guarantee that my marriage and son’s future turn out safe and successful.', to: 'My duty is faithful preparation and compassionate effort; ultimate outcomes belong entirely to Allah.', evidenceArabic: 'فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ', evidence: 'And when you have decided, then rely upon Allah.', source: 'Qur’an 3:159', mechanism: 'Relieves cognitive overload by separating actionable effort (kasb) from divine decree (qadar). [Minhaj al-Sunnah 5:365; Tariq al-Hijratayn 1:259]' },
  { title: 'Future forecasting', from: 'Worrying about every potential threat keeps my family protected.', to: 'Anxiety (hamm) paralyzes judgment; focused action and prayer are my only real protections.', evidenceArabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ', evidence: 'O Allah, I seek refuge in You from anxiety and grief.', source: 'Sahih al-Bukhari 6369', mechanism: 'Disrupts catastrophic cognitive loops by framing ungrounded worry as a spiritual impediment rather than a productive tool. [Tuhfat al-Dhakirin 1:113]' },
  { title: 'Self-evaluation', from: 'If I make a mistake or don’t execute a daily task well, I have failed.', to: 'Human imperfection is expected; my growth is measured by ethical effort, repentance, and continuous improvement.', evidenceArabic: 'قَدْ أَفْلَحَ مَن زَكَّاهَا', evidence: 'He has succeeded who purifies it.', source: 'Qur’an 91:9', mechanism: 'Decouples self-worth from trivial mechanical perfectionism, directing self-reflection toward moral development (tazkiyah). [Nadrat al-Na’im 8:3318]' },
  { title: 'Interpreting unplanned events', from: 'This unexpected setback is a disaster that ruins my plans.', to: 'This outcome is part of a larger decree containing hidden wisdom and opportunities for reward.', evidenceArabic: 'وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ', evidence: 'And Allah knows, while you do not know.', source: 'Qur’an 2:216', mechanism: 'Mitigates the acute stress response by framing disruptions through divine wisdom and patience. [al-Ahadith al-Warida fi al-Ibtila 1:37]' },
  { title: 'Rest and focus', from: 'I am constantly falling behind, so I must stay mentally hyper-vigilant.', to: 'Allah watches over me in this present moment; I need only attend to the task directly in front of me.', evidenceArabic: 'وَأَقِمِ الصَّلَاةَ لِذِكْرِي', evidence: 'And establish prayer for My remembrance.', source: 'Qur’an 20:14', mechanism: 'Restores presence and reduces mental fatigue through the practice of muraqabah.' },
];

/* ── Qur'an plan (gameplan Part II §4) ─────────────────────────────── */
/** seg = in-app listening ranges, played in order. */
export interface Passage { id: string; title: string; ref: string; why: string; url: string; segs: { s: number; a: number; b: number }[] }
export const PASSAGES: Record<string, Passage> = {
  duha: { id: 'duha', title: 'Ad-Duha & Ash-Sharh', ref: 'Qur’an 93 · 94', why: 'Directly counters feelings of abandonment and cognitive overload by reminding the believer of past guidance and promising that ease accompanies every hardship.', url: 'https://quran.com/93', segs: [{ s: 93, a: 1, b: 11 }, { s: 94, a: 1, b: 8 }] },
  yusuf: { id: 'yusuf', title: 'Yusuf', ref: 'Qur’an 12:83–100', why: 'Illustrates how severe disruptions (betrayal, separation, imprisonment) serve as the precise vehicles through which Allah’s subtle care (Al-Latif) establishes long-term good.', url: 'https://quran.com/12/83-100', segs: [{ s: 12, a: 83, b: 100 }] },
  talaq: { id: 'talaq', title: 'At-Talaq 1–7 & Al-Baqarah 286', ref: 'Qur’an 65:1–7 · 2:286', why: '“Whoever relies upon Allah, He is sufficient for him” (65:3) and “Allah does not charge a soul except with that within its capacity” (2:286). Releasing financial and future fears.', url: 'https://quran.com/65/1-7', segs: [{ s: 65, a: 1, b: 7 }, { s: 2, a: 286, b: 286 }] },
  mulk: { id: 'mulk', title: 'Al-Mulk', ref: 'Qur’an 67', why: 'Grounding in Allah’s sovereignty and creation.', url: 'https://quran.com/67', segs: [{ s: 67, a: 1, b: 30 }] },
};
/** Weekly schedule, index = Date.getDay() (0 Sun). */
export const QURAN_WEEK: string[] = ['mulk', 'duha', 'yusuf', 'talaq', 'duha', 'yusuf', 'talaq'];
export const QURAN_FOCUS: Record<string, string> = { duha: 'Relief from internal pressure', yusuf: 'Trusting Allah’s long-term plan across family challenges', talaq: 'Releasing financial and future fears', mulk: 'Grounding in Allah’s sovereignty and creation' };

/* ── Listening: why and how (Listen page) ─────────────────────────── */
export const LISTEN_WHY: Block[] = [
  { kind: 'quran', arabic: 'وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا لَهُ وَأَنصِتُوا لَعَلَّكُمْ تُرْحَمُونَ', text: 'When the Qur’an is recited, listen to it and be silent, so that you may receive mercy.', source: 'Qur’an 7:204' },
  { kind: 'quran', arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', text: 'Truly, in the remembrance of Allah do hearts find rest.', source: 'Qur’an 13:28' },
  { kind: 'quran', arabic: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ', text: 'We send down of the Qur’an that which is healing and mercy for the believers.', source: 'Qur’an 17:82' },
  { kind: 'hadith', text: 'No people gather in one of the houses of Allah, reciting the Book of Allah and studying it together, except that tranquility (sakinah) descends upon them, mercy covers them, the angels surround them, and Allah mentions them to those near Him.', source: 'Sahih Muslim 2699 (Abu Hurayrah)' },
  { kind: 'hadith', text: 'A man was reciting Surah al-Kahf when a cloud came down over him. He told the Prophet ﷺ, who said: “That was the sakinah, which descended because of the Qur’an.” This app is named for it.', source: 'Sahih al-Bukhari 5011; Sahih Muslim 795 (al-Bara’ ibn ‘Azib)' },
  { kind: 'hadith', text: 'The Prophet ﷺ asked Ibn Mas’ud to recite to him. Ibn Mas’ud said, “Shall I recite to you when it was revealed to you?” He said, “I love to hear it from someone else.” When he reached 4:41, the Prophet’s eyes filled with tears.', source: 'Sahih al-Bukhari 5050; Sahih Muslim 800' },
  { kind: 'hadith', text: 'The Prophet ﷺ stood the whole night repeating a single verse until dawn: “If You punish them, they are Your servants; and if You forgive them, You are the Mighty, the Wise.” (5:118)', source: 'Sunan an-Nasa’i 1010; Sunan Ibn Majah 1350 (hasan)' },
  { kind: 'scholar', text: 'Al-Ghazali lists the inner etiquette of the Qur’an: understand its greatness, be present in heart, reflect (tadabbur), take each verse as addressed to you personally, and let it move you — rather than letting the sound pass while the mind wanders.', source: 'Ihya’ ‘Ulum al-Din, Kitab Adab Tilawat al-Qur’an' },
  { kind: 'note', text: 'Attentive listening brings the mercy promised in 7:204. Reciting it yourself also earns ten rewards for every letter (Jami at-Tirmidhi 2910, hasan sahih). So listen to settle the heart, and recite along when you can.', source: 'Qur’an 7:204; Jami at-Tirmidhi 2910' },
];
export const LISTEN_HOW: { step: string; why: string; source: string }[] = [
  { step: 'Pause what you’re doing, or listen on a walk or commute with full attention.', why: 'Listening “and being silent” is the condition for the mercy in the verse.', source: 'Qur’an 7:204' },
  { step: 'Follow the translation line by line.', why: 'The Book was sent down to be reflected on, not only heard.', source: 'Qur’an 38:29' },
  { step: 'When a verse lands, repeat it.', why: 'The Prophet ﷺ repeated one verse through the night. Use the repeat setting.', source: 'Sunan an-Nasa’i 1010' },
  { step: 'Hear it as addressed to you.', why: 'Al-Ghazali’s etiquette: take each verse personally — your fears, your family, your choices.', source: 'Ihya’, Kitab Adab Tilawat al-Qur’an' },
  { step: 'End with one line in muhasabah.', why: 'What the verse asked of you becomes tomorrow’s intention.', source: 'Ihya’, Kitab al-Muraqabah wa al-Muhasabah' },
];
export const AUDIO_SOURCE = 'Text: Uthmani script (Tanzil) · Translation: Saheeh International · Transliteration and audio: Islamic Network (alquran.cloud), per-ayah recitation. Player ported from your quran-recitation app.';

/* ── Weave-ins for existing practices (gameplan Part II §6) ────────── */
export const NIYYAH = {
  nonJudgment: { line: 'Training the mind to drop idle criticism (fudul al-kalam) and see Allah’s creation as it is.', source: 'Ihya’, Kitab Asrar al-Salah; Sahih al-Bukhari 5269 (passing thoughts are forgiven)' },
  backToIt: { line: 'Returning to my amanah — faithful work for halal sustenance.', source: 'Sahih Muslim 8 (ihsan: worship as if you see Him)' },
  reframe: { line: 'Practising husn al-dhann bi-Allah and rida bi-qada’illah.', source: 'Sahih al-Bukhari 7405 (“I am as My servant thinks of Me”); Qur’an 2:216' },
};

/* ── Akhlaq at home (gameplan Part II §5) ─────────────────────────── */
export const AKHLAQ = [
  { title: 'Embodying gentleness (rifq)', arabic: 'إِنَّ الرِّفْقَ لاَ يَكُونُ فِي شَىْءٍ إِلاَّ زَانَهُ وَلاَ يُنْزَعُ مِنْ شَىْءٍ إِلاَّ شَانَهُ', text: 'Gentleness is not found in anything except that it beautifies it, and it is not removed from anything except that it mars it.', source: 'Sahih Muslim 2594', points: ['To yourself: drop self-punishing commentary. Correct mistakes with calm, brief adjustments.', 'To your son: praise effort rather than demanding rigid perfection. When he errs or spills something, pause for 3 seconds before responding, viewing the moment as a training ground for patience.'] },
  { title: 'Communicating fears inside marriage', arabic: '', text: 'When the Prophet ﷺ received the first revelation and felt intense fear, he went to Khadijah, shared his vulnerability plainly (“I feared for myself”), and invited her perspective. She reassured him with rational evidence of his good character.', source: 'Sahih al-Bukhari 3', points: ['Share fears transparently as situational challenges to address together, rather than private burdens you must unilaterally solve.', '“Here is a concern I noticed regarding our routines. Here is what I am thinking — I would value your insight so we can approach it as a team.”'] },
];

/* ── 6–8 week signs (gameplan Part II §7) ─────────────────────────── */
export const SIGNS: { key: string; group: 'Islamic' | 'Practical'; title: string; desc: string }[] = [
  { key: 'calm', group: 'Islamic', title: 'Calmer reaction to unplanned events', desc: 'Setbacks met first with “Inna lillahi wa inna ilayhi raji’un” (2:156) and curiosity about Allah’s wisdom, rather than frustration.' },
  { key: 'waswas', group: 'Islamic', title: 'Reduced inner murmuring', desc: 'Intrusive fears about the future dismissed quickly with Hasbunallahu wa ni’mal-Wakil.' },
  { key: 'reflection', group: 'Islamic', title: 'Structured reflection replaces self-criticism', desc: 'Evening reflection focuses on major ethical and family duties rather than trivial mechanical flaws.' },
  { key: 'khushu', group: 'Islamic', title: 'Presence in salah (khushu’)', desc: 'Prayers feel like grounding moments of relief rather than rushed items on a to-do list.' },
  { key: 'family', group: 'Practical', title: 'Constructive family communication', desc: 'Conversations with my wife about finances, parenting and goals focus on collaborative planning rather than anxious rumination.' },
  { key: 'reactivity', group: 'Practical', title: 'Reduced emotional reactivity', desc: 'Pausing before reacting to domestic mistakes; calm problem-solving for minor accidents.' },
  { key: 'deepwork', group: 'Practical', title: 'Sustained deep work', desc: 'Less time lost to distracting rabbit holes; smooth returns to core tasks when alarms sound.' },
  { key: 'grounding', group: 'Practical', title: 'Emotional grounding', desc: 'A baseline of inner stillness (sakinah) — from defensive hyper-control to steady, compassionate leadership at home.' },
];

/* ── Daily routine (gameplan Part II §6) ──────────────────────────── */
export const ROUTINE: { slot: string; theme: string; items: string[] }[] = [
  { slot: 'Fajr', theme: 'Spiritual anchoring', items: ['Pray fard & sunnah', 'Morning adhkar, incl. du’a against hamm & huzn', 'Read or listen to Qur’an (5–10 min)', 'Set today’s intention (musharatah)'] },
  { slot: 'Work day', theme: 'Mindful execution', items: ['Leaving home: “Bismillahi tawakkaltu ’alallah”', 'Back to it (5-min reset) → intention: amanah', '1-minute non-judgment, mid-morning & mid-afternoon'] },
  { slot: 'Dhuhr · Asr', theme: 'Midday resets', items: ['Use prayer as a break to drop accumulated work anxieties'] },
  { slot: 'Maghrib · Isha', theme: 'Family connection', items: ['Step into home with conscious gentleness (rifq)', '1-minute non-judgment (evening)', 'Collaborative check-in with my wife'] },
  { slot: 'Bedtime', theme: 'Muhasabah & surrender', items: ['3-minute muhasabah: shukr · istighfar · release to Al-Wakil', 'Sleep with night adhkar'] },
];

/* ── Study: the why (gameplan Part I) ─────────────────────────────── */
export interface Block { kind: 'quran' | 'hadith' | 'scholar' | 'note'; arabic?: string; text: string; source?: string }
export interface Lesson { id: string; n: string; title: string; blocks: Block[] }
export const LESSONS: Lesson[] = [
  { id: 'fear', n: '01', title: 'Fear vs. awareness', blocks: [
    { kind: 'quran', arabic: 'قَالَ لَا تَخَافَا إِنَّنِي مَعَكُمَا أَسْمَعُ وَأَرَى', text: 'He said: “Fear not, indeed I am with you both; I hear and I see.”', source: 'Qur’an 20:46' },
    { kind: 'quran', arabic: 'فَلَهُ أَجْرُهُ عِندَ رَبِّهِ وَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ', text: 'They will have their reward with their Lord, and there will be no fear concerning them, nor will they grieve.', source: 'Qur’an 2:112' },
    { kind: 'hadith', arabic: 'كُلُّكُمْ رَاعٍ وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ', text: 'Each of you is a shepherd, and each of you is responsible for his flock.', source: 'Sahih al-Bukhari 893; Sahih Muslim 1829 (Ibn Umar)' },
    { kind: 'hadith', arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ', text: 'O Allah, I seek refuge in You from anxiety (al-hamm) and grief (al-huzn), and from incapacity and laziness.', source: 'Sahih al-Bukhari 6369 (Anas) [1][2][3]' },
    { kind: 'note', text: 'Scholars of hadith define al-hamm as mental anguish concerning potential future harm, while al-huzn is sorrow over what has already passed.', source: 'Tuhfat al-Dhakirin 1:113; al-Muqaddima fi Fiqh al-Asr 1:521' },
    { kind: 'scholar', text: 'Al-Ghazali defines fear (khawf) as a spiritual whip whose sole utility is to drive action and prevent harm. If fear exceeds moderation, it paralyzes the intellect and freezes the limbs, transforming into a pathology (waswas and despair).', source: 'Ihya’ ‘Ulum al-Din, Kitab al-Khawf wa al-Raja’' },
    { kind: 'scholar', text: 'Ibn al-Qayyim: healthy awareness arises from knowledge of duty (fahm al-taklif), which focuses on what is within your command, whereas hamm is an obsession with outcomes (tadbir and qadar), which belong exclusively to Allah.', source: 'Tariq al-Hijratayn' },
    { kind: 'note', text: 'Your therapist’s reframe — “You are not more fearful, you are more aware” — is fully supported. In your 20s, low accountability allowed an illusion of invulnerability. In your 30s, assuming the role of a ra’in (shepherd) over a wife and child naturally elevates situational awareness. It becomes pathological only if that awareness morphs from mas’uliyyah (taking actionable steps) into hamm (obsessive forecasting of uncontrollable futures).' },
  ] },
  { id: 'tawakkul', n: '02', title: 'Preparation and tawakkul', blocks: [
    { kind: 'quran', arabic: 'وَأَعِدُّوا لَهُم مَّا اسْتَطَعْتُم مِّن قُوَّةٍ', text: 'And prepare against them whatever you are able of power.', source: 'Qur’an 8:60 [5]' },
    { kind: 'quran', arabic: 'فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ', text: 'And when you have decided, then rely upon Allah. Indeed, Allah loves those who rely [upon Him].', source: 'Qur’an 3:159' },
    { kind: 'hadith', arabic: 'اعْقِلْهَا وَتَوَكَّلْ', text: 'A man asked: “Should I tie my camel and trust in Allah, or leave her loose and trust in Allah?” He ﷺ replied: “Tie her, and trust in Allah.”', source: 'Jami at-Tirmidhi 2517 (hasan) [6]' },
    { kind: 'scholar', text: 'Al-Ghazali’s three levels of means (asbab): Definite (qat’i) — necessary laws of nature (eating, locking doors, planning family finances); neglecting these is not tawakkul, it is sin or foolishness. Probable (maznun) — standard rational precautions (medical care, sound parenting); taking them is Sunnah. Illusory (mawhum) — superstitions or hyper-controlling micro-management; true tawakkul requires abandoning these.', source: 'Ihya’, Kitab al-Tawhid wa al-Tawakkul [6][7][8]' },
    { kind: 'scholar', text: '“Relying on means alone is shirk in one’s theology, while abandoning means entirely is a deficiency in the sacred law (shari’ah) and intellect.”', source: 'Classical maxim cited by al-Ghazali & Ibn al-Qayyim [9][10][11][12]' },
    { kind: 'note', text: 'The boundary: your responsibility ends at effort and intention (al-kasb wa al-ikhtiyar). Allah’s decree begins at causal efficacy and ultimate outcomes (al-khalq wa al-natijah). Act as a prudent manager, but never believe your planning is the sovereign creator of safety.', source: 'Minhaj al-Sunnah 5:365; Ihya’ 4:280' },
  ] },
  { id: 'qadr', n: '03', title: 'Qadr and good in every outcome', blocks: [
    { kind: 'quran', arabic: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ', text: 'Perhaps you hate a thing and it is good for you, and perhaps you love a thing and it is bad for you. And Allah knows, while you do not know.', source: 'Qur’an 2:216 [13]' },
    { kind: 'hadith', arabic: 'عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ', text: 'How wonderful is the affair of the believer, for his affairs are all good — if prosperity attends him, he is grateful and it is good for him; if adversity befalls him, he is patient and it is good for him.', source: 'Sahih Muslim 2999 (Suhaib) [14–17]' },
    { kind: 'scholar', text: 'Ibn al-Qayyim: the “goodness” in every outcome is not necessarily immediate worldly pleasure (khayr ’ajil), but spiritual elevation and ultimate outcome (khayr ma’ali).', source: '‘Uddat al-Sabirin [18][19]' },
    { kind: 'scholar', text: '“If you understand that Allah’s withholding from you is an act of subtle mercy, the withholding turns into the essence of giving.”', source: 'Ibn ‘Ata’illah, al-Hikam' },
    { kind: 'hadith', arabic: 'إِنَّ الْعَيْنَ تَدْمَعُ وَالْقَلْبَ يَحْزَنُ وَلاَ نَقُولُ إِلاَّ مَا يَرْضَى رَبُّنَا', text: 'The eye weeps and the heart grieves, but we do not say anything except what pleases our Lord. (At the death of his son Ibrahim.)', source: 'Sahih al-Bukhari 1303' },
    { kind: 'note', text: 'Forced positivity pretends harm is pleasurable or denies realistic pain. Rida acknowledges genuine pain while holding certainty that the situation contains expiation, hidden wisdom, and reward through sabr.', source: '[14][15][20]' },
  ] },
  { id: 'muhasabah', n: '04', title: 'Self-judgment vs. muhasabah', blocks: [
    { kind: 'quran', arabic: 'وَلَا أُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ', text: 'And I swear by the self-reproaching soul (al-nafs al-lawwamah).', source: 'Qur’an 75:2 [21][22][23]' },
    { kind: 'hadith', arabic: 'الْكَيِّسُ مَنْ دَانَ نَفْسَهُ وَعَمِلَ لِمَا بَعْدَ الْمَوْتِ', text: 'The wise person is the one who holds himself to account and works for what comes after death.', source: 'Jami at-Tirmidhi 2459 (hasan)' },
    { kind: 'scholar', text: '“Hold yourselves accountable before you are held accountable.”', source: '‘Umar ibn al-Khattab (Tirmidhi, under 2459)' },
    { kind: 'scholar', text: 'Four phases: Musharatah — set clear daily intentions and boundaries. Muraqabah — calm vigilance during action. Muhasabah — objective review at day’s end (did I fulfil the obligation? did I transgress?). Mu’atabah/Mu’aqabah — gentle correction and amends without despair.', source: 'Ihya’, Kitab al-Muraqabah wa al-Muhasabah [24][25]' },
    { kind: 'scholar', text: 'The self deceives and torments itself through whispers (waswas) that hyper-focus on perfectionism in non-moral matters — cooking, trivial execution errors — draining energy from genuine moral refinement.', source: 'al-Ghazali [26]' },
    { kind: 'note', text: 'The 1-minute non-judgment exercise complements muhasabah. Harsh self-criticism is a reactive inner critic judging trivial mechanics. True muhasabah is a values-based audit of religious and ethical duties (prayers, truthfulness, treating family well). Calming judgment of neutral objects reserves moral judgment for what truly matters.', source: '[24][27]' },
  ] },
  { id: 'presence', n: '05', title: 'Presence and distraction', blocks: [
    { kind: 'quran', arabic: 'وَأَقِمِ الصَّلَاةَ لِذِكْرِي', text: 'And establish prayer for My remembrance.', source: 'Qur’an 20:14' },
    { kind: 'quran', arabic: 'وَهُوَ مَعَهُمْ', text: 'And He is with them.', source: 'Qur’an 4:108' },
    { kind: 'hadith', arabic: 'أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ', text: 'That you worship Allah as if you see Him, and if you do not see Him, He sees you.', source: 'Sahih Muslim 8 (Hadith of Jibril)' },
    { kind: 'hadith', arabic: 'إِنَّ اللَّهَ تَجَاوَزَ عَنْ أُمَّتِي مَا حَدَّثَتْ بِهِ أَنْفُسَهَا مَا لَمْ تَعْمَلْ أَوْ تَتَكَلَّمْ', text: 'Allah has forgiven my nation for what whispers within their souls, as long as they do not act upon it or speak of it.', source: 'Sahih al-Bukhari 5269; Sahih Muslim 127' },
    { kind: 'scholar', text: 'Distraction occurs because the heart follows whatever it truly values. Involuntary intrusive thought (khatir) is natural and not sinful; sustained indulgence (istirsal) is actively latching on and daydreaming.', source: 'Ihya’, Kitab Asrar al-Salah' },
    { kind: 'scholar', text: 'Muraqabah is the continuous realization that you are in the present moment under Allah’s sight.', source: 'Ibn al-Qayyim, Madarij al-Salikin' },
    { kind: 'note', text: 'Mechanism: don’t fight wandering thoughts with anger. Acknowledge the drift calmly, drop the thought, and refocus on the task or dhikr.' },
  ] },
  { id: 'husn', n: '06', title: 'Husn al-dhann of Allah', blocks: [
    { kind: 'quran', arabic: 'الظَّانِّينَ بِاللَّهِ ظَنَّ السَّوْءِ عَلَيْهِمْ دَائِرَةُ السَّوْءِ', text: 'Those who think of Allah an evil thought; upon them is a misfortune of evil.', source: 'Qur’an 48:6' },
    { kind: 'hadith', arabic: 'أَنَا عِنْدَ ظَنِّ عَبْدِي بِي', text: 'I am as My servant thinks of Me.', source: 'Sahih al-Bukhari 7405; Sahih Muslim 2675 (Hadith Qudsi, Abu Hurayrah)' },
    { kind: 'hadith', arabic: 'حُسْنُ الظَّنِّ بِاللَّهِ مِنْ حُسْنِ عِبَادَةِ اللَّهِ', text: 'Having a good opinion of Allah is part of the excellence of worshipping Allah.', source: 'Sunan Abi Dawud 4993 ⚠ grading differs among scholars' },
    { kind: 'scholar', text: 'Husn al-dhann is expecting Allah’s help, mercy and wisdom while actively striving and taking rational precautions. Ghurur (delusion) is expecting safety and reward while passive, reckless, or persisting in sin.', source: 'Ibn al-Qayyim, al-Jawab al-Kafi' },
    { kind: 'scholar', text: 'Husn al-dhann is a deliberate act of the heart (’amal qalbi) commanded by Allah, not a passive mood — a conscious stance that His wisdom and mercy encompass every decree.', source: 'Ibn Rajab, Jami’ al-’Ulum wa al-Hikam' },
  ] },
];

/** Qaf's bibliography, kept whole (gameplan “Sources”). */
export const BIBLIOGRAPHY = [
  'Tuhfat al-Dhakirin bi Uddat al-Hisn al-Hasin — vol. 1, p. 113', 'Mirqat al-Mafatih Sharh Mishkat al-Masabih — vol. 4, p. 1704', 'al-Matalib al-Aliya Muhaqqaqan — vol. 14, p. 153', 'al-Muqaddima fi Fiqh al-Asr — vol. 1, p. 521', 'al-Dhakhira lil-Qarafi — vol. 13, p. 247', 'Nihayat al-Arab fi Funun al-Adab — vol. 5, p. 281', 'Kitab al-Tawhid al-Musamma al-Takhalli an al-Taqlid wa al-Tahalli bil-Asl al-Mufid — vol. 1, p. 248', 'Ihya Ulum al-Din — vol. 4, p. 280', 'Ithaf Dhawi al-Albab fi Qawlihi Taala Yumhu Allah ma Yashaa wa Yuthbit wa Indahu Umm al-Kitab — vol. 1, p. 96', 'Raf al-Shubha wa al-Gharar amman yahtajj ala fil al-Maasi bil-Qadar — vol. 1, p. 27', 'Minhaj al-Sunnah al-Nabawiyyah — vol. 5, p. 365', 'Tariq al-Hijratayn wa Bab al-Saadatayn — vol. 1, p. 259', 'Usul al-Dawah wa Turuquha 3 - Jamiat al-Madina — vol. 1, p. 35', 'al-Mufhim lima ashkal min Talkhis Kitab Muslim — vol. 6, p. 629', 'al-Ahadith al-Warida fi al-Ibtila — vol. 1, p. 37', 'al-Kawkab al-Wahhaj Sharh Sahih Muslim ibn al-Hajjaj — vol. 26, p. 436', 'Mirqat al-Mafatih Sharh Mishkat al-Masabih — vol. 8, p. 3316', 'Mawsuat al-Akhlaq al-Islamiyya — vol. 1, p. 310', 'al-Bahr al-Muhit al-Thajjaj fi Sharh Sahih al-Imam Muslim ibn al-Hajjaj — vol. 45, p. 273', 'Tafsir al-Muntasir al-Kattani — vol. 220, p. 2', 'al-Aqaid al-Islamiyya — vol. 1, p. 234', 'al-Ruh - Ibn al-Qayyim — vol. 2, p. 635', 'Durus lil-Shaykh Muhammad Hassan — vol. 84, p. 5', 'Nadrat al-Naim fi Makarim Akhlaq al-Rasul al-Karim — vol. 8, p. 3318', 'al-Durr al-Thamin wa al-Mawrid al-Muin — vol. 1, p. 586', 'Nadrat al-Naim fi Makarim Akhlaq al-Rasul al-Karim — vol. al-Muqaddima, p. 77', 'Mawsuat al-Mafahim al-Islamiyya al-Amma — vol. 1, p. 416', 'al-Tawdih li Sharh al-Jami al-Sahih — vol. 29, p. 305', 'al-Musnad al-Jami — vol. 2, p. 244',
];

/** Stable daily pick. */
export function dayIndex(len: number, d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0).getTime();
  return Math.floor((d.getTime() - start) / 86400000) % len;
}
