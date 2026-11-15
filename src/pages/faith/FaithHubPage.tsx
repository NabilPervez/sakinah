import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { Arabic, SourceLine, useRise } from '../../components/faith/FaithUI';
import { ANCHOR_NAMES, NAMES_99, PASSAGES, QURAN_WEEK, dayIndex } from '../../data/faith/faith';
import '../../present.css';
import '../../faith.css';

interface Row { to: string; title: string; meta: string; blurb: string }
const SECTIONS: { label: string; rows: Row[] }[] = [
  { label: 'In the moment', rows: [
    { to: '/faith/camel', title: 'Tie your camel.', meta: '1 min', blurb: 'Turn a fear into prep steps, then hand the rest to Allah.' },
    { to: '/faith/dhikr', title: 'Dhikr.', meta: 'Counter', blurb: 'Tasbih counter with the core adhkar and the Names.' },
    { to: '/faith/duas', title: 'Du’a by need.', meta: '120 du’as', blurb: 'The gameplan du’as, plus a du’a for what you feel right now.' },
  ] },
  { label: 'Daily', rows: [
    { to: '/reflect/muhasabah', title: 'Muhasabah.', meta: '3 min', blurb: 'Morning intention, nightly review — al-Ghazali’s four stages.' },
    { to: '/faith/quran', title: 'Qur’an plan.', meta: '15 min', blurb: 'Today’s passage and why it fits.' },
    { to: '/faith/names', title: 'Names of Allah.', meta: '99', blurb: 'Five anchor Names for your struggles, and all 99.' },
  ] },
  { label: 'Understand the why', rows: [
    { to: '/faith/shifts', title: 'Mindset shifts.', meta: '5', blurb: 'From → To, with the text behind each.' },
    { to: '/faith/study', title: 'Study.', meta: '6 lessons', blurb: 'Fear, tawakkul, qadr, muhasabah, presence, husn al-dhann.' },
    { to: '/faith/home', title: 'Akhlaq & routine.', meta: 'Home', blurb: 'Gentleness, marriage, and the prayer-anchored day.' },
  ] },
];

/** Faith tab (Mutma'innah v3). Nabil, 2026-11-15: faith gets its own tab AND is woven everywhere. */
export default function FaithHubPage() {
  const ref = useRise<HTMLDivElement>();
  const anchor = ANCHOR_NAMES[dayIndex(ANCHOR_NAMES.length)];
  const name = NAMES_99[dayIndex(NAMES_99.length)];
  const passage = PASSAGES[QURAN_WEEK[new Date().getDay()]];
  let n = 0;
  return (
    <>
      <TopBar title="Faith" icon="mosque" />
      <div className="pr-page" ref={ref}>
        <header className="pr-hero" data-rise>
          <h1 className="pr-h1">The soul at rest. <span>Built daily.</span></h1>
          <Arabic>يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ</Arabic>
          <p className="pr-lede">“O soul at rest, return to your Lord, well-pleased and pleasing.”</p>
          <SourceLine>Qur’an 89:27–28</SourceLine>
        </header>

        <section className="faith-today" data-rise>
          <Link to="/faith/names" className="faith-tile accent">
            <span className="faith-tile-k">Anchor Name</span>
            <span className="faith-tile-v">{anchor.name}</span>
            <span className="faith-tile-s">{anchor.struggle}</span>
          </Link>
          <Link to={`/faith/names?id=${name.id}`} className="faith-tile">
            <span className="faith-tile-k">Name of the day</span>
            <span className="faith-tile-ar" dir="rtl" lang="ar">{name.arabic}</span>
            <span className="faith-tile-s">{name.transliteration} · {name.meaning}</span>
          </Link>
          <Link to="/faith/quran" className="faith-tile">
            <span className="faith-tile-k">Today’s Qur’an</span>
            <span className="faith-tile-v">{passage.title}</span>
            <span className="faith-tile-s">{passage.ref}</span>
          </Link>
        </section>

        {SECTIONS.map((s) => (
          <section key={s.label} className="reflect-group" data-rise>
            <h2 className="reflect-group-label">{s.label}</h2>
            <nav className="pr-spine" aria-label={s.label}>
              {s.rows.map((r) => {
                n += 1;
                return (
                  <Link key={r.to} to={r.to} className="pr-row reflect-link">
                    <span className="pr-row-head" style={{ alignItems: 'flex-start' }}>
                      <span className="pr-row-n">{String(n).padStart(2, '0')}</span>
                      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="pr-row-title">{r.title}</span>
                        <span className="pr-hint">{r.blurb}</span>
                      </span>
                      <span className="pr-row-meta">{r.meta}</span>
                      <span className="material-symbols-outlined pr-row-chev" aria-hidden="true">chevron_right</span>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </section>
        ))}
      </div>
    </>
  );
}
