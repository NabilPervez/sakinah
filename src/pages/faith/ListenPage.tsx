import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { Arabic, SourceLine, useRise } from '../../components/faith/FaithUI';
import { surahs } from '../../lib/quran/surahs';
import { fetchSurah, RECITERS, BISMILLAH, type ReciterId } from '../../lib/quran/quran';
import { useRecitationPlayer } from '../../lib/quran/usePlayer';
import type { Ayah, SessionSettings } from '../../lib/quran/types';
import { AUDIO_SOURCE, LISTEN_HOW, LISTEN_WHY, PASSAGES } from '../../data/faith/faith';
import { addQuranLog } from '../../data/db';
import { getTodayDateString } from '../../store/useAppStore';
import '../../present.css';
import '../../faith.css';

type Seg = { s: number; a: number; b: number };
const REPS = [{ v: 1, l: '1×' }, { v: 3, l: '3×' }, { v: 7, l: '7×' }, { v: 0, l: '∞' }];
const readReciter = (): ReciterId => { try { return (localStorage.getItem('sakinah:reciter') as ReciterId) || 'ar.alafasy'; } catch { return 'ar.alafasy'; } };

/**
 * Listen — in-app Qur'an recitation (player from NabilPervez/quran-recitation).
 * Nabil, 2026-11-15: plan passages play in-app, every cited verse can open here,
 * and the page explains where listening comes from and why we do it.
 */
/** Remount when the query changes, so a verse's Listen link works from this page too. */
export default function ListenPage() {
  const { search } = useLocation();
  return <ListenView key={search} />;
}

function ListenView() {
  const [params] = useSearchParams();
  const planId = params.get('plan');
  const plan = planId ? PASSAGES[planId] : undefined;
  const initial: Seg[] = plan ? plan.segs : [{ s: Number(params.get('s')) || 93, a: Number(params.get('a')) || 1, b: Number(params.get('b')) || 0 }];

  const [queue, setQueue] = useState<Seg[]>(initial);
  const [qi, setQi] = useState(0);
  const [reciter, setReciter] = useState<ReciterId>(readReciter);
  const [reps, setReps] = useState(1);
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
  const [err, setErr] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const ref = useRise<HTMLDivElement>();

  const seg = queue[qi];
  const surah = surahs.find((x) => x.id === seg.s) ?? surahs[0];
  const end = seg.b && seg.b <= surah.totalAyahs ? seg.b : surah.totalAyahs;

  useEffect(() => {
    let live = true;
    setAyahs(null); setErr(false);
    fetchSurah(seg.s, reciter).then((a) => live && setAyahs(a)).catch(() => live && setErr(true));
    return () => { live = false; };
  }, [seg.s, reciter]);

  const pickSurah = (id: number) => { setQueue([{ s: id, a: 1, b: 0 }]); setQi(0); };
  const pickReciter = (r: ReciterId) => { setReciter(r); try { localStorage.setItem('sakinah:reciter', r); } catch { /* ignore */ } };

  return (
    <>
      <TopBar title="Listen" icon="headphones" />
      <div className="pr-page" ref={ref}>
        <Link to="/faith" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Faith</Link>
        <header className="pr-hero" data-rise>
          <h1 className="pr-h1">Listen, and be silent. <span>Mercy follows.</span></h1>
          <p className="pr-lede">“When the Qur’an is recited, listen to it and be silent, so that you may receive mercy.”</p>
          <SourceLine>Qur’an 7:204</SourceLine>
          <button className="cite-btn" onClick={() => setShowWhy(!showWhy)} aria-expanded={showWhy}>
            <span className="material-symbols-outlined" aria-hidden="true">help</span>{showWhy ? 'Hide' : 'Why we listen, and how'}
          </button>
        </header>

        {showWhy && <WhySection />}

        {plan && (
          <p className="niyyah" data-rise><strong>Today’s plan · {plan.title}. </strong>{plan.why} <span className="pr-hint">({plan.ref})</span></p>
        )}

        <section className="listen-controls" data-rise>
          <label className="listen-field">
            <span>Surah</span>
            <select className="qp-input" value={seg.s} onChange={(e) => pickSurah(Number(e.target.value))}>
              {surahs.map((x) => <option key={x.id} value={x.id}>{x.id}. {x.englishName} · {x.name}</option>)}
            </select>
          </label>
          <label className="listen-field">
            <span>Reciter</span>
            <select className="qp-input" value={reciter} onChange={(e) => pickReciter(e.target.value as ReciterId)}>
              {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </label>
          <p className="pr-hint">{RECITERS.find((r) => r.id === reciter)?.note}</p>
          <div className="listen-row">
            <span className="pr-hint">Repeat each ayah</span>
            <div className="qp-chips" role="group" aria-label="Repeat each ayah">
              {REPS.map((r) => <button key={r.v} className={`qp-chip${reps === r.v ? ' active' : ''}`} aria-pressed={reps === r.v} onClick={() => setReps(r.v)}>{r.l}</button>)}
            </div>
          </div>
          {queue.length > 1 && (
            <div className="qp-chips" role="tablist" aria-label="Passage parts">
              {queue.map((q, i) => <button key={i} role="tab" aria-selected={i === qi} className={`qp-chip${i === qi ? ' active' : ''}`} onClick={() => setQi(i)}>{surahs[q.s - 1].englishName} {q.a}–{q.b || surahs[q.s - 1].totalAyahs}</button>)}
            </div>
          )}
        </section>

        {err && <p className="pr-hint">Couldn’t load the recitation. Check your connection and try again.</p>}
        {!ayahs && !err && <p className="pr-hint">Loading {surah.englishName}…</p>}
        {ayahs && (
          <Player key={`${seg.s}-${seg.a}-${end}-${reciter}-${reps}`} ayahs={ayahs} surahId={seg.s} start={Math.max(1, seg.a)} end={end} reps={reps}
            reciterName={RECITERS.find((r) => r.id === reciter)!.name}
            onDone={async () => {
              if (qi < queue.length - 1) { setQi(qi + 1); return; }
              if (plan) await addQuranLog({ passageId: plan.id, date: getTodayDateString() });
            }} />
        )}

        <SourceLine>{AUDIO_SOURCE}</SourceLine>
      </div>
    </>
  );
}

function Player({ ayahs, surahId, start, end, reps, reciterName, onDone }: { ayahs: Ayah[]; surahId: number; start: number; end: number; reps: number; reciterName: string; onDone: () => void }) {
  const surah = surahs[surahId - 1];
  const settings: SessionSettings = useMemo(() => ({ surahId, startAyah: start, endAyah: end, ayahReps: reps, rangeReps: 1, gapMs: 400 }), [surahId, start, end, reps]);
  const { view, toggle, next, prev, goTo } = useRecitationPlayer({ surah, ayahs, settings, reciterName });
  const list = useRef<HTMLOListElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (view.status === 'done' && !doneRef.current) { doneRef.current = true; onDone(); }
    if (view.status !== 'done') doneRef.current = false;
  }, [view.status, onDone]);

  useEffect(() => {
    const el = list.current?.querySelector<HTMLElement>(`[data-ayah="${view.ayah}"]`);
    if (el && (view.status === 'playing' || view.status === 'buffering')) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [view.ayah, view.status]);

  const playing = view.status === 'playing' || view.status === 'buffering';
  return (
    <section className="listen-player">
      <div className="listen-bar">
        <button className="listen-btn" onClick={prev} aria-label="Previous ayah"><span className="material-symbols-outlined">skip_previous</span></button>
        <button className="listen-btn main" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          <span className="material-symbols-outlined">{playing ? 'pause' : view.status === 'done' ? 'replay' : 'play_arrow'}</span>
        </button>
        <button className="listen-btn" onClick={next} aria-label="Next ayah"><span className="material-symbols-outlined">skip_next</span></button>
        <span className="listen-pos">
          <strong>{surah.englishName} {view.ayah}</strong>
          <span>{view.status === 'buffering' ? 'Loading…' : view.status === 'error' ? 'Audio error' : view.status === 'done' ? 'Complete · Sadaqallahul-’Azim' : `Ayah ${view.ayah} of ${start}–${end}${reps !== 1 ? ` · rep ${view.rep}` : ''}`}</span>
        </span>
      </div>

      {surahId !== 1 && surahId !== 9 && start === 1 && <Arabic size="lg">{BISMILLAH}</Arabic>}
      <ol className="listen-ayahs" ref={list}>
        {ayahs.slice(start - 1, end).map((a) => (
          <li key={a.numberInSurah} data-ayah={a.numberInSurah} className={a.numberInSurah === view.ayah ? 'on' : ''}>
            <button className="listen-ayah" onClick={() => goTo(a.numberInSurah, { autoplay: true })} aria-label={`Play ayah ${a.numberInSurah}`}>
              <span className="listen-n">{surahId}:{a.numberInSurah}</span>
              <span className="ar ar-md" dir="rtl" lang="ar">{a.arabic}</span>
              <span className="listen-en">{a.english}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function WhySection() {
  return (
    <section className="reflect-group">
      <h2 className="reflect-group-label">Where it comes from</h2>
      {LISTEN_WHY.map((b, i) => (
        <div key={i} className={`lesson-block ${b.kind}`}>
          <span className="lesson-kind">{b.kind === 'quran' ? 'Qur’an' : b.kind === 'hadith' ? 'Hadith' : b.kind === 'scholar' ? 'Scholar' : 'Note'}</span>
          {b.arabic && <Arabic>{b.arabic}</Arabic>}
          <p>{b.text}</p>
          {b.source && <SourceLine>{b.source}</SourceLine>}
        </div>
      ))}
      <h2 className="reflect-group-label" style={{ marginTop: 24 }}>How to listen</h2>
      <ol className="listen-how">
        {LISTEN_HOW.map((h) => (
          <li key={h.step}><strong>{h.step}</strong><span>{h.why}</span><SourceLine>{h.source}</SourceLine></li>
        ))}
      </ol>
    </section>
  );
}
