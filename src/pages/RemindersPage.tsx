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
    const ok = await showSystemNotification('Mutma’innah is set up', { body: 'This is what your check-ins will look like.', tag: 'test', url: '/today' });
    if (!ok && s.notificationsOn) setPerm(Notification.permission);
  };

  const add = () => {
    if (!draft.label.trim()) return;
    s.addReminder({ ...draft, label: draft.label.trim(), enabled: true });
    setDraft({ ...draft, label: '' });
  };

  return (
    <>
      <TopBar title="Reminders" icon="notifications" />
      <div className="page-content rem-page">
        {/* ── Delivery ───────────────────────── */}
        <section className="card rem-section">
          <h3 className="rem-h">Delivery</h3>
          <div className="rem-row">
            <div>
              <div className="rem-label">Push notifications</div>
              <div className="rem-sub">
                {perm === 'denied' ? 'Blocked — allow notifications for this site in your browser settings.'
                  : perm === 'unsupported' ? 'Not supported here. On iPhone, add Mutma’innah to your Home Screen first.'
                  : 'System notifications for check-ins, reminders and alarms.'}
              </div>
            </div>
            <Switch label="Push notifications" on={s.notificationsOn && perm === 'granted'} onChange={enableNotifications} />
          </div>
          <div className="rem-row">
            <div><div className="rem-label">Sounds</div><div className="rem-sub">Chimes play when a reminder fires.</div></div>
            <Switch label="Sounds" on={s.soundsOn} onChange={(v) => { unlockAudio(); s.set({ soundsOn: v }); }} />
          </div>
          <div className="rem-row">
            <div className="rem-label">Volume</div>
            <input type="range" min={0} max={1} step={0.05} value={s.volume} aria-label="Volume"
              onChange={(e) => s.set({ volume: Number(e.target.value) })} onPointerUp={() => playSound(s.routineSound, s.volume)} style={{ width: 140 }} />
          </div>
          <button className="btn-ghost" onClick={test} style={{ marginTop: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>notifications_active</span> Send a test
          </button>
          <p className="rem-note">
            Notifications fire while Mutma’innah is open or running in the background. Install it to your Home Screen and leave it in your app switcher for the most reliable delivery.
          </p>
        </section>

        {/* ── Routine check-ins ─────────────── */}
        <section className="card rem-section">
          <h3 className="rem-h">Routine check-ins</h3>
          <p className="rem-sub" style={{ marginBottom: 12 }}>A nudge with what's left in each phase. Stays quiet if you've already finished it.</p>
          {PHASES.map((p) => {
            const r = s.routines[p];
            return (
              <div key={p} className="rem-routine">
                <div className="rem-row">
                  <div className="rem-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>{PHASE_META[p].icon}</span>
                    {PHASE_META[p].label}
                  </div>
                  <Switch label={`${PHASE_META[p].label} check-in`} on={r.enabled} onChange={(v) => s.setRoutine(p, { enabled: v })} />
                </div>
                {r.enabled && (
                  <div className="rem-row-inline" style={{ flexWrap: 'wrap' }}>
                    <input className="rem-input" type="time" value={r.time} aria-label={`${p} time`} onChange={(e) => s.setRoutine(p, { time: e.target.value })} />
                    <select className="rem-input" aria-label="Follow-up" value={r.followUpMin} onChange={(e) => s.setRoutine(p, { followUpMin: Number(e.target.value) })}>
                      <option value={0}>No follow-up</option>
                      <option value={30}>Follow up in 30 min</option>
                      <option value={45}>Follow up in 45 min</option>
                      <option value={60}>Follow up in 1 hr</option>
                      <option value={90}>Follow up in 1.5 hr</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })}
          <div className="rem-row" style={{ marginTop: 8 }}>
            <div className="rem-label">Check-in sound</div>
            <SoundSelect label="Check-in sound" value={s.routineSound} onChange={(v) => s.set({ routineSound: v })} />
          </div>
        </section>

        {/* ── Reminders & alarms ─────────────── */}
        <section className="card rem-section">
          <h3 className="rem-h">Reminders &amp; alarms</h3>
          {s.reminders.length === 0 && <p className="rem-sub">None yet.</p>}
          {s.reminders.map((r) => (
            <div key={r.id} className="rem-item">
              <div className="rem-row">
                <div>
                  <div className="rem-label">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: '-3px', marginRight: 6 }}>{r.kind === 'alarm' ? 'alarm' : 'notifications'}</span>
                    {r.label}
                  </div>
                  <div className="rem-sub">{r.time} · {r.days.length === 0 ? 'Every day' : r.days.map((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}</div>
                </div>
                <div className="rem-row-inline">
                  <Switch label={`${r.label} on`} on={r.enabled} onChange={(v) => s.updateReminder(r.id, { enabled: v })} />
                  <button className="btn-ghost rem-mini" aria-label={`Delete ${r.label}`} onClick={() => s.removeReminder(r.id)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="rem-add">
            <div className="rem-label" style={{ marginBottom: 8 }}>Add new</div>
            <div className="rem-seg" role="radiogroup" aria-label="Type">
              {(['reminder', 'alarm'] as ReminderKind[]).map((k) => (
                <button key={k} role="radio" aria-checked={draft.kind === k} className={draft.kind === k ? 'on' : ''}
                  onClick={() => setDraft({ ...draft, kind: k, sound: k === 'alarm' ? 'alarm' : 'chime' })}>
                  {k === 'alarm' ? 'Alarm' : 'Reminder'}
                </button>
              ))}
            </div>
            <input className="rem-input" style={{ width: '100%' }} placeholder={draft.kind === 'alarm' ? 'Wake up for Fajr' : 'Take a walk outside'}
              value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && add()} aria-label="Label" />
            <div className="rem-row-inline" style={{ flexWrap: 'wrap' }}>
              <input className="rem-input" type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} aria-label="Time" />
              <SoundSelect label="Sound" value={draft.sound} onChange={(v) => setDraft({ ...draft, sound: v })} />
            </div>
            <div className="rem-days" aria-label="Repeat days">
              {DAYS.map((d, i) => (
                <button key={i} aria-pressed={draft.days.includes(i)} className={draft.days.includes(i) ? 'on' : ''}
                  onClick={() => setDraft({ ...draft, days: draft.days.includes(i) ? draft.days.filter((x) => x !== i) : [...draft.days, i].sort() })}>{d}</button>
              ))}
              <span className="rem-sub" style={{ marginLeft: 6 }}>{draft.days.length === 0 ? 'Every day' : ''}</span>
            </div>
            <button className="btn-primary" onClick={add} disabled={!draft.label.trim()}>Add {draft.kind}</button>
          </div>
        </section>
      </div>
    </>
  );
}
