import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { PageHeader, Card, Why, Seg, Badge } from '../components/ui';
import { NAV } from '../lib/nav';

const PHASE: Record<string, 1 | 2 | 3> = {
  masters: 1, projects: 1, 'billing-estimate': 1, procurement: 1, inventory: 1, manpower: 1, hiring: 1, dpr: 1, billing: 1, reconciliation: 1, approvals: 1,
  accounts: 2, hr: 2, fleet: 2, qaqc: 2, documents: 2, mis: 2, analytics: 2,
  leads: 3, estimates: 3, sales: 3, om: 3, automation: 3, ai: 3
};
const PHASE_NAME = { 1: 'Phase 1 · Core operations', 2: 'Phase 2 · Finance, people & quality', 3: 'Phase 3 · Growth & intelligence' };

const FLOW = [
  { stage: 'Win', sub: 'get the order', steps: ['Lead / enquiry', 'Marketing & BD', 'Consultation & technical discussion', 'Costing & estimation', 'Quotation / proposal', 'Client approval / order'] },
  { stage: 'Plan', sub: 'set it up', steps: ['Project creation (business-line template)', 'Monthly billing estimation', 'Engineering & planning'] },
  { stage: 'Resource', sub: 'line it up', steps: ['Procurement', 'Manpower', 'Inventory / stores', 'Hiring & rents'] },
  { stage: 'Execute', sub: 'do the work', steps: ['Construction / site execution', 'DPR & production', 'QA / QC'] },
  { stage: 'Close', sub: 'bill and close', steps: ['Client billing / accounts', 'Reconciliation & retention', 'Handover', 'Maintenance / AMC / service'] }
];

const GATES = [
  ['Enquiry → Quotation', 'The requirement is captured and the estimate is approved'],
  ['Quotation → Project', 'The quotation is approved at the right value level, the client PO or work order is uploaded and the business line is chosen'],
  ['Project → Procurement', 'The budget baseline is locked; material requirement comes from the BOQ'],
  ['Requisition → Purchase order', 'Stock is checked, the budget check passes and the value-based approval is given'],
  ['Receipt → Stores', 'Items that need inspection have passed QC'],
  ['Site work → Billing', 'DPR quantities are verified, measurements are certified and no open NCR sits on the item'],
  ['Final bill → Retention release', 'On service projects, the client-steel reconciliation is complete and accepted by Accounts']
];

export default function Modules() {
  const [view, setView] = useState<'stage' | 'phase'>('stage');
  const groups = NAV.filter(g => g.title !== 'Overview');
  const all = groups.flatMap(g => g.items.filter(i => i.num));
  return (
    <>
      <PageHeader eyebrow="Scope matrix · Section 5 of the quotation" title="All 23 modules and the AI Manager" sub="Every module in the quoted price, grouped the way your business runs. Click any card to open its screen." actions={<Seg options={[{ key: 'stage', label: 'By stage' }, { key: 'phase', label: 'By delivery phase' }]} value={view} onChange={setView} />} />
      <Why title="How to read this">Each module is shown with the phase it goes live in. Phase 1 gets projects, material, labour and billing into one system first, because everything else depends on that data.</Why>

      {view === 'stage' ? groups.map(g => (
        <section key={g.title} className="col" style={{ gap: 10 }}>
          <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{g.title}</h2>
          <div className="grid g4">
            {g.items.filter(i => i.num).map(i => (
              <Link key={i.key} to={i.path} className="agent-card">
                <div className="row"><span className="ico-box t-primary"><i.icon size={17} /></span><span className="mono muted">{String(i.num).padStart(2, '0')}</span><Badge tone={PHASE[i.key] === 1 ? 'blue' : PHASE[i.key] === 2 ? 'teal' : 'violet'} dot={false}>Phase {PHASE[i.key]}</Badge></div>
                <div className="strong" style={{ fontSize: 15 }}>{i.label}</div>
                <div className="small muted" style={{ lineHeight: 1.5 }}>{i.blurb}</div>
                <span className="small strong row" style={{ color: 'var(--primary-ink)', marginTop: 'auto', gap: 4 }}>Open screen<ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </section>
      )) : ([1, 2, 3] as const).map(ph => (
        <section key={ph} className="col" style={{ gap: 10 }}>
          <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{PHASE_NAME[ph]}</h2>
          <div className="grid g4">
            {all.filter(i => PHASE[i.key] === ph).map(i => (
              <Link key={i.key} to={i.path} className="agent-card"><div className="row"><span className="ico-box t-primary"><i.icon size={17} /></span><span className="mono muted">{String(i.num).padStart(2, '0')}</span></div><div className="strong">{i.label}</div><div className="small muted">{i.blurb}</div></Link>
            ))}
            {ph === 3 && <Link to="/ai" className="agent-card ai-grad" style={{ color: '#fff', border: 'none' }}><div className="row"><span className="ico-box" style={{ background: 'rgba(255,255,255,.12)' }}><Sparkles size={17} color="#9FB3FF" /></span></div><div className="strong">AI Manager & 7 agents</div><div className="small" style={{ color: '#C9D4F2' }}>Needs Phase 1 and 2 data to be useful</div></Link>}
          </div>
        </section>
      ))}

      <Link to="/ai" className="card ai-grad" style={{ border: 'none', textDecoration: 'none', color: '#fff' }}>
        <div className="card-b row wrap" style={{ gap: 16 }}>
          <span className="ai-avatar" style={{ width: 44, height: 44, background: 'rgba(255,255,255,.1)' }}><Sparkles size={20} /></span>
          <div className="col grow" style={{ gap: 2 }}><span style={{ fontWeight: 700, fontSize: 16 }}>Plus the AI layer: a central AI Manager and 7 agents</span><span style={{ color: '#C9D4F2', fontSize: 13 }}>Project · Finance (CA & CFO) · Procurement & Inventory · HR · Sales & CRM · Documents & Data · Workflow & Automation</span></div>
          <span className="btn btn-sm" style={{ background: 'rgba(255,255,255,.14)', color: '#fff', borderColor: 'rgba(255,255,255,.2)' }}>Open AI Manager<ArrowRight size={14} /></span>
        </div>
      </Link>

      <Card title="End-to-end workflow" sub="Your business flow with the changes from your notes. Commissioning & Handover and Foreign Machinery Trading are out of scope.">
        <div className="grid g5" style={{ gap: 10 }}>
          {FLOW.map(f => (
            <div key={f.stage} className="col" style={{ gap: 6 }}>
              <div style={{ background: 'var(--nav)', color: '#fff', borderRadius: 9, padding: '8px 10px', textAlign: 'center' }}><div style={{ fontWeight: 800, letterSpacing: '.12em', fontSize: 12 }}>{f.stage.toUpperCase()}</div><div style={{ fontSize: 11, color: '#AFC0F0' }}>{f.sub}</div></div>
              {f.steps.map(s => <div key={s} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: '#fff', fontSize: 12.5, fontWeight: 600, textAlign: 'center' }}>{s}</div>)}
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 9, background: 'var(--nav)', color: '#C9D4F2', fontSize: 12.5, textAlign: 'center' }}><b style={{ color: '#fff' }}>Cross-cutting controls:</b> Approvals · Tasks · Notifications · Documents · Audit trail · Analytics · Alerts · AI Manager & agents</div>
        <div style={{ padding: '10px 14px', borderRadius: 9, background: 'var(--primary)', color: '#E3E9FF', fontSize: 12.5, textAlign: 'center' }}><b style={{ color: '#fff' }}>Back office, alongside every phase:</b> Accounts & audit · Finance management & MIS · Finance Agent (CA & CFO) · Payroll, HR & statutory</div>
      </Card>

      <Card title="Stage gates — what the system checks before work moves on" flush actions={<span className="row small muted" style={{ gap: 6 }}><ShieldCheck size={15} />Enforced, not advisory</span>}>
        <div className="table-wrap"><table className="table">
          <thead><tr><th style={{ width: 240 }}>From → To</th><th>The system will not move forward until</th></tr></thead>
          <tbody>{GATES.map(g => <tr key={g[0]}><td className="strong">{g[0]}</td><td>{g[1]}</td></tr>)}</tbody>
        </table></div>
      </Card>
      <Why>Work cannot move forward until its conditions are met. Budget is checked before buying, QC passes before stock is accepted, measurements are certified before billing, and steel is reconciled before retention is released.</Why>
    </>
  );
}
