import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useReminderStore } from '../store/useReminderStore';
import { PHASE_META, type Phase } from '../data/checklist';
import { db } from '../data/db';
import { requestNotificationPermission } from '../utils/notify';
import { requestPersistence } from '../data/backup';
import { unlockAudio, playSound } from '../utils/reminderSounds';

const PHASES: Phase[] = ['morning', 'afternoon', 'evening'];

const TOUR = [
  { icon: 'today', title: 'Today', text: 'Your morning, afternoon and evening routine. Tick things off as you go.' },
  { icon: 'self_improvement', title: 'Practice', text: 'Breathing, affirmations, coping skills and 60-second presence drills.' },
  { icon: 'auto_stories', title: 'Reflect', text: 'Quick reframes anytime, gratitude every night, the four pillars on Fridays.' },
  { icon: 'monitoring', title: 'Progress', text: 'Everything you log, charted. Consistency over perfection.' },
  { icon: 'emergency', title: 'SOS', text: 'Always one tap away at the top when things spike.' },
];

/** First-run flow: welcome → tour → routine times → notifications → privacy. Replayable from Settings. */
export default function Onboarding() {
  const { onboarded, setOnboarded } = useAppStore();
  const rem = useReminderStore();
  const [step, setStep] = useState(0);
  const [perm, setPerm] = useState<string>('default');

  // Existing users who already have data skip onboarding automatically.
  useEffect(() => {
    if (onboarded) return;
    db.checklistDays.count().then((n) => { if (n > 0) setOnboarded(true); });
  }, [onboarded, setOnboarded]);

  if (onboarded) return null;

  const finish = async () => { await requestPersistence().catch(() => false); setOnboarded(true); setStep(0); };
  const enableNotifs = async () => {
    unlockAudio();
    const p = await requestNotificationPermission();
    setPerm(p);
    rem.set({ notificationsOn: p === 'granted' });
    if (p === 'granted') playSound(rem.routineSound, rem.volume);
  };

  const steps = [
    <>
      <span className="material-symbols-outlined ob-hero-icon">spa</span>
      <h1 className="ob-h">Welcome to Serenity.</h1>
      <p className="ob-p">A calm daily plan for anxiety and stress. Small steps, morning to night. Two minutes to set up.</p>
    </>,
    <>
      <h1 className="ob-h">How it fits together.</h1>
      <ul className="ob-tour">
        {TOUR.map((t) => (
          <li key={t.title}>
            <span className="material-symbols-outlined">{t.icon}</span>
            <div><strong>{t.title}</strong><p>{t.text}</p></div>
          </li>
        ))}
      </ul>
    </>,
    <>
      <h1 className="ob-h">When should we check in?</h1>
      <p className="ob-p">A nudge for each part of your routine. Quiet if you've already done it.</p>
      <div className="ob-times">
        {PHASES.map((p) => (
          <label key={p} className="ob-time">
            <span className="material-symbols-outlined">{PHASE_META[p].icon}</span>
            <span className="ob-time-label">{PHASE_META[p].label}</span>
            <input type="time" className="rem-input" value={rem.routines[p].time} onChange={(e) => rem.setRoutine(p, { time: e.target.value, enabled: true })} />
          </label>
        ))}
      </div>
    </>,
    <>
      <span className="material-symbols-outlined ob-hero-icon">notifications_active</span>
      <h1 className="ob-h">Turn on notifications?</h1>
      <p className="ob-p">For check-ins, nightly gratitude and your Friday reflection. You can change any of it later.</p>
      {perm === 'granted' ? <p className="ob-ok">✓ Notifications are on</p>
        : perm === 'denied' ? <p className="ob-p">Blocked in your browser settings — you can still use in-app reminders.</p>
        : perm === 'unsupported' ? <p className="ob-p">On iPhone, add Serenity to your Home Screen first, then enable them in Settings.</p>
        : <button className="btn-primary" onClick={enableNotifs}>Enable notifications</button>}
    </>,
    <>
      <span className="material-symbols-outlined ob-hero-icon">lock</span>
      <h1 className="ob-h">Your data stays on this device.</h1>
      <p className="ob-p">No account, no cloud. Back it up anytime from Settings (gear icon, top right) so you can move it to a new phone.</p>
    </>,
  ];
  const last = step === steps.length - 1;

  return (
    <div className="ob-overlay" role="dialog" aria-modal="true" aria-label="Welcome to Serenity">
      <div className="ob-card animate-fade-up" key={step}>
        <div className="ob-dots" aria-hidden="true">{steps.map((_, i) => <i key={i} className={i <= step ? 'on' : ''} />)}</div>
        <div className="ob-body">{steps[step]}</div>
        <div className="ob-actions">
          {step > 0 ? <button className="btn-ghost" onClick={() => setStep(step - 1)}>Back</button>
            : <button className="btn-ghost" onClick={finish}>Skip</button>}
          <button className="btn-primary" onClick={() => (last ? finish() : setStep(step + 1))}>{last ? 'Start' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
}
