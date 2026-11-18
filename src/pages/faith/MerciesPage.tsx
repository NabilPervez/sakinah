import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { SourceLine, useRise } from '../../components/faith/FaithUI';
import { addMercy, deleteMercy, getMercies, type Mercy } from '../../data/db';
import '../../present.css';
import '../../faith.css';

/** Mercies journal — Fear and Hope, Iḥyā' Book 33 (PRD v3.2 FR4). */
export default function MerciesPage() {
  const [list, setList] = useState<Mercy[]>([]);
  const [text, setText] = useState('');
  const [shown, setShown] = useState<Mercy | null>(null);
  const ref = useRise<HTMLDivElement>();
  const load = () => getMercies().then(setList);
  useEffect(() => { load(); }, []);
  const add = async () => { if (!text.trim()) return; await addMercy(text.trim()); setText(''); load(); };
  const showOne = () => {
    if (!list.length) return;
    const pool = list.length > 1 ? list.filter((m) => m.id !== shown?.id) : list;
    setShown(pool[Math.floor(Math.random() * pool.length)]);
  };

  return (
    <>
      <TopBar title="Mercies" icon="volunteer_activism" />
      <div className="pr-page" ref={ref}>
        <Link to="/faith" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Faith</Link>
        <header className="pr-hero" data-rise>
          <h1 className="pr-h1">He came through before. <span>Write it down.</span></h1>
          <p className="pr-lede">When dread runs ahead of you, hope needs evidence. Keep a record of times Allah rescued, provided or eased things for you.</p>
          <SourceLine>Fear and hope as two wings: al-Ghazali, Iḥyā’, Book 33 · composed summary</SourceLine>
        </header>

        <section className="card prompt-card focus" data-rise>
          <p className="flow-k">Anxious right now?</p>
          <button className="qp-btn qp-btn-primary" onClick={showOne} disabled={!list.length}>Show me one</button>
          {shown && <p className="pr-lede" style={{ marginTop: 12 }}>“{shown.text}”</p>}
          {!list.length && <p className="pr-hint">Add your first mercy below.</p>}
        </section>

        <section className="card prompt-card" data-rise>
          <label className="flow-k" htmlFor="mercy">Add a mercy</label>
          <textarea id="mercy" className="qp-input" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="The time when…" />
          <button className="qp-btn qp-btn-primary" onClick={add} disabled={!text.trim()}>Save</button>
        </section>

        {list.length > 0 && (
          <section className="reflect-group" data-rise>
            <h2 className="reflect-group-label">{list.length} {list.length === 1 ? 'mercy' : 'mercies'}</h2>
            <div className="pr-spine">
              {list.map((m) => (
                <div key={m.id} className="pr-row"><div className="pr-row-head" style={{ alignItems: 'flex-start' }}>
                  <span className="pr-hint" style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>{m.text}</span>
                  <button type="button" aria-label="Delete" onClick={() => m.id && deleteMercy(m.id).then(load)} style={{ background: 'none', border: 0, color: 'var(--ink-2)', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div></div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
