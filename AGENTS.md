# AGENTS.md — Mutma'innah

- **Build order:** PRD (Notion) → sprint plan with DoD → build in passes → deploy → README.
- **Design:** Quiet Precision. One sans (Outfit), plus Noto Naskh Arabic (RTL, never letter-spaced). Closed type scale 62/32/24/22/18/16/14/13. Lapis ramp `--accent-*`. Hairlines, not shadows. Light mode only.
- **Motion:** GSAP via `useRise()` / PageTransition. Easing `expo.out`, rise 30px, 900ms, stagger 140ms. Always respect `prefers-reduced-motion`.
- **Faith content:** only from `src/data/faith/*`. Never generate Arabic, hadith, or rulings. Every item needs a `source`; `npm run check:citations` enforces it. Label composed du'as as composed.
- **Data:** Dexie migrations are additive only. Bump the version and never drop tables.
- **Mobile QA before push:** 360px, no horizontal scroll, every route opens at the top.
