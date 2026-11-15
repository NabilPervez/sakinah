import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Arabic, Cite, Counter, SourceLine, useRise } from '../../components/faith/FaithUI';
import { addFear, addDhikrLog, getAllFears, updateFear, type Fear } from '../../data/db';
import { getTodayDateString } from '../../store/useAppStore';
import '../../present.css';
import '../../faith.css';

/**
 * Tie your camel — Fear → Prep → Tawakkul (PRD F1).
 * Merges therapy takeaway (prep beats worry) with Tirmidhi 2517 and al-Ghazali's means.
 * Nabil, 2026-11-15: ≤ 60s, no typing beyond the fear line + optional steps.
 */
export default function CamelPage() {
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  const [prep, setPrep] = useState<string[]>(['']);
  const [release, setRelease] = useState('');
  const [spouse, setSpouse] = useState(false);
  const [fears, setFears] = useState<Fear[]>([]);
  const { toast, showToast } = useToast();
  const ref = useRise<HTMLDivElement>([step]);

  useEffect(() => { getAllFears().then(setFears); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const save = async () => {
    const steps = prep.map((p) => p.trim()).filter(Boolean).map((t) => ({ text: t, done: false }));
    await addFear({ text: text.trim(), prepSteps: steps, released: release.trim() ? [release.trim()] : [], spouseFlag: spouse, status: steps.length ? 'open' : 'released', createdAt: Date.now(), date: getTodayDateString() });
    setFears(await getAllFears());
    setStep(3);
  };
  const reset = () => { setStep(0); setText(''); setPrep(['']); setRelease(''); setSpouse(false); };

  const toggleStep = async (f: Fear, i: number) => {
    const prepSteps = f.prepSteps.map((s, j) => (j === i ? { ...s, done: !s.done } : s));
    const status = prepSteps.every((s) => s.done) ? 'prepped' : 'open';
    await updateFear(f.id!, { prepSteps, status });
    setFears(await getAllFears());
  };
  const releaseFear = async (f: Fear) => { await updateFear(f.id!, { status: 'released' }); setFears(await getAllFears()); showToast('Handed to Al-Wakil ✓'); };

  return (
    <>
      <Toast message={toast.message} show={toast.show} />
      <TopBar title="Tie your camel" icon="anchor" />
      <div className="pr-page" ref={ref}>
        <Link to="/faith" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Faith</Link>

        {step === 0 && (
          <section className="flow" data-rise>
            <h1 className="pr-h1">Name the fear. <span>Just one line.</span></h1>
            <input className="qp-input" autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="I’m afraid that…" aria-label="The fear" />
            <div className="pr-actions"><button className="qp-btn qp-btn-primary" disabled={!text.trim()} onClick={() => setStep(1)}>Next</button></div>
            <blockquote className="evidence">
              <Arabic>اعْقِلْهَا وَتَوَكَّلْ</Arabic>
              <p>“Tie her, and trust in Allah.”</p>
              <SourceLine>Jami at-Tirmidhi 2517 (hasan)</SourceLine>
            </blockquote>
          </section>
        )}

        {step === 1 && (
          <section className="flow" data-rise>
            <p className="flow-k">Step 2 of 3 · In my control</p>
            <h1 className="pr-h1">Tie the camel. <span>What can I prepare?</span></h1>
            <p className="pr-hint">“{text}”</p>
            {prep.map((p, i) => (
              <input key={i} className="qp-input" value={p} placeholder={i === 0 ? 'One concrete prep step…' : 'Another step (optional)'} aria-label={`Prep step ${i + 1}`}
                onChange={(e) => { const next = prep.map((x, j) => (j === i ? e.target.value : x)); if (i === prep.length - 1 && e.target.value && prep.length < 5) next.push(''); setPrep(next); }} />
            ))}
            <label className="flow-check"><input type="checkbox" checked={spouse} onChange={(e) => setSpouse(e.target.checked)} /> Bring this to my wife, with a plan</label>
            <p className="pr-hint">Definite and probable means are yours to take. Illusory means — hyper-control, micro-managing what can’t be managed — are to be dropped. <Cite source="al-Ghazali, Ihya’, Kitab al-Tawhid wa al-Tawakkul" /></p>
            <div className="pr-actions">
              <button className="qp-btn qp-btn-ghost" onClick={() => setStep(0)}>Back</button>
              <button className="qp-btn qp-btn-primary" onClick={() => setStep(2)}>Next</button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="flow" data-rise>
            <p className="flow-k">Step 3 of 3 · Allah’s</p>
            <h1 className="pr-h1">Hand over the outcome. <span>It was never mine.</span></h1>
            <input className="qp-input" value={release} onChange={(e) => setRelease(e.target.value)} placeholder="The part I can’t control is…" aria-label="Outcome to release" />
            <blockquote className="evidence">
              <Arabic>فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ</Arabic>
              <p>“When you have decided, rely upon Allah. Indeed, Allah loves those who rely upon Him.”</p>
              <SourceLine>Qur’an 3:159</SourceLine>
            </blockquote>
            <p className="pr-lede">Say it seven times.</p>
            <Arabic size="lg">حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ</Arabic>
            <p className="pr-hint">Hasbunallahu wa ni’mal-Wakil — “Sufficient for us is Allah, and He is the best Disposer of affairs.” <Cite source="Qur’an 3:173; Sahih al-Bukhari 4563" /></p>
            <Counter target={7} label="Hasbunallah" onComplete={(c) => addDhikrLog({ dhikrId: 'hasbunallah', count: c, target: 7, at: Date.now(), date: getTodayDateString() })} />
            <div className="pr-actions">
              <button className="qp-btn qp-btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="qp-btn qp-btn-primary" onClick={save}>Done</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="flow" data-rise>
            <h1 className="pr-h1">Camel tied. <span>Outcome handed over.</span></h1>
            <p className="pr-lede">Your prep steps are on Today until you check them off.</p>
            <div className="pr-actions">
              <Link className="qp-btn qp-btn-primary" to="/today">Go to Today</Link>
              <button className="qp-btn qp-btn-ghost" onClick={reset}>Another fear</button>
            </div>
          </section>
        )}

        {step === 0 && fears.length > 0 && (
          <section className="reflect-group" data-rise>
            <h2 className="reflect-group-label">My fears</h2>
            <div className="pr-spine">
              {fears.slice(0, 20).map((f) => (
                <div key={f.id} className="pr-row">
                  <div className="pr-row-body" style={{ paddingTop: 16 }}>
                    <p className="fear-head"><span className={`fear-status ${f.status}`}>{f.status}</span>{f.spouseFlag && <span className="fear-status">with my wife</span>}</p>
                    <p className="pr-row-title" style={{ margin: '4px 0 8px' }}>{f.text}</p>
                    {f.prepSteps.map((s, i) => (
                      <label key={i} className="flow-check"><input type="checkbox" checked={s.done} onChange={() => toggleStep(f, i)} /> {s.text}</label>
                    ))}
                    {f.released.map((r, i) => <p key={i} className="pr-hint">Handed over: {r}</p>)}
                    {f.status !== 'released' && <button className="qp-btn qp-btn-ghost" style={{ marginTop: 8 }} onClick={() => releaseFear(f)}>Release to Al-Wakil</button>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
