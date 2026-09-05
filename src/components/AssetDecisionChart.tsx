import { useId, useState } from 'react';
import { money, type AssetAction, type AssetDecisionRow } from '../financialModels';

const series: { id: AssetAction; label: string }[] = [
  { id: 'repair', label: 'Repair' },
  { id: 'upgrade', label: 'Upgrade' },
  { id: 'replace', label: 'Replace' },
];

export default function AssetDecisionChart({ rows }: { rows: AssetDecisionRow[] }) {
  const id = useId();
  const [cursor, setCursor] = useState<number | null>(null);
  const index = Math.min(cursor ?? rows.length - 1, rows.length - 1);
  const selected = rows[index];
  const W = 480, H = 160, L = 58, R = 18, T = 12, B = 26;
  const highest = Math.max(1, ...rows.flatMap(row => series.map(item => row[item.id])));
  const magnitude = 10 ** Math.floor(Math.log10(highest));
  const ceiling = Math.ceil(highest / magnitude * 2) / 2 * magnitude;
  const lastYear = Math.max(rows.at(-1)?.year ?? 1, 1);
  const x = (year: number) => L + year / lastYear * (W - L - R);
  const y = (value: number) => H - B - value / ceiling * (H - T - B);
  const path = (key: AssetAction) => rows.map((row, rowIndex) => `${rowIndex ? 'L' : 'M'} ${x(row.year)} ${y(row[key])}`).join(' ');
  const axis = (value: number) => `$${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;

  return <figure className="desk-chart desk-asset-chart">
    <figcaption className="desk-chart__legend">
      {series.map((item, itemIndex) => <span key={item.id}><i className={`desk-chart__key${itemIndex ? ` desk-chart__key--${item.id}` : ''}`} />{item.label}</span>)}
      <small>USD · EQUIVALENT</small>
    </figcaption>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Equivalent Repair, Upgrade and Replace planning costs over the selected horizon. Use the year selector or data table for exact values."
      onClick={event => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - bounds.left) / bounds.width * W;
        const targetYear = Math.max(0, Math.min(lastYear, (px - L) / (W - L - R) * lastYear));
        setCursor(rows.reduce((nearest, row, rowIndex) => Math.abs(row.year - targetYear) < Math.abs(rows[nearest].year - targetYear) ? rowIndex : nearest, 0));
      }}>
      {[0, 0.5, 1].map(fraction => <g key={fraction}>
        <line x1={L} x2={W - R} y1={y(ceiling * fraction)} y2={y(ceiling * fraction)} className="desk-chart__grid" />
        <text x={L - 8} y={y(ceiling * fraction) + 4} textAnchor="end">{axis(ceiling * fraction)}</text>
      </g>)}
      {series.map(item => <path key={item.id} d={path(item.id)} className={`desk-chart__line desk-chart__line--${item.id}`} />)}
      <line x1={x(selected.year)} x2={x(selected.year)} y1={T} y2={H - B} className="desk-chart__cursor" />
      <rect x={x(selected.year) - 4} y={y(selected.repair) - 4} width="8" height="8" className="desk-chart__point desk-chart__point--repair" />
      <circle cx={x(selected.year)} cy={y(selected.upgrade)} r="4" className="desk-chart__point desk-chart__point--upgrade" />
      <path d={`M ${x(selected.year)} ${y(selected.replace) - 5} L ${x(selected.year) + 5} ${y(selected.replace)} L ${x(selected.year)} ${y(selected.replace) + 5} L ${x(selected.year) - 5} ${y(selected.replace)} Z`} className="desk-chart__point desk-chart__point--replace" />
      <text x={L} y={H - 6}>YEAR 0</text>
      <text x={W - R} y={H - 6} textAnchor="end">YEAR {lastYear}</text>
    </svg>
    <div className="desk-chart__readout desk-asset-chart__readout">
      <label htmlFor={`${id}-year`}>YEAR {selected.year}</label>
      <input id={`${id}-year`} type="range" min="0" max={rows.length - 1} step="1" value={index}
        aria-label="Inspect asset decision year" onChange={event => setCursor(Number(event.target.value))} />
      <div>{series.map(item => <span key={item.id}>{item.label} <b>{money(selected[item.id])}</b></span>)}</div>
    </div>
    <details className="desk-data">
      <summary>View annual comparison</summary>
      <div className="desk-data__scroll" tabIndex={0} role="region" aria-label="Annual asset decision comparison">
        <table><caption>Equivalent planning costs in USD, rounded to cents</caption><thead><tr><th scope="col">Year</th>{series.map(item => <th key={item.id} scope="col">{item.label}</th>)}</tr></thead>
          <tbody>{rows.map(row => <tr key={row.year}><th scope="row">{row.year}</th>{series.map(item => <td key={item.id}>{money(row[item.id])}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </details>
  </figure>;
}
