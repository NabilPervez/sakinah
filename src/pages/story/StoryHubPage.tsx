import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import '../../present.css';

interface Row { to: string; title: string; meta: string; blurb: string }

/** Reflect — grouped by cadence: anytime, nightly, weekly on Fridays (Nabil, 2026-11-11). */
const isFriday = new Date().getDay() === 5;
const SECTIONS: { label: string; note?: string; rows: Row[] }[] = [
  {
    label: 'Anytime',
    rows: [
      { to: '/reflect/quick', title: 'Reframe it.', meta: '1 min', blurb: 'Turn what happened into the version that helps.' },
      { to: '/reflect/reframe', title: 'Guided reframe.', meta: '5 min', blurb: 'Rewrite one harsh thought into a merciful one.' },
    ],
  },
  {
    label: 'Nightly',
    rows: [
      { to: '/reflect/muhasabah', title: 'Muhasabah.', meta: '3 min', blurb: 'Morning intention, nightly review: shukr, istighfar, hand it over.' },
      { to: '/reflect/gratitude', title: 'Gratitude journal.', meta: '2 min', blurb: 'Three things from today, and why one mattered.' },
      { to: '/reflect/ledger', title: 'Effort ledger.', meta: '3 min', blurb: 'What I tried today, and what I hand to Allah.' },
    ],
  },
  {
    label: 'Weekly · Fridays',
    note: isFriday ? 'Today' : undefined,
    rows: [
      { to: '/reflect/pillars', title: 'Four pillars.', meta: '10 min', blurb: 'Community, purpose, charity, story.' },
    ],
  },
];

export default function StoryHubPage() {
  return (
    <>
      <TopBar title="Reflect" icon="auto_stories" />
      <div className="pr-page">
        <header className="pr-hero animate-fade-up">
          <h1 className="pr-h1">The story I choose. <span>Written down.</span></h1>
        </header>
        <ul className="reflect-anchor">
          <li>Allah is the Most Forgiving and the Most Kind.</li>
          <li>I don't need to be perfect — Allah is in control, I am not.</li>
          <li>I control my effort, my emotions and my outlook.</li>
        </ul>
        {SECTIONS.map((s, si) => (
          <section key={s.label} className="reflect-group">
            <h2 className="reflect-group-label">
              {s.label}{s.note && <span className="phase-now">{s.note}</span>}
            </h2>
            <nav className="pr-spine" aria-label={s.label}>
              {s.rows.map((r, ri) => {
                const n = SECTIONS.slice(0, si).reduce((a, x) => a + x.rows.length, 0) + ri + 1;
                return (
                  <Link key={r.to} to={r.to} className="pr-row reflect-link">
                    <span className="pr-row-head" style={{ alignItems: 'flex-start' }}>
                      <span className="pr-row-n">0{n}</span>
                      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
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
