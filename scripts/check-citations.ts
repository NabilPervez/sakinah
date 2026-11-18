/** Fails the build if any faith item lacks a source (PRD §9, DoD). */
import { NAMES_99, NEED_DUAS, NEED_DUA_NOTE, DHIKR, GAMEPLAN_DUAS, ANCHOR_NAMES, SHIFTS, PASSAGES, LESSONS, AKHLAQ, NIYYAH, LISTEN_WHY, LISTEN_HOW } from '../src/data/faith/faith';
import { DELIVERANCES } from '../src/data/faith/munjiyat';
import { REFRAME_CARDS } from '../src/data/faith/reframeCards';
const bad: string[] = [];
const need = (ok: unknown, where: string) => { if (!ok || (typeof ok === 'string' && !ok.trim())) bad.push(where); };
NAMES_99.forEach((n) => need(n.verse?.citation || n.hadith?.reference || n.hadith?.topic, `Name ${n.transliteration}`));
need(NEED_DUA_NOTE.source, 'Need du’a note'); need(NEED_DUAS.length, 'Need du’as loaded');
DHIKR.forEach((d) => need(d.source, `Dhikr ${d.id}`));
GAMEPLAN_DUAS.forEach((d) => need(d.source, `Du’a ${d.id}`));
ANCHOR_NAMES.forEach((a) => need(a.source, `Anchor ${a.name}`));
SHIFTS.forEach((s) => need(s.source, `Shift ${s.title}`));
Object.values(PASSAGES).forEach((p) => need(p.ref, `Passage ${p.id}`));
LESSONS.forEach((l) => l.blocks.forEach((b, i) => { if (b.kind !== 'note') need(b.source, `Lesson ${l.id} #${i + 1}`); }));
LISTEN_WHY.forEach((b, i) => need(b.source, `Listen why #${i + 1}`));
LISTEN_HOW.forEach((h, i) => need(h.source, `Listen how #${i + 1}`));
AKHLAQ.forEach((a) => need(a.source, `Akhlaq ${a.title}`));
Object.entries(NIYYAH).forEach(([k, v]) => need(v.source, `Niyyah ${k}`));
REFRAME_CARDS.forEach((c) => { need(c.text.source, `Card ${c.id}`); if (c.support) need(c.support.source, `Card ${c.id} support`); });
DELIVERANCES.forEach((d) => need(d.source, `Deliverance ${d.id}`));
need(DELIVERANCES.length === 10, 'Deliverances: all 10 books');
if (bad.length) { console.error(`✗ ${bad.length} faith item(s) missing a citation:\n- ${bad.join('\n- ')}`); process.exit(1); }
console.log(`✓ citations: ${NAMES_99.length} Names, ${DHIKR.length} dhikr, ${GAMEPLAN_DUAS.length + NEED_DUAS.length} du’as, ${LESSONS.length} lessons — all sourced`);
