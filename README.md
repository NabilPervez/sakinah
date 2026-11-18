# Sakinah — tranquility of the heart

> “It is He who sent down tranquility (sakinah) into the hearts of the believers.” — Qur’an 48:4

Sakinah (Serenity v3) is a local-first PWA for anxiety, with faith woven through every practice: tawakkul, dhikr, muhasabah, the Names of Allah, and the therapy exercises from Serenity v2.

## What's inside

| Tab | What it does |
| --- | --- |
| **Today** | Routine checklist, plus today's intention (muraqabah), open prep steps from your fears, the anchor Name, and today's Qur'an passage |
| **Practice** | Non-judgment minute, body focus, Back to it (5-min refocus), box breathing, each with its niyyah |
| **Faith** | Tie your camel (fear → prep → tawakkul), dhikr counter, du'a by need, the 99 Names, Qur'an plan, mindset shifts, study, akhlaq & routine |
| **Reflect** | Reframe cards (situation → action, text, reframe, reward; log heaviness before/after, pin to Today, write your own), muhasabah (al-Ghazali's 4 stages), gratitude, reframes (husn al-dhann), effort ledger, Friday pillars |
| **Progress** | Adherence vs. stress, plus weekly 6–8 week signs and faith stats |

SOS (top bar) is one tap from anywhere and includes Du'a al-Karb, Tie your camel, and "Is it one of these thoughts?" to jump to a reframe card. Between 9 pm and 7 am, Today shows the sleepless-nights card first; the PWA shortcut "Night card" opens it directly. A weekday 8:30 reminder opens the work card.

## Citations

Every Islamic item carries its source: Qur'an surah:ayah, or the hadith collection and number with grading. `npm run check:citations` runs before every build and fails if any item has no source. The du'as in "Du'a by need" are **composed** supplications that call on a Name; they're labelled as such and kept separate from narrated du'as. Items marked ⚠ should be verified on quran.com / sunnah.com.

Content source: the Qaf gameplan (kept whole in `src/data/faith/faith.ts`), plus datasets reused from Nabil's repos:

- `learnthenamesofallah`: 99 Names with verse, hadith, and audio
- `name-and-need-duaa-discovery-tool`: 116 Names with du'as by need
- `Dhikrflow`: dhikr presets

## Moving data from Serenity v2

The app lives at a new address, so its local data starts empty. In Serenity v2, go to **Settings → Export JSON**, then in Sakinah go to **Settings → Import**. v2 backups are accepted as-is.

## Stack

React 19 + Vite, Dexie (IndexedDB, schema v6), Zustand, Recharts, GSAP + @gsap/react, vite-plugin-pwa. Design: Quiet Precision (Cisco), light mode, lapis accent, Outfit + Noto Naskh Arabic.

```bash
npm install
npm run dev      # local
npm run build    # citation check → type check → build
```

Deployed on Netlify (`netlify.toml`). The PRD lives in Notion: *PRD — Sakinah (Serenity v3)*.
