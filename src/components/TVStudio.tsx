// src/components/TVStudio.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TV_CHANNELS } from '../data';
import { sfx } from '../sound';

gsap.registerPlugin(ScrollTrigger);

export default function TVStudio() {
  const rootRef = useRef<HTMLElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<HTMLDivElement>(null);
  const lowerRef = useRef<HTMLDivElement>(null);
  const [channel, setChannel] = useState(0);
  const [power, setPower] = useState(true);
  const [staticBurst, setStaticBurst] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const active = TV_CHANNELS[channel];
  const ticker = `${active.genre} • ${active.length} ··· ${active.synopsis} ··· 📼 Insert a cassette from the film archive to change the channel.`;

  // CRT static noise
  useEffect(() => {
    const canvas = noiseRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 220;
    canvas.height = 140;
    let raf = 0;
    let visible = true;
    // freeze the static while the TV is scrolled out of view
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const img = ctx.createImageData(canvas.width, canvas.height);
      const d = img.data;
      // heavy snow during channel change / power off, faint film grain otherwise
      const intensity = !power || staticBurst ? 255 : 26;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * intensity;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = !power || staticBurst ? 255 : 60;
      }
      ctx.putImageData(img, 0, 0);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [power, staticBurst]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tvcab',
        { y: 90, opacity: 0, rotate: -2 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.tv__grid', start: 'top 78%' },
        }
      );
      gsap.fromTo(
        '.vhs',
        { y: 26, opacity: 0, scale: 0.7 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: '.tvcab__shelf', start: 'top 88%' },
        }
      );
      gsap.fromTo(
        '.tvlower',
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'opacity', /* .tvlower--off dims via class opacity */
          scrollTrigger: { trigger: '.tv__grid', start: 'top 78%' },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const runTune = useCallback((i: number) => {
    sfx.channel();
    setStaticBurst(true);
    gsap.to(knobRef.current, { rotate: i * 90, duration: 0.45, ease: 'back.out(2)' });
    if (programRef.current) {
      gsap.fromTo(programRef.current, { opacity: 0, scaleY: 0.05 }, { opacity: 1, scaleY: 1, duration: 0.4, delay: 0.25 });
    }
    if (lowerRef.current) {
      gsap.fromTo(lowerRef.current, { opacity: 0.15 }, { opacity: 1, duration: 0.45, delay: 0.25, clearProps: 'opacity' });
    }
    setTimeout(() => {
      setChannel(i);
      setStaticBurst(false);
      setVideoPlaying(false); /* the <video> unmounts on retune — onPause never fires */
    }, 260);
  }, []);

  function tune(i: number) {
    if (i === channel || !power) return;
    runTune(i);
  }

  // External "WATCH IN STUDIO" buttons (research logs) tune the TV by channel id.
  useEffect(() => {
    const onTune = (e: Event) => {
      const id = (e as CustomEvent<number>).detail;
      const idx = TV_CHANNELS.findIndex((c) => c.id === id);
      if (idx < 0) return;
      setPower(true);
      runTune(idx);
    };
    window.addEventListener('tv:tune', onTune);
    return () => window.removeEventListener('tv:tune', onTune);
  }, [runTune]);

  function togglePower() {
    sfx.click();
    setPower((p) => {
      if (p) setVideoPlaying(false); /* video unmounts when switching off */
      return !p;
    });
  }

  return (
    <section className="section" id="tv" ref={rootRef}>
      <div className="section-tag" style={{ background: 'var(--sage)' }}>
        🎬 TV BROADCASTING STUDIO 🎬
      </div>

      <div className="tv__grid">
        {/* '80s living-room wall unit: wood cabinet + TV + VHS film archive */}
        <div className="tvcab">
          <span className="tvcab__antenna" aria-hidden="true"><i /><i /></span>

          <div className="tvset">
            <div className="tvset__brand">📺 SANDY CINE-VISION 16:9 ✨</div>
            <div className="tvset__screen-wrap">
              <div className="tvset__screen">
                <canvas className="tvset__noise" ref={noiseRef} />
                {power && (active.videoSrc ? (
                  /* click-to-play (Sandy 07-17): no autoplay, so audio is allowed on user gesture */
                  <video
                    className="tvset__video"
                    src={active.videoSrc}
                    loop
                    playsInline
                    controls
                    preload="metadata"
                    onPlay={() => setVideoPlaying(true)}
                    onPause={() => setVideoPlaying(false)}
                  />
                ) : (
                  <div className="tvset__program" ref={programRef}>
                    <span className="tvset__prog-icon">{active.icon}</span>
                    <div className="tvset__prog-title">CH_{String(active.id).padStart(2, '0')} ▸ {active.title}</div>
                    <div className="tvset__prog-meta">{active.genre} • {active.length}</div>
                  </div>
                ))}
                {!power && <div className="tvset__off">⏻ CINE_OFF — PRESS POWER</div>}
              </div>
            </div>
            <div className="tvset__panel">
              <span className={`tvset__onair ${power && videoPlaying ? 'tvset__onair--live' : ''}`}>
                ON AIR
              </span>
              <span className="tvset__panel-label">CHANNEL</span>
              <div className="tvset__knob" ref={knobRef} />
              <span className="tvset__panel-label">CH SELECT</span>
              <div className="tvset__knob tvset__knob--vol" />
              <span className="tvset__panel-label">VOLUME</span>
              <div className="tvset__grille" />
              <span className="tvset__panel-label">POWER<br />CINE_ON</span>
              <button
                className={`tvset__power ${power ? '' : 'tvset__power--off'}`}
                onClick={togglePower}
                aria-label="TV power"
              />
            </div>
          </div>

          <div className="tvcab__shelf">
            <div className="tvcab__shelf-label">📼 FILM ARCHIVE // INSERT A TAPE TO TUNE</div>
            <div className="tvcab__tapes">
              {TV_CHANNELS.map((ch, i) => (
                <button
                  key={ch.id}
                  className={`vhs ${i === channel ? 'vhs--in' : ''} ${ch.tape === 'BLANK TAPE' ? 'vhs--blank' : ''}`}
                  onClick={() => tune(i)}
                  onMouseEnter={() => sfx.hover()}
                  aria-label={`Tune to channel ${ch.id}: ${ch.title}`}
                  aria-pressed={i === channel}
                >
                  <span className="vhs__num">{String(ch.id).padStart(2, '0')}</span>
                  <span className="vhs__label">{ch.tape}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* lower third — broadcast caption bar under the set (the old guide panel, compressed) */}
        <div className={`tvlower ${power ? '' : 'tvlower--off'}`} ref={lowerRef}>
          <div className="tvlower__row">
            <span className="tvlower__ch">CH_{String(active.id).padStart(2, '0')}</span>
            <span className="tvlower__title">{active.icon} {active.title}</span>
            <span className="tvlower__tapes">{TV_CHANNELS.length} TAPES ARCHIVED</span>
          </div>
          <div className="tvlower__tickerwrap">
            {/* two copies scroll seamlessly; key restarts the loop on retune */}
            <div className="tvlower__ticker" key={channel}>
              <span>{ticker}</span>
              <span aria-hidden="true">{ticker}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
