import { useCards } from '../../hooks/useCards';
import { useCardStore } from '../../store/useCardStore';
import { NIGHT_CARD_ID, isNight } from '../../data/faith/reframeCards';
import { CardRow } from './CardBits';

/** Today: the night card between 9 pm and 7 am, plus up to 2 pinned cards (FR6). */
export default function TodayCards() {
  const { cards } = useCards();
  const { pinned, hidden } = useCardStore();
  const night = isNight() && !hidden.includes(NIGHT_CARD_ID) ? cards.find((c) => c.id === NIGHT_CARD_ID) : undefined;
  const pins = cards.filter((c) => pinned.includes(c.id) && c.id !== night?.id && !hidden.includes(c.id));
  if (!night && !pins.length) return null;
  return (
    <section className="rc-today" aria-label="Reframe cards">
      {night && <CardRow card={night} label="Up in the night?" />}
      {pins.map((c) => <CardRow key={c.id} card={c} label="Pinned" />)}
    </section>
  );
}
