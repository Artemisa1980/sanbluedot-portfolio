import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArcadeCarousel from './ArcadeCarousel';
import GameShell from './GameShell';

gsap.registerPlugin(ScrollTrigger);

interface ActiveGame {
  id: string;
  screenEl: HTMLElement;
}

export default function Arcade() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<ActiveGame | null>(null);

  // carousel rises from below as you scroll in
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.carousel',
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.carousel', start: 'top 80%' },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section crt crt-fx" id="arcade" ref={rootRef}>
      <div className="arcade__head">
        <div className="section-tag" style={{ background: 'var(--gold)' }}>
          🕹️ ARCADE STATION 🕹️
        </div>
        <h2 className="section-title" style={{ color: 'var(--cream)' }}>
          SANDY'S <span style={{ color: 'var(--mint)' }}>DEV-STATION</span>
        </h2>
        <p className="arcade__sub">CLASSIC '80s ARCADE CABINETS • 6 CARTRIDGE SLOTS • INSERT COIN</p>
      </div>

      <ArcadeCarousel
        paused={active !== null}
        onLaunch={(id, screenEl) => setActive({ id, screenEl })}
      />

      {active && (
        <GameShell gameId={active.id} screenEl={active.screenEl} onClose={() => setActive(null)} />
      )}
    </section>
  );
}
