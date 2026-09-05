// src/components/Analytics.tsx — EXECUTIVE ANALYTICS DESK
// Same retro-CRT-workstation diorama as the Reception desk (Sandy 07-18):
// LEFT = the BBA calculator lab and research explorer in a
// monitor on a stand · RIGHT = Study Files & Research Logs in a monitor stacked on
// the SANDY-86 CPU · both seated on the wood desk with the same props. Reuses the
// .dsk-* terminal chrome; .dsk--analytics re-inks the content onto the paper screen.
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CompoundCalculator from './CompoundCalculator';
import FinancialDashboard from './FinancialDashboard';
import ResearchLogRow from './ResearchLogRow';
import DeskTabs from './DeskTabs';
import { researchLogs } from '../data/researchLogs';
import { sfx } from '../sound';

gsap.registerPlugin(ScrollTrigger);

export default function Analytics() {
  const rootRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLHeadingElement>(null);
  const focusAnalysis = useRef(false);
  const [mode, setMode] = useState<'calculators' | 'research'>('calculators');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const selectedLog = researchLogs.find(log => log.id === selectedLogId) ?? researchLogs.find(log => log.status === 'live');
  const modes = [{ id: 'calculators', label: '▦ Calculators' }, { id: 'research', label: '▣ Research' }] as const;

  const showMode = (next: 'calculators' | 'research') => {
    setMode(next);
    if (leftPanelRef.current) leftPanelRef.current.scrollTop = 0;
    if (next === 'research' && !selectedLogId && selectedLog) setSelectedLogId(selectedLog.id);
  };
  const goToAnalysis = () => {
    if (leftPanelRef.current) leftPanelRef.current.scrollTop = 0;
    leftPanelRef.current?.focus({ preventScroll: true });
    if (window.matchMedia('(max-width: 900px)').matches) {
      leftPanelRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };
  const handleSelect = (id: string) => {
    if (mode === 'research' && selectedLogId === id) { goToAnalysis(); return; }
    focusAnalysis.current = true;
    setSelectedLogId(id);
    setMode('research');
  };
  useEffect(() => {
    if (focusAnalysis.current) { goToAnalysis(); focusAnalysis.current = false; }
  }, [mode, selectedLogId]);

  // entrance: terminals rise, desk slides in (scoped to this section by gsap.context)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
              <div className="dsk-mon__screen">
                <div className="desk-shell" ref={leftPanelRef} id="analysis-workbench" role="region" tabIndex={-1} aria-label="Analysis workbench">
                  <DeskTabs id="desk-mode" label="Workbench mode" items={modes} value={mode} onChange={showMode} primary />
                  <div id="desk-mode-panel-calculators" role="tabpanel" aria-labelledby="desk-mode-tab-calculators" hidden={mode !== 'calculators'}>
                    <CompoundCalculator />
                  </div>
                  <div id="desk-mode-panel-research" role="tabpanel" aria-labelledby="desk-mode-tab-research" hidden={mode !== 'research'}>
                    {selectedLog && <FinancialDashboard key={selectedLog.id} log={selectedLog} />}
                    <button className="desk-return" type="button" onClick={() => {
                      archiveRef.current?.focus({ preventScroll: true });
                      archiveRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
                    }}>Back to research files →</button>
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

          {/* RIGHT — research logs in a monitor stacked on the SANDY-86 CPU */}
          <div className="dsk-rig">
            <div className="dsk-mon__case">
              <div className="dsk-mon__strip">
                <span className="dsk-mon__label">▚ RESEARCH.SYS — DRIVE A:</span>
                <span className="dsk-mon__led" />
              </div>
              <div className="dsk-mon__screen">
                <div className="desk-archive">
                  <div className="desk-archive__head"><span className="desk-eyebrow">A:\&gt; DIR /RESEARCH</span><span className="desk-archive__count">{String(researchLogs.filter(log => log.status === 'live').length).padStart(2, '0')} PUBLISHED / {String(researchLogs.filter(log => log.status === 'coming-soon').length).padStart(2, '0')} QUEUED</span></div>
                  <h3 ref={archiveRef} tabIndex={-1}>Ideas worth opening.</h3>
                  <p className="desk-intro">Load a published file or inspect what is waiting in the research queue.</p>
                  <div className="desk-files">
                    {researchLogs.map(log => <ResearchLogRow key={log.id} log={log} selected={selectedLogId === log.id} onSelect={handleSelect} />)}
                  </div>
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

      <aside className="analytics__service-ticket" aria-label="Asset decision context">
        <div className="analytics__service-stamp">
          <span>SERVICE TICKET</span>
          <strong>R / U / R · 01</strong>
        </div>
        <div className="analytics__service-copy">
          <strong>Model the next useful life before the next purchase.</strong>
          <p>The lowest modeled cost is one signal. Downtime and what happens to old hardware stay visible beside it.</p>
        </div>
        <ul className="analytics__service-checks" aria-label="Decision checks">
          <li><span>01</span>COST PATH</li>
          <li><span>02</span>SERVICE DAYS</li>
          <li><span>03</span>MATERIAL ROUTE</li>
        </ul>
      </aside>
    </section>
  );
}
