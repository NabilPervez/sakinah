import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import TopBar from '../../components/TopBar';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useRise } from '../../components/faith/FaithUI';
import { SIGNS } from '../../data/faith/faith';
import { getAllWeeklySigns, saveWeeklySigns, getAllDhikrLogs, getAllFears, getAllMuhasabah, type WeeklySigns } from '../../data/db';
import { getWeekStart } from '../../data/storyContent';
import '../../present.css';
import '../../faith.css';

/** Friday 6–8 week signs (gameplan Part II §7) + faith stats. */
export default function SignsPage() {
  const weekOf = getWeekStart();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [hist, setHist] = useState<WeeklySigns[]>([]);
  const [stats, setStats] = useState({ dhikr: 0, released: 0, nights: 0 });
  const { toast, showToast } = useToast();
  const ref = useRise<HTMLDivElement>();

  useEffect(() => {
    getAllWeeklySigns().then((h) => { setHist(h); const cur = h.find((x) => x.weekOf === weekOf); if (cur) setScores(cur.scores); });
    Promise.all([getAllDhikrLogs(), getAllFears(), getAllMuhasabah()]).then(([d, f, m]) =>
      setStats({ dhikr: d.reduce((a, x) => a + x.count, 0), released: f.filter((x) => x.status !== 'open').length, nights: m.filter((x) => x.well || x.slip || x.release).length }));
  }, [weekOf]);

  const save = async () => { await saveWeeklySigns({ weekOf, scores, createdAt: Date.now() }); setHist(await getAllWeeklySigns()); showToast('Week saved ✓'); };
  const data = hist.map((h) => {
    const avg = (g: string) => { const v = SIGNS.filter((s) => s.group === g).map((s) => h.scores[s.key]).filter(Boolean); return v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : null; };
    return { w: h.weekOf.slice(5), Islamic: avg('Islamic'), Practical: avg('Practical') };
  });

  return (
    <>
      <Toast message={toast.message} show={toast.show} />
      <TopBar title="Weekly signs" icon="trending_up" />
      <div className="pr-page" ref={ref}>
        <Link to="/progress" className="back-link"><span className="material-symbols-outlined">arrow_back</span>Progress</Link>
        <header className="pr-hero" data-rise>
          <h1 className="pr-h1">Six to eight weeks. <span>Watch the signs.</span></h1>
          <p className="pr-lede">Rate each from 1 (not yet) to 5 (clearly). Fridays.</p>
        </header>

        <div className="progress-stats" data-rise>
          <div className="progress-stat"><span className="progress-stat-value">{stats.dhikr}</span><span className="progress-stat-label">Dhikr counted</span></div>
          <div className="progress-stat"><span className="progress-stat-value">{stats.released}</span><span className="progress-stat-label">Fears prepped</span></div>
          <div className="progress-stat"><span className="progress-stat-value">{stats.nights}</span><span className="progress-stat-label">Muhasabah nights</span></div>
        </div>

        {data.length > 1 && (
          <div className="card progress-chart-card" data-rise>
            <div className="chart-legend"><span className="lg-a">Islamic</span><span className="lg-b">Practical</span></div>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <XAxis dataKey="w" tick={{ fontSize: 13 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[1, 5]} ticks={[1, 3, 5]} width={28} tick={{ fontSize: 13 }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Islamic" stroke="var(--accent-600)" strokeWidth={2} dot={false} connectNulls />
                  <Line type="monotone" dataKey="Practical" stroke="var(--accent-300)" strokeWidth={2} dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(['Islamic', 'Practical'] as const).map((g) => (
          <section key={g} className="reflect-group" data-rise>
            <h2 className="reflect-group-label">{g}</h2>
            <div className="pr-spine">
              {SIGNS.filter((s) => s.group === g).map((s) => (
                <div key={s.key} className="pr-row"><div className="pr-row-body" style={{ paddingTop: 16 }}>
                  <p className="pr-row-title">{s.title}</p>
                  <p className="pr-hint">{s.desc}</p>
                  <div className="qp-chips" role="group" aria-label={s.title}>
                    {[1, 2, 3, 4, 5].map((v) => <button key={v} className={`qp-chip${scores[s.key] === v ? ' active' : ''}`} aria-pressed={scores[s.key] === v} onClick={() => setScores({ ...scores, [s.key]: v })}>{v}</button>)}
                  </div>
                </div></div>
              ))}
            </div>
          </section>
        ))}
        <div className="pr-actions" data-rise><button className="qp-btn qp-btn-primary" onClick={save} disabled={!Object.keys(scores).length}>Save this week</button></div>
      </div>
    </>
  );
}
