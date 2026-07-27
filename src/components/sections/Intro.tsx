import { useEffect, useRef, useState } from "react";

type Phase = 'start' | 'line1' | 'line2' | 'hold' | 'exit';

interface IntroProps {
    onComplete: () => void;
}

const FADE_MS = 800;

export default function Intro({ onComplete }: IntroProps) {
  const [phase, setPhase] = useState<Phase>('start');
  const timers = useRef<number[]>([]);
  const skipping = useRef(false);

  useEffect(() => {
    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timers.current.push(timer);
    };

    schedule(() => setPhase('line1'), 500);
    schedule(() => setPhase('line2'), 1500);
    schedule(() => setPhase('hold'), 3000);
    schedule(() => setPhase('exit'), 6000);
    schedule(onComplete, 6000 + FADE_MS);

    return () => {
      timers.current.forEach(window.clearTimeout);
    };
  }, []);

  const skip = () => {
    if (skipping.current || phase === 'exit') return;
    skipping.current = true;
    timers.current.forEach(window.clearTimeout);
    setPhase('exit');
    window.setTimeout(onComplete, FADE_MS);
  };

  const visible = (cond: boolean) => ({
    opacity: cond ? 1 : 0,
    transition: 'opacity 0.8s ease',
  });

  return (
    <div
      onClick={skip}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        zIndex: 1000,
        opacity: phase === 'exit' ? 0 : 1,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}>
      <img
        src="/intro_dance.jpg"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 42%',
          opacity: phase === 'start' ? 0 : 0.5,
          transform: phase === 'start' ? 'scale(1.08)' : 'scale(1)',
          transition: 'opacity 2s ease, transform 6s ease-out',
          pointerEvents: 'none',
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse at center, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.72) 55%, rgba(10,10,10,0.94) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative' }}>
        <p style={{ fontStyle: 'italic', fontSize: '1.5rem', margin: 0, textAlign: 'center' }}>
          <span style={{ color: 'white', ...visible(phase !== 'start') }}>
            "A walk through the corridors{' '}
          </span>
          <span style={{ color: 'var(--color-red)', ...visible(phase === 'line2' || phase === 'hold') }}>
            awakens the senses."
          </span>
        </p>
      </div>
      <p style={{
        position: 'absolute',
        bottom: 48,
        right: 120,
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
        ...visible(phase === 'hold'),
      }}>
        - 1997–98 Season Brochure
      </p>
      <p style={{
        position: 'absolute',
        bottom: 48,
        left: 120,
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
        ...visible(phase !== 'start'),
      }}>
        Click to skip
      </p>

    </div>
  );
}
