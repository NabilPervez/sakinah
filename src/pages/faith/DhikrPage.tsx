import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { Arabic, Counter, SourceLine, useRise } from '../../components/faith/FaithUI';
import { DHIKR, GAMEPLAN_DUAS } from '../../data/faith/faith';
import { addDhikrLog, getAllDhikrLogs } from '../../data/db';
import { getTodayDateString } from '../../store/useAppStore';
import '../../present.css';
import '../../faith.css';

const TARGETS = [1, 3, 7, 33, 100];
const CATS = ['Gameplan', 'Core', 'Morning', 'Evening', 'Salawat', '99 Names'];

/** Dhikr counter — presets from the Dhikrflow repo + gameplan adhkar (PRD F2). */
export default function DhikrPage() {
  const [params] = useSearchParams();
  const all = useMemo(() => [
    ...GAMEPLAN_DUAS.map((d) => ({ id: d.id, arabic: d.arabic, transliteration: d.transliteration, translation: d.translation, category: 'Gameplan', source: d.source, target: d.target })),
    ...DHIKR.map((d) => ({ ...d, target: 33 })),
  ], []);
  const [cat, setCat] = useState('Gameplan');
  const [sel, setSel] = useState(() => all.find((d) => d.id === params.get('id')) ?? all[1]);
  const [target, setTarget] = useState(sel.target);
  const [todayCount, setTodayCount] = useState(0);
  const ref = useRise<HTMLDivElement>();

  const refresh = () => getAllDhikrLogs().then((l) => setTodayCount(l.filter((x) => x.date === getTodayDateString()).reduce((a, x) => a + x.count, 0)));
  useEffect(() => { refresh(); }, []);

  const pick = (d: typeof sel) => { setSel(d); setTarget(d.target); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      <TopBar title="Dhikr" icon="radio_button_checked" />
      <div className="pr-page" ref={ref}>
        <Link to="/faith" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Faith</Link>
        <section className="flow" data-rise>
          <Arabic size="lg">{sel.arabic}</Arabic>
          <p className="pr-row-title">{sel.transliteration}</p>
          <p className="pr-hint">{sel.translation}</p>
          <SourceLine>{sel.source}</SourceLine>
          <div className="qp-chips" role="group" aria-label="Target">
            {TARGETS.map((t) => <button key={t} className={`qp-chip${t === target ? ' active' : ''}`} aria-pressed={t === target} onClick={() => setTarget(t)}>{t}×</button>)}
          </div>
          <Counter key={`${sel.id}-${target}`} target={target} label={sel.transliteration}
            onComplete={async (c) => { await addDhikrLog({ dhikrId: sel.id, count: c, target, at: Date.now(), date: getTodayDateString() }); refresh(); }} />
          <p className="pr-hint">{todayCount} counted in completed sets today.</p>
        </section>

        <section className="reflect-group" data-rise>
          <div className="qp-chips" role="tablist" aria-label="Categories">
            {CATS.map((c) => <button key={c} role="tab" aria-selected={c === cat} className={`qp-chip${c === cat ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="pr-spine" style={{ marginTop: 16 }}>
            {all.filter((d) => d.category === cat).map((d) => (
              <button key={d.id} className={`pr-row dhikr-row${d.id === sel.id ? ' open' : ''}`} onClick={() => pick(d)}>
                <span className="dhikr-ar" dir="rtl" lang="ar">{d.arabic}</span>
                <span className="pr-hint">{d.transliteration}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
