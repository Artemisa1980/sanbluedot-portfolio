// src/components/Analytics.tsx — EXECUTIVE ANALYTICS DESK
// Same retro-CRT-workstation diorama as the Reception desk (Sandy 07-18):
// LEFT = the BBA compound-interest calculator (swaps to FinancialDashboard) in a
// monitor on a stand · RIGHT = Study Files & Research Logs in a monitor stacked on
// the SANDY-86 CPU · both seated on the wood desk with the same props. Reuses the
// .dsk-* terminal chrome; .dsk--analytics re-inks the content onto the paper screen.
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CompoundCalculator from './CompoundCalculator';
import FinancialDashboard from './FinancialDashboard';
import ResearchLogRow from './ResearchLogRow';
import { researchLogs } from '../data/researchLogs';
import { sfx } from '../sound';

gsap.registerPlugin(ScrollTrigger);

export default function Analytics() {
  const rootRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const selectedLog = selectedLogId
    ? researchLogs.find((l) => l.id === selectedLogId) ?? null
    : null;

  const swapTo = (next: () => void) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !leftPanelRef.current) {
      next();
      return;
    }
    gsap.to(leftPanelRef.current, {
      opacity: 0,
      y: -16,
      duration: 0.25,
      ease: 'power1.in',
      onComplete: () => {
        next();
        gsap.fromTo(
          leftPanelRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      },
    });
  };

  const handleSelect = (id: string) => swapTo(() => setSelectedLogId(id));
  const handleBack = () => swapTo(() => setSelectedLogId(null));

  // entrance: terminals rise, desk slides in (scoped to this section by gsap.context)
  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section analytics" id="analytics" ref={rootRef}>
      <div className="section-tag" style={{ background: 'var(--clay)' }}>
        📊 EXECUTIVE ANALYTICS DESK
      </div>

      <div className="dsk dsk--panel dsk--analytics">
        <div className="dsk__row">
          {/* LEFT — calculator (⇄ dashboard) in a CRT monitor on a stand */}
          <div className="dsk-mon">
            <div className="dsk-mon__case">
              <div className="dsk-mon__strip">
                <span className="dsk-mon__label">▚ ANALYTICS.SYS</span>
                <span className="dsk-mon__led" />
              </div>
              <div className="dsk-mon__screen" ref={leftPanelRef}>
                {selectedLog ? (
                  <FinancialDashboard log={selectedLog} onBack={handleBack} />
                ) : (
                  <CompoundCalculator />
                )}
              </div>
              <div className="dsk-mon__vents"><i /><i /><i /></div>
            </div>
            <div className="dsk-mon__neck" />
            <div className="dsk-mon__base" />
          </div>

          {/* RIGHT — research logs in a monitor stacked on the SANDY-86 CPU */}
          <div className="dsk-rig">
            <div className="dsk-mon__case">
              <div className="dsk-mon__strip">
                <span className="dsk-mon__label">▚ RESEARCH.SYS — DRIVE A:</span>
                <span className="dsk-mon__led" />
              </div>
              <div className="dsk-mon__screen">
                <div className="dsk-vault__prompt">A:\&gt; dir RESEARCH /LOGS</div>
                <div className="research-list">
                  {researchLogs.map((log) => (
                    <ResearchLogRow key={log.id} log={log} onSelect={handleSelect} />
                  ))}
                </div>
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
          </div>
        </div>

        {/* the desk surface + props (same as reception) */}
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
            <button className="dsk-bell" aria-label="Ring the desk bell" onClick={() => sfx.bell()}>
              <span className="dsk-bell__dome" />
              <span className="dsk-bell__base" />
            </button>
          </div>
        </div>
      </div>

      <p className="analytics__note">
        “Financial modeling matches operational predictability. As I advance in my BBA path at UTEL, I will
        keep growing this dashboard with new research logs and the financial models behind each one.”
      </p>
    </section>
  );
}
