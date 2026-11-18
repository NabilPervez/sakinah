import { Link } from 'react-router-dom';
import '../faith.css';
import { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import TopBar from '../components/TopBar';
import CardStats from '../components/cards/CardStats';
import {
  db, type CheckIn, type ChecklistDay, type PracticeSession, type Reframe, type EffortNight, type PillarWeek,
  type DistractionReset, type Judgment, type QuickReframe, type GratitudeNight,
} from '../data/db';
import { CHECKLIST_TASKS, TASKS_BY_PHASE, PHASE_META, type Phase } from '../data/checklist';
import { today as ymd, streak } from './present/presentUtils';
import { getWeekStart } from '../data/storyContent';

/** Progress — every data source in the app, each with a fitting chart (Nabil, 2026-11-11). */

const C = { deep: '#1b2f52', mid: '#2e4f86', soft: '#5f7fb3', pale: '#c5d2e6', warm: '#b08a5a', ink2: '#6b6b6b', grid: '#e7e7e7' };
const SERIES = [C.deep, C.soft, C.warm, C.pale, C.mid, C.ink2];
const PHASES: Phase[] = ['morning', 'afternoon', 'evening'];
const tip = { contentStyle: { background: '#fff', border: `1px solid ${C.grid}`, borderRadius: 8, fontSize: 13 } };
const axis = { tickLine: false, axisLine: false, tick: { fontSize: 11, fill: C.ink2 } } as const;

interface Data {
  days: ChecklistDay[]; checkIns: CheckIn[]; sessions: PracticeSession[]; reframes: Reframe[]; efforts: EffortNight[];
  pillars: PillarWeek[]; resets: DistractionReset[]; judgments: Judgment[]; quick: QuickReframe[]; gratitude: GratitudeNight[];
}

function daysBack(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); out.push(ymd(d)); }
  return out;
}
const short = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString([], { month: 'short', day: 'numeric' }); };
const avg = (a: number[]) => (a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 10) / 10 : null);

function Card({ icon, title, sub, children }: { icon: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="card progress-chart-card animate-fade-up">
      <div className="section-header" style={{ marginBottom: sub ? 2 : '0.75rem' }}>
        <span className="material-symbols-outlined">{icon}</span>
        <h3 className="section-title">{title}</h3>
      </div>
      {sub && <p className="pg-sub">{sub}</p>}
      {children}
    </section>
  );
}
const Empty = ({ text }: { text: string }) => <p className="pg-empty">{text}</p>;

export default function AnalyticsPage() {
  const [data, setData] = useState<Data | null>(null);
  const [range, setRange] = useState<7 | 30>(7);

  useEffect(() => {
    Promise.all([
      db.checklistDays.toArray(), db.checkIns.toArray(), db.practiceSessions.toArray(), db.reframes.toArray(), db.efforts.toArray(),
      db.pillarWeeks.toArray(), db.distractionResets.toArray(), db.judgments.toArray(), db.quickReframes.toArray(), db.gratitudes.toArray(),
    ]).then(([days, checkIns, sessions, reframes, efforts, pillars, resets, judgments, quick, gratitude]) =>
      setData({ days, checkIns, sessions, reframes, efforts, pillars, resets, judgments, quick, gratitude }));
  }, []);

  const v = useMemo(() => {
    if (!data) return null;
    const dates = daysBack(range);
    const inRange = new Set(dates);
    const dayMap = new Map(data.days.map((d) => [d.date, d.completedTaskIds]));
    const r = <T extends { date: string }>(a: T[]) => a.filter((x) => inRange.has(x.date));

    // Plan by phase per day
    const plan = dates.map((date) => {
      const done = dayMap.get(date) ?? [];
      const row: Record<string, string | number> = { label: range === 7 ? new Date(date + 'T00:00').toLocaleDateString([], { weekday: 'short' }) : short(date) };
      PHASES.forEach((p) => { row[p] = TASKS_BY_PHASE[p].filter((t) => done.includes(t.id)).length; });
      row.total = Math.round((done.length / CHECKLIST_TASKS.length) * 100);
      return row;
    });

    // Per-task completion rate
    const taskRate = CHECKLIST_TASKS.map((t) => ({
      name: t.title.replace(/\s*\(.*\)/, ''),
      rate: Math.round((dates.filter((d) => (dayMap.get(d) ?? []).includes(t.id)).length / dates.length) * 100),
    })).sort((a, b) => b.rate - a.rate);

    // Mood & stress
    const ci = r(data.checkIns);
    const stress = dates.map((date) => ({ label: short(date), stress: avg(ci.filter((c) => c.date === date).map((c) => c.anxietyLevel)) }));
    const moodCount: Record<string, number> = {};
    ci.forEach((c) => { moodCount[`${c.moodIcon} ${c.mood}`] = (moodCount[`${c.moodIcon} ${c.mood}`] ?? 0) + 1; });
    const moods = Object.entries(moodCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const hourBuckets = [
      { name: 'Morning', test: (h: number) => h < 12 }, { name: 'Afternoon', test: (h: number) => h >= 12 && h < 17 }, { name: 'Evening', test: (h: number) => h >= 17 },
    ].map((b) => ({ name: b.name, stress: avg(ci.filter((c) => b.test(new Date(c.timestamp).getHours())).map((c) => c.anxietyLevel)) ?? 0 }));

    // Practice
    const ps = r(data.sessions);
    const practice = dates.map((date) => {
      const row: Record<string, string | number> = { label: short(date) };
      (['object', 'food', 'body'] as const).forEach((t) => {
        row[t] = Math.round(ps.filter((p) => p.date === date && p.type === t).reduce((n, p) => n + p.durationSec, 0) / 6) / 10;
      });
      return row;
    });
    const resetOutcomes = (['started', 'snoozed', 'missed', 'pending'] as const)
      .map((o) => ({ name: o[0].toUpperCase() + o.slice(1), value: r(data.resets).filter((x) => x.outcome === o).length }))
      .filter((x) => x.value);
    const judgmentTags = Object.entries(r(data.judgments).reduce<Record<string, number>>((m, j) => ({ ...m, [j.tag]: (m[j.tag] ?? 0) + 1 }), {}))
      .map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    // Reflection
    const rf = r(data.reframes);
    const reframeShift = rf.slice(-12).map((x, i) => ({ n: `#${i + 1}`, before: x.intensityBefore, after: x.intensityAfter }));
    const writing = [
      { name: 'Gratitude', value: r(data.gratitude).length },
      { name: 'Effort ledger', value: r(data.efforts).length },
      { name: 'Quick reframes', value: r(data.quick).length },
      { name: 'Guided reframes', value: rf.length },
    ];

    // Weekly pillars — last 8 weeks
    const weeks: { week: string; done: boolean; headline: string }[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i * 7);
      const ws = getWeekStart(d);
      const p = data.pillars.find((x) => x.weekStart === ws);
      weeks.push({ week: ws, done: !!p && !!(p.community || p.purpose || p.charity || p.headline), headline: p?.headline ?? '' });
    }

    // Consistency heatmap — last 35 days, count of distinct practices done
    const heat = daysBack(35).map((date) => {
      const kinds = [
        (dayMap.get(date) ?? []).length > 0, data.checkIns.some((c) => c.date === date), data.sessions.some((s) => s.date === date),
        data.gratitude.some((g) => g.date === date), data.efforts.some((e) => e.date === date),
        data.reframes.some((x) => x.date === date) || data.quick.some((x) => x.date === date), data.judgments.some((j) => j.date === date),
      ].filter(Boolean).length;
      return { date, kinds };
    });

    const allActiveDates = heat.filter((h) => h.kinds > 0).map((h) => h.date);
    const stats = {
      plan: Math.round(plan.reduce((n, p) => n + (p.total as number), 0) / plan.length),
      stress: avg(ci.map((c) => c.anxietyLevel)),
      present: Math.round(ps.reduce((n, p) => n + p.durationSec, 0) / 60),
      journal: r(data.gratitude).length + r(data.efforts).length,
      reframes: rf.length + r(data.quick).length,
      streak: streak([...allActiveDates, ...data.days.filter((d) => d.completedTaskIds.length).map((d) => d.date)]),
    };

    return { plan, taskRate, stress, moods, hourBuckets, practice, resetOutcomes, judgmentTags, reframeShift, writing, weeks, heat, stats, ci };
  }, [data, range]);

  if (!v) {
    return (<><TopBar title="Progress" icon="monitoring" /><div className="page-content"><p className="pg-empty">Loading your history…</p></div></>);
  }

  const hasPractice = v.practice.some((p) => (p.object as number) + (p.food as number) + (p.body as number) > 0);

  return (
    <>
      <TopBar title="Progress" icon="monitoring" />
      <div className="page-content pg-page">
        <Link to="/progress/signs" className="faith-strip" style={{ textDecoration: 'none' }}>
          <span>
            <span className="material-symbols-outlined" aria-hidden="true">trending_up</span>
            <span className="faith-strip-t"><strong>Weekly signs{new Date().getDay() === 5 ? ' · today' : ''}</strong>The 6–8 week check, plus dhikr, fears and muhasabah stats</span>
            <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
          </span>
        </Link>
        <div className="rem-seg pg-range" role="radiogroup" aria-label="Range">
          {[7, 30].map((n) => (
            <button key={n} role="radio" aria-checked={range === n} className={range === n ? 'on' : ''} onClick={() => setRange(n as 7 | 30)}>
              {n} days
            </button>
          ))}
        </div>

        {/* ── Tiles ── */}
        <section className="pg-tiles animate-fade-up">
          {[
            [`${v.stats.plan}%`, 'Avg plan'], [v.stats.stress ?? '–', 'Avg stress'], [v.stats.present, 'Present min'],
            [v.stats.journal, 'Journal nights'], [v.stats.reframes, 'Reframes'], [v.stats.streak, 'Day streak'],
          ].map(([n, l]) => (
            <div key={l as string} className="progress-stat"><span className="progress-stat-value">{n}</span><span className="progress-stat-label">{l}</span></div>
          ))}
        </section>
        <CardStats days={range} />

        {/* ── Heatmap ── */}
        <Card icon="calendar_month" title="Consistency" sub="Last 5 weeks · darker = more practices that day">
          <div className="pg-heat" role="img" aria-label="Activity heatmap">
            {v.heat.map((h) => (
              <i key={h.date} title={`${short(h.date)} · ${h.kinds} practice${h.kinds === 1 ? '' : 's'}`} data-k={Math.min(h.kinds, 4)} />
            ))}
          </div>
        </Card>

        {/* ── Plan ── */}
        <Card icon="fact_check" title="Daily plan" sub="Tasks completed per phase">
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={v.plan} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={C.grid} />
                <XAxis dataKey="label" {...axis} interval={range === 7 ? 0 : 4} />
                <YAxis {...axis} allowDecimals={false} />
                <Tooltip {...tip} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                {PHASES.map((p, i) => <Bar key={p} dataKey={p} name={PHASE_META[p].label} stackId="a" fill={[C.pale, C.soft, C.deep][i]} radius={i === 2 ? [4, 4, 0, 0] : 0} maxBarSize={28} />)}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card icon="checklist" title="Habit by habit" sub={`% of the last ${range} days each was done`}>
          <div className="pg-bars">
            {v.taskRate.map((t) => (
              <div key={t.name} className="pg-bar-row">
                <span className="pg-bar-name">{t.name}</span>
                <span className="pg-bar-track"><span style={{ width: `${t.rate}%` }} /></span>
                <span className="pg-bar-n">{t.rate}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Mood ── */}
        <Card icon="mood" title="Stress & mood" sub="From your emotional check-ins">
          {v.ci.length === 0 ? <Empty text="No check-ins in this range yet." /> : (
            <>
              <div style={{ width: '100%', height: 180 }}>
                <ResponsiveContainer>
                  <LineChart data={v.stress} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={C.grid} />
                    <XAxis dataKey="label" {...axis} interval={range === 7 ? 0 : 4} />
                    <YAxis domain={[0, 10]} ticks={[0, 5, 10]} {...axis} />
                    <Tooltip {...tip} />
                    <Line type="monotone" dataKey="stress" name="Stress (1–10)" stroke={C.deep} strokeWidth={2} dot={{ r: 3 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="pg-split">
                <div style={{ flex: 1, minWidth: 160, height: 180 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={v.moods} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                        {v.moods.map((_, i) => <Cell key={i} fill={SERIES[i % SERIES.length]} />)}
                      </Pie>
                      <Tooltip {...tip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex: 1, minWidth: 160, height: 180 }}>
                  <ResponsiveContainer>
                    <BarChart data={v.hourBuckets} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
                      <XAxis dataKey="name" {...axis} />
                      <YAxis domain={[0, 10]} {...axis} />
                      <Tooltip {...tip} />
                      <Bar dataKey="stress" name="Avg stress" fill={C.warm} radius={[4, 4, 0, 0]} maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="pg-sub" style={{ textAlign: 'center' }}>Mood mix · stress by time of day</p>
            </>
          )}
        </Card>

        {/* ── Practice ── */}
        <Card icon="self_improvement" title="Present practice" sub="Minutes per day by type">
          {!hasPractice ? <Empty text="No practice sessions in this range yet." /> : (
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={v.practice} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={C.grid} />
                  <XAxis dataKey="label" {...axis} interval={range === 7 ? 0 : 4} />
                  <YAxis {...axis} />
                  <Tooltip {...tip} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="object" name="Object" stackId="p" fill={C.pale} maxBarSize={28} />
                  <Bar dataKey="food" name="Food" stackId="p" fill={C.warm} maxBarSize={28} />
                  <Bar dataKey="body" name="Body" stackId="p" fill={C.deep} radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <div className="pg-split">
          <Card icon="restart_alt" title="Back to it" sub="How resets ended">
            {v.resetOutcomes.length === 0 ? <Empty text="No resets yet." /> : (
              <div style={{ height: 170 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={v.resetOutcomes} dataKey="value" nameKey="name" outerRadius={65}>
                      {v.resetOutcomes.map((o, i) => <Cell key={o.name} fill={SERIES[i]} />)}
                    </Pie>
                    <Tooltip {...tip} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
          <Card icon="balance" title="Judgments noticed" sub="By theme">
            {v.judgmentTags.length === 0 ? <Empty text="None logged yet." /> : (
              <div style={{ height: 170 }}>
                <ResponsiveContainer>
                  <BarChart data={v.judgmentTags} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
                    <XAxis type="number" hide allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={90} {...axis} />
                    <Tooltip {...tip} />
                    <Bar dataKey="value" name="Times" fill={C.soft} radius={[0, 4, 4, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* ── Reflection ── */}
        <Card icon="auto_stories" title="Reflection" sub="Entries written in this range">
          <div className="pg-bars">
            {v.writing.map((w) => {
              const max = Math.max(1, ...v.writing.map((x) => x.value));
              return (
                <div key={w.name} className="pg-bar-row">
                  <span className="pg-bar-name">{w.name}</span>
                  <span className="pg-bar-track"><span style={{ width: `${(w.value / max) * 100}%`, background: C.warm }} /></span>
                  <span className="pg-bar-n">{w.value}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card icon="trending_down" title="Reframe effect" sub="How intense the thought felt, before → after">
          {v.reframeShift.length === 0 ? <Empty text="Do a guided reframe to see the shift." /> : (
            <div style={{ width: '100%', height: 190 }}>
              <ResponsiveContainer>
                <BarChart data={v.reframeShift} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={C.grid} />
                  <XAxis dataKey="n" {...axis} />
                  <YAxis domain={[0, 10]} {...axis} />
                  <Tooltip {...tip} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="before" name="Before" fill={C.warm} radius={[4, 4, 0, 0]} maxBarSize={16} />
                  <Bar dataKey="after" name="After" fill={C.deep} radius={[4, 4, 0, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card icon="event_repeat" title="Friday pillars" sub="Last 8 weeks">
          <div className="pg-weeks">
            {v.weeks.map((w) => (
              <div key={w.week} className={`pg-week${w.done ? ' on' : ''}`} title={w.headline || (w.done ? 'Done' : 'Missed')}>
                <i />
                <span>{short(w.week)}</span>
              </div>
            ))}
          </div>
          {v.weeks.filter((w) => w.headline).slice(-1).map((w) => <p key={w.week} className="pg-quote">“{w.headline}”</p>)}
        </Card>
      </div>
    </>
  );
}
