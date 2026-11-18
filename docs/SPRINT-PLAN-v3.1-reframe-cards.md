# Sprint plan — Sakinah v3.1 Reframe Cards

Solo build (Nabil + Claude Code). Sprints are ~1 focused session each. Estimates are **estimates**. Push to GitHub at the end of every sprint.

## Sprint 0 — Content check (≈1 hr, blocks release, not build)
- Verify the three ⚠ references (PRD §6) on sunnah.com; record collection, number and grading.
- Fix the copy notes (naṣab spelling, Card 2 "may elevate", Card 4 condition).
- **DoD:** a final table of 4 primary sources with gradings; no ⚠ left.

## Sprint 1 — Data + card screens (≈3 hrs)
- `src/data/faith/reframeCards.ts` with the 4 cards (FR1).
- Extend `scripts/check-citations` to cover the new file.
- Card list `/reflect/cards` with tag filter (FR2); card detail with the 4 sections and GSAP reveal (FR3).
- Entry from the Reflect hub.
- **DoD:** cards render with Arabic + source; `npm run build` passes; reduced motion respected; pushed.

## Sprint 2 — Use, logging, entry points (≈3 hrs)
- Dexie v6: `reframeUses` table; backup export/import updated; v5 import test (FR5).
- "I've set my intention" + optional before/after intensity.
- "What's the thought?" match in SOS and Reflect (FR4).
- Pin up to 2 cards to Today (FR6); Anchor Name chip (FR9).
- **DoD:** a use is saved and survives reload; v5 backup imports; SOS → intention < 20 s on phone; pushed.

## Sprint 3 — Custom cards + Progress + ship (≈3 hrs)
- Create/edit/delete custom cards, labelled "Your card" (FR7).
- Progress: weekly uses, most-used card, avg intensity drop (FR8).
- PWA shortcut to Card 3 (if Open question 1 = yes).
- README update, Lighthouse pass, Netlify deploy.
- **DoD:** release DoD in PRD §11 met; deployed; Change Log updated.

## Backlog (later)
- Reminders tied to a card (e.g. before work).
- JSON import of new cards.
- Audio recitation of each card's text.
