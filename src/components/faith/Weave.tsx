import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllFears, getMuhasabah, updateFear, type Fear } from '../../data/db';
import { getTodayDateString } from '../../store/useAppStore';
import { ANCHOR_NAMES, NIYYAH, PASSAGES, QURAN_WEEK, dayIndex } from '../../data/faith/faith';
import { Cite } from './FaithUI';
import '../../faith.css';

/** Today › faith strip: muraqabah intention, open prep steps, anchor Name, Qur'an (PRD F4/F5/F7/F9). */
export function TodayFaith() {
  const [intention, setIntention] = useState('');
  const [fears, setFears] = useState<Fear[]>([]);
  const hour = new Date().getHours();
  const anchor = ANCHOR_NAMES[dayIndex(ANCHOR_NAMES.length)];
  const passage = PASSAGES[QURAN_WEEK[new Date().getDay()]];
  useEffect(() => {
    getMuhasabah(getTodayDateString()).then((m) => setIntention(m?.intention ?? ''));
    getAllFears().then((f) => setFears(f.filter((x) => x.status === 'open')));
  }, []);
  const tick = async (f: Fear, i: number) => {
    const prepSteps = f.prepSteps.map((s, j) => (j === i ? { ...s, done: true } : s));
    await updateFear(f.id!, { prepSteps, status: prepSteps.every((s) => s.done) ? 'prepped' : 'open' });
    setFears((await getAllFears()).filter((x) => x.status === 'open'));
  };
  return (
    <div className="faith-strip">
      <Link to="/reflect/muhasabah">
        <span className="material-symbols-outlined" aria-hidden="true">{hour >= 18 ? 'nights_stay' : 'flag'}</span>
        <span className="faith-strip-t">
          <strong>{intention ? `“${intention}”` : hour >= 18 ? 'Close the day: muhasabah' : 'Set today’s intention'}</strong>
          {intention ? 'Today’s intention · He sees you' : 'Musharatah · 1 line'}
        </span>
      </Link>
      {fears.flatMap((f) => f.prepSteps.map((s, i) => s.done ? null : (
        <label key={`${f.id}-${i}`} className="flow-check" style={{ minHeight: 0 }}>
          <input type="checkbox" onChange={() => tick(f, i)} />
          <span className="faith-strip-t"><strong>{s.text}</strong>Prep for: {f.text}</span>
        </label>
      ))).filter(Boolean).slice(0, 4)}
      <Link to="/faith/names">
        <span className="material-symbols-outlined" aria-hidden="true">star</span>
        <span className="faith-strip-t"><strong>Ya {anchor.name.replace(/^(Al-|As-|Ar-)/, '')}</strong>{anchor.struggle}</span>
      </Link>
      <Link to="/faith/quran">
        <span className="material-symbols-outlined" aria-hidden="true">menu_book</span>
        <span className="faith-strip-t"><strong>{passage.title}</strong>Today’s listening · {passage.ref}</span>
      </Link>
    </div>
  );
}

/** One-line niyyah above an existing exercise (PRD F5). */
export function Niyyah({ k }: { k: keyof typeof NIYYAH }) {
  const n = NIYYAH[k];
  return <p className="niyyah"><strong>Niyyah · </strong>{n.line} <Cite source={n.source} /></p>;
}

/** Check-in → suggested Name when anxiety is high (PRD F5). */
export function NameSuggestion({ level }: { level: number }) {
  if (level < 7) return null;
  const a = ANCHOR_NAMES[0];
  return (
    <div className="niyyah" role="note">
      <strong>Call on {a.name}. </strong>{a.mechanism}{' '}
      <Link to="/faith/camel" style={{ color: 'var(--accent-600)', fontWeight: 500 }}>Tie your camel →</Link>
    </div>
  );
}
