import { useState } from 'react';
import TopBar from '../../components/TopBar';
import { useCards } from '../../hooks/useCards';
import { useCardStore } from '../../store/useCardStore';
import { CardRow } from '../../components/cards/CardBits';
import { useRise } from '../../components/faith/FaithUI';
import { saveCustomCard } from '../../data/db';
import '../../present.css';
import '../../faith.css';
import '../../cards.css';

const EMPTY = { title: '', situation: '', action: '', negative: '', positive: '', reward: '', textNote: '' };
const FIELDS: { k: keyof typeof EMPTY; label: string; long?: boolean }[] = [
  { k: 'title', label: 'Title' }, { k: 'situation', label: 'When does this happen?' },
  { k: 'action', label: 'Do this', long: true }, { k: 'negative', label: 'The heavy thought', long: true },
  { k: 'positive', label: 'The reframe', long: true }, { k: 'reward', label: 'Reward & why', long: true },
  { k: 'textNote', label: 'Verse or hadith (optional, with its source)', long: true },
];

/** Reflect › Reframe cards list + "write your own" (FR2, FR7). */
export default function CardsPage() {
  const { cards, reload } = useCards();
  const { pinned, hidden } = useCardStore();
  const [tag, setTag] = useState('all');
  const [form, setForm] = useState<typeof EMPTY | null>(null);
  const ref = useRise<HTMLDivElement>([cards.length]);
  const tags = ['all', ...Array.from(new Set(cards.flatMap((c) => c.tags)))];
  const shown = cards
    .filter((c) => tag === 'all' || c.tags.includes(tag))
    .sort((a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id)) || Number(hidden.includes(a.id)) - Number(hidden.includes(b.id)));

  const save = async () => {
    if (!form?.title.trim() || !form.positive.trim()) return;
    await saveCustomCard({ ...form, createdAt: Date.now() });
    setForm(null); reload();
  };

  return (
    <>
      <TopBar title="Reframe cards" icon="style" />
      <div className="pr-page" ref={ref}>
        <header className="pr-hero" data-rise>
          <h1 className="pr-h1">Name the moment. <span>Take the card.</span></h1>
          <p className="pr-lede">One action, one text, one reframe. Under 20 seconds.</p>
        </header>
        <div className="rc-tags" data-rise role="group" aria-label="Filter">
          {tags.map((t) => <button key={t} type="button" className={`rc-tag${tag === t ? ' on' : ''}`} aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>)}
        </div>
        <div className="rc-list" data-rise>
          {shown.map((c) => <CardRow key={c.id} card={c} label={pinned.includes(c.id) ? 'Pinned' : c.custom ? 'Your card' : hidden.includes(c.id) ? 'Hidden' : undefined} />)}
        </div>
        {!form ? (
          <button type="button" className="qp-btn qp-btn-ghost" data-rise onClick={() => setForm(EMPTY)}>
            <span className="material-symbols-outlined" aria-hidden="true">add</span> Write your own card
          </button>
        ) : (
          <section className="rc-form">
            {FIELDS.map((f) => (
              <label key={f.k}>
                <span>{f.label}</span>
                {f.long
                  ? <textarea rows={2} value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
                  : <input value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />}
              </label>
            ))}
            <div className="pr-actions">
              <button type="button" className="qp-btn qp-btn-primary" onClick={save} disabled={!form.title.trim() || !form.positive.trim()}>Save card</button>
              <button type="button" className="qp-btn qp-btn-ghost" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
