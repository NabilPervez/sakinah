# PRD — Sakinah v3.1: Reframe Cards (life situations → faith reframes)

| | |
|---|---|
| **Owner** | Nabil Pervez |
| **Date** | 2026-11-18 |
| **Status** | Built 2026-11-18 |
| **Repo** | github.com/NabilPervez/sakinah |
| **Stack** | React 19 + Vite, Dexie (schema v5 → v6), Zustand, GSAP — unchanged |
| **Design** | Quiet Precision (web-design-cisco), light mode, lapis accent |

## 1. Summary

Add **Reframe Cards**: situation-based cards that turn a specific heavy moment (past mistakes, a trial starting, a sleepless night with a sick child, work strain) into four moves — an **action**, a **text** (Qur'an/hadith), a **reframe** (negative → positive), and the **reward & why**. Cards are reachable from Reflect, SOS, and the Today screen, and every use is logged so Progress can show it.

The first four cards come from Nabil's new content (Nov 2026). The format is built so more cards can be added as data, not code.

## 2. Problem

- The existing reframe tools (Reframe, Quick reframe, Mindset shifts) are generic: they ask the user to write their own reframe. In the moment (3 a.m., child crying), that's too much work.
- Real triggers are situational and repeat: the same thought comes back with the same situation. A ready-made, sourced card for that situation is faster than a blank form.
- Niyyah/iḥtisāb (intending reward) is the key move in the new content, and the app has no "set intention for this hardship" action today.

## 3. Goals and non-goals

**Goals**
1. Ship the 4 cards with full text, Arabic, translation and citations that pass `check:citations`.
2. Make a card usable in **under 20 seconds**: open → read reframe → tap "I've set my intention" → done.
3. Let the user match their own thought to a card ("This is what I'm thinking") from SOS and Reflect.
4. Log uses (card, timestamp, optional before/after intensity 1–5) and show them in Progress.
5. Let the user pin cards to Today and add their own custom cards with the same four fields.

**Non-goals**
- No AI-generated reframes or fatwa-style answers.
- No accounts, sync or server. Stays local-first.
- No redesign of existing pages beyond adding entry points.
- No notifications in this release (see Open questions).

## 4. Users and moments

| Moment | Card | Entry point |
|---|---|---|
| A memory of a past mistake comes back | 1. Reframe difficulties & past mistakes (Qadar + tawbah) | Reflect, SOS |
| A new trial starts; mind jumps to worst case | 2. Expect good from Allah (husn al-ẓann) | SOS, Today |
| Woken at night by a sick/teething child | 3. Sleepless nights (iḥtisāb) | Today (pinned), SOS |
| Overloaded at work, resenting the grind | 4. Work strain & providing | Today, Reflect |

## 5. Functional requirements

**FR1 — Card data model** (`src/data/faith/reframeCards.ts`)
```ts
interface ReframeCard {
  id: string; title: string; situation: string; tags: string[];   // e.g. ['parenting','night']
  action: string;                     // the actionable step
  text: { arabic: string; translation: string; source: string; kind: 'quran'|'hadith'; grading?: string };
  negative: string; positive: string; // the reframe pair
  reward: string;                     // reward & why
  scholarRefs?: string[];             // commentary refs from the source list
  anchorName?: string;                // key into ANCHOR_NAMES / NAMES_99
  custom?: boolean;
}
```
Every built-in card must have `text.source`; `check:citations` is extended to cover this file.

**FR2 — Card list** (`/reflect/cards`): grid of cards with title + situation line; filter by tag; pinned first.

**FR3 — Card detail**: four stacked sections in fixed order — *Do this* → *Text* (Arabic, Noto Naskh, then translation and source) → *Reframe* (negative struck through, positive revealed with a GSAP fade/slide) → *Reward & why*. Primary button: **"I've set my intention"**. Optional 1–5 intensity before/after.

**FR4 — Thought match**: in SOS and Reflect, a "What's the thought?" list showing each card's `negative` line; tapping one opens its card.

**FR5 — Logging**: new Dexie table `reframeUses` (`++id, cardId, at, before?, after?`) in schema v6. Backup export/import includes it; v5 backups import unchanged.

**FR6 — Pin to Today**: pin up to 2 cards; they show as a compact row on Today.

**FR7 — Custom cards**: create/edit/delete with the same fields; source is optional for custom cards but they are labelled "Your card" and excluded from the citation check.

**FR8 — Progress**: "Reframes used this week" count, most-used card, and average intensity drop when before/after are logged.

**FR9 — Anchor Name link**: cards with `anchorName` show the Name chip (e.g. Card 2 → Al-Wadūd) linking to its Names page.

## 6. Content and citations

Source: Nabil's uploaded notes (4 cards + 22 commentary references). Text references to verify before release:

| Card | Text | Reference to attach | Status |
|---|---|---|---|
| 1 | مَا أَصَابَ مِنْ مُصِيبَةٍ… | Qur'an 57:22 | Confirmed |
| 1 | "What missed you was never meant to reach you…" (used in *Reward & why*) | Hadith — Abu Dawud 4699 / Tirmidhi 2144 | ⚠ verify number on sunnah.com |
| 2 | أَنَا عِنْدَ ظَنِّ عَبْدِي بِي… | Bukhari 7405, Muslim 2675 (base wording); the "if he thinks good…" addition is in Ahmad / Ibn Hibban | ⚠ verify wording & grading |
| 3 | مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ… | Bukhari 5641–5642, Muslim 2573 | Confirmed |
| 4 | إِنْ كَانَ خَرَجَ يَسْعَى عَلَى وَلَدِهِ صِغَارًا… | al-Ṭabarānī (al-Kabīr / al-Awsaṭ); graded ṣaḥīḥ by al-Albānī (Ṣaḥīḥ al-Targhīb) | ⚠ verify reference & grading |

Content rules:
- The upload's `[n]` markers point to commentary works (sharḥ, fatawa), **not** the hadith source. Keep them as `scholarRefs`, and always show the primary collection as the main source.
- Card 3 translation: "nasp" → **naṣab** (fatigue); fix the spelling.
- Card 4 positive line says work "is recorded as striving in the path of Allah." Keep it tied to the hadith's condition (providing for dependents, halal earning) so it isn't read as a blanket claim.
- Card 2 phrase "elevate my rank in Jannah" is a hope, not a promise; phrase as "may elevate".

## 7. UX and design

- Quiet Precision: one typeface (Outfit) + Noto Naskh Arabic, hairlines, no shadows, lapis accent only on the primary button and the positive reframe.
- Reframe reveal: negative line fades to 40% with strikethrough, positive slides up 8px; 300ms; respects `prefers-reduced-motion`.
- Night use (Card 3): card detail works one-handed, large tap target at the bottom, no bright full-white flash on open (use the existing light background, not pure #FFF).
- Copy stays short: no paragraph over 3 lines on a phone.

## 8. Success metrics (personal app, measured locally)

- ≥ 3 card uses per week after week 2.
- Average intensity drop ≥ 1 point when before/after is logged.
- Time from SOS tap to "I've set my intention" under 20 s (manual test).

## 9. Risks

| Risk | Mitigation |
|---|---|
| Wrong hadith reference or weak narration shipped | ⚠ items block release until checked on sunnah.com; citation script fails build if source missing |
| Feels preachy in a hard moment | Action first, short lines, no guilt language; user can hide any card |
| Dexie v6 migration loses data | Additive table only; test import of a v5 backup before deploy |

## 10. Decisions (2026-11-18)

1. Night card: shows first on Today 9 pm–7 am, plus a PWA shortcut. 2. Reminders: yes — weekday 08:30 work card (on), 12:30 expect-good (off by default). 3. No JSON card import for now.

## 10b. Original open questions

1. Should Card 3 get a night-mode shortcut (e.g. home-screen shortcut / PWA shortcut straight to the card)? Proposed: yes, PWA `shortcuts` entry — low cost.
2. Do you want gentle reminders (e.g. "set your intention before work") in a later release?
3. Will you be adding more cards soon? If yes, Sprint 3 includes a JSON import for cards.

## 11. Definition of Done (release)

- All 4 cards live with verified sources; no ⚠ left in the UI.
- `npm run build` passes (citations → types → build) with no new lint errors.
- v5 backup imports cleanly into v6; export includes `reframeUses`.
- Lighthouse PWA + a11y ≥ 90 on Reflect/cards and card detail.
- Tested on phone: SOS → card → intention in < 20 s; reduced motion respected.
- Deployed to Netlify; README "What's inside" updated.
