import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { Arabic, SourceLine, useRise } from '../../components/faith/FaithUI';
import { GAMEPLAN_DUAS, NEEDS, NEED_DUAS, NEED_DUA_NOTE } from '../../data/faith/faith';
import '../../present.css';
import '../../faith.css';

/**
 * Du'a library (PRD F3). Narrated gameplan du'as first, then Du'a by Need
 * from the name-and-need-duaa-discovery-tool repo (116 composed du'as, labelled as such).
 */
export default function DuasPage() {
  const [params] = useSearchParams();
  const [need, setNeed] = useState(params.get('need') ?? 'Anxiety');
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRise<HTMLDivElement>([need]);
  const list = useMemo(() => NEED_DUAS.filter((d) => d.intents.includes(need)), [need]);

  return (
    <>
      <TopBar title="Du’as" icon="volunteer_activism" />
      <div className="pr-page" ref={ref}>
        <Link to="/faith" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Faith</Link>
        <header className="pr-hero" data-rise>
          <h1 className="pr-h1">Ask Him. <span>By name, for what you need.</span></h1>
        </header>

        <section className="reflect-group" data-rise>
          <h2 className="reflect-group-label">From the Sunnah</h2>
          <div className="pr-spine">
            {GAMEPLAN_DUAS.map((d, i) => (
              <div key={d.id} className={`pr-row${open === d.id ? ' open' : ''}`}>
                <button className="pr-row-head" aria-expanded={open === d.id} onClick={() => setOpen(open === d.id ? null : d.id)}>
                  <span className="pr-row-n">0{i + 1}</span>
                  <span className="pr-row-title">{d.title}</span>
                  <span className="material-symbols-outlined pr-row-chev" aria-hidden="true">expand_more</span>
                </button>
                {open === d.id && (
                  <div className="pr-row-body">
                    <Arabic>{d.arabic}</Arabic>
                    <p className="pr-row-title">{d.transliteration}</p>
                    <p className="pr-lede">{d.translation}</p>
                    <p className="pr-hint"><strong>When:</strong> {d.when}</p>
                    <SourceLine>{d.source}</SourceLine>
                    <Link className="qp-btn qp-btn-ghost" to={`/faith/dhikr?id=${d.id}`}>Count it</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="reflect-group" data-rise>
          <h2 className="reflect-group-label">By what I feel</h2>
          <div className="qp-chips" role="group" aria-label="Needs">
            {NEEDS.map((n) => <button key={n} className={`qp-chip${n === need ? ' active' : ''}`} aria-pressed={n === need} onClick={() => setNeed(n)}>{n}</button>)}
          </div>
          <p className="pr-hint" style={{ marginTop: 12 }}>{list.length} Names for “{need}”. These are composed du’as that call on a Name — not narrated texts.</p>
          <div className="pr-spine" style={{ marginTop: 8 }}>
            {list.map((d) => {
              const k = `n${d.id}`;
              return (
                <div key={k} className={`pr-row${open === k ? ' open' : ''}`}>
                  <button className="pr-row-head" aria-expanded={open === k} onClick={() => setOpen(open === k ? null : k)}>
                    <span className="pr-row-title" style={{ flex: 1 }}>{d.name}</span>
                    <span className="pr-row-meta">{d.meaning}</span>
                    <span className="material-symbols-outlined pr-row-chev" aria-hidden="true">expand_more</span>
                  </button>
                  {open === k && (
                    <div className="pr-row-body">
                      {d.meaningBlocks.map((m, i) => <p key={i} className="pr-hint">{m}</p>)}
                      <p className="pr-lede need-dua">{d.dua}</p>
                      <SourceLine>{NEED_DUA_NOTE.source}</SourceLine>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
