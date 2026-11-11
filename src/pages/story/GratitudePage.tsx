import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { getAllGratitudeNights, getGratitudeNight, saveGratitudeNight, type GratitudeNight } from '../../data/db';
import { getTodayDateString } from '../../store/useAppStore';
import { streak } from '../present/presentUtils';

const PROMPTS = [
  'Something small that went right today…',
  'Someone I’m grateful for…',
  'A blessing I almost overlooked…',
];

/** Reflect › Nightly gratitude — three things, one "why". */
export default function GratitudePage() {
  const today = getTodayDateString();
  const [items, setItems] = useState<string[]>(['', '', '']);
  const [why, setWhy] = useState('');
  const [past, setPast] = useState<GratitudeNight[]>([]);
  const { toast, showToast } = useToast();

  useEffect(() => {
    getGratitudeNight(today).then((n) => {
      if (n) { setItems([...n.items, '', '', ''].slice(0, 3)); setWhy(n.why); }
    });
    getAllGratitudeNights().then(setPast);
  }, [today]);

  const filled = items.filter((i) => i.trim());
  const save = async () => {
    await saveGratitudeNight({ date: today, items: filled, why: why.trim(), createdAt: Date.now() });
    setPast(await getAllGratitudeNights());
    showToast('Alhamdulillah ✓');
  };
  const run = streak(past.map((p) => p.date));

  return (
    <>
      <Toast message={toast.message} show={toast.show} />
      <TopBar title="Gratitude" icon="favorite" />
      <div className="story-page">
        <Link to="/reflect" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Reflect</Link>
        <p className="story-lead">Three things from today. Small counts.{run > 1 ? ` ${run} nights in a row.` : ''}</p>

        <div className="card prompt-card">
          <label>Tonight I’m grateful for…</label>
          {items.map((v, i) => (
            <div key={i} className="effort-row">
              <span className="effort-badge">{i + 1}</span>
              <input className="story-input" value={v} placeholder={PROMPTS[i]} aria-label={`Gratitude ${i + 1}`}
                onChange={(e) => setItems(items.map((x, j) => (j === i ? e.target.value : x)))} />
            </div>
          ))}
        </div>

        <div className="card prompt-card">
          <label htmlFor="why">Why did one of these matter?</label>
          <textarea id="why" className="story-textarea" style={{ minHeight: 80 }} value={why} onChange={(e) => setWhy(e.target.value)} />
        </div>

        <div className="step-actions">
          <button className="btn-primary" disabled={filled.length === 0} onClick={save}>Save tonight</button>
        </div>

        {past.length > 0 && (
          <section className="card">
            <p className="story-section-title"><span className="material-symbols-outlined">history</span>Past nights</p>
            {past.map((n) => (
              <div key={n.id} className="past-row"><span>{n.date}</span><span>{n.items.join(' · ')}</span></div>
            ))}
          </section>
        )}
      </div>
    </>
  );
}
