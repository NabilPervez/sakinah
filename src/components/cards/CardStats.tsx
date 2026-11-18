import { useEffect, useState } from 'react';

const now = () => Date.now();
import { Link } from 'react-router-dom';
import { getAllReframeUses, type ReframeUse } from '../../data/db';
import { useCards } from '../../hooks/useCards';

/** Progress: reframe-card uses in range, most-used card, avg heaviness drop (FR8). */
export default function CardStats({ days }: { days: number }) {
  const [uses, setUses] = useState<ReframeUse[]>([]);
  const [t] = useState(now);
  const { cards } = useCards();
  useEffect(() => { getAllReframeUses().then(setUses); }, []);
  const since = t - days * 86_400_000;
  const inRange = uses.filter((u) => u.at >= since);
  const counts = inRange.reduce<Record<string, number>>((a, u) => ({ ...a, [u.cardId]: (a[u.cardId] ?? 0) + 1 }), {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const pairs = inRange.filter((u) => u.before && u.after);
  const drop = pairs.length ? (pairs.reduce((s, u) => s + (u.before! - u.after!), 0) / pairs.length).toFixed(1) : '–';
  const topTitle = top ? cards.find((c) => c.id === top[0])?.title ?? '–' : '–';
  return (
    <section className="pg-tiles animate-fade-up" aria-label="Reframe cards">
      <div className="progress-stat"><span className="progress-stat-value">{inRange.length}</span><span className="progress-stat-label">Cards used</span></div>
      <div className="progress-stat"><span className="progress-stat-value">{drop}</span><span className="progress-stat-label">Avg lighter (1–5)</span></div>
      <Link to={top ? `/reflect/cards/${top[0]}` : '/reflect/cards'} className="progress-stat" style={{ textDecoration: 'none', gridColumn: 'span 1' }}>
        <span className="progress-stat-value" style={{ fontSize: 16 }}>{topTitle}</span><span className="progress-stat-label">Most used card</span>
      </Link>
    </section>
  );
}
