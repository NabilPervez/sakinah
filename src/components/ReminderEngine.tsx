import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReminderStore, type SoundId } from '../store/useReminderStore';
import { getTodayDateString } from '../store/useAppStore';
import { TASKS_BY_PHASE, PHASE_META, type Phase } from '../data/checklist';
import { getChecklistDay } from '../data/db';
import { playSound, loopSound, unlockAudio } from '../utils/reminderSounds';
import { showSystemNotification } from '../utils/notify';

/** Routine check-ins stay "catch-up-able" this long after their time (e.g. you open the app late). */
const ROUTINE_WINDOW_MIN = 120;
const REMINDER_WINDOW_MIN = 30;
const TICK_MS = 20_000;

interface Prompt {
  key: string;
  kind: 'routine' | 'reminder' | 'alarm';
  title: string;
  body: string;
  url: string;
  phase?: Phase;
  done?: number;
  total?: number;
  sound: SoundId;
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

async function phaseProgress(phase: Phase) {
  const day = await getChecklistDay(getTodayDateString());
  const tasks = TASKS_BY_PHASE[phase];
  const doneIds = day?.completedTaskIds ?? [];
  const remaining = tasks.filter((t) => !doneIds.includes(t.id));
  return { done: tasks.length - remaining.length, total: tasks.length, next: remaining[0]?.title };
}

/**
 * Runs while the app is open (or backgrounded but alive): fires routine check-ins,
 * custom reminders and alarms as system notifications + in-app prompt + sound.
 */
export default function ReminderEngine() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const stopLoop = useRef<(() => void) | null>(null);
  const busy = useRef(false);

  const fire = useCallback(async (p: Prompt) => {
    const s = useReminderStore.getState();
    if (s.notificationsOn) {
      await showSystemNotification(p.title, { body: p.body, tag: p.key, url: p.url, requireInteraction: p.kind === 'alarm' });
    }
    if (s.soundsOn) {
      stopLoop.current?.();
      if (p.kind === 'alarm') stopLoop.current = loopSound(p.sound, s.volume);
      else playSound(p.sound, s.volume);
    }
    setPrompt(p);
  }, []);

  const tick = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const s = useReminderStore.getState();
      const now = new Date();
      const today = getTodayDateString();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const dow = now.getDay();

      // 1) Snoozes that have come due
      for (const [key, at] of Object.entries(s.snoozes)) {
        if (Date.now() < at) continue;
        s.clearSnooze(key);
        const p = await buildPrompt(key);
        if (p) { await fire(p); return; }
      }

      // 2) Routine check-ins (+ follow-ups)
      for (const phase of ['morning', 'afternoon', 'evening'] as Phase[]) {
        const r = s.routines[phase];
        if (!r.enabled) continue;
        const slots: [string, number][] = [[`routine:${phase}`, toMin(r.time)]];
        if (r.followUpMin > 0) slots.push([`routine:${phase}:follow`, toMin(r.time) + r.followUpMin]);
        for (const [key, at] of slots) {
          if (s.fired[key] === today || nowMin < at || nowMin > at + ROUTINE_WINDOW_MIN) continue;
          s.markFired(key, today);
          const p = await buildPrompt(key);
          if (p) { await fire(p); return; } // phase already complete → stays quiet
        }
      }

      // 3) Custom reminders & alarms
      for (const r of s.reminders) {
        if (!r.enabled) continue;
        if (r.days.length && !r.days.includes(dow)) continue;
        const key = `rem:${r.id}`;
        const at = toMin(r.time);
        if (s.fired[key] === today || nowMin < at || nowMin > at + REMINDER_WINDOW_MIN) continue;
        s.markFired(key, today);
        const p = await buildPrompt(key);
        if (p) { await fire(p); return; }
      }
    } finally {
      busy.current = false;
    }
  }, [fire]);

  useEffect(() => {
    tick();
    const id = window.setInterval(tick, TICK_MS);
    const onVis = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVis);
    // Unlock audio on first interaction so timed sounds can play later.
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointerdown', unlock);
    };
  }, [tick]);

  const close = () => { stopLoop.current?.(); stopLoop.current = null; setPrompt(null); };
  const snooze = (min: number) => { if (prompt) useReminderStore.getState().snooze(prompt.key, min); close(); };
  const open = () => { if (prompt?.url) navigate(prompt.url); close(); };

  if (!prompt) return null;
  const isAlarm = prompt.kind === 'alarm';
  return (
    <div className={`rem-overlay${isAlarm ? ' alarm' : ''}`} role="alertdialog" aria-modal="true" aria-label={prompt.title}>
      <div className="rem-card animate-fade-up">
        <span className="material-symbols-outlined rem-icon" aria-hidden="true">
          {isAlarm ? 'alarm' : prompt.phase ? PHASE_META[prompt.phase].icon : 'notifications'}
        </span>
        <div className="rem-eyebrow">{isAlarm ? 'Alarm' : prompt.kind === 'routine' ? 'Check-in' : 'Reminder'}</div>
        <h2 className="rem-title">{prompt.title}</h2>
        <p className="rem-body">{prompt.body}</p>
        {prompt.total ? (
          <div className="rem-progress" aria-label={`${prompt.done} of ${prompt.total} done`}>
            <div style={{ width: `${(prompt.done! / prompt.total) * 100}%` }} />
          </div>
        ) : null}
        <div className="rem-actions">
          <button className="btn-primary" onClick={isAlarm && !prompt.url ? close : open}>
            {prompt.kind === 'routine' ? 'Open routine' : isAlarm ? 'I’m up' : 'Open'}
          </button>
          <button className="btn-ghost" onClick={() => snooze(isAlarm ? 5 : 15)}>Snooze {isAlarm ? 5 : 15} min</button>
          {!isAlarm && <button className="btn-ghost" onClick={close}>Dismiss</button>}
        </div>
      </div>
    </div>
  );
}

/** Builds the prompt for a key. Returns null if there's nothing to say (e.g. routine already done). */
async function buildPrompt(key: string): Promise<Prompt | null> {
  const s = useReminderStore.getState();
  if (key.startsWith('routine:')) {
    const phase = key.split(':')[1] as Phase;
    const isFollow = key.endsWith(':follow');
    const { done, total, next } = await phaseProgress(phase);
    if (done >= total) return null;
    const label = PHASE_META[phase].label;
    const title = isFollow
      ? `${label} routine — still ${total - done} to go`
      : done === 0 ? `Time for your ${label.toLowerCase()} routine` : `${label} check-in · ${done}/${total} done`;
    const body = next ? `Next up: ${next}` : PHASE_META[phase].subtitle;
    return { key, kind: 'routine', title, body, url: `/today?phase=${phase}`, phase, done, total, sound: s.routineSound };
  }
  if (key.startsWith('rem:')) {
    const r = s.reminders.find((x) => `rem:${x.id}` === key);
    if (!r) return null;
    return {
      key,
      kind: r.kind,
      title: r.label,
      body: r.kind === 'alarm' ? `It’s ${r.time}.` : 'A gentle nudge from Serenity.',
      url: r.link ?? '',
      sound: r.sound,
    };
  }
  return null;
}
