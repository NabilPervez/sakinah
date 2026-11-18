import { Link } from 'react-router-dom';
import type { ReframeCard } from '../../data/faith/reframeCards';

/** Compact card row used on Today, Reflect, SOS. */
export function CardRow({ card, label }: { card: ReframeCard; label?: string }) {
  return (
    <Link to={`/reflect/cards/${card.id}`} className="rc-row">
      <span className="rc-row-t">
        {label && <span className="rc-kicker">{label}</span>}
        <strong>{card.title}</strong>
        <span className="pr-hint">{card.situation}</span>
      </span>
      <span className="material-symbols-outlined pr-row-chev" aria-hidden="true">chevron_right</span>
    </Link>
  );
}

/** "What's the thought?" — tap the thought you're having to open its card (FR4). */
export function ThoughtMatch({ cards, title = 'What’s the thought?' }: { cards: ReframeCard[]; title?: string }) {
  if (!cards.length) return null;
  return (
    <section className="rc-match">
      <h2 className="reflect-group-label">{title}</h2>
      <ul>
        {cards.map((c) => (
          <li key={c.id}><Link to={`/reflect/cards/${c.id}`}>“{c.negative}”</Link></li>
        ))}
      </ul>
    </section>
  );
}
