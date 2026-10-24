import { type ReactNode, useEffect } from 'react';
import { Lightbulb, Lock, X, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { useApp } from '../lib/store';
import { roleByKey } from '../lib/roles';
import { avatarColor, initials } from '../lib/format';
import { lineOf, type LineKey, type Tone } from '../data/core';

export function PageHeader(p: { num?: number | string; eyebrow?: string; title: string; sub?: ReactNode; actions?: ReactNode; chips?: ReactNode }) {
  return (
    <div className="page-head">
      <div className="titles">
        {(p.num !== undefined || p.eyebrow) && (
          <div className="eyebrow">
            {p.num !== undefined && <span className="mod-tag">{typeof p.num === 'number' ? `Module ${String(p.num).padStart(2, '0')}` : p.num}</span>}
            {p.eyebrow && <span>{p.eyebrow}</span>}
          </div>
        )}
        <div className="row wrap"><h1 className="page-title">{p.title}</h1>{p.chips}</div>
        {p.sub && <p className="page-sub">{p.sub}</p>}
      </div>
      {p.actions && <div className="actions">{p.actions}</div>}
    </div>
  );
}

export function Card(p: { title?: ReactNode; sub?: ReactNode; actions?: ReactNode; children: ReactNode; flush?: boolean; footer?: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <section className={'card ' + (p.className || '')} style={p.style}>
      {(p.title || p.actions) && (
        <div className="card-h">
          <div className="col" style={{ gap: 2, flex: '1 1 200px' }}>
            {p.title && <h2>{p.title}</h2>}
            {p.sub && <span className="sub">{p.sub}</span>}
          </div>
          {p.actions && <div className="actions">{p.actions}</div>}
        </div>
      )}
      <div className={'card-b' + (p.flush ? ' flush' : '')}>{p.children}</div>
      {p.footer && <div className="card-f">{p.footer}</div>}
    </section>
  );
}

export function Stat(p: { label: ReactNode; value: ReactNode; meta?: ReactNode; delta?: string; up?: boolean; good?: boolean; icon?: ReactNode; valueColor?: string }) {
  const good = p.good ?? p.up;
  return (
    <div className="stat">
      <div className="label">{p.icon}{p.label}</div>
      <div className="value" style={{ color: p.valueColor }}>{p.value}</div>
      {(p.delta || p.meta) && (
        <div className="meta">
          {p.delta && <span className={good ? 'delta-up' : 'delta-down'}>{p.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{p.delta}</span>}
          {p.meta && <span>{p.meta}</span>}
        </div>
      )}
    </div>
  );
}

export function Badge(p: { tone?: Tone; children: ReactNode; dot?: boolean; icon?: ReactNode }) {
  return <span className={`badge t-${p.tone || 'grey'}${p.dot === false || p.icon ? ' nodot' : ''}`}>{p.icon}{p.children}</span>;
}

const statusTone: Record<string, Tone> = {
  'On track': 'green', 'At risk': 'amber', 'Delayed': 'red', 'Completed': 'grey', Pending: 'amber', Approved: 'green', Rejected: 'red', Blocked: 'red',
  Open: 'amber', Closed: 'grey', Draft: 'grey', Issued: 'blue', Paid: 'green', Overdue: 'red', Active: 'green', Due: 'amber', Filed: 'green'
};
export function StatusBadge({ s }: { s: string }) { return <Badge tone={statusTone[s] || 'grey'}>{s}</Badge>; }

export function LineChip({ line, short }: { line: LineKey; short?: boolean }) {
  const l = lineOf(line);
  const SHORT: Record<string, string> = { sales: 'Sales', service: 'Service', salesService: 'Sales+Service', om: 'O&M', manpower: 'Manpower', consultation: 'Consulting' };
  return <span className={`line-chip t-${l.tone}`}>{l.no} {short ? SHORT[l.key] : l.name}</span>;
}

export function Tabs<T extends string>(p: { tabs: { key: T; label: string; count?: number | string }[]; value: T; onChange: (k: T) => void }) {
  return (
    <div className="tabs" role="tablist">
      {p.tabs.map(t => (
        <button key={t.key} role="tab" aria-selected={p.value === t.key} className={'tab' + (p.value === t.key ? ' active' : '')} onClick={() => p.onChange(t.key)}>
          {t.label}{t.count !== undefined && <span className="count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Seg<T extends string>(p: { options: { key: T; label: string }[]; value: T; onChange: (k: T) => void }) {
  return (
    <div className="seg">
      {p.options.map(o => <button key={o.key} aria-pressed={p.value === o.key} className={p.value === o.key ? 'on' : ''} onClick={() => p.onChange(o.key)}>{o.label}</button>)}
    </div>
  );
}

/** "Why it matters" — benefit callout, hidden when the presenter switches benefit notes off. */
export function Why(p: { title?: string; children?: ReactNode; points?: ReactNode[]; compact?: boolean }) {
  const show = useApp(s => s.showWhy);
  if (!show) return null;
  return (
    <aside className={'why' + (p.compact ? ' compact' : '')} aria-label="Why it matters">
      <span className="why-icon"><Lightbulb size={16} /></span>
      <div style={{ minWidth: 0 }}>
        <div className="why-title">{p.title || 'Why it matters'}</div>
        {p.children && <div className="why-text">{p.children}</div>}
        {p.points && <ul className="why-points">{p.points.map((x, i) => <li key={i}>{x}</li>)}</ul>}
      </div>
    </aside>
  );
}

/** Small hover pin next to a feature, for tight spaces. */
export function WhyPin({ text, label = 'Why' }: { text: string; label?: string }) {
  const show = useApp(s => s.showWhy);
  if (!show) return null;
  return (
    <span className="why-pin" tabIndex={0} aria-label={`Why it matters: ${text}`}>
      <Lightbulb size={12} />{label}
      <span className="pop" role="tooltip">{text}</span>
    </span>
  );
}

export function Progress({ value, tone, lg, width }: { value: number; tone?: string; lg?: boolean; width?: number | string }) {
  const color = tone === 'red' ? 'var(--crit)' : tone === 'amber' ? 'var(--warn)' : tone === 'green' ? 'var(--good)' : tone === 'grey' ? '#98A2B3' : tone === 'orange' ? 'var(--c2)' : tone === 'aqua' ? 'var(--c3)' : 'var(--c1)';
  return <div className={'progress' + (lg ? ' lg' : '')} style={{ width: width ?? '100%' }}><span style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} /></div>;
}

export function PctCell({ value, tone, w = 72 }: { value: number; tone?: string; w?: number }) {
  return <div className="meter-row"><Progress value={value} tone={tone} width={w} /><span className="small num">{value}%</span></div>;
}

export function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  return <span className="avatar" aria-hidden="true" style={{ width: size, height: size, background: avatarColor(name), fontSize: Math.round(size * 0.38) }}>{initials(name)}</span>;
}

export function Person({ name, sub, size }: { name: string; sub?: string; size?: number }) {
  return <div className="row" style={{ gap: 10 }}><Avatar name={name} size={size} /><div className="cell-2"><span className="strong">{name}</span>{sub && <span className="s">{sub}</span>}</div></div>;
}

export function Two({ a, b }: { a: ReactNode; b: ReactNode }) {
  return <div className="cell-2"><span>{a}</span><span className="s">{b}</span></div>;
}

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={'switch' + (on ? ' on' : '')} onClick={() => onChange(!on)}><span /></button>;
}

/** Masks margin or salary figures for roles that should not see them (Section 8). */
export function Sensitive({ kind, children }: { kind: 'margin' | 'salary'; children: ReactNode }) {
  const role = roleByKey(useApp(s => s.role));
  const ok = kind === 'margin' ? role.seesMargin : role.seesSalary;
  if (ok) return <>{children}</>;
  return <span className="badge t-grey nodot" title={`Hidden for ${role.name}`}><Lock size={11} />Hidden</span>;
}

export function Drawer(p: { open: boolean; onClose: () => void; title: ReactNode; sub?: ReactNode; children: ReactNode; footer?: ReactNode; width?: number }) {
  useEffect(() => {
    if (!p.open) return;
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') p.onClose(); };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  }, [p.open]);
  if (!p.open) return null;
  return (
    <div className="overlay" onClick={p.onClose}>
      <div className="drawer" role="dialog" aria-modal="true" style={p.width ? { width: `min(${p.width}px, 100%)` } : undefined} onClick={e => e.stopPropagation()}>
        <div className="drawer-h">
          <div className="col grow" style={{ gap: 2 }}><h2 style={{ fontSize: 17 }}>{p.title}</h2>{p.sub && <span className="small muted">{p.sub}</span>}</div>
          <button className="icon-btn" aria-label="Close" onClick={p.onClose}><X size={18} /></button>
        </div>
        <div className="drawer-b">{p.children}</div>
        {p.footer && <div className="drawer-f">{p.footer}</div>}
      </div>
    </div>
  );
}

export function Modal(p: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!p.open) return;
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') p.onClose(); };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  }, [p.open]);
  if (!p.open) return null;
  return (
    <div className="overlay" onClick={p.onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="drawer-h"><h2 style={{ fontSize: 17, flex: 1 }}>{p.title}</h2><button className="icon-btn" aria-label="Close" onClick={p.onClose}><X size={18} /></button></div>
        <div className="drawer-b">{p.children}</div>
        {p.footer && <div className="drawer-f">{p.footer}</div>}
      </div>
    </div>
  );
}

export function Stages({ stages, current, done }: { stages: string[]; current: number; done?: boolean }) {
  return (
    <div className="stages" role="list">
      {stages.map((s, i) => {
        const st = done || i < current ? 'done' : i === current ? 'now' : '';
        return (
          <div key={s} role="listitem" className={'stage ' + st}>
            <span className="st-n">{st === 'done' ? <span className="row" style={{ gap: 4, color: 'var(--green)' }}><Check size={12} />Done</span> : st === 'now' ? <span style={{ color: 'var(--primary-ink)' }}>In progress</span> : `Stage ${i + 1}`}</span>
            <span className="st-t">{s}</span>
          </div>
        );
      })}
    </div>
  );
}

export interface TLItem { when: string; who?: string; what: ReactNode; tone?: Tone; icon?: ReactNode; }
export function Timeline({ items }: { items: TLItem[] }) {
  return (
    <ol className="timeline">
      {items.map((it, i) => (
        <li key={i}>
          <div className="tl-dot"><span className={`t-${it.tone || 'grey'}`}>{it.icon || <Check size={13} />}</span>{i < items.length - 1 && <i />}</div>
          <div className="tl-body"><div style={{ fontSize: 13.5 }}>{it.what}</div><div className="xs muted">{it.when}{it.who ? ` · ${it.who}` : ''}</div></div>
        </li>
      ))}
    </ol>
  );
}

export function IconBox({ tone = 'primary', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`ico-box t-${tone}`}>{children}</span>;
}

export function Field(p: { label: string; children: ReactNode; hint?: ReactNode; span?: number }) {
  return <label className="field" style={p.span ? { gridColumn: `span ${p.span}` } : undefined}><span className="label">{p.label}</span>{p.children}{p.hint && <span className="hint">{p.hint}</span>}</label>;
}
