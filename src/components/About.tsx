// src/components/About.tsx — RECEPTION DESK SCENE (workshop 2026-07-17)
// 80s workstation diorama: ONE shared wall shelf on top holding the education
// manuals + the floppy cert archive (education card sits on the shelf like a
// plaque) · below it the two CRT terminals start on the same line — IDENTITY on
// its stand, VAULT on the SANDY-86 CPU — both seated on the wood desk.
// Certs are disks you insert into drive A:; SKILLS.EXE is the system disk.
// All art procedural CSS.
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROFILE, CERTIFICATIONS, SKILLS, EDUCATION } from '../data';
import { sfx } from '../sound';

gsap.registerPlugin(ScrollTrigger);

const READ_MS = 950; // drive "reading" time before a disk's content appears

// book-spine metadata per education entry (short label, color modifier, spine height)
const SPINES: Record<string, { label: string; mod: string; h: number }> = {
  'ibm-cert': { label: 'AI BUILDER', mod: 'ai', h: 120 },
  utel: { label: 'UTEL · BBA', mod: 'utel', h: 132 },
  worwic: { label: 'HOTEL MGMT', mod: 'hotel', h: 110 },
  ucsg: { label: 'BUSINESS MGMT', mod: 'biz', h: 114 },
};

const DISKS = [
  ...CERTIFICATIONS.map((c) => ({ id: c.id, title: c.name, sub: `${c.issuer} · ${c.year}` })),
  { id: 'skills', title: 'SKILLS.EXE', sub: 'System Disk · skill matrix' },
];

const fileOf = (id: string) => (id === 'skills' ? 'SKILLS.EXE' : `${id.toUpperCase()}.CRT`);

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const readTimer = useRef(0);
  const [disk, setDisk] = useState(CERTIFICATIONS[0].id);
  const [pending, setPending] = useState<string | null>(null);
  const [book, setBook] = useState('utel');
  const reading = pending !== null;

  // entrance: shelf drops in, monitors rise, desk slides in, books pop up
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dsk-shelfbar',
        { y: -34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.dsk', start: 'top 80%' },
        }
      );
      gsap.fromTo(
        '.dsk__row > *',
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.dsk', start: 'top 78%' },
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
          scrollTrigger: { trigger: '.dsk', start: 'top 70%' },
        }
      );
      gsap.fromTo(
        '.shelfbook',
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.09,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: '.dsk-shelfbar', start: 'top 88%' },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // skill bars fill each time SKILLS.EXE finishes loading
  useEffect(() => {
    if (disk !== 'skills' || reading) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.skill').forEach((el, i) => {
        const fill = el.querySelector<HTMLElement>('.skill__fill')!;
        const pct = el.querySelector<HTMLElement>('.skill__pct')!;
        const level = Number(fill.dataset.level);
        const counter = { v: 0 };
        gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, delay: i * 0.04 });
        gsap.fromTo(fill, { width: '0%' }, { width: `${level}%`, duration: 1, ease: 'power3.out', delay: i * 0.04 });
        gsap.to(counter, {
          v: level,
          duration: 1,
          delay: i * 0.04,
          onUpdate: () => {
            pct.textContent = `${Math.round(counter.v)}/100`;
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [disk, reading]);

  useEffect(() => () => window.clearTimeout(readTimer.current), []);

  function insert(id: string) {
    if (reading || id === disk) return;
    sfx.floppy();
    setPending(id);
    readTimer.current = window.setTimeout(() => {
      setDisk(id);
      setPending(null);
    }, READ_MS);
  }

  const cert = CERTIFICATIONS.find((c) => c.id === disk);
  const eduSel = EDUCATION.find((e) => e.id === book) ?? EDUCATION[0];

  return (
    <section className="section" id="reception" ref={rootRef}>
      <div className="section-tag" style={{ background: 'var(--sage)' }}>
        🌸 RECEPTION DESK // BIOGRAPHY
      </div>

      <div className="dsk">
        {/* the shared wall shelf: manuals + education plaque + cert disks */}
        <div className="dsk-shelfbar">
          <div className="dsk-shelfbar__caption">◐ ARCHIVE SHELF — PULL A MANUAL · LOAD A DISK</div>
          <div className="dsk-shelfbar__row">
            <div className="dsk-shelf__books">
              {EDUCATION.map((e) => {
                const s = SPINES[e.id] ?? { label: e.institution, mod: 'biz', h: 114 };
                return (
                  <button
                    key={e.id}
                    className={`shelfbook shelfbook--${s.mod} ${book === e.id ? 'shelfbook--out' : ''}`}
                    style={{ height: s.h }}
                    onClick={() => { sfx.click(); setBook(e.id); }}
                    onMouseEnter={() => sfx.hover()}
                    aria-pressed={book === e.id}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
            <div className="dsk-shelf__card" key={book}>
              <b>{eduSel.degree}</b>
              <small>{eduSel.institution} · {eduSel.period}</small>
            </div>
            {/* 80s disk file box: floppies stored upright, spines out; the one
                in drive A: sits sunken + dimmed in its slot */}
            <div className="dsk-diskbox">
              {DISKS.map((d, i) => (
                <button
                  key={d.id}
                  className={`dsk-spine ${i % 2 ? 'dsk-spine--b' : 'dsk-spine--a'} ${
                    d.id === 'skills' ? 'dsk-spine--sys' : ''
                  } ${d.id === disk ? 'dsk-spine--indrive' : ''}`}
                  title={`${d.title} — ${d.sub}`}
                  onClick={() => insert(d.id)}
                  onMouseEnter={() => sfx.hover()}
                  aria-pressed={d.id === disk}
                  disabled={reading}
                >
                  <span className="dsk-spine__label">{d.title}</span>
                </button>
              ))}
              <span className="dsk-diskbox__front" aria-hidden="true">CERTS · A:</span>
            </div>
          </div>
          <div className="dsk-shelfbar__plank" />
        </div>

        <div className="dsk__row">
          {/* IDENTITY.SYS — CRT monitor on its stand */}
          <div className="dsk-mon">
            <div className="dsk-mon__case">
              <div className="dsk-mon__strip">
                <span className="dsk-mon__label">▚ IDENTITY.SYS</span>
                <span className="dsk-mon__led" />
              </div>
              <div className="dsk-mon__screen">
                <span className="about__label">Professional Identity</span>
                <h2 className="about__name">{PROFILE.name}</h2>
                <div className="about__role">{PROFILE.title}</div>
                <div className="about__meta">
                  <span>◆ {PROFILE.location}</span>
                  <span>◆ {PROFILE.email}</span>
                </div>
                <p className="about__bio">“{PROFILE.bio}”</p>
                <div className="about__langs">
                  {PROFILE.languages.map((l) => (
                    <div className="about__lang" key={l.name}>
                      <span>◈ {l.name}</span>
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
                  style={{ marginBottom: 18 }}
                >
                  in LinkedIn Network ↗
                </a>
                <div className="about__quote">“{PROFILE.quote}” — {PROFILE.name}</div>
              </div>
              <div className="dsk-mon__vents"><i /><i /><i /></div>
            </div>
            <div className="dsk-mon__neck" />
            <div className="dsk-mon__base" />
          </div>

          {/* VAULT.SYS — monitor stacked on the SANDY-86 CPU */}
          <div className="dsk-rig">
            <div className="dsk-mon__case">
              <div className="dsk-mon__strip">
                <span className="dsk-mon__label">▚ VAULT.SYS — DRIVE A:</span>
                <span className="dsk-mon__led" data-busy={reading || undefined} />
              </div>
              <div className="dsk-mon__screen dsk-vault" aria-live="polite">
                {reading ? (
                  <div className="dsk-vault__load">
                    <div className="dsk-vault__prompt">A:\&gt; load {fileOf(pending!)}</div>
                    <div className="dsk-vault__line">READING DISK ▪ PLEASE WAIT…</div>
                    <div className="dsk-load"><i /></div>
                  </div>
                ) : disk === 'skills' ? (
                  <div className="dsk-vault__body">
                    <div className="dsk-vault__prompt">A:\&gt; run SKILLS.EXE</div>
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
                  </div>
                ) : cert ? (
                  <div className="dsk-vault__body dsk-vault__cert">
                    <div className="dsk-vault__prompt">A:\&gt; load {fileOf(cert.id)}</div>
                    <span className="dsk-vault__glyph">◆</span>
                    <div className="dsk-vault__name">{cert.name}</div>
                    <div className="dsk-vault__issuer">{cert.issuer}</div>
                    <span className="dsk-vault__year">{cert.year}</span>
                    <div className="dsk-vault__status">STATUS: VERIFIED ▪ ARCHIVED IN VAULT</div>
                  </div>
                ) : null}
              </div>
              <div className="dsk-mon__vents"><i /><i /><i /></div>
            </div>
            <div className="dsk-cpu">
              <div className="dsk-cpu__bays">
                <div className={`dsk-bay ${reading ? 'dsk-bay--reading' : 'dsk-bay--busy'}`}>
                  <span className="dsk-bay__disk" />
                </div>
                <div className="dsk-bay" />
              </div>
              <div className="dsk-cpu__ctrl">
                <span className="dsk-cpu__brand">SANDY-86</span>
                <span className="dsk-cpu__hdd" data-busy={reading || undefined}><i /> HDD</span>
                <span className="dsk-cpu__turbo">TURBO</span>
                <span className="dsk-cpu__power" />
              </div>
            </div>
          </div>
        </div>

        {/* the desk surface + props. The plant sits at the LEFT edge of the
            right (SANDY-86) terminal — its own group, not moved to the other
            terminal (Sandy 07-18). */}
        <div className="dsk__desk">
          <div className="dsk__propsL">
            <div className="dsk-plaque">&lt;SANDY.SYSDEV/&gt; · AI BUILDER</div>
          </div>
          <div className="dsk__propsLR">
            <div className="dsk-sticky" />
          </div>
          <div className="dsk__propsRL">
            <div className="dsk-plant"><div className="dsk-plant__leaf" /><div className="dsk-plant__pot" /></div>
          </div>
          <div className="dsk__propsR">
            <div className="dsk-mug" />
            <button className="dsk-bell" aria-label="Ring the reception bell" onClick={() => sfx.bell()}>
              <span className="dsk-bell__dome" />
              <span className="dsk-bell__base" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
