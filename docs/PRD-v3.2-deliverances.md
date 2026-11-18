# PRD — Sakinah v3.2 "The Deliverances"

**Owner:** Nabil · **Date:** 2026-11-18 · **Status:** Built

## 1. Problem
Sakinah already has Muhasabah, Tie Your Camel (tawakkul), Gratitude, Names, Du'as and Reframe Cards. But nothing ties them to a single framework, and three of al-Ghazali's healing themes have no tool yet: repentance without spiralling, a balance of fear and hope, and a weekly path.

## 2. Source framework
Book 4 of al-Ghazali's *Iḥyā' ʿUlūm al-Dīn*, *Rubʿ al-Munjiyāt* (The Deliverances), which has 10 books. The book names and order follow the Iḥyā'. The **problem, lens and practice text is composed** (inspired by the book), not a quotation, and the UI labels it that way. No new Arabic, hadith or rulings get added (AGENTS.md); verses are reused only where they already exist in the app.

## 3. Goals / non-goals
- **Goals:** one home for the 10 books; each book links to the existing tool that practises it; add 2 new tools (Tawbah reset, Mercies journal); tag reframe cards with their book.
- **Non-goals:** streaks or scoring on the path (that would cut against zuhd); quoting Ghazali; cloud sync.

## 4. Requirements
| ID | Requirement |
|---|---|
| FR1 | `src/data/faith/munjiyat.ts`: 10 books, each with id, title, Arabic transliteration, Iḥyā' reference, problem, lens, practice, linked tool route, and the card tags it covers. Covered by check-citations. |
| FR2 | `/faith/deliverances`: a "This week's book" tile (week number mod 10) and a list of all 10 that expand to show problem → lens → practice → "Practise it" link. A "composed, inspired by Iḥyā' Book 4" label. |
| FR3 | `/faith/tawbah`: a 3-step reset (acknowledge, regret toward Allah, follow with a good deed from a picker or your own). Saves **only the date and the deed** and never the slip text. Closes on Qur'an 39:53 (already in the app). |
| FR4 | `/faith/mercies`: a journal of times Allah came through for you. When anxious, "Show me one" surfaces a random entry. Includes add and delete. |
| FR5 | Reframe card detail shows a "Deliverance" chip (book title) mapped from the card's tags, linking to that book. |
| FR6 | Dexie v7, additive: `tawbahLogs`, `mercies`. Backup covers them. |
| FR7 | Faith hub gets a "Deliverances" row, and its "In the moment" section gets Tawbah and Mercies. |

## 5. Definition of Done (release)
- `npm run build` passes, including check-citations covering munjiyat.
- All new routes open at the top, with no horizontal scroll at 360px and reduced motion respected.
- A Tawbah log and a Mercy survive a reload, and the slip text is never written to the DB.
- Pushed to `main`; Netlify auto-deploys; README updated.

## 6. Open questions
1. Should the weekly book also drive a Today reminder? (Deferred to v3.3.)
2. Verify the Iḥyā' page refs against a print edition (Sprint 0).
