import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, Send } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Badge, Stat, Seg } from '../components/ui';
import { ColumnChart, Legend } from '../components/charts';
import { BILL_ESTIMATES } from '../data/finance';
import { money, inr } from '../lib/format';
import { toast } from '../lib/store';

export default function BillingEstimate() {
  const [month, setMonth] = useState<'nov' | 'oct'>('nov');
  const [rows, setRows] = useState(BILL_ESTIMATES.map(b => ({ ...b })));
  const eng = rows.reduce((a, r) => a + r.engineer, 0);
  const acc = rows.reduce((a, r) => a + r.accounts, 0);
  const lastEst = rows.reduce((a, r) => a + r.lastMonthEst, 0);
  const lastAct = rows.reduce((a, r) => a + r.lastMonthActual, 0);
  const set = (p: string, k: 'engineer' | 'accounts', v: number) => setRows(rs => rs.map(r => r.project === p ? { ...r, [k]: v, status: 'Under review' } : r));
  return (
    <>
      <PageHeader num={6} eyebrow="Plan" title="Monthly billing estimation" sub="Site engineers and Accounts estimate each project's billing every month. Estimates are compared with what was actually billed, and they feed the cash-flow forecast."
        actions={<><Seg options={[{ key: 'nov', label: 'November 2026' }, { key: 'oct', label: 'October 2026' }]} value={month} onChange={setMonth} /><button className="btn btn-primary" onClick={() => { setRows(rs => rs.map(r => ({ ...r, status: 'Agreed' }))); toast('November estimate locked and sent to the cash-flow forecast'); }}><Check size={15} />Lock estimate</button></>} />
      <div className="callout info"><Sparkles size={16} style={{ flexShrink: 0 }} /><span><b>Project Agent</b> drafted this estimate from DPR quantities, certified measurements, the O&M tonnage run-rate and manpower attendance. Site engineers and Accounts confirm or correct each line.</span></div>
      <div className="grid g4">
        <Stat label="Site engineers' estimate" value={money(eng)} meta="7 running projects" />
        <Stat label="Accounts' estimate" value={money(acc)} meta={`${money(eng - acc)} lower than site`} />
        <Stat label="October estimate vs actual" value={`${Math.round((lastAct / lastEst) * 100)}%`} meta={`${money(lastAct)} billed of ${money(lastEst)} estimated`} />
        <Stat label="Feeds cash forecast" value={<Link to="/mis" className="row" style={{ gap: 6, fontSize: 18 }}>Open forecast<ArrowRight size={16} /></Link>} meta="Collections by week" />
      </div>
      <Why points={['Cash inflow becomes predictable: you know by the 25th what will be billed this month and collected next month.', 'Billable work stops slipping into the next month, because a gap between the estimate and the bills raised shows up before month-end.']} />
      <Card flush title={month === 'nov' ? 'November estimate by project' : 'October: estimate against actual billed'} sub="Edit a line to send it back for review" actions={<WhyPin text="When site and Accounts disagree by more than 10%, the line is flagged. Most gaps are unsigned measurement sheets, so the fix is clear before the bill is due." />}>
        <div className="table-wrap"><table className="table">
          <thead>{month === 'nov'
            ? <tr><th>Project</th><th>Basis</th><th className="r">Site engineer</th><th className="r">Accounts</th><th className="r">Gap</th><th>Status</th></tr>
            : <tr><th>Project</th><th>Basis</th><th className="r">Estimated</th><th className="r">Actually billed</th><th className="r">Accuracy</th><th>Reason</th></tr>}</thead>
          <tbody>{rows.map(r => {
            const gap = r.engineer ? ((r.engineer - r.accounts) / r.engineer) * 100 : 0;
            const accu = r.lastMonthEst ? Math.round((r.lastMonthActual / r.lastMonthEst) * 100) : 100;
            return month === 'nov' ? (
              <tr key={r.project}><td><div className="cell-2"><span className="code-link">{r.project}</span><span className="strong">{r.name}</span></div></td><td className="small">{r.basis}</td>
                <td className="r"><input className="input input-sm num" style={{ width: 120 }} type="number" value={r.engineer} onChange={e => set(r.project, 'engineer', Number(e.target.value) || 0)} aria-label={`Site estimate for ${r.project}`} /></td>
                <td className="r"><input className="input input-sm num" style={{ width: 120 }} type="number" value={r.accounts} onChange={e => set(r.project, 'accounts', Number(e.target.value) || 0)} aria-label={`Accounts estimate for ${r.project}`} /></td>
                <td className="r strong" style={{ color: Math.abs(gap) > 10 ? 'var(--red)' : 'var(--ink-2)' }}>{gap.toFixed(0)}%</td>
                <td><Badge tone={r.status === 'Agreed' ? 'green' : r.status === 'Under review' ? 'amber' : 'grey'}>{r.status}</Badge></td></tr>
            ) : (
              <tr key={r.project}><td><div className="cell-2"><span className="code-link">{r.project}</span><span className="strong">{r.name}</span></div></td><td className="small">{r.basis}</td><td className="r">{inr(r.lastMonthEst)}</td><td className="r">{inr(r.lastMonthActual)}</td>
                <td className="r strong" style={{ color: accu < 85 ? 'var(--red)' : 'var(--green)' }}>{r.lastMonthEst ? `${accu}%` : '—'}</td>
                <td className="small muted">{accu < 85 ? 'Measurement sheet signed late by client' : accu > 100 ? 'O&M tonnage above run-rate' : 'On plan'}</td></tr>
            );
          })}
            <tr className="total">{month === 'nov' ? <><td colSpan={2}>Total</td><td className="r">{inr(eng)}</td><td className="r">{inr(acc)}</td><td className="r">{(((eng - acc) / eng) * 100).toFixed(0)}%</td><td /></> : <><td colSpan={2}>Total</td><td className="r">{inr(lastEst)}</td><td className="r">{inr(lastAct)}</td><td className="r">{Math.round((lastAct / lastEst) * 100)}%</td><td /></>}</tr>
          </tbody>
        </table></div>
      </Card>
      <div className="grid g2">
        <Card title="Estimate against actual billed" sub="Last 6 months, ₹ lakh">
          <ColumnChart aria="Monthly billing estimate versus actual" categories={['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']} series={[{ name: 'Estimated', color: 'var(--c1)', values: [124, 131, 137, 144, 152, 162] }, { name: 'Billed', color: 'var(--c3)', values: [118, 126, 131, 138, 146, 153] }]} fmt={n => `₹${n.toFixed(0)} L`} height={200} />
          <Legend items={[{ name: 'Estimated', color: 'var(--c1)' }, { name: 'Billed', color: 'var(--c3)' }]} />
        </Card>
        <Card title="What happens next">
          {[['25th', 'Site engineers confirm their lines on the phone', 'Reminder sent on WhatsApp'], ['26th', 'Accounts reviews and agrees each line', 'Gaps above 10% flagged'], ['27th', 'Estimate locked', 'Feeds the 4-week cash-flow forecast'], ['Month-end', 'Bills raised against the estimate', 'Shortfall reported in the MIS pack']].map(([d, t, s]) => (
            <div key={d} className="row-top" style={{ gap: 12 }}><span className="tag" style={{ minWidth: 72, justifyContent: 'center' }}>{d}</span><div className="col" style={{ gap: 0 }}><span className="small strong">{t}</span><span className="xs muted">{s}</span></div></div>
          ))}
          <button className="btn" onClick={() => toast('Reminder sent to 3 site engineers on WhatsApp')}><Send size={15} />Remind site engineers</button>
        </Card>
      </div>
    </>
  );
}
