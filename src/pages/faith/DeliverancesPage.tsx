import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { SourceLine, useRise } from '../../components/faith/FaithUI';
import { DELIVERANCES, weekBook } from '../../data/faith/munjiyat';
import '../../present.css';
import '../../faith.css';

/** The Deliverances — Iḥyā' Book 4 as one path through the app (PRD v3.2 FR2). */
export default function DeliverancesPage() {
  const [params] = useSearchParams();
  const week = weekBook();
  const [open, setOpen] = useState<string | null>(params.get('id') ?? week.id);
  const ref = useRise<HTMLDivElement>();
  return (
    <>
      <TopBar title="Deliverances" icon="spa" />
      <div className="pr-page" ref={ref}>
        <Link to="/faith" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Faith</Link>
        <header className="pr-hero" data-rise>
          <h1 className="pr-h1">Ten ways the heart is saved. <span>One a week.</span></h1>
          <p className="pr-lede">The fourth quarter of al-Ghazali’s Iḥyā’, the Munjiyāt, each book matched to a tool here.</p>
          <SourceLine>Titles from the Iḥyā’, books 31–40 · summaries are composed, inspired by the text</SourceLine>
        </header>

        <section className="faith-today" data-rise style={{ gridTemplateColumns: '1fr' }}>
          <button type="button" className="faith-tile accent" style={{ textAlign: 'left', border: 0, font: 'inherit', cursor: 'pointer' }} onClick={() => setOpen(week.id)}>
            <span className="faith-tile-k">This week · Book {week.n} of 10</span>
            <span className="faith-tile-v">{week.title}</span>
            <span className="faith-tile-s">{week.practice}</span>
          </button>
        </section>

        <section className="reflect-group" data-rise>
          <h2 className="reflect-group-label">All ten</h2>
          <div className="pr-spine">
            {DELIVERANCES.map((d) => {
              const isOpen = open === d.id;
              return (
                <div key={d.id} className="pr-row">
                  <button type="button" className="pr-row-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : d.id)}
                    style={{ width: '100%', background: 'none', border: 0, font: 'inherit', color: 'inherit', textAlign: 'left', cursor: 'pointer', alignItems: 'flex-start' }}>
                    <span className="pr-row-n">{String(d.n).padStart(2, '0')}</span>
                    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="pr-row-title">{d.title}</span>
                      <span className="pr-hint">{d.translit}</span>
                    </span>
                    <span className="material-symbols-outlined pr-row-chev" aria-hidden="true">{isOpen ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {isOpen && (
                    <div className="pr-row-body" style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
                      <p className="pr-hint"><strong>When</strong> · {d.problem}</p>
                      <p className="pr-hint"><strong>Lens</strong> · {d.lens}</p>
                      <p className="pr-hint"><strong>Practice</strong> · {d.practice}</p>
                      <SourceLine>{d.source} · composed summary</SourceLine>
                      <div className="pr-actions"><Link className="qp-btn qp-btn-primary" to={d.tool.to}>Practise it · {d.tool.label}</Link></div>
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
