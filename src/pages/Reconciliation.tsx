import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock, Unlock, TriangleAlert, Sparkles, FileText } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Seg } from '../components/ui';
import { StackBar } from '../components/charts';
import { inr, money } from '../lib/format';
import { RETENTIONS } from '../data/finance';
import { useApp, setState, toast } from '../lib/store';
import { roleByKey } from '../lib/roles';

const STEEL = {
  '087': { code: 'PRJ-23-087', name: 'Mill building re-sheeting', client: 'Vijayanagar Alloys Ltd', received: 42.5, used: 39.8, scrap: 2.15, atSite: 0, allowance: 1.5, rate: 58000, stage: 'Final bill submitted' },
  '102': { code: 'PRJ-24-102', name: 'Kiln shell & cyclone repair', client: 'Coromandel Cement Ltd', received: 64.0, used: 51.6, scrap: 5.8, atSite: 5.52, allowance: 1.5, rate: 58000, stage: 'Running · RA 05' }
} as const;
const WORK = [
  { p: 'PRJ-24-101', name: 'Bay 4 structural steel', done: 11900000, billed: 11200000, received: 9650000, ret: 0 },
  { p: 'PRJ-24-102', name: 'Kiln shell & cyclone repair', done: 4824000, billed: 4480000, received: 3810000, ret: 224000 },
  { p: 'PRJ-24-103', name: 'Conveyor gallery', done: 9200000, billed: 8600000, received: 7020000, ret: 430000 },
  { p: 'PRJ-24-107', name: 'Cooling tower refurbishment', done: 1740000, billed: 1560000, received: 980000, ret: 78000 },
  { p: 'PRJ-23-087', name: 'Mill building re-sheeting', done: 12800000, billed: 12800000, received: 12160000, ret: 640000 }
];

export default function Reconciliation() {
  const role = roleByKey(useApp(s => s.role));
  const a8 = useApp(s => s.approvals.find(a => a.id === 'A8'));
  const accepted = a8?.status !== 'Blocked';
  const [tab, setTab] = useState<'steel' | 'retention' | 'work'>('steel');
  const [pid, setPid] = useState<'087' | '102'>('087');
  const s = STEEL[pid];
  const unaccounted = +(s.received - s.used - s.scrap - s.atSite).toFixed(2);
  const pctV = (unaccounted / s.used) * 100;
  const allowed = +(s.used * s.allowance / 100).toFixed(3);
  const excess = Math.max(0, +(unaccounted - allowed).toFixed(3));
  const recovery = Math.round(excess * s.rate);
  const canAccept = role.key === 'accounts' || role.key === 'md';
  const accept = () => {
    setState(st => ({
      approvals: st.approvals.map(a => a.id === 'A8' ? { ...a, status: 'Pending', blockReason: undefined } : a),
      tasks: st.tasks.map(t => t.id === 'T4' ? { ...t, done: true } : t)
    }));
    toast('Reconciliation for PRJ-23-087 accepted. Retention claim of ₹6.40 L is now open for approval.');
  };
  return (
    <>
      <PageHeader num={16} eyebrow="Bill & close" title="Reconciliation & retention" sub="Client-steel reconciliation after the final bill on service projects; retention held and released; work done against money billed, received and retained." />
      <div className="grid g4">
        <Stat label="Retention held" value={money(RETENTIONS.reduce((a, r) => a + r.held, 0))} meta="4 projects" />
        <Stat label="Due this month" value={money(640000)} meta={accepted ? 'Ready to claim' : 'Blocked by steel reconciliation'} valueColor={accepted ? 'var(--green)' : 'var(--amber)'} />
        <Stat label="Work done, not billed" value={money(WORK.reduce((a, w) => a + w.done - w.billed, 0))} meta="Across running projects" />
        <Stat label="Client steel above allowance" value="1 project" valueColor="var(--red)" meta="PRJ-24-102 · 2.1% against 1.5%" />
      </div>
      <Why points={['Retention is released sooner because the steel reconciliation is ready the day the final bill goes in, not months later.', 'Wastage recoveries are worked out from the register, so disputes are settled with numbers instead of arguments.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'steel', label: 'Client-steel reconciliation' }, { key: 'retention', label: 'Retention', count: RETENTIONS.length }, { key: 'work', label: 'Work & money' }]} />

      {tab === 'steel' && <div className="split">
        <Card title={`${s.code} · ${s.name}`} sub={`${s.client} · ${s.stage}`} actions={<Seg options={[{ key: '087', label: 'PRJ-23-087' }, { key: '102', label: 'PRJ-24-102' }]} value={pid} onChange={setPid} />}>
          <div className="table-wrap"><table className="table">
            <tbody>
              <tr><td>Steel received from client</td><td className="r strong">{s.received.toFixed(2)} MT</td></tr>
              <tr><td>Used as per measured work (BOQ design weight)</td><td className="r">−{s.used.toFixed(2)} MT</td></tr>
              <tr><td>Scrap returned to client (gate passes)</td><td className="r">−{s.scrap.toFixed(2)} MT</td></tr>
              <tr><td>Balance at site / returned unused</td><td className="r">{s.atSite ? "−" : ""}{s.atSite.toFixed(2)} MT</td></tr>
              <tr className="total"><td>Unaccounted</td><td className="r">{unaccounted.toFixed(2)} MT · {pctV.toFixed(2)}% of used</td></tr>
              <tr><td>Wastage allowance in contract ({s.allowance}% of used)</td><td className="r">{allowed.toFixed(2)} MT</td></tr>
              <tr><td className="strong">Excess over allowance</td><td className="r strong" style={{ color: excess > 0 ? 'var(--red)' : 'var(--green)' }}>{excess.toFixed(2)} MT</td></tr>
              <tr><td className="strong">Recovery at client rate ({inr(s.rate)} / MT)</td><td className="r strong" style={{ color: recovery ? 'var(--red)' : 'var(--green)' }}>{recovery ? inr(recovery) : 'Nil'}</td></tr>
            </tbody>
          </table></div>
          {pid === '087' ? (accepted
            ? <div className="callout ok"><Check size={16} style={{ flexShrink: 0 }} /><span><b>Accepted by Accounts.</b> The stage gate Final bill → Retention release is cleared.</span></div>
            : <div className="callout warn"><Lock size={16} style={{ flexShrink: 0 }} /><span>Within allowance, so no recovery. It needs acceptance by Accounts before the ₹6.40 L retention can be claimed.</span><button className="btn btn-sm btn-success ml-auto" disabled={!canAccept} onClick={accept}><Check size={13} />Accept reconciliation</button></div>)
            : <div className="callout danger"><TriangleAlert size={16} style={{ flexShrink: 0 }} /><span><b>Procurement & Inventory Agent:</b> {excess.toFixed(2)} MT above allowance while the job is still running. Check cutting plans and scrap gate passes now, instead of losing {inr(recovery)} at the final bill.</span></div>}
          {!canAccept && pid === '087' && !accepted && <span className="xs muted">Only Accounts or the MD can accept. Switch "View as" to Accounts / Finance.</span>}
        </Card>
        <Card title="Where the steel went" sub={`${s.received} MT received`}>
          <StackBar fmt={n => `${n.toFixed(2)} MT`} parts={[{ label: 'Used', value: s.used, color: 'var(--c1)' }, { label: 'Scrap returned', value: s.scrap, color: 'var(--c3)' }, { label: 'At site', value: s.atSite, color: '#B8C4D6' }, { label: 'Unaccounted', value: unaccounted, color: 'var(--c2)' }]} height={16} />
          <span className="label">Evidence</span>
          {['Client steel receipts (6 challans)', 'Scrap gate passes (4)', 'Measurement sheets MS-01 to MS-05', 'Cutting plans with nesting sheets'].map(e => <div key={e} className="row small"><FileText size={14} color="var(--ink-3)" />{e}</div>)}
          <Why compact>Every number in the statement links back to a challan, gate pass or measurement sheet, so the client can check it line by line.</Why>
        </Card>
      </div>}

      {tab === 'retention' && <Card flush title="Retention register" sub="Held by clients and released against conditions" actions={<WhyPin text="When retention is tracked loosely, money already earned stays locked with clients for longer than needed. Here every rupee has a release date and a condition." />}>
        <div className="table-wrap"><table className="table"><thead><tr><th>Project</th><th>Client</th><th className="r">Held</th><th>Release condition</th><th>Due</th><th>Status</th><th /></tr></thead>
          <tbody>{RETENTIONS.map(r => { const blocked = r.state === 'Blocked' && !accepted; return (
            <tr key={r.project}><td><div className="cell-2"><span className="code-link">{r.project}</span><span className="strong">{r.name}</span></div></td><td>{r.client}</td><td className="r strong">{inr(r.held)}</td><td className="small">{r.condition}</td><td>{r.due}</td>
              <td>{r.state === 'Held' ? <Badge tone="grey">Held</Badge> : blocked ? <Badge tone="red" icon={<Lock size={11} />}>Gate not met</Badge> : <Badge tone="green" icon={<Unlock size={11} />}>Ready to claim</Badge>}</td>
              <td>{r.state !== 'Held' && <Link to="/approvals" className={'btn btn-sm' + (blocked ? '' : ' btn-primary')}>{blocked ? 'Why blocked' : 'Claim'}</Link>}</td></tr>); })}</tbody></table></div>
      </Card>}

      {tab === 'work' && <Card flush title="Work done against money" sub="Work done (from verified DPRs) → billed → received → retained">
        <div className="table-wrap"><table className="table"><thead><tr><th>Project</th><th className="r">Work done</th><th className="r">Billed</th><th className="r">Not billed</th><th className="r">Received</th><th className="r">Retention</th><th className="r">Outstanding</th></tr></thead>
          <tbody>{WORK.map(w => <tr key={w.p}><td><div className="cell-2"><span className="code-link">{w.p}</span><span className="strong">{w.name}</span></div></td><td className="r">{money(w.done)}</td><td className="r">{money(w.billed)}</td><td className="r strong" style={{ color: w.done - w.billed > 0 ? 'var(--amber)' : undefined }}>{w.done - w.billed > 0 ? money(w.done - w.billed) : '—'}</td><td className="r">{money(w.received)}</td><td className="r">{money(w.ret)}</td><td className="r">{money(w.billed - w.received - w.ret)}</td></tr>)}</tbody></table></div>
        <div className="card-f"><Sparkles size={15} color="var(--violet)" /><span className="small">Finance Agent: {money(WORK.reduce((a, w) => a + w.done - w.billed, 0))} of work is done but not billed. It is picked up in the November billing estimate.</span></div>
      </Card>}
    </>
  );
}
