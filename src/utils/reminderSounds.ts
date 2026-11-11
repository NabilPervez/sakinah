import type { SoundId } from '../store/useReminderStore';

let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (C) ctx = new C();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Call from any user gesture so later timed sounds aren't blocked by autoplay rules. */
export function unlockAudio() { ac(); }

function tone(c: AudioContext, freq: number, start: number, dur: number, peak: number, type: OscillatorType = 'sine', partials: number[] = []) {
  [1, ...partials].forEach((mult, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq * mult, c.currentTime + start);
    const p = peak / (i + 1.5);
    g.gain.setValueAtTime(0, c.currentTime + start);
    g.gain.linearRampToValueAtTime(i === 0 ? peak : p, c.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + start);
    o.stop(c.currentTime + start + dur + 0.05);
  });
}

/** Plays one pass of a sound. Returns its length in seconds. */
export function playSound(id: SoundId, volume = 0.6): number {
  if (id === 'none') return 0;
  const c = ac();
  if (!c) return 0;
  const v = Math.max(0, Math.min(1, volume)) * 0.25;
  switch (id) {
    case 'bell': // soft temple bell, two strikes
      tone(c, 523.25, 0, 2.4, v, 'sine', [2.76, 5.4]);
      tone(c, 659.25, 0.9, 2.4, v * 0.8, 'sine', [2.76, 5.4]);
      return 3.3;
    case 'bowl': // singing bowl — long low hum with beat
      tone(c, 220, 0, 4.5, v, 'sine', [2.01, 3.0]);
      tone(c, 221.5, 0, 4.5, v * 0.6);
      return 4.5;
    case 'chime': // rising wind-chime
      [784, 988, 1175, 1568].forEach((f, i) => tone(c, f, i * 0.18, 1.4, v * 0.7, 'triangle'));
      return 2;
    case 'birds': // quick chirps
      for (let i = 0; i < 6; i++) {
        const s = i * 0.22 + (i > 2 ? 0.4 : 0);
        const o = c.createOscillator(); const g = c.createGain();
        o.frequency.setValueAtTime(2600, c.currentTime + s);
        o.frequency.exponentialRampToValueAtTime(4200, c.currentTime + s + 0.08);
        g.gain.setValueAtTime(0, c.currentTime + s);
        g.gain.linearRampToValueAtTime(v * 0.4, c.currentTime + s + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + s + 0.12);
        o.connect(g); g.connect(c.destination); o.start(c.currentTime + s); o.stop(c.currentTime + s + 0.15);
      }
      return 1.8;
    case 'alarm': // gentle-but-insistent rising triple
      [0, 0.35, 0.7].forEach((s, i) => tone(c, 660 + i * 110, s, 0.3, v * 1.2, 'triangle'));
      return 1.4;
  }
  return 0;
}

/** Loops a sound until the returned stop() is called (for alarms). */
export function loopSound(id: SoundId, volume = 0.6): () => void {
  let stopped = false;
  let t: number | undefined;
  const run = () => {
    if (stopped) return;
    const len = playSound(id === 'none' ? 'alarm' : id, volume);
    t = window.setTimeout(run, (len + 0.8) * 1000);
  };
  run();
  return () => { stopped = true; if (t) clearTimeout(t); };
}

export const SOUND_OPTIONS: { id: SoundId; label: string }[] = [
  { id: 'bell', label: 'Bell' },
  { id: 'bowl', label: 'Singing bowl' },
  { id: 'chime', label: 'Chime' },
  { id: 'birds', label: 'Birds' },
  { id: 'alarm', label: 'Alarm' },
  { id: 'none', label: 'Silent' },
];
