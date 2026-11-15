import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Arabic, Cite, SourceLine, useRise } from '../../components/faith/FaithUI';
import { getAllMuhasabah, getMuhasabah, saveMuhasabah, type MuhasabahDay } from '../../data/db';
import { getTodayDateString } from '../../store/useAppStore';
import { streak } from '../present/presentUtils';
import '../../present.css';
import '../../faith.css';

/**
 * Muhasabah — al-Ghazali's four stages (Ihya', Kitab al-Muraqabah wa al-Muhasabah).
 * Nabil, 2026-11-15: shukr first, one slip only, close on mercy — so it stays an audit, not a spiral.
 */
export default function MuhasabahPage() {
  const date = getTodayDateString();
  const evening = new Date().getHours() >= 16;
  const [m, setM] = useState<Omit<MuhasabahDay, 'id'>>({ date, intention: '', well: '', slip: '', release: '', createdAt: Date.now() });
  const [past, setPast] = useState<MuhasabahDay[]>([]);
  const [closed, setClosed] = useState(false);
  const { toast, showToast } = useToast();
  const ref = useRise<HTMLDivElement>([closed]);

  useEffect(() => { getMuhasabah(date).then((x) => x && setM(x)); getAllMuhasabah().then(setPast); }, [date]);
  const set = (k: keyof MuhasabahDay) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setM({ ...m, [k]: e.target.value });
  const save = async (close = false) => {
    await saveMuhasabah({ ...m, createdAt: Date.now() });
    setPast(await getAllMuhasabah());
    if (close) { setClosed(true); window.scrollTo(0, 0); } else showToast('Intention set ✓');
  };
  const run = streak(past.filter((p) => p.well || p.slip || p.release).map((p) => p.date));

  if (closed) return (
    <>
      <TopBar title="Muhasabah" icon="nights_stay" />
      <div className="pr-page" ref={ref}>
        <section className="flow" data-rise>
          <p className="flow-k">Mu’atabah · gentle correction</p>
          <h1 className="pr-h1">Reviewed. <span>Now rest in His mercy.</span></h1>
          <Arabic>قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ</Arabic>
          <p className="pr-lede">“Say: O My servants who have wronged themselves, do not despair of the mercy of Allah.”</p>
          <SourceLine>Qur’an 39:53</SourceLine>
          <p className="pr-hint">Tomorrow’s outcomes are with Al-Wakil. Sleep with the night adhkar.</p>
          <div className="pr-actions"><Link className="qp-btn qp-btn-primary" to="/today">Done</Link></div>
        </section>
      </div>
    </>
  );

  return (
    <>
      <Toast message={toast.message} show={toast.show} />
      <TopBar title="Muhasabah" icon="nights_stay" />
      <div className="pr-page" ref={ref}>
        <Link to="/reflect" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Reflect</Link>
        <header className="pr-hero" data-rise>
          <h1 className="pr-h1">Account for the day. <span>Gently.</span></h1>
          <p className="pr-lede">“The wise one holds himself to account and works for what comes after death.”</p>
          <SourceLine>Jami at-Tirmidhi 2459 (hasan) · four stages: al-Ghazali, Ihya’</SourceLine>
          {run > 1 && <p className="pr-hint">{run} nights in a row.</p>}
        </header>

        <section className={`card prompt-card${evening ? '' : ' focus'}`} data-rise>
          <p className="flow-k">01 · Musharatah · morning</p>
          <label htmlFor="int">One intention for today</label>
          <input id="int" className="qp-input" value={m.intention} onChange={set('intention')} placeholder="Today I intend to…" />
          <p className="pr-hint">It shows on Today as your muraqabah reminder. <Cite source="Muraqabah: Sahih Muslim 8 — worship as if you see Him" /></p>
          {!evening && <button className="qp-btn qp-btn-primary" onClick={() => save(false)} disabled={!m.intention.trim()}>Set intention</button>}
        </section>

        <section className={`card prompt-card${evening ? ' focus' : ''}`} data-rise>
          <p className="flow-k">03 · Muhasabah · night</p>
          {m.intention && <p className="pr-hint">This morning you intended: “{m.intention}”</p>}
          <label htmlFor="well">What went well? <em>Alhamdulillah</em></label>
          <textarea id="well" className="qp-input qp-textarea" value={m.well} onChange={set('well')} />
          <label htmlFor="slip">Where did I slip — morally or with someone? <em>Astaghfirullah</em></label>
          <input id="slip" className="qp-input" value={m.slip} onChange={set('slip')} placeholder="One thing. Not a list." />
          <p className="pr-hint">One entry only: perfectionism about non-moral things is waswas, not muhasabah. <Cite source="al-Ghazali, Ihya’ [Nadrat al-Na’im, al-Muqaddima p. 77]" /></p>
          <label htmlFor="rel">What do I hand to Al-Wakil for tomorrow?</label>
          <input id="rel" className="qp-input" value={m.release} onChange={set('release')} />
          <button className="qp-btn qp-btn-primary" onClick={() => save(true)} disabled={!(m.well.trim() || m.slip.trim() || m.release.trim())}>Close the day</button>
        </section>

        {past.length > 1 && (
          <section className="reflect-group" data-rise>
            <h2 className="reflect-group-label">Past nights</h2>
            <div className="pr-spine">
              {past.filter((p) => p.date !== date).slice(0, 14).map((p) => (
                <div key={p.date} className="pr-row"><div className="pr-row-body" style={{ paddingTop: 16 }}>
                  <p className="pr-row-meta">{p.date}</p>
                  {p.intention && <p className="pr-hint">Intention: {p.intention}</p>}
                  {p.well && <p className="pr-hint">Shukr: {p.well}</p>}
                  {p.slip && <p className="pr-hint">Istighfar: {p.slip}</p>}
                  {p.release && <p className="pr-hint">Handed over: {p.release}</p>}
                </div></div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
