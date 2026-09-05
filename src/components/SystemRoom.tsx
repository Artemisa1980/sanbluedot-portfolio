import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DEMO_COMMITS, PROFILE } from '../data';
import { sfx } from '../sound';

gsap.registerPlugin(ScrollTrigger);

// GitHub contribution greens — kept as-is on purpose (Sandy's rule: authentic GH look)
const GH_COLORS = ['rgba(19,26,67,0.08)', '#bbf7d0', '#6ee7b7', '#34d399', '#0d9488'];

export default function SystemRoom() {
  const rootRef = useRef<HTMLElement>(null);
  const stdoutRef = useRef<HTMLDivElement>(null);
  const stdoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Illustrative heatmap, seeded so it doesn't reshuffle per render; no GitHub API connection.
  const cells = useMemo(() => {
    let seed = 20260611;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: 112 }, () => {
      const r = rand();
      if (r < 0.52) return 0;
      if (r < 0.7) return 1;
      if (r < 0.84) return 2;
      if (r < 0.94) return 3;
      return 4;
    });
  }, []);

  // entrance: terminals rise + desk slides in (like the reception/analytics diorama),
  // then the grid cells pop and the commit log types on
  useEffect(() => {
    // GSAP writes inline styles, which the CSS reduced-motion block cannot reach.
    // The grid cells and console lines start hidden in CSS, so they must be landed,
    // not skipped.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.gh__cell', { scale: 1 });
        gsap.set('.console__line', { opacity: 1 });
        return;
      }
      gsap.fromTo(
        '.dsk__row > *',
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.dsk', start: 'top 80%' },
        }
      );
      gsap.fromTo(
        '.dsk__desk',
        { scaleX: 0.92, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.dsk', start: 'top 72%' },
        }
      );
      gsap.to('.gh__cell', {
        scale: 1,
        duration: 0.4,
        stagger: { each: 0.008, from: 'random' },
        ease: 'back.out(2.5)',
        scrollTrigger: { trigger: '.gh__cells', start: 'top 85%' },
      });
      gsap.to('.console__line', {
        opacity: 1,
        duration: 0.05,
        stagger: 0.3,
        scrollTrigger: { trigger: '.console', start: 'top 85%' },
      });
    }, rootRef);
    return () => {
      ctx.revert();
      if (stdoutTimerRef.current !== null) clearTimeout(stdoutTimerRef.current);
    };
  }, []);

  function typeStdout(lines: string[]) {
    if (stdoutTimerRef.current !== null) clearTimeout(stdoutTimerRef.current);
    const el = stdoutRef.current;
    if (!el) return;
    el.textContent = '';
    let li = 0;
    let ci = 0;
    const tick = () => {
      if (li >= lines.length) return;
      const line = lines[li];
      ci++;
      el.textContent = lines.slice(0, li).join('\n') + (li ? '\n' : '') + line.slice(0, ci);
      if (ci >= line.length) {
        li++;
        ci = 0;
      }
      stdoutTimerRef.current = setTimeout(tick, 12);
    };
    tick();
  }

  function onSend(e: FormEvent) {
    e.preventDefault();
    const sender = name.trim();
    const content = message.trim();
    if (!sender || !content) {
      sfx.locked();
      typeStdout(['SYS: ERROR — missing fields.', 'SYS: ENTER_NAME and ENTER_MESSAGE are required.']);
      return;
    }
    sfx.send();
    typeStdout([
      'SYS: Opening your email app with a draft…',
      'SYS: Review and send it from your email app.',
      'SYS: Delivery is not tracked by this site.',
    ]);
    const subject = encodeURIComponent(`[RETRO DEV-STATION] Connection request from ${sender}`);
    const body = encodeURIComponent(`${content}\n\n— ${sender}${email.trim() ? ` (${email.trim()})` : ''}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section className="section" id="mail" ref={rootRef}>
      <div className="section-tag" style={{ background: 'var(--mintsoft)' }}>
        🛰 SYSTEM ROOM // GIT + MAIL
      </div>

      <div className="dsk dsk--panel dsk--sysroom">
        <div className="dsk__row">
          {/* LEFT — GitHub activity in a CRT monitor on a stand */}
          <div className="dsk-mon">
            <div className="dsk-mon__case">
              <div className="dsk-mon__strip">
                <span className="dsk-mon__label">▚ GITHUB.SYS</span>
                <span className="dsk-mon__led" />
              </div>
              <div className="dsk-mon__screen">
                <div className="card">
                  <div className="gh__head">
                    <div>
                      <div className="gh__title">🐙 GitHub Activity Demo</div>
                      <div className="gh__sub">Illustrative grid and sample commits — not live data</div>
                    </div>
                    <span className="gh__branch">⎇ demo: main</span>
                  </div>

                  <div className="gh__cells" aria-hidden="true">
                    {cells.map((level, i) => (
                      <i key={i} className="gh__cell" style={{ background: GH_COLORS[level] }} />
                    ))}
                  </div>
                  <div className="gh__legend">
                    Less {GH_COLORS.map((c, i) => <i key={i} style={{ background: c }} />)} More
                  </div>

                  <div className="console">
                    <div className="console__dots">
                      <i style={{ background: '#ff5f57' }} />
                      <i style={{ background: '#febc2e' }} />
                      <i style={{ background: '#28c840' }} />
                    </div>
                    {DEMO_COMMITS.map((c) => (
                      <div className="console__line" key={c.hash}>
                        <span className="t">[{c.date}]</span> <span className="b">main</span>{' '}
                        <span className="h">{c.hash}:</span> {c.msg}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="dsk-mon__vents"><i /><i /><i /></div>
            </div>
            <div className="dsk-mon__neck" />
            <div className="dsk-mon__base" />
            <div className="dsk__propsL">
              <div className="dsk-plaque">&lt;SANDY.SYSDEV/&gt; · AI BUILDER</div>
            </div>
            <div className="dsk__propsLR">
              <div className="dsk-sticky" />
            </div>
          </div>

          {/* RIGHT — mail room in a monitor stacked on the SANDY-86 CPU */}
          <div className="dsk-rig">
            <div className="dsk-mon__case">
              <div className="dsk-mon__strip">
                <span className="dsk-mon__label">▚ MAILROOM.SYS — MAILTO</span>
                <span className="dsk-mon__led" />
              </div>
              <div className="dsk-mon__screen">
                <form className="mail" onSubmit={onSend}>
                  <div className="mail__title">✉️ MAIL ROOM TERMINAL ✉️</div>

                  {/* real <label>s: the accessible name must contain the visible
                      prompt text (WCAG 2.5.3 Label in Name) */}
                  <label className="mail__prompt" htmlFor="mail-name">
                    GUEST@SANDY.SYS:~$ <b>ENTER_NAME</b>
                  </label>
                  <input
                    id="mail-name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name or Company"
                  />

                  <label className="mail__prompt" htmlFor="mail-email">
                    GUEST@SANDY.SYS:~$ <b>ENTER_EMAIL</b>
                  </label>
                  <input
                    id="mail-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="recruiter@company.com"
                  />

                  <label className="mail__prompt" htmlFor="mail-message">
                    GUEST@SANDY.SYS:~$ <b>ENTER_MESSAGE</b>
                  </label>
                  <textarea
                    id="mail-message"
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your connection request or greeting here…"
                  />

                  <button className="mail__send" type="submit">
                    📡 RUN CONNECT_MAIL
                  </button>

                  <div className="mail__stdout" ref={stdoutRef} role="status" aria-live="polite">
                    {`SYS: Opens your email app with a draft.\nSYS: Review and send there; delivery is not tracked.`}
                  </div>

                  <div className="mail__shortcuts">
                    <button
                      type="button"
                      className="mail__shortcut"
                      onClick={async () => {
                        try {
                          if (!navigator.clipboard) throw new Error('Clipboard unavailable');
                          await navigator.clipboard.writeText(PROFILE.email);
                          sfx.pop();
                          typeStdout([`SYS: ${PROFILE.email} copied to clipboard. 📋`]);
                        } catch {
                          typeStdout([`SYS: Copy unavailable. Email: ${PROFILE.email}`, 'SYS: Use OPEN EMAIL CLIENT below.']);
                        }
                      }}
                    >
                      ⧉ COPY GMAIL
                    </button>
                    <a className="mail__shortcut" href={`mailto:${PROFILE.email}`} onClick={() => sfx.click()}>
                      ✉ OPEN EMAIL CLIENT
                    </a>
                    <a className="mail__shortcut" href={PROFILE.linkedin} target="_blank" rel="noreferrer" onClick={() => sfx.click()}>
                      in LINKEDIN
                    </a>
                  </div>
                </form>
              </div>
              <div className="dsk-mon__vents"><i /><i /><i /></div>
            </div>
            <div className="dsk-cpu">
              <div className="dsk-cpu__bays">
                <div className="dsk-bay" />
                <div className="dsk-bay" />
              </div>
              <div className="dsk-cpu__ctrl">
                <span className="dsk-cpu__brand">SANDY-86</span>
                <span className="dsk-cpu__hdd"><i /> HDD</span>
                <span className="dsk-cpu__turbo">TURBO</span>
                <span className="dsk-cpu__power" />
              </div>
            </div>
            <div className="dsk__propsRL">
              <div className="dsk-plant"><div className="dsk-plant__leaf" /><div className="dsk-plant__pot" /></div>
            </div>
            <div className="dsk__propsR">
              <div className="dsk-mug" />
              <button className="dsk-bell" aria-label="Ring the desk bell" onClick={() => sfx.bell()}>
                <span className="dsk-bell__dome" />
                <span className="dsk-bell__base" />
              </button>
            </div>
          </div>
        </div>

        {/* the desk surface. Props now live inside each terminal (above) so each
            terminal carries its own props when the row stacks on mobile. */}
        <div className="dsk__desk" />
      </div>
    </section>
  );
}
