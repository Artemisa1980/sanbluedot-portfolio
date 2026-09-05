import { useState } from 'react';
import type { ResearchLog } from '../data/researchLogs';
import DeskTabs from './DeskTabs';

const views = [{ id: 'overview', label: 'Overview' }, { id: 'costs', label: 'Costs' }, { id: 'capital', label: 'Capital' }, { id: 'lifecycle', label: 'Lifecycle' }] as const;
type View = typeof views[number]['id'];
const chapterUrl = (chapter: string) => `https://github.com/Artemisa1980/ai-robot-race/blob/main/report/${chapter}.qmd`;

function PixelRobot({ stage }: { stage: number }) {
  return <svg className="desk-robot" viewBox="0 0 64 76" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M30 0h4v8h-4zM18 8h28v4h4v24h-4v4H18v-4h-4V12h4zM20 44h24v20H20zM8 44h8v20H8zM48 44h8v20h-8zM20 68h8v8H16v-4h4zM36 68h8v4h4v4H36z" fill="currentColor" />
    <path d="M22 16h20v16H22z" fill="var(--paper)" /><path d="M24 20h4v4h-4zM36 20h4v4h-4zM28 28h8v2h-8z" fill="var(--olive)" />
    <path d="M24 48h16v12H24z" fill="var(--gold)" /><rect x="28" y="51" width="8" height="6" fill={stage >= 4 ? 'var(--dustyblue)' : 'var(--olive)'} />
  </svg>;
}

export default function FinancialDashboard({ log }: { log: ResearchLog }) {
  const [view, setView] = useState<View>('overview');
  const [stage, setStage] = useState(0);
  const fin = log.financials;
  const analysis = log.analysis;
  if (!fin || !analysis || !analysis.lifecycle.length || !fin.valuations.length) return <p className="desk-intro">This analysis is being prepared.</p>;
  const active = analysis.lifecycle[Math.min(stage, analysis.lifecycle.length - 1)];
  const maxValuation = Math.max(...fin.valuations.map(item => item.amountB));
  return <div className="desk-workbench">
    <div className="desk-heading"><span className="desk-eyebrow">RESEARCH FILE {log.number} / 2025–2035 OUTLOOK</span><h3>{log.title}</h3></div>
    <DeskTabs id="research-view" label="Research view" items={views} value={view} onChange={setView} />
    {views.map(tab => <div key={tab.id} id={`research-view-panel-${tab.id}`} role="tabpanel" aria-labelledby={`research-view-tab-${tab.id}`} hidden={view !== tab.id}>
      {view === tab.id && <>
        {view === 'overview' && <>
          <div className="desk-thesis"><PixelRobot stage={0} /><div><span className="desk-eyebrow">THE CENTRAL QUESTION</span><h4>{analysis.thesis}</h4></div></div>
          <p className="desk-intro">Follow the machine from its parts and financing to its working life, upgrades and recovery.</p>
          <div className="desk-findings">{analysis.findings.map((finding, index) => <button type="button" key={finding.title} onClick={() => setView(finding.view)}>
            <span>0{index + 1}</span><div><b>{finding.title}</b><p>{finding.body}</p></div><i aria-hidden="true">↗</i>
          </button>)}</div>
          <p className="desk-footnote">The hidden cost is a gap in measurement and responsibility, not a single established dollar total. <a href={chapterUrl('10-net-reckoning')} target="_blank" rel="noreferrer">Read the argument ↗</a></p>
        </>}
        {view === 'costs' && <>
          <div className="desk-section-heading"><h4>What goes into the body?</h4><span className="desk-badge">PARTS ONLY</span></div>
          <div className="desk-cost-pair">
            <div><span>{fin.bomCost.fromYear} · ESTIMATE</span><strong>~${fin.bomCost.from.toLocaleString('en-US')}</strong></div>
            <i aria-hidden="true">→</i><div><span>{fin.bomCost.toYear} · FORECAST</span><strong>&lt; ${fin.bomCost.to.toLocaleString('en-US')}</strong></div>
          </div>
          <p className="desk-intro">China-built humanoid bill of materials. This is not a retail price or a total ownership cost.</p>
          <div className="desk-bars desk-bars--parts" aria-label="Projected 2030 bill of materials breakdown">
            <div className="desk-bars__heading"><b>2030 projected parts mix</b><span>SHARE / %</span></div>
            {analysis.components.map(item => <div className="desk-bar" key={item.name}>
              <div className="desk-bar__label"><span>{item.name}</span><b>{item.share}%</b></div>
              <div className="desk-bar__track" aria-hidden="true"><span className={item.motion ? 'desk-bar__motion' : ''} style={{ width: `${item.share}%` }} /></div>
            </div>)}
          </div>
          <p className="desk-footnote">Actuators + hands = 70% of the projected parts bill. <a href={fin.bomCost.sourceUrl} target="_blank" rel="noreferrer">{fin.bomCost.source} · pp. 3–5 ↗</a></p>
        </>}
        {view === 'capital' && <>
          <div className="desk-section-heading"><h4>The scale of the bet</h4><span className="desk-badge">DATED SNAPSHOTS</span></div>
          <p className="desk-intro">Reported private valuations across the US robotics ecosystem. Different companies, different rounds.</p>
          <div className="desk-bars desk-bars--capital" aria-label="Reported company valuations in US dollar billions">
            <div className="desk-bars__heading"><b>Private valuation</b><span>USD BILLIONS</span></div>
            {fin.valuations.map(item => <div className="desk-bar" key={item.name}>
              <div className="desk-bar__label"><b>{item.name}</b><strong>${item.amountB}B</strong></div>
              <div className="desk-bar__track" aria-hidden="true"><span style={{ width: `${item.amountB / maxValuation * 100}%` }} /></div>
              <div className="desk-bar__meta"><span>{item.role} · {item.asOf}</span><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.source} ↗</a></div>
            </div>)}
            <div className="desk-bars__axis" aria-hidden="true"><span>$0B</span><span>${maxValuation / 2}B</span><span>${maxValuation}B</span></div>
          </div>
          <p className="desk-footnote">Research snapshots, not live prices. Valuation is not revenue, profit or the amount raised. <a href={chapterUrl('03-capital-investment')} target="_blank" rel="noreferrer">Chapter 3 context ↗</a></p>
        </>}
        {view === 'lifecycle' && <>
          <div className="desk-section-heading"><h4>One robot. A whole lifecycle.</h4><span className="desk-badge">EXPLORE 8 STAGES</span></div>
          <p className="desk-intro">Select a stage to follow the research beyond the launch.</p>
          <div className="desk-lifecycle" aria-label="Robot lifecycle stages">
            {analysis.lifecycle.map((item, index) => <button key={item.name} type="button" aria-pressed={stage === index} onClick={() => setStage(index)}><span>0{index + 1}</span>{item.name}</button>)}
          </div>
          <div className="desk-life-halves"><span>01–04 / ACQUIRE</span><span>05–08 / KEEP & RECOVER</span></div>
          <div className="desk-life-card" aria-live="polite" aria-atomic="true">
            <PixelRobot stage={stage} /><div><span className="desk-badge">{active.status}</span><h4>{active.title}</h4><p>{active.detail}</p><a href={chapterUrl(active.chapter)} target="_blank" rel="noreferrer">Read the source chapter ↗</a></div>
          </div>
          <p className="desk-footnote">Research findings reflect their cited dates. Gaps are shown as gaps; no robot lifespan or waste total is invented.</p>
        </>}
      </>}
    </div>)}
  </div>;
}
