import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import SanblueBadge from './SanblueBadge';
import { sfx } from '../sound';

const BOOT_STEPS = [
  { verb: 'BIOS CHECK', detail: 'SANDY_OS v2.0', progress: 18 },
  { verb: 'LOADING', detail: 'OPERATIONS.EXE · 20+ YRS', progress: 38 },
  { verb: 'MOUNTING', detail: 'FINANCE_LAB.SYS', progress: 59 },
  { verb: 'CONNECTING', detail: 'AI_BUILDER.NET', progress: 81 },
  { verb: 'OPENING', detail: 'RESEARCH_ARCHIVE.DRV', progress: 100 },
];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const readyRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitRequestedRef = useRef(false);
  const doneRef = useRef(onDone);
  const [ready, setReady] = useState(false);
  doneRef.current = onDone;

  const leaveBoot = (withSound = false) => {
    if (exitRequestedRef.current) return;
    exitRequestedRef.current = true;
    if (withSound) sfx.click();
    const timeline = timelineRef.current;
    if (!timeline) {
      doneRef.current();
      return;
    }
    timeline.seek('exit').play();
  };

  // The boot screen is an aria-modal dialog over the whole page, so keyboard focus
  // must start inside it and stay inside it until it closes.
  useEffect(() => {
    const skip = rootRef.current?.querySelector<HTMLButtonElement>('.preloader__skip');
    skip?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !rootRef.current) return;
      const focusable = rootRef.current.querySelectorAll<HTMLElement>('button:not([disabled])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!rootRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Review scaffolding is a development affordance and never reaches the public site.
    const reviewToken = import.meta.env.DEV
      ? new URLSearchParams(window.location.search).get('review')
      : null;
    const holdForReview = reviewToken === 'preloader-cinematic-20260904';
    // Sandy 2026-09-04: the boot always plays in full. The earlier shortcut replayed
    // it at 48% speed on every load after the first one in a browser session.
    const speed = reduced ? 0.06 : 1;
    const duration = (seconds: number) => seconds * speed;
    const lineEls = linesRef.current ? Array.from(linesRef.current.children) : [];

    const ctx = gsap.context(() => {
      gsap.set(shellRef.current, { autoAlpha: 0, scaleY: 0.025 });
      gsap.set(beamRef.current, { autoAlpha: 0, scaleX: 0 });
      gsap.set(logoRef.current, { autoAlpha: 0, y: 10, scale: 0.78 });
      gsap.set(lineEls, { autoAlpha: 0, y: 8 });
      gsap.set(barRef.current, { scaleX: 0 });
      gsap.set(readyRef.current, { autoAlpha: 0, y: 8 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => doneRef.current(),
      });
      timelineRef.current = tl;

      tl.to(beamRef.current, { autoAlpha: 1, scaleX: 1, duration: duration(0.18) })
        .to(shellRef.current, { autoAlpha: 1, scaleY: 1, duration: duration(0.3), ease: 'power3.out' }, '<')
        .to(beamRef.current, { autoAlpha: 0, duration: duration(0.14) })
        .to(logoRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: duration(0.34) }, '<');

      BOOT_STEPS.forEach((step, index) => {
        tl.to(
          lineEls[index],
          { autoAlpha: 1, y: 0, duration: duration(0.17) },
          index === 0 ? `>+=${duration(0.02)}` : `>+=${duration(0.08)}`
        ).call(() => {
          if (percentRef.current) percentRef.current.textContent = `${step.progress}%`;
          gsap.to(barRef.current, {
            scaleX: step.progress / 100,
            duration: duration(0.24),
            ease: 'steps(4)',
          });
        });
      });

      tl.call(() => setReady(true))
        .to(readyRef.current, { autoAlpha: 1, y: 0, duration: duration(0.24), ease: 'back.out(1.6)' });

      if (holdForReview) {
        // Keep the finished screen visible for review; either button seeks past this hold.
        tl.to({}, { duration: 3600 });
      } else {
        // Give the visitor enough time to read the completed boot screen.
        tl.to({}, { duration: reduced ? 0.12 : 2.4 });
      }

      tl.addLabel('exit')
        .call(() => {
          exitRequestedRef.current = true;
        });

      if (reduced) {
        tl.to(rootRef.current, { autoAlpha: 0, duration: 0.12 });
      } else {
        tl.to(screenRef.current, {
          scaleY: 0.018,
          filter: 'brightness(3)',
          duration: duration(0.24),
          ease: 'power3.in',
        })
          .to(screenRef.current, { scaleX: 0, autoAlpha: 0, duration: duration(0.16), ease: 'power2.in' })
          // Sandy 2026-09-04: the handover to the page was abrupt at 0.18s. The screen
          // still collapses like a CRT; the panel itself now dissolves gently.
          .to(rootRef.current, { autoAlpha: 0, duration: duration(0.55), ease: 'power2.out' });
      }
    }, rootRef);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <div className="preloader" ref={rootRef} role="dialog" aria-modal="true" aria-label="sanbluedot system booting">
      <div className="preloader__ambient" aria-hidden="true" />
      <div className="preloader__power-beam" ref={beamRef} aria-hidden="true" />

      <div className="preloader__shell" ref={shellRef}>
        <i className="preloader__screw preloader__screw--tl" aria-hidden="true" />
        <i className="preloader__screw preloader__screw--tr" aria-hidden="true" />
        <i className="preloader__screw preloader__screw--bl" aria-hidden="true" />
        <i className="preloader__screw preloader__screw--br" aria-hidden="true" />

        <button className="preloader__skip" type="button" onClick={() => leaveBoot(true)}>
          SKIP BOOT ↗
        </button>

        <div className="preloader__screen" ref={screenRef}>
          <div className="preloader__screen-head">
            <span>SANBLUE.DOT // POWER-ON SELF TEST</span>
            <span className="preloader__signal"><i /> SIGNAL</span>
          </div>

          <div className="preloader__brand" ref={logoRef}>
            <SanblueBadge className="preloader__logo" variant="sage" />
            <div className="preloader__brand-copy">
              <strong>RETRO DEV-STATION</strong>
              <span>PORTFOLIO SYSTEM · BUILD 2.0</span>
            </div>
          </div>

          <div className="preloader__lines" ref={linesRef} aria-live="polite">
            {BOOT_STEPS.map((step) => (
              <div className="preloader__line" key={step.detail}>
                <span className="preloader__verb">{step.verb}</span>
                <span>{step.detail}</span>
                <b>OK</b>
              </div>
            ))}
          </div>

          <div className="preloader__load">
            <div className="preloader__load-meta">
              <span>SYSTEM LOAD</span>
              <span ref={percentRef}>0%</span>
            </div>
            <div className="preloader__bar" aria-hidden="true">
              <div className="preloader__bar-fill" ref={barRef} />
            </div>
          </div>

          <div className="preloader__ready">
            <button
              className="preloader__enter"
              type="button"
              ref={readyRef}
              disabled={!ready}
              onClick={() => leaveBoot(true)}
            >
              <span className="preloader__cursor">▸</span> SYSTEM READY — ENTER STATION ↵
            </button>
            <span className="preloader__autostart">AUTO-LAUNCH SEQUENCE ACTIVE</span>
          </div>
        </div>

        <div className="preloader__case-label">
          <span>SANDY-86</span>
          <span>CRT / 1986</span>
          <i aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
