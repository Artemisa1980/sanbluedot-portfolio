import { useId, useState } from 'react';
import { money, type ChartRow } from '../financialModels';

export default function CalculatorChart({ rows, labels }: { rows: ChartRow[]; labels: [string, string] }) {
  const id = useId();
  const [cursor, setCursor] = useState<number | null>(null);
  const index = Math.min(cursor ?? rows.length - 1, rows.length - 1);
  const selected = rows[index];
  const W = 480, H = 150, L = 58, R = 18, T = 12, B = 26;
  const highest = Math.max(1, ...rows.flatMap(row => [row.primary, row.secondary]));
  const magnitude = 10 ** Math.floor(Math.log10(highest));
  const ceiling = Math.ceil(highest / magnitude * 2) / 2 * magnitude;
  const lastYear = Math.max(rows[rows.length - 1].year, 1 / 12);
  const x = (i: number) => L + rows[i].year / lastYear * (W - L - R);
  const y = (v: number) => H - B - v / ceiling * (H - T - B);
  const path = (key: 'primary' | 'secondary') => rows.map((row, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(row[key])}`).join(' ');
  const axis = (v: number) => `$${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(v)}`;
  const elapsed = (year: number) => {
    const months = Math.round(year * 12);
    const fullYears = Math.floor(months / 12);
    const extraMonths = months % 12;
    return extraMonths ? `${fullYears ? `${fullYears}Y ` : ''}${extraMonths}M` : `${fullYears}Y`;
  };
  return (
    <figure className="desk-chart">
      <figcaption className="desk-chart__legend">
        <span><i className="desk-chart__key" />{labels[0]}</span>
        <span><i className="desk-chart__key desk-chart__key--secondary" />{labels[1]}</span>
        <small>USD</small>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${labels[0]} and ${labels[1]} over time. Use the period selector or data table below for exact values.`}
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
        <path d={`${path('primary')} L ${W - R} ${H - B} L ${L} ${H - B} Z`} className="desk-chart__fill" />
        <path d={path('secondary')} className="desk-chart__line desk-chart__line--secondary" />
        <path d={path('primary')} className="desk-chart__line" />
        <line x1={x(index)} x2={x(index)} y1={T} y2={H - B} className="desk-chart__cursor" />
        <rect x={x(index) - 4} y={y(selected.primary) - 4} width="8" height="8" className="desk-chart__point" />
        <text x={L} y={H - 6}>YEAR 0</text>
        <text x={W - R} y={H - 6} textAnchor="end">{elapsed(rows[rows.length - 1].year)}</text>
      </svg>
      <div className="desk-chart__readout">
        <label htmlFor={`${id}-year`}>{elapsed(selected.year)}</label>
        <input id={`${id}-year`} type="range" min="0" max={rows.length - 1} step="1" value={index}
          aria-label="Inspect chart period" onChange={event => setCursor(Number(event.target.value))} />
        <div><span>{labels[0]} <b>{money(selected.primary)}</b></span><span>{labels[1]} <b>{money(selected.secondary)}</b></span></div>
      </div>
      <details className="desk-data">
        <summary>View periodic data</summary>
        <div className="desk-data__scroll" tabIndex={0} role="region" aria-label="Periodic calculation data">
          <table><caption>Periodic values in USD, rounded to cents</caption><thead><tr><th scope="col">Elapsed</th><th scope="col">{labels[0]}</th><th scope="col">{labels[1]}</th></tr></thead>
            <tbody>{rows.map(row => <tr key={row.year}><th scope="row">{elapsed(row.year)}</th><td>{money(row.primary)}</td><td>{money(row.secondary)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
