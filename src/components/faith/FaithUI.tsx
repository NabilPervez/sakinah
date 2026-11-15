import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Arabic: Noto Naskh, RTL, never letter-spaced (Quiet Precision rule). */
export function Arabic({ children, size = 'md' }: { children: React.ReactNode; size?: 'md' | 'lg' }) {
  return <p className={`ar ar-${size}`} dir="rtl" lang="ar">{children}</p>;
}

/** Evidence on tap — every faith item shows where it comes from (PRD §9). */
export function Cite({ source, label = 'Source' }: { source: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="cite">
      <button type="button" className="cite-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="material-symbols-outlined" aria-hidden="true">menu_book</span>{label}
      </button>
      {open && <span className="cite-text">{source}</span>}
    </span>
  );
}

/** Block-level citation line (always visible). */
export function SourceLine({ children }: { children: React.ReactNode }) {
  return <p className="src-line"><span className="material-symbols-outlined" aria-hidden="true">menu_book</span>{children}</p>;
}

/**
 * Staggered GSAP entrance for a page (Cisco motion: rise 30px, 900ms, stagger 140ms, .16,1,.3,1).
 * Children marked [data-rise] animate. Without JS or with reduced motion, content is simply visible.
 */
export function useRise<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);
  useGSAP(() => {
    if (!ref.current || reduced()) return;
    gsap.from(ref.current.querySelectorAll('[data-rise]'), {
      y: 30, opacity: 0, duration: 0.9, stagger: 0.14, ease: 'expo.out', clearProps: 'transform,opacity',
    });
  }, { scope: ref, dependencies: deps });
  return ref;
}

/** Tasbih counter with haptics + a GSAP pulse per tap. */
export function Counter({ target, onComplete, label }: { target: number; onComplete?: (count: number) => void; label?: string }) {
  const [count, setCount] = useState(0);
  const ring = useRef<HTMLButtonElement>(null);
  const done = target > 0 && count >= target;
  const tap = () => {
    const next = count + 1;
    setCount(next);
    if ('vibrate' in navigator) navigator.vibrate(next === target ? [30, 60, 30] : 12);
    if (ring.current && !reduced()) {
      gsap.fromTo(ring.current, { scale: 0.96 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });
    }
    if (next === target) onComplete?.(next);
  };
  const pct = target > 0 ? Math.min(1, count / target) : 0;
  return (
    <div className="counter">
      <button ref={ring} type="button" className={`counter-ring${done ? ' done' : ''}`} onClick={tap}
        aria-label={`${label ?? 'Count'}: ${count} of ${target}. Tap to count.`}
        style={{ ['--pct' as string]: `${pct * 360}deg` }}>
        <span className="counter-n">{count}</span>
        <span className="counter-t">{done ? 'Done' : `of ${target}`}</span>
      </button>
      <button type="button" className="qp-btn qp-btn-ghost" onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
