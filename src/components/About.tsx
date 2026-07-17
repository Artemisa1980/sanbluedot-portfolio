// src/components/About.tsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROFILE, CERTIFICATIONS, SKILLS, EDUCATION } from '../data';
import { sfx } from '../sound';

gsap.registerPlugin(ScrollTrigger);

type VaultTab = 'certs' | 'skills';

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const vaultScreenRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<VaultTab>('certs');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about__grid > *',
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.about__grid', start: 'top 78%' },
        }
      );
      gsap.fromTo(
        '.edu',
        { y: 50, opacity: 0, rotate: -2 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.edu__grid', start: 'top 85%' },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // vault screen content animates per tab (certs slide in / skill bars fill)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (tab === 'certs') {
        gsap.fromTo(
          '.cert',
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.09,
            ease: 'power2.out',
            scrollTrigger: { trigger: vaultScreenRef.current, start: 'top 85%' },
          }
        );
      } else {
        gsap.utils.toArray<HTMLElement>('.skill').forEach((el, i) => {
          const fill = el.querySelector<HTMLElement>('.skill__fill')!;
          const pct = el.querySelector<HTMLElement>('.skill__pct')!;
          const level = Number(fill.dataset.level);
          const counter = { v: 0 };
          gsap.fromTo(el, { opacity: 0, y: 24 }, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            delay: i * 0.05,
            scrollTrigger: { trigger: el, start: 'top 92%' },
          });
          gsap.fromTo(
            fill,
            { width: '0%' },
            {
              width: `${level}%`,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 92%' },
            }
          );
          gsap.to(counter, {
            v: level,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%' },
            onUpdate: () => {
              pct.textContent = `${Math.round(counter.v)}/100`;
            },
          });
        });
      }
      // tab content changes the section height — re-measure the triggers below
      ScrollTrigger.refresh();
    }, vaultScreenRef);
    return () => ctx.revert();
  }, [tab]);

  function switchTab(next: VaultTab) {
    if (next === tab) return;
    sfx.channel();
    setTab(next);
  }

  return (
    <section className="section" id="reception" ref={rootRef}>
      <div className="section-tag" style={{ background: 'var(--pink)' }}>
        🌸 RECEPTION DESK // BIOGRAPHY
      </div>

      <div className="about__grid">
        {/* left terminal — professional identity */}
        <div className="term-unit">
          <div className="term-unit__top">
            <span className="term-unit__label">💾 IDENTITY.SYS</span>
            <div className="term-unit__leds">
              <i style={{ background: '#ff5f57' }} />
              <i style={{ background: '#febc2e' }} />
              <i style={{ background: '#28c840' }} />
            </div>
          </div>

          <div className="term-unit__screen">
            <span className="about__label">Professional Identity</span>
            <h2 className="about__name">{PROFILE.name} ☕️👾</h2>
            <div className="about__role">{PROFILE.title}</div>
            <div className="about__meta">
              <span>📍 {PROFILE.location}</span>
              <span>✉️ {PROFILE.email}</span>
            </div>
            <p className="about__bio">“{PROFILE.bio}”</p>
            <div className="about__langs">
              {PROFILE.languages.map((l) => (
                <div className="about__lang" key={l.name}>
                  <span>🌐 {l.name}</span>
                  <span className="chip">{l.level}</span>
                </div>
              ))}
            </div>
            <a
              className="btn"
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => sfx.click()}
              style={{ marginBottom: 24 }}
            >
              in LinkedIn Network ↗
            </a>
            <div className="about__quote">💼 “{PROFILE.quote}” — {PROFILE.name}</div>
          </div>

          <div className="term-unit__panel">
            <span className="term-unit__power" />
            <span>POWER</span>
            <span className="term-unit__status">GUEST_PROFILE ONLINE</span>
          </div>
        </div>

        {/* right terminal — credential vault with CERTS / SKILLS tabs */}
        <div className="term-unit">
          <div className="term-unit__top">
            <span className="term-unit__label">🗄 VAULT.SYS</span>
            <div className="term-unit__tabs" role="tablist" aria-label="Credential vault">
              <button
                role="tab"
                aria-selected={tab === 'certs'}
                className={`term-unit__tab ${tab === 'certs' ? 'term-unit__tab--on' : ''}`}
                onClick={() => switchTab('certs')}
                onMouseEnter={() => sfx.hover()}
              >
                🏅 CERTS
              </button>
              <button
                role="tab"
                aria-selected={tab === 'skills'}
                className={`term-unit__tab ${tab === 'skills' ? 'term-unit__tab--on' : ''}`}
                onClick={() => switchTab('skills')}
                onMouseEnter={() => sfx.hover()}
              >
                ⚡ SKILLS
              </button>
            </div>
          </div>

          <div className="term-unit__screen" role="tabpanel" ref={vaultScreenRef}>
            {tab === 'certs' ? (
              <>
                <div className="vault__prompt">GUEST@RECEPTION:~$ open certification_vault</div>
                <div className="certs__list">
                  {CERTIFICATIONS.map((c) => (
                    <div className="cert" key={c.id} onMouseEnter={() => sfx.hover()}>
                      <span className="cert__icon">{c.icon}</span>
                      <div>
                        <div className="cert__name">{c.name}</div>
                        <div className="cert__issuer">{c.issuer}</div>
                      </div>
                      <span className="cert__year">{c.year}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="vault__prompt">GUEST@RECEPTION:~$ run skill_matrix --power-ups</div>
                <div className="vault__skills">
                  {SKILLS.map((s) => (
                    <div className="skill" key={s.name}>
                      <div className="skill__head">
                        <span className="skill__name">{s.name}</span>
                        <span
                          className={`skill__cat ${
                            s.category === 'Soft Skills' ? 'skill__cat--soft' : `skill__cat--${s.category}`
                          }`}
                        >
                          {s.category}
                        </span>
                        <span className="skill__pct">0/100</span>
                      </div>
                      <div className="skill__bar">
                        <div className="skill__fill" data-level={s.level} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="term-unit__panel">
            <span className="term-unit__power" />
            <span>POWER</span>
            <span className="term-unit__status">
              {tab === 'certs'
                ? `${CERTIFICATIONS.length} CERTS LOADED`
                : `${SKILLS.length} POWER-UPS INDEXED`}
            </span>
          </div>
        </div>
      </div>

      <div className="edu__grid">
        {EDUCATION.map((e) => (
          <div className="edu" key={e.id}>
            <div className="edu__deg">🎓 {e.degree}</div>
            <div className="edu__inst">{e.institution}</div>
            <div className="edu__period">{e.period}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
