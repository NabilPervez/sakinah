import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '../../components/TopBar';
import { Arabic, SourceLine, useRise } from '../../components/faith/FaithUI';
import { useCards } from '../../hooks/useCards';
import { useCardStore, MAX_PINS } from '../../store/useCardStore';
import { ANCHOR_NAMES } from '../../data/faith/faith';
import { bookForTags } from '../../data/faith/munjiyat';
import { addReframeUse, deleteCustomCard } from '../../data/db';
import { getTodayDateString } from '../../store/useAppStore';
import '../../present.css';
import '../../faith.css';
import '../../cards.css';

const stamp = () => Date.now();
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Scale({ label, value, onChange }: { label: string; value?: number; onChange: (n: number) => void }) {
  return (
    <div className="rc-scale" role="group" aria-label={label}>
      <span>{label}</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" aria-pressed={value === n} className={value === n ? 'on' : ''} onClick={() => onChange(n)}>{n}</button>
      ))}
    </div>
  );
}

/** One card: Do this → Text → Reframe → Reward, then "I've set my intention" (FR3, FR5). */
export default function CardDetailPage() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const { cards } = useCards();
  const { pinned, hidden, togglePin, toggleHidden } = useCardStore();
  const card = cards.find((c) => c.id === id);
  const [revealed, setRevealed] = useState(false);
  const [before, setBefore] = useState<number>();
  const [after, setAfter] = useState<number>();
  const [done, setDone] = useState(false);
  const posRef = useRef<HTMLParagraphElement>(null);
  const ref = useRise<HTMLDivElement>([!!card]);

  if (!card) return (<><TopBar title="Card" icon="style" /><div className="pr-page"><p className="pr-lede">Loading…</p><Link to="/reflect/cards">All cards</Link></div></>);
  const anchor = ANCHOR_NAMES.find((a) => a.key === card.anchorName);
  const book = bookForTags(card.tags);

  const reveal = () => {
    setRevealed(true);
    requestAnimationFrame(() => {
      if (posRef.current && !reduced()) gsap.from(posRef.current, { y: 8, opacity: 0, duration: 0.3, ease: 'expo.out', clearProps: 'all' });
    });
  };
  const commit = async () => {
    await addReframeUse({ cardId: card.id, at: stamp(), date: getTodayDateString(), before, after });
    if ('vibrate' in navigator) navigator.vibrate(20);
    setDone(true);
  };

  return (
    <>
      <TopBar title="Reframe card" icon="style" />
      <div className="pr-page rc-detail" ref={ref}>
        <header className="pr-hero" data-rise>
          <p className="rc-kicker">{card.situation}</p>
          <h1 className="pr-h1">{card.title}</h1>
        </header>

        <section className="rc-sec" data-rise>
          <h2 className="rc-label">01 · Do this</h2>
          <p className="rc-body">{card.action}</p>
        </section>

        {(card.text.arabic || card.text.translation) && (
          <section className="rc-sec" data-rise>
            <h2 className="rc-label">02 · {card.text.kind === 'quran' ? 'The verse' : 'The hadith'}</h2>
            {card.text.arabic && <Arabic>{card.text.arabic}</Arabic>}
            <p className="rc-body">{card.text.arabic ? `“${card.text.translation}”` : card.text.translation}</p>
            {card.text.source && <SourceLine>{card.text.source}</SourceLine>}
            {card.support && <p className="pr-hint">“{card.support.text}” <span className="rc-src">{card.support.source}</span></p>}
            {card.scholarRefs && <p className="rc-src">Commentary: {card.scholarRefs.join(' · ')}</p>}
          </section>
        )}

        <section className="rc-sec" data-rise>
          <h2 className="rc-label">03 · Reframe</h2>
          <p className={`rc-neg${revealed ? ' gone' : ''}`}>{card.negative}</p>
          {revealed
            ? <p ref={posRef} className="rc-pos">{card.positive}</p>
            : <button type="button" className="qp-btn qp-btn-ghost" onClick={reveal}>Turn it</button>}
          {anchor && <Link to="/faith/names" className="rc-chip">{anchor.name} · {anchor.title}</Link>}
          {book && <Link to={`/faith/deliverances?id=${book.id}`} className="rc-chip">Deliverance · {book.title}</Link>}
        </section>

        <section className="rc-sec" data-rise>
          <h2 className="rc-label">04 · Reward & why</h2>
          <p className="rc-body">{card.reward}</p>
        </section>

        <section className="rc-commit" data-rise>
          {!done ? (
            <>
              <Scale label="Heaviness now" value={before} onChange={setBefore} />
              {revealed && <Scale label="After" value={after} onChange={setAfter} />}
              <button type="button" className="qp-btn qp-btn-primary rc-cta" onClick={commit}>I’ve set my intention</button>
            </>
          ) : (
            <>
              <p className="rc-pos">Done. May Allah accept it.</p>
              <button type="button" className="qp-btn qp-btn-ghost" onClick={() => nav(-1)}>Back</button>
            </>
          )}
        </section>

        <div className="rc-tools">
          <button type="button" className="qp-btn qp-btn-ghost" onClick={() => togglePin(card.id)}>
            {pinned.includes(card.id) ? 'Unpin from Today' : `Pin to Today${pinned.length >= MAX_PINS ? ' (replaces oldest)' : ''}`}
          </button>
          <button type="button" className="qp-btn qp-btn-ghost" onClick={() => toggleHidden(card.id)}>{hidden.includes(card.id) ? 'Show card' : 'Hide card'}</button>
          {card.custom && (
            <button type="button" className="qp-btn qp-btn-ghost" onClick={async () => { await deleteCustomCard(Number(card.id.slice(1))); nav('/reflect/cards'); }}>Delete</button>
          )}
        </div>
      </div>
    </>
  );
}
