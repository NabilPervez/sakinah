import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { Arabic, SourceLine, useRise } from '../../components/faith/FaithUI';
import { GOOD_DEEDS } from '../../data/faith/munjiyat';
import { addTawbahLog, countTawbah } from '../../data/db';
import { getTodayDateString } from '../../store/useAppStore';
import '../../present.css';
import '../../faith.css';

/**
 * Tawbah reset — Iḥyā' Book 31 (PRD v3.2 FR3). Nabil: never show your mistakes back as a list.
 * The slip text lives in component state only and is never written to the DB.
 */
export default function TawbahPage() {
  const [step, setStep] = useState(0);
  const [slip, setSlip] = useState('');
  const [deed, setDeed] = useState('');
  const [own, setOwn] = useState('');
  const [total, setTotal] = useState(0);
  const ref = useRise<HTMLDivElement>([step]);
  useEffect(() => { countTawbah().then(setTotal); }, []);
  const go = (n: number) => { setStep(n); window.scrollTo(0, 0); };
  const finish = async () => {
    await addTawbahLog({ date: getTodayDateString(), at: Date.now(), deed: own.trim() || deed });
    setSlip('');
    setTotal((t) => t + 1);
    go(3);
  };

  return (
    <>
      <TopBar title="Tawbah" icon="restart_alt" />
      <div className="pr-page" ref={ref}>
        <Link to="/faith" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Faith</Link>

        {step === 0 && (
          <section className="flow" data-rise>
            <p className="flow-k">Step 1 of 3 · Acknowledge</p>
            <h1 className="pr-h1">Name it plainly. <span>No defending, no drowning.</span></h1>
            <label className="pr-hint" htmlFor="slip">What happened? (Stays on this screen. Never saved.)</label>
            <textarea id="slip" className="qp-input" rows={3} value={slip} onChange={(e) => setSlip(e.target.value)} placeholder="I…" />
            <div className="pr-actions"><button className="qp-btn qp-btn-primary" onClick={() => go(1)}>I’ve named it</button></div>
          </section>
        )}

        {step === 1 && (
          <section className="flow" data-rise>
            <p className="flow-k">Step 2 of 3 · Regret, toward Allah</p>
            <h1 className="pr-h1">Sorrow that turns you to Him, <span>not against yourself.</span></h1>
            <p className="pr-lede">Say <em>astaghfirullah</em> and mean it. Resolve not to return to it. If someone was wronged, plan to make it right.</p>
            <SourceLine>al-Ghazali, Iḥyā’, Book 31 · composed summary</SourceLine>
            <div className="pr-actions"><button className="qp-btn qp-btn-primary" onClick={() => go(2)}>Astaghfirullah</button></div>
          </section>
        )}

        {step === 2 && (
          <section className="flow" data-rise>
            <p className="flow-k">Step 3 of 3 · Follow it with good</p>
            <h1 className="pr-h1">Pick one good deed. <span>Do it today.</span></h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {GOOD_DEEDS.map((g) => (
                <button key={g} type="button" className="rc-chip" aria-pressed={deed === g && !own}
                  style={deed === g && !own ? { background: 'var(--accent-600)', color: '#fff', borderColor: 'var(--accent-600)' } : { background: 'none' }}
                  onClick={() => { setDeed(g); setOwn(''); }}>{g}</button>
              ))}
            </div>
            <input className="qp-input" value={own} onChange={(e) => setOwn(e.target.value)} placeholder="Or your own…" aria-label="Your own good deed" />
            <div className="pr-actions"><button className="qp-btn qp-btn-primary" disabled={!(deed || own.trim())} onClick={finish}>I’ll do this</button></div>
          </section>
        )}

        {step === 3 && (
          <section className="flow" data-rise>
            <p className="flow-k">Turned back</p>
            <h1 className="pr-h1">The door is open. <span>Walk on.</span></h1>
            <Arabic>قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ</Arabic>
            <p className="pr-lede">“Say: O My servants who have wronged themselves, do not despair of the mercy of Allah.”</p>
            <SourceLine>Qur’an 39:53</SourceLine>
            {total > 1 && <p className="pr-hint">You’ve turned back {total} times. Each one counts.</p>}
            <div className="pr-actions"><Link className="qp-btn qp-btn-primary" to="/today">Done</Link></div>
          </section>
        )}
      </div>
    </>
  );
}
