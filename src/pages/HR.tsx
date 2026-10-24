import { useState } from 'react';
import { Check, Camera, CalendarClock, Sparkles, Download, TriangleAlert, CircleCheck, Clock } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Sensitive } from '../components/ui';
import { inr, money } from '../lib/format';
import { ADVANCES } from '../data/finance';
import { toast } from '../lib/store';

const PAYROLL = [
  { head: 'Gross wages and salaries', amt: 3512000 },
  { head: 'Employer PF (12%)', amt: 0, note: 'Paid separately' },
  { head: 'Employee PF (12%)', amt: -284000 },
  { head: 'Employee ESI (0.75%)', amt: -16900 },
  { head: 'Professional tax (Karnataka)', amt: -36400 },
  { head: 'Weekly cash advances recovered', amt: -238000 },
  { head: 'LPG deductions', amt: -18200 },
  { head: 'Material mishandling deductions', amt: -12600 },
  { head: 'Safety violation deductions', amt: -4500 },
  { head: 'TDS on salaries', amt: -61400 }
];
const DEDUCTIONS = [
  { code: 'W-1131', name: 'Anil Kumar', type: 'Safety violation', amount: 500, evidence: 'Photo · no harness at +18 m · 21 Oct', ack: true },
  { code: 'W-1088', name: 'Basavaraj H', type: 'Material mishandling', amount: 1800, evidence: 'Report · grinding disc pack damaged · 19 Oct', ack: true },
  { code: 'W-1042', name: 'Ramesh Naik', type: 'LPG', amount: 640, evidence: 'Room LPG share, October', ack: true },
  { code: 'W-1203', name: 'Mallikarjun K', type: 'Material mishandling', amount: 2400, evidence: 'Report · welding cable cut · 23 Oct', ack: false }
];
const STATUTORY = [
  { what: 'PF challan — September wages', due: '15 Oct', amount: 462000, state: 'Overdue 9 d' },
  { what: 'ESI challan — September wages', due: '15 Oct', amount: 118000, state: 'Overdue 9 d' },
  { what: 'Professional tax — October', due: '20 Nov', amount: 36400, state: 'Due' },
  { what: 'PF & ESI — October wages', due: '15 Nov', amount: 584000, state: 'Due' },
  { what: "Workmen's compensation policy (WCP) renewal", due: '30 Nov', amount: 148000, state: 'Due' },
  { what: 'Labour licence (CLRA) — Ballari BF-2', due: '20 Nov', amount: 0, state: 'Due' },
  { what: 'Half-yearly return (CLRA Form XXIV)', due: '30 Jan', amount: 0, state: 'Upcoming' },
  { what: 'Karnataka Labour Welfare Fund', due: '15 Jan', amount: 9360, state: 'Upcoming' },
  { what: 'PF & ESI — August wages', due: '15 Sep', amount: 571000, state: 'Filed' }
];

export default function HR() {
  const [tab, setTab] = useState<'payroll' | 'advances' | 'deductions' | 'statutory' | 'attendance'>('advances');
  const [advOk, setAdvOk] = useState(false);
  const [filed, setFiled] = useState(false);
  const net = PAYROLL.reduce((a, p) => a + p.amt, 0);
  const open = ADVANCES.filter(a => a.given > a.recovered);
  return (
    <>
      <PageHeader num={20} eyebrow="Back office & finance" title="Payroll, HR & statutory" sub="Employee master, attendance, leave and salary; weekly cash advances and deductions with evidence; PF, ESI, PT, WCP, labour licence, half-yearly returns and welfare."
        actions={<button className="btn btn-primary" onClick={() => setTab('payroll')}>Review October payroll</button>} />
      <div className="grid g4">
        <Stat label="People on payroll" value="312" meta="64 staff · 248 workers" />
        <Stat label="October net pay (draft)" value={<Sensitive kind="salary">{money(net)}</Sensitive>} meta="Drafted by HR Agent" />
        <Stat label="Advances outstanding" value={inr(open.reduce((a, x) => a + x.given - x.recovered, 0))} meta={`${open.length} workers`} />
        <Stat label="Statutory overdue" value={filed ? 'None' : '2'} valueColor={filed ? 'var(--green)' : 'var(--red)'} meta={filed ? 'PF & ESI filed today' : 'PF & ESI for September'} />
      </div>
      <Why points={['Weekly advances are recovered in full: each one is recorded against the worker and deducted from wages automatically, including from final settlement when someone leaves.', 'Deductions for LPG, damage and safety carry their evidence, so they are not disputed; a statutory calendar keeps PF, ESI, PT and licences from becoming penalties.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'advances', label: 'Weekly advances', count: open.length }, { key: 'deductions', label: 'Deductions', count: DEDUCTIONS.length }, { key: 'payroll', label: 'Payroll run' }, { key: 'statutory', label: 'Statutory calendar', count: STATUTORY.filter(s => s.state !== 'Filed').length }, { key: 'attendance', label: 'Attendance & leave' }]} />

      {tab === 'advances' && <div className="split">
        <Card flush title="Advances by worker" sub="Given weekly, recovered from wages" actions={<WhyPin text="Advances tracked on paper are rarely recovered in full. Here every rupee is recovered from wages, or from final settlement for workers who leave." />}>
          <div className="table-wrap"><table className="table"><thead><tr><th>Worker</th><th>Site</th><th className="r">Given</th><th className="r">Recovered</th><th className="r">Outstanding</th><th>Recovery</th></tr></thead>
            <tbody>{ADVANCES.map(a => <tr key={a.code}><td><div className="cell-2"><span className="strong">{a.name}</span><span className="s mono">{a.code} · {a.trade}</span></div></td><td>{a.site}</td><td className="r">{inr(a.given)}</td><td className="r">{inr(a.recovered)}</td><td className="r strong" style={{ color: a.given - a.recovered > 0 ? 'var(--amber)' : 'var(--green)' }}>{inr(a.given - a.recovered)}</td>
              <td>{a.given === a.recovered ? <Badge tone="green">Cleared</Badge> : a.status === 'Left' ? <Badge tone="red">Left · from final settlement</Badge> : <Badge tone="blue">Weekly from wages</Badge>}</td></tr>)}</tbody></table></div>
        </Card>
        <Card title="This week's advance batch · ADV-W43" sub="86 workers · paid on Saturday by UPI or cash">
          <dl className="kv" style={{ gridTemplateColumns: '1fr auto' }}><dt>Workers requesting</dt><dd className="r">86</dd><dt>Total requested</dt><dd className="r">{inr(258000)}</dd><dt>Weekly limit per worker</dt><dd className="r">{inr(3500)}</dd><dt>Above limit</dt><dd className="r" style={{ color: 'var(--green)' }}>None</dd></dl>
          {advOk ? <div className="callout ok"><Check size={15} style={{ flexShrink: 0 }} /><span>Approved. Payment file ready for Saturday; recovery is scheduled in the October payroll.</span></div>
            : <button className="btn btn-primary" onClick={() => { setAdvOk(true); toast('Advance batch ADV-W43 approved (₹2.58 L)'); }}><Check size={15} />Approve batch</button>}
          <div className="callout info"><Sparkles size={15} style={{ flexShrink: 0 }} /><span><b>HR Agent:</b> 2 workers who left still owe ₹13,000. Recovery from their final settlement has been added to the payroll draft.</span></div>
        </Card>
      </div>}

      {tab === 'deductions' && <Card flush title="Deductions with evidence" sub="LPG, material mishandling and safety violations">
        <div className="table-wrap"><table className="table"><thead><tr><th>Worker</th><th>Type</th><th className="r">Amount</th><th>Evidence</th><th>Worker acknowledged</th></tr></thead>
          <tbody>{DEDUCTIONS.map(d => <tr key={d.code + d.type}><td><div className="cell-2"><span className="strong">{d.name}</span><span className="s mono">{d.code}</span></div></td><td><Badge tone={d.type === 'Safety violation' ? 'red' : d.type === 'LPG' ? 'grey' : 'amber'} dot={false}>{d.type}</Badge></td><td className="r strong">{inr(d.amount)}</td><td><span className="row small" style={{ gap: 6 }}><Camera size={13} color="var(--ink-3)" />{d.evidence}</span></td><td>{d.ack ? <Badge tone="green">Yes · OTP</Badge> : <Badge tone="amber">Pending</Badge>}</td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'payroll' && <div className="split">
        <Card title="Payroll run PR-OCT-26 · draft" sub="Drafted by the HR Agent from attendance, overtime, advances and deductions" footer={<><button className="btn" onClick={() => toast('Payslips previewed', 'info')}><Download size={15} />Payslips</button><button className="btn btn-primary" onClick={() => toast('Payroll sent to Accounts for approval')}><Check size={15} />Send for approval</button></>}>
          <div className="table-wrap"><table className="table dense"><tbody>{PAYROLL.map(p => <tr key={p.head}><td>{p.head}</td><td className="r">{p.note ? <span className="xs muted">{p.note}</span> : <Sensitive kind="salary">{p.amt < 0 ? `−${inr(-p.amt)}` : inr(p.amt)}</Sensitive>}</td></tr>)}
            <tr className="total"><td>Net pay</td><td className="r"><Sensitive kind="salary">{inr(net)}</Sensitive></td></tr></tbody></table></div>
        </Card>
        <Card title="What changed since September">
          {[['Overtime', '+1,840 hours from the BF-2 shutdown'], ['New joiners', '22 (BF-2 contract labour)'], ['Leavers', '9; 2 with advances recovered from settlement'], ['Payslips', 'Sent on WhatsApp after approval']].map(([a, b]) => <div key={a} className="row-top small" style={{ gap: 8 }}><CircleCheck size={15} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} /><span><b>{a}:</b> {b}</span></div>)}
          <Why compact>Payroll is prepared in hours, not days: attendance, advances and deductions are already in the system when the month closes.</Why>
        </Card>
      </div>}

      {tab === 'statutory' && <Card flush title="Statutory calendar" sub="Reminders at 7 and 2 days on WhatsApp and email" actions={!filed ? <button className="btn btn-sm btn-primary" onClick={() => { setFiled(true); toast('PF & ESI challans for September uploaded and marked filed'); }}>File PF & ESI now</button> : undefined}>
        <div className="table-wrap"><table className="table"><thead><tr><th>Obligation</th><th>Due</th><th className="r">Amount</th><th>Status</th></tr></thead>
          <tbody>{STATUTORY.map(s => { const st = filed && s.state.startsWith('Overdue') ? 'Filed' : s.state; return <tr key={s.what}><td className="strong"><span className="row" style={{ gap: 6 }}><CalendarClock size={14} color="var(--ink-3)" />{s.what}</span></td><td>{s.due}</td><td className="r">{s.amount ? inr(s.amount) : '—'}</td><td><Badge tone={st === 'Filed' ? 'green' : st.startsWith('Overdue') ? 'red' : st === 'Due' ? 'amber' : 'grey'} icon={st.startsWith('Overdue') ? <TriangleAlert size={11} /> : st === 'Due' ? <Clock size={11} /> : undefined}>{st}</Badge></td></tr>; })}</tbody></table></div>
        <div className="card-f small muted">Returns are filed by your team and CA. The system prepares the workings, keeps the registers inspection-ready and reminds you before each due date.</div>
      </Card>}

      {tab === 'attendance' && <div className="grid g3">
        <Stat label="Attendance this month" value="93.6%" meta="Face scan and site engineer marking" />
        <Stat label="Leave taken (staff)" value="41 days" meta="CL 18 · SL 9 · EL 14" />
        <Stat label="Leave balance requests" value="3" meta="Waiting for manager approval" />
      </div>}
    </>
  );
}
