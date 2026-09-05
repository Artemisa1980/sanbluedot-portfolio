import type { ResearchLog } from '../data/researchLogs';
import { TV_CHANNELS } from '../data';
import { sfx } from '../sound';

interface ResearchLogRowProps {
  log: ResearchLog;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function ResearchLogRow({ log, selected, onSelect }: ResearchLogRowProps) {
  const isLive = log.status === 'live';
  const filmReady = TV_CHANNELS.some(channel => channel.id === log.studioChannelId && channel.videoSrc);
  return <article className={`desk-file${isLive ? ' desk-file--live' : ' desk-file--soon'}${selected ? ' desk-file--selected' : ''}`}>
    <div className="desk-file__top"><span className="desk-disk" aria-hidden="true">{log.number}</span><span className="desk-eyebrow">FILE_{log.number}{isLive ? '.RSH' : ' / IN QUEUE'}</span><span className="desk-badge">{isLive ? selected ? 'LOADED' : 'PUBLISHED' : 'SOON'}</span></div>
    <h4>{log.title}</h4>
    <p>{log.legend}</p>
    {isLive && <>
      <div className="desk-file__topics">{log.topics?.map(topic => <span key={topic}>{topic}</span>)}</div>
      <button type="button" className="desk-open" aria-label={`${selected ? 'Return to' : 'Open'} analysis: ${log.title}`} aria-controls="desk-mode-panel-research" onClick={() => { sfx.channel(); onSelect(log.id); }}>
        <span>{selected ? '↗ RETURN TO ANALYSIS' : '▶ OPEN ANALYSIS'}</span><span aria-hidden="true">ENTER ↵</span>
      </button>
      {log.links && <div className="desk-file__links">
        <a href={log.links.html} target="_blank" rel="noreferrer">Read online ↗</a>
        <a href={log.links.pdf} target="_blank" rel="noreferrer">PDF ↗</a>
        <a href={log.links.doi} target="_blank" rel="noreferrer">Cite ↗</a>
        {filmReady ? <a href="#tv" onClick={event => {
          event.preventDefault(); sfx.click();
          document.getElementById('tv')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          window.dispatchEvent(new CustomEvent('tv:tune', { detail: log.studioChannelId }));
        }}>Watch in studio ↗</a> : log.studioChannelId !== undefined && <span>Film / coming soon</span>}
      </div>}
    </>}
    {!isLive && log.queue && <div className="desk-file__queue" aria-label={`Queue status: ${log.queue.status}. Next: ${log.queue.next}.`}>
      <span><i aria-hidden="true" />{log.queue.status}</span>
      <small>NEXT // {log.queue.next}</small>
    </div>}
  </article>;
}
