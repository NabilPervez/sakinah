import { useEffect, useState } from 'react';
import { REFRAME_CARDS, type ReframeCard } from '../data/faith/reframeCards';
import { getCustomCards, type CustomCard } from '../data/db';

export const customToCard = (c: CustomCard): ReframeCard => ({
  id: `c${c.id}`, title: c.title, situation: c.situation, tags: ['yours'], action: c.action,
  text: { arabic: '', translation: c.textNote, source: '', kind: 'quran' },
  negative: c.negative, positive: c.positive, reward: c.reward, custom: true,
});

/** Built-in cards plus the user's own. */
export function useCards() {
  const [custom, setCustom] = useState<CustomCard[]>([]);
  const reload = () => getCustomCards().then(setCustom);
  useEffect(() => { reload(); }, []);
  return { cards: [...REFRAME_CARDS, ...custom.map(customToCard)], custom, reload };
}
