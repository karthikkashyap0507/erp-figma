import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Upload, Check, TriangleAlert, Sparkles, Eye, Lock, CircleCheck, CircleX } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat } from '../components/ui';
import { HBars } from '../components/charts';
import { inr, money } from '../lib/format';
import { useApp, toast } from '../lib/store';
import { roleByKey } from '../lib/roles';

const AR = [
  { party: 'Vijayanagar Alloys Ltd', b0: 3700000, b30: 0, b60: 0, b90: 640000, note: 'Includes ₹6.40 L retention (PRJ-23-087)' },
  { party: 'Tungabhadra Steel Works Ltd', b0: 2830000, b30: 0, b60: 0, b90: 0, note: 'INV-2026-0412 and head-day bills' },
  { party: 'Kaveri Power Ltd', b0: 0, b30: 580000, b60: 1580000, b90: 0, note: 'Reminder drafted by Finance Agent' },
  { party: 'Coromandel Cement Ltd', b0: 670000, b30: 0, b60: 0, b90: 0, note: 'RA-102-04 balance' }
];
const AP = [
  { bill: 'KST/2241', vendor: 'Karnataka Steel Traders', amount: 612000, po: true, grn: true, qty: true, result: 'Matched', pay: 612000 },
  { bill: 'SBI/882', vendor: 'Sri Balaji Iron & Steel', amount: 402000, po: true, grn: true, qty: false, result: 'Billed 6.4 MT, received 4.1 MT', pay: 257600 },
  { bill: 'HCS/26/0418', vendor: 'Hospet Crane Services', amount: 347200, po: true, grn: true, qty: false, result: 'Billed 124 h, DPR shows 112 h', pay: 313600 },
  { bill: 'DG/1182', vendor: 'Deccan Gases', amount: 18400, po: true, grn: true, qty: true, result: 'Duplicate — already received by email', pay: 0 },
  { bill: 'SB-0388', vendor: 'Rajesh Erectors', amount: 192000, po: true, grn: true, qty: true, result: 'TDS corrected to 2% (194C)', pay: 188160 }
];
const AUDIT = [
  { at: '24 Oct 16:42', who: 'Deepa Nair', what: 'Posted RA-102-05 and generated e-invoice IRN', rec: 'Sales invoice' },
  { at: '24 Oct 15:10', who: 'Finance Agent', what: 'Flagged TDS rate on SB-0388 (1% → 2%)', rec: 'Purchase bill' },
  { at: '24 Oct 14:58', who: 'Deepa Nair', what: 'Corrected TDS on SB-0388 from ₹1,920 to ₹3,840', rec: 'Purchase bill' },
  { at: '24 Oct 11:20', who: 'Imran Sheikh', what: 'Edited vendor bank account — sent to checker', rec: 'Vendor master' },
  { at: '24 Oct 11:31', who: 'Deepa Nair', what: 'Approved vendor bank change (maker-checker)', rec: 'Vendor master' },
  { at: '23 Oct 18:05', who: 'Documents & Data Agent', what: 'Blocked duplicate bill DG/1182', rec: 'Purchase bill' }
];

export default function Accounts() {
  const role = roleByKey(useApp(s => s.role));
  const [tab, setTab] = useState<'ar' | 'ap' | 'bank' | 'gst' | 'cost' | 'audit' | 'tally'>('ap');
  const [synced, setSynced] = useState('06:00');
  const arTotal = AR.reduce((a, r) => a + r.b0 + r.b30 + r.b60 + r.b90, 0);
  return (
    <>
      <PageHeader num={18} eyebrow="Back office & finance" title="Accounts, finance & audit" sub="Receivables, payables, receipts, payments, expenses, advances, cost centres, bank, GST and TDS records, audit trail and Tally sync."
        actions={<button className="btn" onClick={() => { setSynced('just now'); toast('342 vouchers pushed to Tally · 0 errors'); }}><RefreshCw size={15} />Sync with Tally</button>} />
      {role.readOnly && <div className="callout info"><Eye size={16} style={{ flexShrink: 0 }} /><span><b>Read-only view for the CA / Auditor.</b> You can see the books, Finance Agent findings and the full audit trail, but you cannot post or edit.</span></div>}
      <div className="grid g4">
        <Stat label="Receivable from clients" value={money(arTotal)} meta="incl. ₹6.40 L retention" />
        <Stat label="Payable to vendors" value={money(4210000)} meta="₹18.4 L in this week's batch" />
        <Stat label="Bank balance" value={money(4260000)} meta="HDFC current · reconciled to 23 Oct" />
        <Stat label="Saved by checks this week" value={money(AP.reduce((a, b) => a + b.amount - b.pay, 0))} valueColor="var(--green)" meta="Short receipt, extra hours, duplicate, TDS" />
      </div>
      <Why points={['Financial entries cannot be silently changed: every create, edit, approval and delete is in the audit trail with the user and time.', 'Vendors are paid only after a three-way match of PO, goods receipt and bill, so you never pay for steel that has not arrived or crane hours that were not worked.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'ap', label: 'Payables', count: AP.length }, { key: 'ar', label: 'Receivables' }, { key: 'bank', label: 'Bank' }, { key: 'gst', label: 'GST & TDS' }, { key: 'cost', label: 'Cost centres' }, { key: 'audit', label: 'Audit trail' }, { key: 'tally', label: 'Tally sync' }]} />

      {tab === 'ap' && <Card flush title="Vendor bills · three-way match" sub="PO → goods receipt → bill, checked before payment" actions={<Link to="/approvals" className="btn btn-sm">Payment batch PB-2026-41</Link>}>
        <div className="table-wrap"><table className="table"><thead><tr><th>Bill</th><th>Vendor</th><th className="r">Billed</th><th>PO</th><th>GRN</th><th>Qty / hours</th><th>Result</th><th className="r">To pay</th></tr></thead>
          <tbody>{AP.map(b => <tr key={b.bill}><td className="mono">{b.bill}</td><td className="strong">{b.vendor}</td><td className="r">{inr(b.amount)}</td>
            <td>{b.po ? <CircleCheck size={16} color="var(--green)" /> : <CircleX size={16} color="var(--red)" />}</td><td>{b.grn ? <CircleCheck size={16} color="var(--green)" /> : <CircleX size={16} color="var(--red)" />}</td><td>{b.qty ? <CircleCheck size={16} color="var(--green)" /> : <CircleX size={16} color="var(--red)" />}</td>
            <td><Badge tone={b.result === 'Matched' ? 'green' : b.pay === 0 ? 'red' : 'amber'}>{b.result}</Badge></td><td className="r strong">{inr(b.pay)}</td></tr>)}
            <tr className="total"><td colSpan={2}>Total</td><td className="r">{inr(AP.reduce((a, b) => a + b.amount, 0))}</td><td colSpan={4}>Saved {inr(AP.reduce((a, b) => a + b.amount - b.pay, 0))} before payment</td><td className="r">{inr(AP.reduce((a, b) => a + b.pay, 0))}</td></tr></tbody></table></div>
      </Card>}

      {tab === 'ar' && <Card flush title="Receivables ageing" sub="Amounts due from clients, by age" actions={<WhyPin text="Receivables are followed up by age with reminders drafted by the Finance Agent, so collections do not depend on someone remembering." />}>
        <div className="table-wrap"><table className="table"><thead><tr><th>Client</th><th className="r">0–30</th><th className="r">31–60</th><th className="r">61–90</th><th className="r">90+</th><th className="r">Total</th><th>Note</th></tr></thead>
          <tbody>{AR.map(r => <tr key={r.party}><td className="strong">{r.party}</td><td className="r">{r.b0 ? money(r.b0) : '—'}</td><td className="r">{r.b30 ? money(r.b30) : '—'}</td><td className="r" style={{ color: r.b60 ? 'var(--red)' : undefined }}>{r.b60 ? money(r.b60) : '—'}</td><td className="r">{r.b90 ? money(r.b90) : '—'}</td><td className="r strong">{money(r.b0 + r.b30 + r.b60 + r.b90)}</td><td className="small muted">{r.note}</td></tr>)}
            <tr className="total"><td>Total</td><td className="r">{money(AR.reduce((a, r) => a + r.b0, 0))}</td><td className="r">{money(AR.reduce((a, r) => a + r.b30, 0))}</td><td className="r">{money(AR.reduce((a, r) => a + r.b60, 0))}</td><td className="r">{money(AR.reduce((a, r) => a + r.b90, 0))}</td><td className="r">{money(arTotal)}</td><td /></tr></tbody></table></div>
      </Card>}

      {tab === 'bank' && <Card title="Bank reconciliation · HDFC current account" sub="Statement for 1–23 Oct uploaded as Excel / CSV" actions={<button className="btn btn-sm" onClick={() => toast('Statement uploaded: 148 lines', 'info')}><Upload size={13} />Upload statement</button>}>
        <div className="grid g3"><Stat label="Statement lines" value="148" /><Stat label="Matched automatically" value="141" valueColor="var(--green)" /><Stat label="To match" value="7" valueColor="var(--amber)" /></div>
        <div className="table-wrap"><table className="table dense"><thead><tr><th>Date</th><th>Narration</th><th className="r">Amount</th><th>Suggested match</th><th /></tr></thead>
          <tbody>
            <tr><td>22 Oct</td><td className="mono small">NEFT CR COROMANDEL CEMENT LTD</td><td className="r">{inr(376000)}</td><td>RA-102-04 balance after TDS</td><td><button className="btn btn-sm" onClick={() => toast('Matched to RA-102-04')}><Check size={13} />Match</button></td></tr>
            <tr><td>21 Oct</td><td className="mono small">UPI DR 98451XXXXX</td><td className="r">−{inr(2000)}</td><td>Weekly advance · W-1203</td><td><button className="btn btn-sm" onClick={() => toast('Matched to worker advance')}><Check size={13} />Match</button></td></tr>
            <tr><td>20 Oct</td><td className="mono small">CHRG GST 18% NEFT</td><td className="r">−{inr(1180)}</td><td>Bank charges</td><td><button className="btn btn-sm" onClick={() => toast('Posted to bank charges')}><Check size={13} />Post</button></td></tr>
          </tbody></table></div>
      </Card>}

      {tab === 'gst' && <div className="grid g2">
        <Card title="GST · October 2026">
          <dl className="kv" style={{ gridTemplateColumns: '1fr auto' }}><dt>Outward taxable value (GSTR-1)</dt><dd className="num r">{inr(15300000)}</dd><dt>Output tax</dt><dd className="num r">{inr(2754000)}</dd><dt>Input credit in books</dt><dd className="num r">{inr(1756000)}</dd><dt>Input credit in GSTR-2B</dt><dd className="num r">{inr(1570000)}</dd><dt className="strong" style={{ color: 'var(--red)' }}>Not yet in 2B</dt><dd className="num r strong" style={{ color: 'var(--red)' }}>{inr(186000)}</dd></dl>
          <div className="callout warn"><Sparkles size={16} style={{ flexShrink: 0 }} /><span><b>Finance Agent:</b> 3 vendor invoices are not in GSTR-2B. Reminders are drafted to Karnataka Steel Traders and Nandi Weld Consumables.</span></div>
          <div className="small muted">Filing is done by your CA. The Finance Agent prepares the workings and the reminders.</div>
        </Card>
        <Card title="TDS · October 2026" sub="Due 7 Nov">
          <div className="table-wrap"><table className="table dense"><thead><tr><th>Section</th><th>On</th><th className="r">Deducted</th></tr></thead>
            <tbody><tr><td className="mono">194C</td><td>Subcontractors, transport</td><td className="r">{inr(112400)}</td></tr><tr><td className="mono">194I</td><td>Crane hire, dormitory rent</td><td className="r">{inr(8480)}</td></tr><tr><td className="mono">194Q</td><td>Steel purchases above ₹50 L</td><td className="r">{inr(4890)}</td></tr><tr className="total"><td colSpan={2}>Total</td><td className="r">{inr(125770)}</td></tr></tbody></table></div>
          <div className="callout danger"><TriangleAlert size={16} style={{ flexShrink: 0 }} /><span>SB-0388 (Rajesh Erectors) was deducted at 1% instead of 2%. It has been corrected before payment.</span></div>
        </Card>
      </div>}

      {tab === 'cost' && <Card title="Expenses by cost centre" sub="October · every expense carries a project or department">
        <HBars fmt={money} labelW={180} rows={[{ label: 'PRJ-24-104 Slag O&M', value: 2860000 }, { label: 'PRJ-24-103 Conveyor gallery', value: 2240000 }, { label: 'PRJ-24-101 Bay 4 steel', value: 1980000 }, { label: 'PRJ-24-105 BF-2 manpower', value: 1560000 }, { label: 'PRJ-24-102 Kiln repair', value: 940000 }, { label: 'Head office overheads', value: 820000, color: '#98A2B3' }, { label: 'PRJ-24-107 Cooling tower', value: 610000 }]} />
      </Card>}

      {tab === 'audit' && <Card flush title="Audit trail" sub="Append-only · cannot be edited or deleted" actions={<span className="row small muted" style={{ gap: 6 }}><Lock size={14} />Tamper-proof</span>}>
        <div className="table-wrap"><table className="table"><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Record</th></tr></thead>
          <tbody>{AUDIT.map((a, i) => <tr key={i}><td className="mono nowrap">{a.at}</td><td className="nowrap">{a.who.includes('Agent') ? <span className="row" style={{ gap: 4, color: 'var(--violet)' }}><Sparkles size={12} />{a.who}</span> : a.who}</td><td>{a.what}</td><td><Badge tone="grey" dot={false}>{a.rec}</Badge></td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'tally' && <Card title="Tally sync" sub="For teams that keep Tally running · structured export and scheduled push">
        <div className="grid g4"><Stat label="Last push" value={synced} /><Stat label="Vouchers pushed" value="342" meta="Sales, purchase, receipt, payment, journal" /><Stat label="Errors" value="0" valueColor="var(--green)" /><Stat label="Schedule" value="Daily 06:00" meta="Plus on demand" /></div>
        <Why compact>Accounts can keep using Tally for filing while every voucher originates in the ERP once, without double entry.</Why>
      </Card>}
    </>
  );
}
