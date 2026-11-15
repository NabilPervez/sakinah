import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { Arabic, SourceLine, useRise } from '../../components/faith/FaithUI';
import { ANCHOR_NAMES, NAMES_99 } from '../../data/faith/faith';
import '../../present.css';
import '../../faith.css';

/** Names of Allah — 5 anchor Names (gameplan) + all 99 (learnthenamesofallah repo). */
export default function NamesPage() {
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<number | null>(() => Number(params.get('id')) || null);
  const [anchor, setAnchor] = useState<string | null>(ANCHOR_NAMES[0].key);
  const audio = useRef<HTMLAudioElement | null>(null);
  const ref = useRise<HTMLDivElement>();
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? NAMES_99.filter((n) => `${n.transliteration} ${n.meaning}`.toLowerCase().includes(s)) : NAMES_99;
  }, [q]);

  const play = (url: string) => { audio.current?.pause(); audio.current = new Audio(url); audio.current.play().catch(() => {}); };

  return (
    <>
      <TopBar title="Names of Allah" icon="star" />
      <div className="pr-page" ref={ref}>
        <Link to="/faith" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Faith</Link>
        <header className="pr-hero" data-rise>
          <h1 className="pr-h1">Know Him by name. <span>Call Him by name.</span></h1>
          <p className="pr-lede">“To Allah belong the best names, so invoke Him by them.”</p>
          <SourceLine>Qur’an 7:180</SourceLine>
        </header>

        <section className="reflect-group" data-rise>
          <h2 className="reflect-group-label">Anchor Names for my struggles</h2>
          <div className="pr-spine">
            {ANCHOR_NAMES.map((a, i) => (
              <div key={a.key} className={`pr-row${anchor === a.key ? ' open' : ''}`}>
                <button className="pr-row-head" aria-expanded={anchor === a.key} onClick={() => setAnchor(anchor === a.key ? null : a.key)}>
                  <span className="pr-row-n">0{i + 1}</span>
                  <span className="pr-row-title" style={{ flex: 1 }}>{a.name}</span>
                  <span className="pr-row-meta">{a.title}</span>
                  <span className="material-symbols-outlined pr-row-chev" aria-hidden="true">expand_more</span>
                </button>
                {anchor === a.key && (
                  <div className="pr-row-body">
                    <p className="pr-lede">{a.meaning}</p>
                    <p className="pr-hint"><strong>For:</strong> {a.struggle}</p>
                    <p className="pr-hint"><strong>Why it works:</strong> {a.mechanism}</p>
                    <SourceLine>{a.source}</SourceLine>
                    <Link className="qp-btn qp-btn-ghost" to={`/faith/dhikr?id=${a.key === 'wakil' ? 'hasbunallah' : a.key === 'salam' ? 'as-salam' : 'lailahaillallah'}`}>Dhikr</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="reflect-group" data-rise>
          <h2 className="reflect-group-label">All 99</h2>
          <input className="qp-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a name or meaning" aria-label="Search Names" />
          <div className="pr-spine" style={{ marginTop: 12 }}>
            {list.map((n) => (
              <div key={n.id} className={`pr-row${open === n.id ? ' open' : ''}`}>
                <button className="pr-row-head" aria-expanded={open === n.id} onClick={() => setOpen(open === n.id ? null : n.id)}>
                  <span className="pr-row-n">{String(n.id).padStart(2, '0')}</span>
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                    <span className="pr-row-title">{n.transliteration}</span>
                    <span className="pr-hint">{n.meaning}</span>
                  </span>
                  <span className="name-ar" dir="rtl" lang="ar">{n.arabic}</span>
                </button>
                {open === n.id && (
                  <div className="pr-row-body">
                    <p className="pr-lede">{n.explanation}</p>
                    {n.verse && (
                      <blockquote className="evidence">
                        <Arabic>{n.verse.arabic}</Arabic>
                        <p>“{n.verse.english}”</p>
                        <SourceLine>Qur’an {n.verse.citation}</SourceLine>
                      </blockquote>
                    )}
                    {n.hadith && (
                      <blockquote className="evidence">
                        {n.hadith.arabic && <Arabic>{n.hadith.arabic}</Arabic>}
                        <p>“{n.hadith.english}”</p>
                        <SourceLine>{n.hadith.reference ?? n.hadith.topic ?? 'Hadith'}</SourceLine>
                      </blockquote>
                    )}
                    <button className="qp-btn qp-btn-ghost" onClick={() => play(n.audioUrl)}><span className="material-symbols-outlined" aria-hidden="true">volume_up</span>Listen</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
