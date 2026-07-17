import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import RubikCube from './RubikCube';
import { sfx } from '../sound';

/* Pixel-art arcade coin (16×16 grid, classic platformer style — procedural, no assets).
   . transparent · O outline · G gold · H highlight · S shade · D slot */
const COIN_SPRITE = [
  '................',
  '.....OOOOOO.....',
  '...OOGGGGGGOO...',
  '..OGGHHGGGGGGO..',
  '..OGHHGDDGGGSO..',
  '.OGHHGGDDGGGGSO.',
  '.OGHGGGDDGGGGSO.',
  '.OGHGGGDDGGGGSO.',
  '.OGHGGGDDGGGGSO.',
  '.OGHGGGDDGGGGSO.',
  '.OGHHGGDDGGGGSO.',
  '..OGHHGDDGGSSO..',
  '..OGGHHGGGSSSO..',
  '...OOGGGGSSOO...',
  '.....OOOOOO.....',
  '................',
];
const COIN_COLORS: Record<string, string> = {
  O: '#3d2800',
  G: '#f7c948',
  H: '#fdeaa8',
  S: '#d98a2b',
  D: '#3d2800',
};

function PixelCoin() {
  return (
    <svg width="64" height="64" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      {COIN_SPRITE.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={COIN_COLORS[cell]} />
        )
      )}
    </svg>
  );
}

interface CartridgeLoaderProps {
  /** Headline above the cube. */
  label?: string;
  /** Seconds for the progress bar to reach 100. */
  duration?: number;
  /** Play the coin-drop intro. Use false for level transitions. */
  withCoin?: boolean;
  onDone: () => void;
}

/** Fullscreen retro loader: optional coin drop → frantic Rubik's cube → stepped progress bar. */
export default function CartridgeLoader({
  label = 'INSERT COIN ▸ LOADING CARTRIDGE',
  duration = 3.4,
  withCoin = true,
  onDone,
}: CartridgeLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  // reduced-motion: skip coin + cube entirely — progress bar only
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches).current;

  useEffect(() => {
    if (withCoin) sfx.coin();
    const q = gsap.utils.selector(rootRef);
    const progress = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        sfx.boot();
        doneRef.current();
      },
    });
    if (withCoin && !reduced) {
      tl.fromTo(
        q('.boot__coin'),
        { y: -240, rotationY: 0, opacity: 0 },
        { y: 0, rotationY: 720, opacity: 1, duration: 0.8, ease: 'bounce.out', transformPerspective: 400 }
      );
    }
    tl.fromTo(q('.boot__title'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4 }, '-=0.2');
    if (!reduced) {
      tl.fromTo(q('.boot__cube'), { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' });
    }
    tl.to(progress, {
        v: 100,
        duration: reduced ? Math.min(duration, 0.8) : duration,
        ease: 'steps(34)',
        onUpdate: () => {
          const pct = Math.round(progress.v);
          if (barRef.current) barRef.current.style.width = `${pct}%`;
          if (pctRef.current) pctRef.current.textContent = `${pct}%`;
        },
      })
      .to(rootRef.current, { opacity: 0, duration: 0.3 });
    return () => {
      tl.kill();
    };
  }, [withCoin, duration, reduced]);

  return (
    <div className="boot crt-fx" ref={rootRef}>
      {withCoin && !reduced && <div className="boot__coin"><PixelCoin /></div>}
      <div className="boot__title">{label}</div>
      {!reduced && (
        <>
          <div className="boot__cube">
            <RubikCube frantic />
          </div>
          <div className="boot__hint">SOLVING THE LOAD-CUBE… CLICK IT TO HELP!</div>
        </>
      )}
      <div className="boot__bar">
        <div className="boot__bar-fill" ref={barRef} />
      </div>
      <span className="boot__pct" ref={pctRef}>0%</span>
    </div>
  );
}
