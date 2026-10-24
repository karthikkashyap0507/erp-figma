import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ClipboardList, ShoppingCart, Receipt, CircleCheck, Circle, Lock, Plus, FolderTree, Users } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, LineChip, StatusBadge, Stages, Sensitive, Progress, Timeline } from '../components/ui';
import { ColumnChart, Legend } from '../components/charts';
import { useApp, toast } from '../lib/store';
import { money, inr } from '../lib/format';
import { lineOf, type Project } from '../data/core';

interface BoqLine { no: string; item: string; uom: string; qty: number; rate: number; done: number; billed: number; }
function boqFor(p: Project): BoqLine[] {
  switch (p.line) {
    case 'service': return [
      { no: '1.01', item: 'Mobilisation and site establishment', uom: 'LS', qty: 1, rate: 240000, done: 1, billed: 1 },
      { no: '2.03', item: 'Removal of damaged shell plates', uom: 'MT', qty: 22, rate: 18500, done: 14.6, billed: 12.0 },
      { no: '2.05', item: 'Fabrication & fixing of shell plates (client steel)', uom: 'MT', qty: 58, rate: 42000, done: 26.8, billed: 22.4 },
      { no: '2.07', item: 'Cyclone duct liner replacement', uom: 'm²', qty: 410, rate: 3400, done: 120, billed: 90 },
      { no: '3.01', item: 'NDT — DPT & UT of welds', uom: 'm', qty: 640, rate: 220, done: 280, billed: 240 }];
    case 'om': return [
      { no: 'OM-1', item: 'Slag handling & transport to yard', uom: 't', qty: 204000, rate: 212, done: 102400, billed: 96700 },
      { no: 'OM-2', item: 'Loader deployment (our equipment)', uom: 'month', qty: 12, rate: 185000, done: 6, billed: 6 },
      { no: 'OM-3', item: 'Pot cleaning & breakdown support', uom: 'shift', qty: 720, rate: 2400, done: 362, billed: 340 }];
    case 'manpower': return [
      { no: 'MP-1', item: 'Fitters', uom: 'head-day', qty: 2250, rate: 1250, done: 1380, billed: 1180 },
      { no: 'MP-2', item: 'Welders', uom: 'head-day', qty: 1800, rate: 1350, done: 1060, billed: 920 },
      { no: 'MP-3', item: 'Helpers', uom: 'head-day', qty: 1350, rate: 950, done: 820, billed: 700 }];
    case 'consultation': return [
      { no: 'F-1', item: 'Site assessment & existing-structure survey', uom: 'milestone', qty: 1, rate: 195000, done: 1, billed: 1 },
      { no: 'F-2', item: 'Costing report with three design options', uom: 'milestone', qty: 1, rate: 260000, done: 0.6, billed: 0.5 },
      { no: 'F-3', item: 'Design review & vendor bid evaluation', uom: 'milestone', qty: 1, rate: 195000, done: 0, billed: 0 }];
    default: return [
      { no: '1.01', item: 'Supply of structural steel (our material)', uom: 'MT', qty: 180, rate: 74500, done: 118, billed: 104 },
      { no: '2.04', item: 'Fabrication & painting in workshop', uom: 'MT', qty: 180, rate: 18500, done: 112, billed: 98 },
      { no: '3.02', item: 'Erection at site incl. cranage', uom: 'MT', qty: 180, rate: 14200, done: 64, billed: 52 },
      { no: '3.04', item: 'Truss T3/T4 erection (NCR hold)', uom: 'MT', qty: 18, rate: 14200, done: 6, billed: 0 },
      { no: '4.01', item: 'Gratings and handrails', uom: 'm²', qty: 620, rate: 2850, done: 140, billed: 120 }];
  }
}

export default function ProjectDetail() {
  const { id } = useParams();
  const projects = useApp(s => s.projects);
  const p = projects.find(x => x.id === id) || projects[0];
  const l = lineOf(p.line);
  const [tab, setTab] = useState<'overview' | 'structure' | 'boq' | 'budget' | 'schedule' | 'gates'>('overview');
  const boq = boqFor(p);
  const margin = p.billed ? ((p.billed - p.actual) / p.billed) * 100 : 0;
  const heads = ['Material', 'Labour', 'Equipment & hire', 'Subcontract', 'Overheads'];
  const split = [0.46, 0.27, 0.12, 0.09, 0.06];
  const isNCR = p.id === '103';
  return (
    <>
      <Link to="/projects" className="small row" style={{ gap: 4 }}><ArrowLeft size={14} />All projects</Link>
      <PageHeader num={5} eyebrow={`${p.code} · ${p.client} · ${p.site}`} title={p.name} chips={<><LineChip line={p.line} /><StatusBadge s={p.status} /></>}
        actions={<><Link to="/dpr" className="btn"><ClipboardList size={15} />DPR</Link><Link to="/procurement" className="btn"><ShoppingCart size={15} />Requisition</Link><Link to="/billing" className="btn btn-primary"><Receipt size={15} />Bill</Link></>} />
      <Card title={`${l.no} ${l.name} template`} sub={`${l.handles} · Billing: ${l.billing}`} actions={<WhyPin text="The stages come from the business-line template, so a service job always passes steel reconciliation before retention release, and a manpower job never touches stores." />}>
        <Stages stages={l.stages} current={p.stage} done={p.status === 'Completed'} />
      </Card>
      <div className="grid g6">
        <Stat label="Contract" value={money(p.contract)} />
        <Stat label="Budget (locked)" value={money(p.budget)} meta="Baseline v2 · 12 Sep" />
        <Stat label="Committed" value={money(p.committed)} meta="Open POs, hires" />
        <Stat label="Actual cost" value={money(p.actual)} meta={`${Math.round((p.actual / p.budget) * 100)}% of budget`} />
        <Stat label="Billed · received" value={money(p.billed)} meta={`${money(p.received)} received`} />
        <Stat label="Project margin" value={<Sensitive kind="margin">{p.billed ? `${margin.toFixed(1)}%` : '—'}</Sensitive>} valueColor={margin < 10 ? 'var(--red)' : 'var(--green)'} meta="On billed work" />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'overview', label: 'Overview & P&L' }, { key: 'structure', label: 'Structure' }, { key: 'boq', label: 'WBS & BOQ', count: boq.length }, { key: 'budget', label: 'Budget & variations' }, { key: 'schedule', label: 'Schedule' }, { key: 'gates', label: 'Stage gates' }]} />

      {tab === 'overview' && <div className="split-wide">
        <Card title="Budget for work done against actual cost" sub="₹ lakh, by cost head · budget scaled to physical progress">
          <ColumnChart aria="Budget for work done and actual cost by cost head" categories={heads} series={[{ name: 'Budget for work done', color: 'var(--c1)', values: split.map(s => (p.budget * s * p.progress / 100) / 1e5) }, { name: 'Actual', color: 'var(--c2)', values: split.map((s, i) => (p.actual * s * (i === 2 ? 1.25 : 0.96)) / 1e5) }]} fmt={n => `₹${n.toFixed(0)} L`} height={210} />
          <Legend items={[{ name: 'Budget for work done', color: 'var(--c1)' }, { name: 'Actual', color: 'var(--c2)' }]} />
          {(() => { const eqB = p.budget * split[2] * p.progress / 100, eqA = p.actual * split[2] * 1.25, over = Math.round((eqA / eqB - 1) * 100); return over > 0 ? <div className="callout warn"><Lock size={15} style={{ flexShrink: 0 }} /><span>Equipment & hire is {over}% above its budget for the work done. Any hire extension needs approval before it is committed.</span></div> : <div className="callout ok"><Lock size={15} style={{ flexShrink: 0 }} /><span>All cost heads are within their budget for the work done.</span></div>; })()}
        </Card>
        <Card title="Project P&L" sub="Updates with every bill, GRN, DPR and payroll run">
          <dl className="kv">
            <dt>Billed to date</dt><dd className="num">{inr(p.billed)}</dd>
            <dt>Cost to date</dt><dd className="num">{inr(p.actual)}</dd>
            <dt>Gross profit</dt><dd className="num"><Sensitive kind="margin">{inr(p.billed - p.actual)}</Sensitive></dd>
            <dt>Retention held</dt><dd className="num">{inr(p.retention)}</dd>
            <dt>Received</dt><dd className="num">{inr(p.received)}</dd>
            <dt>Outstanding</dt><dd className="num">{inr(p.billed - p.received)}</dd>
          </dl>
          <div className="divider" />
          <span className="label">Recent activity</span>
          <Timeline items={[{ when: 'Today 07:40', who: p.engineer, what: 'DPR submitted: work done, manpower, equipment and photos', tone: 'blue', icon: <ClipboardList size={13} /> }, { when: 'Yesterday', who: 'Imran Sheikh', what: 'PO raised against BOQ 2.11 after the budget check passed', tone: 'green', icon: <ShoppingCart size={13} /> }, { when: '20 Oct', who: 'Deepa Nair', what: 'RA bill posted and e-invoice generated', tone: 'violet', icon: <Receipt size={13} /> }]} />
        </Card>
      </div>}

      {tab === 'structure' && <Card title="Project → Department → Team → Job description" sub="Every cost and every person is booked to this structure">
        <div className="col" style={{ gap: 10 }}>
          <div className="row strong"><FolderTree size={16} color="var(--primary)" />{p.code} · {p.name}</div>
          {(p.line === 'manpower' ? [['Deployment', [['Crew A — fitters', 48, 'Fit-up, bolting, gas cutting'], ['Crew B — welders', 40, 'Structural welding (6G certified)'], ['Crew C — helpers', 32, 'Material shifting, housekeeping']]]] :
            p.line === 'consultation' ? [['Estimation', [['Costing team', 3, 'Survey, take-off, rate analysis']]]] :
              p.line === 'om' ? [['Operations', [['Shift crews A/B/C', 54, 'Slag pot handling, loader operation'], ['Maintenance', 8, 'Loader & tipper upkeep']]]] :
                [['Workshop', [['Fabrication', 26, 'Cutting, fit-up, welding'], ['Painting', 6, 'Blasting, primer, finish coats']]], ['Site', [['Erection', 22, 'Rigging, bolting, alignment'], ['Safety', 3, 'Permits, toolbox talks']]], ['Quality', [['QC', 2, 'DPT, UT, dimensional checks']]]]).map(([d, teams]) => (
              <div key={d as string} style={{ marginLeft: 22, paddingLeft: 14, borderLeft: '2px solid var(--line)' }} className="col">
                <span className="strong">Department · {d as string}</span>
                {(teams as [string, number, string][]).map(([t, n, jd]) => (
                  <div key={t} style={{ marginLeft: 22, paddingLeft: 14, borderLeft: '2px solid var(--line-2)' }} className="row wrap">
                    <span className="small strong">Team · {t}</span><Badge tone="grey" dot={false} icon={<Users size={11} />}>{n} people</Badge><span className="small muted">Job description: {jd}</span>
                  </div>
                ))}
              </div>
            ))}
        </div>
        <Why compact>Labour cost, material and DPR quantities roll up from job description to team, department and project, so you can see exactly where a margin was lost.</Why>
      </Card>}

      {tab === 'boq' && <Card title="Bill of quantities" sub="Executed quantity comes from verified DPRs; billed quantity from certified bills" flush actions={<button className="btn btn-sm" onClick={() => toast('BOQ exported to Excel', 'info')}>Export</button>}>
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Item</th><th>Description</th><th>UoM</th><th className="r">BOQ qty</th><th className="r">Rate</th><th className="r">Amount</th><th>Executed</th><th className="r">Billed qty</th><th className="r">Billable now</th></tr></thead>
          <tbody>{boq.map(b => {
            const ncr = isNCR && b.no === '3.04';
            return (
              <tr key={b.no}><td className="mono">{b.no}</td><td className="strong">{b.item}{ncr && <> <Badge tone="red" icon={<Lock size={11} />}>NCR-0412 hold</Badge></>}</td><td>{b.uom}</td><td className="r">{b.qty.toLocaleString('en-IN')}</td><td className="r">{inr(b.rate)}</td><td className="r">{money(b.qty * b.rate)}</td>
                <td><div className="meter-row"><Progress value={(b.done / b.qty) * 100} width={60} /><span className="xs num">{b.done.toLocaleString('en-IN')}</span></div></td><td className="r">{b.billed.toLocaleString('en-IN')}</td>
                <td className="r strong" style={{ color: ncr ? 'var(--ink-3)' : 'var(--green)' }}>{ncr ? 'Held' : money((b.done - b.billed) * b.rate)}</td></tr>
            );
          })}</tbody>
        </table></div>
      </Card>}

      {tab === 'budget' && <div className="grid g2">
        <Card title="Budget baseline" sub="Locked on 12 Sep · material requirement comes from the BOQ" flush>
          <div className="table-wrap"><table className="table"><thead><tr><th>Cost head</th><th className="r">Budget</th><th className="r">Committed</th><th className="r">Actual</th><th className="r">Balance</th></tr></thead>
            <tbody>{heads.map((h, i) => { const b = p.budget * split[i], a = p.actual * split[i] * (i === 2 ? 1.25 : 0.96), c = p.committed * split[i]; return <tr key={h}><td className="strong">{h}</td><td className="r">{money(b)}</td><td className="r">{money(c)}</td><td className="r">{money(a)}</td><td className="r" style={{ color: b - a - c < 0 ? 'var(--red)' : undefined }}>{money(b - a - c)}</td></tr>; })}</tbody></table></div>
        </Card>
        <Card title="Variations" sub="Scope changes with client approval" flush actions={<button className="btn btn-sm" onClick={() => toast('Variation VO-04 drafted', 'info')}><Plus size={13} />Variation</button>}>
          <div className="table-wrap"><table className="table"><thead><tr><th>VO</th><th>Description</th><th className="r">Value</th><th>Status</th></tr></thead>
            <tbody><tr><td className="mono">VO-01</td><td>Additional platform at +18 m</td><td className="r">₹4.2 L</td><td><Badge tone="green">Approved</Badge></td></tr><tr><td className="mono">VO-02</td><td>Change in paint system</td><td className="r">₹1.1 L</td><td><Badge tone="green">Approved</Badge></td></tr><tr><td className="mono">VO-03</td><td>Extra liner plates</td><td className="r">₹3.4 L</td><td><Badge tone="amber">Pending MD</Badge></td></tr></tbody></table></div>
          <div className="card-b"><Why compact>Variations are priced and approved before the extra work is done, so they are billed instead of being written off at the final bill.</Why></div>
        </Card>
      </div>}

      {tab === 'schedule' && <Card title="Schedule" sub="Planned against actual, from DPR progress">
        {[['Drawings & approvals', 0, 18, 100], ['Material procurement', 10, 35, 90], ['Workshop fabrication', 20, 60, 70], ['Site erection', 40, 85, p.progress], ['Painting & touch-up', 70, 92, 10], ['Final measurement & bill', 88, 100, 0]].map(([t, s, e, pr]) => (
          <div key={t as string} className="row" style={{ gap: 12 }}>
            <span className="small strong" style={{ width: 180, flexShrink: 0 }}>{t as string}</span>
            <div className="grow" style={{ position: 'relative', height: 22, background: 'var(--surface-2)', borderRadius: 6 }}>
              <div style={{ position: 'absolute', left: `${s}%`, width: `${(e as number) - (s as number)}%`, top: 4, height: 14, borderRadius: 4, background: 'var(--surface-3)', overflow: 'hidden' }}><div style={{ width: `${pr}%`, height: '100%', background: (pr as number) < 40 && (s as number) < 45 ? 'var(--warn)' : 'var(--c1)' }} /></div>
              <div style={{ position: 'absolute', left: '52%', top: 0, bottom: 0, width: 2, background: 'var(--ink)' }} title="Today" />
            </div>
            <span className="xs num muted" style={{ width: 36 }}>{pr}%</span>
          </div>
        ))}
        <span className="xs muted">The black line is today. Bars fill with progress from verified DPRs.</span>
      </Card>}

      {tab === 'gates' && <Card title="Stage gates for this project" sub="Work cannot move on until these are met">
        {[['Quotation → Project', true, 'Quotation approved, client PO uploaded, business line chosen'], ['Project → Procurement', true, 'Budget baseline locked on 12 Sep'], ['Requisition → Purchase order', true, 'Stock and budget checked on every PR'], ['Receipt → Stores', true, 'QC passed on all inspected receipts'], ['Site work → Billing', !isNCR, isNCR ? 'Blocked for BOQ 3.04: NCR-0412 is open on truss T3' : 'DPR quantities verified and measurements certified'], ['Final bill → Retention release', p.line !== 'service', p.line === 'service' ? 'Needs client-steel reconciliation accepted by Accounts' : 'Not applicable for this line']].map(([g, ok, d]) => (
          <div key={g as string} className="row-top" style={{ gap: 10 }}>{ok ? <CircleCheck size={18} color="var(--green)" /> : <Circle size={18} color="var(--red)" />}<div className="col" style={{ gap: 0 }}><span className="strong">{g as string}</span><span className="small muted">{d as string}</span></div></div>
        ))}
      </Card>}
    </>
  );
}
