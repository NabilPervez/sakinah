import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Arabic, SourceLine, useRise } from '../../components/faith/FaithUI';
import { AKHLAQ, BIBLIOGRAPHY, LESSONS, PASSAGES, QURAN_FOCUS, QURAN_WEEK, ROUTINE, SHIFTS } from '../../data/faith/faith';
import { addQuranLog, getQuranLogs, type QuranLog } from '../../data/db';
import { getTodayDateString } from '../../store/useAppStore';
import { streak } from '../present/presentUtils';
import '../../present.css';
import '../../faith.css';

const Back = () => <Link to="/faith" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Faith</Link>;
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Qur'an listening plan (gameplan Part II §4). Audio links out to quran.com. */
export function QuranPage() {
  const today = new Date().getDay();
  const p = PASSAGES[QURAN_WEEK[today]];
  const [logs, setLogs] = useState<QuranLog[]>([]);
  const { toast, showToast } = useToast();
  const ref = useRise<HTMLDivElement>();
  useEffect(() => { getQuranLogs().then(setLogs); }, []);
  const done = logs.some((l) => l.date === getTodayDateString());
  const mark = async () => { await addQuranLog({ passageId: p.id, date: getTodayDateString() }); setLogs(await getQuranLogs()); showToast('Listened ✓'); };
  const run = streak([...new Set(logs.map((l) => l.date))]);
  return (
    <>
      <Toast message={toast.message} show={toast.show} />
      <TopBar title="Qur’an plan" icon="menu_book" />
      <div className="pr-page" ref={ref}>
        <Back />
        <header className="pr-hero" data-rise>
          <p className="flow-k">{DAYS[today]} · 15–20 min</p>
          <h1 className="pr-h1">{p.title}. <span>{QURAN_FOCUS[p.id]}.</span></h1>
          <p className="pr-lede">{p.why}</p>
          <SourceLine>{p.ref}</SourceLine>
          <div className="pr-actions">
            <Link className="qp-btn qp-btn-primary" to={`/faith/listen?plan=${p.id}`}><span className="material-symbols-outlined" aria-hidden="true">play_arrow</span>Listen here</Link>
            <a className="qp-btn qp-btn-ghost" href={p.url} target="_blank" rel="noreferrer">quran.com</a>
            <button className="qp-btn qp-btn-ghost" disabled={done} onClick={mark}>{done ? 'Listened today' : 'Mark listened'}</button>
          </div>
          {run > 1 && <p className="pr-hint">{run} days in a row.</p>}
        </header>
        <section className="reflect-group" data-rise>
          <h2 className="reflect-group-label">The week</h2>
          <div className="pr-spine">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => {
              const x = PASSAGES[QURAN_WEEK[d]];
              return (
                <div key={d} className={`pr-row${d === today ? ' open' : ''}`}>
                  <Link className="pr-row-head" to={`/faith/listen?plan=${x.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span className="pr-row-n">{DAYS[d].slice(0, 3)}</span>
                    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span className="pr-row-title">{x.title}</span>
                      <span className="pr-hint">{QURAN_FOCUS[x.id]}</span>
                    </span>
                    <span className="pr-row-meta">{x.ref.replace('Qur’an ', '')}</span>
                    <span className="material-symbols-outlined pr-row-chev" aria-hidden="true">play_circle</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

/** Mindset shifts (gameplan Part II §1). */
export function ShiftsPage() {
  const ref = useRise<HTMLDivElement>();
  return (
    <>
      <TopBar title="Mindset shifts" icon="swap_horiz" />
      <div className="pr-page" ref={ref}>
        <Back />
        <header className="pr-hero" data-rise><h1 className="pr-h1">Change the belief. <span>The feeling follows.</span></h1></header>
        {SHIFTS.map((s, i) => (
          <article key={s.title} className="shift" data-rise>
            <p className="flow-k">0{i + 1} · {s.title}</p>
            <p className="shift-from"><span>From</span>{s.from}</p>
            <p className="shift-to"><span>To</span>{s.to}</p>
            <Arabic>{s.evidenceArabic}</Arabic>
            <p className="pr-hint">“{s.evidence}”</p>
            <SourceLine>{s.source}</SourceLine>
            <p className="pr-hint"><strong>Why it works:</strong> {s.mechanism}</p>
          </article>
        ))}
      </div>
    </>
  );
}

/** Study — gameplan Part I, kept whole, every block cited. */
export function StudyPage() {
  const [open, setOpen] = useState<string | null>(LESSONS[0].id);
  const ref = useRise<HTMLDivElement>();
  return (
    <>
      <TopBar title="Study" icon="school" />
      <div className="pr-page" ref={ref}>
        <Back />
        <header className="pr-hero" data-rise>
          <h1 className="pr-h1">Understand the why. <span>Then practise it.</span></h1>
          <p className="pr-lede">The Qur’an, the Sunnah, al-Ghazali and the scholars on each struggle.</p>
        </header>
        <div className="pr-spine" data-rise>
          {LESSONS.map((l) => (
            <div key={l.id} className={`pr-row${open === l.id ? ' open' : ''}`}>
              <button className="pr-row-head" aria-expanded={open === l.id} onClick={() => setOpen(open === l.id ? null : l.id)}>
                <span className="pr-row-n">{l.n}</span>
                <span className="pr-row-title">{l.title}</span>
                <span className="material-symbols-outlined pr-row-chev" aria-hidden="true">expand_more</span>
              </button>
              {open === l.id && (
                <div className="pr-row-body">
                  {l.blocks.map((b, i) => (
                    <div key={i} className={`lesson-block ${b.kind}`}>
                      <span className="lesson-kind">{b.kind === 'quran' ? 'Qur’an' : b.kind === 'hadith' ? 'Hadith' : b.kind === 'scholar' ? 'Scholar' : 'Note'}</span>
                      {b.arabic && <Arabic>{b.arabic}</Arabic>}
                      <p>{b.text}</p>
                      {b.source && <SourceLine>{b.source}</SourceLine>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className={`pr-row${open === 'bib' ? ' open' : ''}`}>
            <button className="pr-row-head" aria-expanded={open === 'bib'} onClick={() => setOpen(open === 'bib' ? null : 'bib')}>
              <span className="pr-row-n">[ ]</span>
              <span className="pr-row-title">Sources (29)</span>
              <span className="material-symbols-outlined pr-row-chev" aria-hidden="true">expand_more</span>
            </button>
            {open === 'bib' && (
              <div className="pr-row-body">
                <ol className="bib">{BIBLIOGRAPHY.map((b) => <li key={b}>{b}</li>)}</ol>
                <p className="pr-hint">Bracketed numbers in lessons refer to this list. Compiled by Qaf; spot-check against quran.com and sunnah.com.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** Akhlaq at home + the prayer-anchored day (gameplan Part II §5–6). */
export function HomePage() {
  const ref = useRise<HTMLDivElement>();
  return (
    <>
      <TopBar title="Akhlaq & routine" icon="home" />
      <div className="pr-page" ref={ref}>
        <Back />
        <header className="pr-hero" data-rise><h1 className="pr-h1">Gentle at home. <span>Anchored by prayer.</span></h1></header>
        {AKHLAQ.map((a) => (
          <article key={a.title} className="shift" data-rise>
            <p className="pr-row-title">{a.title}</p>
            {a.arabic && <Arabic>{a.arabic}</Arabic>}
            <p className="pr-lede">{a.text}</p>
            <SourceLine>{a.source}</SourceLine>
            <ul className="sos-steps">{a.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </article>
        ))}
        <section className="reflect-group" data-rise>
          <h2 className="reflect-group-label">The day</h2>
          <div className="pr-spine">
            {ROUTINE.map((r) => (
              <div key={r.slot} className="pr-row open">
                <div className="pr-row-head">
                  <span className="pr-row-title" style={{ flex: 1 }}>{r.slot}</span>
                  <span className="pr-row-meta">{r.theme}</span>
                </div>
                <div className="pr-row-body"><ul className="sos-steps">{r.items.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
