import { useState } from 'react';
import TopBar from '../components/TopBar';
import { useReminderStore, type ReminderKind, type SoundId } from '../store/useReminderStore';
import { PHASE_META, type Phase } from '../data/checklist';
import { playSound, unlockAudio, SOUND_OPTIONS } from '../utils/reminderSounds';
import { requestNotificationPermission, showSystemNotification, notificationsSupported } from '../utils/notify';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const PHASES: Phase[] = ['morning', 'afternoon', 'evening'];

function SoundSelect({ value, onChange, label }: { value: SoundId; onChange: (s: SoundId) => void; label: string }) {
  const vol = useReminderStore((s) => s.volume);
  return (
    <div className="rem-row-inline">
      <select className="rem-input" aria-label={label} value={value} onChange={(e) => onChange(e.target.value as SoundId)}>
        {SOUND_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
      <button className="btn-ghost rem-mini" aria-label="Preview sound" onClick={() => { unlockAudio(); playSound(value, vol); }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span>
      </button>
    </div>
  );
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} className={`rem-switch${on ? ' on' : ''}`} onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

export default function RemindersPage() {
  const s = useReminderStore();
  const [perm, setPerm] = useState<string>(notificationsSupported() ? Notification.permission : 'unsupported');
  const [draft, setDraft] = useState({ label: '', time: '09:00', kind: 'reminder' as ReminderKind, days: [] as number[], sound: 'chime' as SoundId });

  const enableNotifications = async (on: boolean) => {
    unlockAudio();
    if (!on) return s.set({ notificationsOn: false });
    const p = await requestNotificationPermission();
    setPerm(p);
    s.set({ notificationsOn: p === 'granted' });
  };

  const test = async () => {
    unlockAudio();
    if (s.soundsOn) playSound(s.routineSound, s.volume);
    const ok = await showSystemNotification('Sakinah is set up', { body: 'This is what your check-ins will look like.', tag: 'test', url: '/today' });
    if (!ok && s.notificationsOn) setPerm(Notification.permission);
  };

  const add = () => {
    if (!draft.label.trim()) return;
    s.addReminder({ ...draft, label: draft.label.trim(), enabled: true });
    setDraft({ ...draft, label: '' });
  };

  const [more, setMore] = useState(false);
  const pushOn = s.notificationsOn && perm === 'granted';

  return (
    <>
      <TopBar title="Reminders" icon="notifications" />
      <div className="page-content rem-page">
        {/* 1 · Turn on — one switch */}
        <section className="card rem-section">
          <div className="rem-row">
            <div>
              <div className="rem-label">{pushOn ? 'Reminders are on' : 'Turn on reminders'}</div>
              <div className="rem-sub">
                {perm === 'denied' ? 'Blocked — allow notifications for this site in browser settings.'
                  : perm === 'unsupported' ? 'On iPhone, add Sakinah to your Home Screen first.'
                  : pushOn ? 'You’ll get a gentle nudge at the times below.' : 'One tap. You can change times anytime.'}
              </div>
            </div>
            <Switch label="Reminders" on={pushOn} onChange={enableNotifications} />
          </div>
        </section>

        {/* 2 · Daily check-ins — three rows, switch + time */}
        <section className="card rem-section">
          <h3 className="rem-h">Daily check-ins</h3>
          <p className="rem-sub" style={{ marginBottom: 8 }}>Skipped automatically if that part of your day is already done.</p>
          {PHASES.map((p) => {
            const r = s.routines[p];
            return (
              <div key={p} className="rem-row">
                <div className="rem-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>{PHASE_META[p].icon}</span>
                  {PHASE_META[p].label}
                </div>
                <div className="rem-row-inline">
                  {r.enabled && <input className="rem-input" type="time" value={r.time} aria-label={`${p} time`} onChange={(e) => s.setRoutine(p, { time: e.target.value })} />}
                  <Switch label={`${PHASE_META[p].label} check-in`} on={r.enabled} onChange={(v) => s.setRoutine(p, { enabled: v })} />
                </div>
              </div>
            );
          })}
        </section>

        {/* 3 · My reminders — name + time + add */}
        <section className="card rem-section">
          <h3 className="rem-h">My reminders</h3>
          {s.reminders.map((r) => (
            <div key={r.id} className="rem-row">
              <div>
                <div className="rem-label">{r.kind === 'alarm' && <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: '-3px', marginRight: 6 }}>alarm</span>}{r.label}</div>
                <div className="rem-sub">{r.time} · {r.days.length === 0 ? 'Every day' : r.days.map((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}</div>
              </div>
              <div className="rem-row-inline">
                <Switch label={`${r.label} on`} on={r.enabled} onChange={(v) => s.updateReminder(r.id, { enabled: v })} />
                <button className="btn-ghost rem-mini" aria-label={`Delete ${r.label}`} onClick={() => s.removeReminder(r.id)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                </button>
              </div>
            </div>
          ))}
          <div className="rem-add">
            <input className="rem-input" style={{ width: '100%' }} placeholder="e.g. Take a walk outside" value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && add()} aria-label="Reminder name" />
            <div className="rem-row-inline">
              <input className="rem-input" type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} aria-label="Time" />
              <button className="btn-primary" onClick={add} disabled={!draft.label.trim()}>Add</button>
            </div>
            <span className="rem-sub">Repeats every day unless you pick days below.</span>
            <div className="rem-days" aria-label="Repeat days">
              {DAYS.map((d, i) => (
                <button key={i} aria-pressed={draft.days.includes(i)} className={draft.days.includes(i) ? 'on' : ''}
                  onClick={() => setDraft({ ...draft, days: draft.days.includes(i) ? draft.days.filter((x) => x !== i) : [...draft.days, i].sort() })}>{d}</button>
              ))}
            </div>
            <label className="rem-sub" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={draft.kind === 'alarm'} onChange={(e) => setDraft({ ...draft, kind: e.target.checked ? 'alarm' : 'reminder', sound: e.target.checked ? 'alarm' : 'chime' })} />
              Make it a loud alarm
            </label>
          </div>
        </section>

        {/* 4 · Everything else, tucked away */}
        <button className="btn-ghost" onClick={() => setMore(!more)} aria-expanded={more} style={{ alignSelf: 'flex-start' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{more ? 'expand_less' : 'tune'}</span> {more ? 'Hide sound settings' : 'Sound settings'}
        </button>
        {more && (
          <section className="card rem-section">
            <div className="rem-row">
              <div className="rem-label">Sounds</div>
              <Switch label="Sounds" on={s.soundsOn} onChange={(v) => { unlockAudio(); s.set({ soundsOn: v }); }} />
            </div>
            <div className="rem-row">
              <div className="rem-label">Volume</div>
              <input type="range" min={0} max={1} step={0.05} value={s.volume} aria-label="Volume"
                onChange={(e) => s.set({ volume: Number(e.target.value) })} onPointerUp={() => playSound(s.routineSound, s.volume)} style={{ width: 140 }} />
            </div>
            <div className="rem-row">
              <div className="rem-label">Check-in sound</div>
              <SoundSelect label="Check-in sound" value={s.routineSound} onChange={(v) => s.set({ routineSound: v })} />
            </div>
            <div className="rem-row">
              <div className="rem-label">Nudge again if not done</div>
              <select className="rem-input" aria-label="Follow-up" value={s.routines.morning.followUpMin}
                onChange={(e) => PHASES.forEach((p) => s.setRoutine(p, { followUpMin: Number(e.target.value) }))}>
                <option value={0}>Never</option><option value={30}>After 30 min</option><option value={60}>After 1 hr</option>
              </select>
            </div>
            <button className="btn-ghost" onClick={test} style={{ marginTop: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>notifications_active</span> Send a test
            </button>
            <p className="rem-note">Keep Sakinah installed on your Home Screen for the most reliable delivery.</p>
          </section>
        )}
      </div>
    </>
  );
}
