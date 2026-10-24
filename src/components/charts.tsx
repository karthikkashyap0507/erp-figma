import { useEffect, useRef, useState, type ReactNode } from 'react';

function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(e => setW(Math.max(220, Math.floor(e[0].contentRect.width))));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export interface Series { name: string; color: string; values: number[]; dashed?: boolean; }

export function Legend({ items, line }: { items: { name: string; color: string }[]; line?: boolean }) {
  return <div className="legend">{items.map(i => <span key={i.name}><i className={line ? 'line' : ''} style={{ background: i.color }} />{i.name}</span>)}</div>;
}

function niceStep(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}
/** Clean axis ticks from 0 (or lo) to a round top value. */
function niceTicks(max: number, lo = 0): number[] {
  const step = niceStep((max - lo) / 4);
  const top = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let t = lo; t <= top + 1e-9; t += step) out.push(Math.round(t * 1000) / 1000);
  return out;
}

/** Grouped vertical columns with a per-category tooltip. */
export function ColumnChart(p: { categories: string[]; series: Series[]; height?: number; fmt?: (n: number) => string; yMax?: number; aria: string }) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const H = p.height || 220, pl = 52, pr = 8, pt = 10, pb = 26;
  const fmt = p.fmt || (n => String(n));
  const ticks = p.yMax ? [0, p.yMax / 4, p.yMax / 2, (3 * p.yMax) / 4, p.yMax] : niceTicks(Math.max(...p.series.flatMap(s => s.values)));
  const max = ticks[ticks.length - 1];
  const band = (W - pl - pr) / p.categories.length;
  const bw = Math.min(24, (band * 0.7 - (p.series.length - 1) * 2) / p.series.length);
  const groupW = bw * p.series.length + (p.series.length - 1) * 2;
  const y = (v: number) => pt + (1 - v / max) * (H - pt - pb);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <svg width={W} height={H} role="img" aria-label={p.aria} style={{ display: 'block', overflow: 'visible' }}>
        {ticks.map(t => (
          <g key={t}>
            <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke={t === 0 ? '#C9D0DA' : '#EBEEF3'} strokeWidth={1} />
            <text x={pl - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#5B6474">{fmt(t)}</text>
          </g>
        ))}
        {p.categories.map((c, ci) => {
          const gx = pl + ci * band + (band - groupW) / 2;
          return (
            <g key={c} onMouseEnter={() => setHover(ci)} onMouseLeave={() => setHover(null)}>
              <rect x={pl + ci * band} y={pt} width={band} height={H - pt - pb} fill={hover === ci ? '#F2F5FB' : 'transparent'} />
              {p.series.map((s, si) => {
                const v = s.values[ci] || 0, x = gx + si * (bw + 2), yy = y(v), h = Math.max(1, H - pb - yy);
                return <path key={s.name} d={`M${x},${H - pb} V${yy + 4} Q${x},${yy} ${x + 4},${yy} H${x + bw - 4} Q${x + bw},${yy} ${x + bw},${yy + 4} V${H - pb} Z`} fill={s.color} opacity={hover === null || hover === ci ? 1 : 0.55} style={{ transition: 'opacity .12s' }} />;
              })}
              <text x={pl + ci * band + band / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#5B6474">{c}</text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="chart-tip" style={{ left: Math.min(W - 180, pl + hover * band + band / 2 + 10), top: 8 }}>
          <div style={{ fontWeight: 700 }}>{p.categories[hover]}</div>
          {p.series.map(s => <div key={s.name} className="row" style={{ gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: 'inline-block' }} />{s.name}: {fmt(s.values[hover] || 0)}</div>)}
        </div>
      )}
    </div>
  );
}

/** Multi-series line chart with a crosshair tooltip. */
export function LineChart(p: { labels: string[]; series: Series[]; height?: number; fmt?: (n: number) => string; yMin?: number; yMax?: number; aria: string; endLabels?: boolean }) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const H = p.height || 220, pl = 52, pr = p.endLabels ? 64 : 12, pt = 12, pb = 26;
  const fmt = p.fmt || (n => String(n));
  const all = p.series.flatMap(s => s.values);
  const lo = p.yMin ?? 0;
  const autoTicks = niceTicks(Math.max(...all), lo);
  const hi = p.yMax ?? autoTicks[autoTicks.length - 1];
  const n = p.labels.length;
  const x = (i: number) => pl + (n === 1 ? 0 : (i * (W - pl - pr)) / (n - 1));
  const y = (v: number) => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  const ticks = p.yMax !== undefined ? [0, 1, 2, 3, 4].map(i => lo + ((hi - lo) * i) / 4) : autoTicks;
  const step = Math.ceil(n / Math.max(2, Math.floor((W - pl - pr) / 70)));
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <svg width={W} height={H} role="img" aria-label={p.aria} style={{ display: 'block', overflow: 'visible' }}
        onMouseMove={e => { const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect(); const mx = e.clientX - r.left; const i = Math.round(((mx - pl) / (W - pl - pr)) * (n - 1)); setHover(i >= 0 && i < n ? i : null); }}
        onMouseLeave={() => setHover(null)}>
        {ticks.map(t => (
          <g key={t}>
            <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke={t === lo ? '#C9D0DA' : '#EBEEF3'} />
            <text x={pl - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#5B6474">{fmt(t)}</text>
          </g>
        ))}
        {p.labels.map((l, i) => (i % step === 0 || i === n - 1) && <text key={l + i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} fill="#5B6474">{l}</text>)}
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={pt} y2={H - pb} stroke="#98A2B3" />}
        {p.series.map(s => (
          <g key={s.name}>
            <polyline points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? '5 4' : undefined} />
            {hover !== null && <circle cx={x(hover)} cy={y(s.values[hover])} r={4.5} fill={s.color} stroke="#fff" strokeWidth={2} />}
            {p.endLabels && <text x={x(n - 1) + 9} y={y(s.values[n - 1]) + 4} fontSize={11} fontWeight={600} fill="#101828">{fmt(s.values[n - 1])}</text>}
            {p.endLabels && <circle cx={x(n - 1)} cy={y(s.values[n - 1])} r={4} fill={s.color} stroke="#fff" strokeWidth={2} />}
          </g>
        ))}
      </svg>
      {hover !== null && (
        <div className="chart-tip" style={{ left: Math.min(W - 190, x(hover) + 12), top: 6 }}>
          <div style={{ fontWeight: 700 }}>{p.labels[hover]}</div>
          {p.series.map(s => <div key={s.name} className="row" style={{ gap: 6 }}><i style={{ width: 10, height: 2, background: s.color, display: 'inline-block' }} />{s.name}: {fmt(s.values[hover])}</div>)}
        </div>
      )}
    </div>
  );
}

/** Horizontal single-series bars with a value at the tip. */
export function HBars(p: { rows: { label: ReactNode; value: number; sub?: ReactNode; color?: string; right?: ReactNode }[]; max?: number; fmt?: (n: number) => string; labelW?: number }) {
  const max = p.max || Math.max(...p.rows.map(r => r.value), 1);
  const fmt = p.fmt || (n => String(n));
  return (
    <div className="col" style={{ gap: 10 }}>
      {p.rows.map((r, i) => (
        <div key={i} className="row" style={{ gap: 12 }} title={typeof r.label === 'string' ? `${r.label}: ${fmt(r.value)}` : undefined}>
          <div style={{ width: p.labelW || 150, flexShrink: 0 }} className="cell-2"><span className="small strong">{r.label}</span>{r.sub && <span className="s">{r.sub}</span>}</div>
          <div className="grow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: `${(r.value / max) * 100}%`, minWidth: 3, height: 14, background: r.color || 'var(--c1)', borderRadius: '0 4px 4px 0' }} />
            <span className="small num" style={{ whiteSpace: 'nowrap' }}>{fmt(r.value)}</span>
          </div>
          {r.right}
        </div>
      ))}
    </div>
  );
}

/** One stacked bar with 2px surface gaps and a legend. */
export function StackBar(p: { parts: { label: string; value: number; color: string }[]; height?: number; fmt?: (n: number) => string; showLegend?: boolean }) {
  const total = p.parts.reduce((a, b) => a + b.value, 0) || 1;
  const fmt = p.fmt || (n => String(n));
  return (
    <div className="col" style={{ gap: 8 }}>
      <div role="img" aria-label={p.parts.map(x => `${x.label} ${fmt(x.value)}`).join(', ')} style={{ display: 'flex', gap: 2, height: p.height || 12 }}>
        {p.parts.map((x, i) => <div key={x.label} title={`${x.label}: ${fmt(x.value)}`} style={{ flex: `${x.value} 1 0`, background: x.color, borderRadius: i === 0 ? '4px 0 0 4px' : i === p.parts.length - 1 ? '0 4px 4px 0' : 0, minWidth: x.value > 0 ? 3 : 0 }} />)}
      </div>
      {p.showLegend !== false && <div className="legend">{p.parts.map(x => <span key={x.label}><i style={{ background: x.color }} />{x.label} · {fmt(x.value)}</span>)}</div>}
    </div>
  );
}

export function Sparkline({ values, color = 'var(--c1)', w = 90, h = 26 }: { values: number[]; color?: string; w?: number; h?: number }) {
  const lo = Math.min(...values), hi = Math.max(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - 2 - ((v - lo) / (hi - lo || 1)) * (h - 4)}`).join(' ');
  return <svg width={w} height={h} aria-hidden="true"><polyline points={pts} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" /></svg>;
}
