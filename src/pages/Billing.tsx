import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, QrCode, Truck, Lock, Check, FileText, Send } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, LineChip } from '../components/ui';
import { inr, money } from '../lib/format';
import { toast, useApp } from '../lib/store';
import type { LineKey } from '../data/core';

const BILLS: { no: string; type: string; project: string; line: LineKey; client: string; amount: number; date: string; state: string }[] = [
  { no: 'SUP-103-07', type: 'Supply invoice', project: 'PRJ-24-103', line: 'salesService', client: 'Kaveri Power Ltd', amount: 1580000, date: '21 Aug', state: 'Overdue 64 d' },
  { no: 'INV-2026-0412', type: 'Tax invoice', project: 'PRJ-24-101', line: 'sales', client: 'Tungabhadra Steel Works', amount: 2480000, date: '20 Oct', state: 'E-invoiced' },
  { no: 'TON-104-SEP', type: 'Tonnage bill', project: 'PRJ-24-104', line: 'om', client: 'Vijayanagar Alloys', amount: 5390000, date: '03 Oct', state: 'Paid' },
  { no: 'HD-105-W5', type: 'Head-day bill', project: 'PRJ-24-105', line: 'manpower', client: 'Tungabhadra Steel Works', amount: 960000, date: '19 Oct', state: 'Certified' },
  { no: 'RA-102-04', type: 'RA bill', project: 'PRJ-24-102', line: 'service', client: 'Coromandel Cement', amount: 960000, date: '30 Sep', state: 'Paid' },
  { no: 'RA-107-01', type: 'RA bill', project: 'PRJ-24-107', line: 'service', client: 'Kaveri Power Ltd', amount: 580000, date: '06 Oct', state: 'Overdue 12 d' },
  { no: 'MS-106-01', type: 'Fee milestone', project: 'PRJ-24-106', line: 'consultation', client: 'Hosur Auto Components', amount: 325000, date: '15 Sep', state: 'Paid' }
];
const RA = [
  { boq: '2.03', item: 'Removal of damaged shell plates', uom: 'MT', rate: 18500, prev: 12.0, certified: 14.6 },
  { boq: '2.05', item: 'Fabrication & fixing of shell plates (client steel)', uom: 'MT', rate: 42000, prev: 22.4, certified: 26.8 },
  { boq: '2.07', item: 'Cyclone duct liner replacement', uom: 'm²', rate: 3400, prev: 90, certified: 120 },
  { boq: '3.01', item: 'NDT — DPT & UT of welds', uom: 'm', rate: 220, prev: 240, certified: 280 }
];
const stTone = (s: string) => s === 'Paid' ? 'green' : s.startsWith('Overdue') ? 'red' : s === 'E-invoiced' ? 'blue' : 'amber';

export default function Billing() {
  const vo = useApp(s => s.approvals.find(a => a.ref === 'VO-102-03'));
  const [tab, setTab] = useState<'register' | 'ra' | 'einv'>('ra');
  const [qty, setQty] = useState<Record<string, number>>(Object.fromEntries(RA.map(r => [r.boq, +(r.certified - r.prev).toFixed(2)])));
  const [irn, setIrn] = useState(false);
  const voOk = vo?.status === 'Approved';
  const lines = RA.map(r => ({ ...r, now: Math.min(qty[r.boq] ?? 0, r.certified - r.prev) }));
  const voAmt = voOk ? 170000 : 0;
  const gross = lines.reduce((a, l) => a + l.now * l.rate, 0) + voAmt;
  const retention = Math.round(gross * 0.05);
  const advance = Math.round(gross * 0.10);
  const taxable = gross - retention - advance;
  const gst = Math.round(taxable * 0.18);
  const invoice = taxable + gst;
  const tds = Math.round(taxable * 0.02);
  return (
    <>
      <PageHeader num={15} eyebrow="Bill & close" title="Client billing" sub="BOQ, progress, running (RA), measurement and milestone bills, with advances, deductions and variations, and GST e-invoice and e-way bill from the same screen."
        actions={<button className="btn btn-primary" onClick={() => setTab('ra')}><Plus size={15} />New bill</button>} />
      <div className="grid g4">
        <Stat label="Billed this month" value={money(15300000)} meta="All six business lines" />
        <Stat label="Ready to bill" value={money(gross)} meta="Certified, not yet billed · RA-102-05" />
        <Stat label="Overdue from clients" value={money(2160000)} valueColor="var(--red)" meta="2 bills · Kaveri Power" />
        <Stat label="E-invoices this month" value="14" meta="IRN and QR generated in-app" />
      </div>
      <Why points={['RA and final bills are no longer prepared by hand: certified measurements turn into a bill the same day, with retention, advance recovery, GST and TDS worked out for you.', 'An item with an open NCR or an uncertified measurement cannot be billed, so bills are not disputed later.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'ra', label: 'RA bill builder' }, { key: 'register', label: 'Bill register', count: BILLS.length }, { key: 'einv', label: 'E-invoice & e-way bill' }]} />

      {tab === 'register' && <Card flush title="Bills across all business lines" sub="Each line bills on its own basis">
        <div className="table-wrap"><table className="table"><thead><tr><th>Bill</th><th>Type</th><th>Project</th><th>Client</th><th className="r">Amount</th><th>Date</th><th>State</th></tr></thead>
          <tbody>{BILLS.map(b => <tr key={b.no}><td className="mono">{b.no}</td><td><div className="cell-2"><span className="strong">{b.type}</span><LineChip line={b.line} short /></div></td><td className="code-link">{b.project}</td><td>{b.client}</td><td className="r strong">{inr(b.amount)}</td><td>{b.date}</td><td><Badge tone={stTone(b.state)}>{b.state}</Badge></td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'ra' && <div className="split">
        <Card title="RA-102-05 · Kiln shell & cyclone repair" sub="PRJ-24-102 · Coromandel Cement Ltd · ② Service · measurement-based" actions={<WhyPin text="Quantities cannot exceed what the client certified in the measurement sheet, so the bill matches the client's own records." />}>
          <div className="callout ok"><Check size={15} style={{ flexShrink: 0 }} /><span>Measurement sheet MS-102-05 certified by Coromandel (S. Hiremath) on 23 Oct. No open NCR on these items.</span></div>
          <div className="table-wrap"><table className="table dense"><thead><tr><th>BOQ</th><th>Item</th><th className="r">Previous</th><th className="r">This bill</th><th className="r">Up to date</th><th className="r">Rate</th><th className="r">Amount</th></tr></thead>
            <tbody>{lines.map(l => <tr key={l.boq}><td className="mono">{l.boq}</td><td className="strong">{l.item}</td><td className="r">{l.prev} {l.uom}</td>
              <td className="r"><input className="input input-sm num" type="number" step="0.1" style={{ width: 78 }} value={qty[l.boq]} max={l.certified - l.prev} onChange={e => setQty(q => ({ ...q, [l.boq]: Number(e.target.value) || 0 }))} aria-label={`This bill quantity for ${l.item}`} /></td>
              <td className="r">{(l.prev + l.now).toFixed(1)}</td><td className="r">{inr(l.rate)}</td><td className="r strong">{inr(l.now * l.rate)}</td></tr>)}
              <tr><td className="mono">VO-03</td><td className="strong">Extra cyclone duct liner plates (variation)</td><td className="r">—</td><td colSpan={3}>{voOk ? <Badge tone="green">Approved · 50% done</Badge> : <Link to="/approvals"><Badge tone="amber" icon={<Lock size={11} />}>Waiting for MD approval</Badge></Link>}</td><td className="r strong">{voOk ? inr(voAmt) : '—'}</td></tr>
            </tbody></table></div>
        </Card>
        <Card title="Bill summary" sub="Live as you change quantities" footer={<><button className="btn" onClick={() => toast('Draft RA bill PDF in your format downloaded', 'info')}><FileText size={15} />PDF</button><button className="btn btn-primary" onClick={() => { setIrn(true); setTab('einv'); toast('RA-102-05 posted; e-invoice IRN generated'); }}><QrCode size={15} />Post & e-invoice</button></>}>
          <dl className="kv" style={{ gridTemplateColumns: '1fr auto' }}>
            <dt>Gross value this bill</dt><dd className="num r">{inr(gross)}</dd>
            <dt>Less retention 5%</dt><dd className="num r">−{inr(retention)}</dd>
            <dt>Less mobilisation advance recovery 10%</dt><dd className="num r">−{inr(advance)}</dd>
            <dt className="strong" style={{ color: 'var(--ink)' }}>Taxable value</dt><dd className="num r strong">{inr(taxable)}</dd>
            <dt>CGST 9% + SGST 9%</dt><dd className="num r">{inr(gst)}</dd>
            <dt className="strong" style={{ color: 'var(--ink)' }}>Invoice value</dt><dd className="num r strong" style={{ fontSize: 16 }}>{inr(invoice)}</dd>
            <dt>TDS 194C 2% (deducted by client)</dt><dd className="num r">−{inr(tds)}</dd>
            <dt className="strong" style={{ color: 'var(--ink)' }}>Expected receipt</dt><dd className="num r strong" style={{ color: 'var(--green)' }}>{inr(invoice - tds)}</dd>
          </dl>
          <div className="divider" />
          <div className="small muted">Retention of {inr(retention)} is added to the retention register and released after the final bill and client-steel reconciliation.</div>
        </Card>
      </div>}

      {tab === 'einv' && <div className="grid g2">
        <Card title="GST e-invoice" sub="Generated through a GST Suvidha Provider from the invoice screen">
          {irn ? <>
            <div className="row" style={{ gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 112, height: 112, flexShrink: 0, background: 'repeating-conic-gradient(#101828 0% 25%, #fff 0% 50%) 50% / 14px 14px', borderRadius: 6, border: '6px solid #fff', boxShadow: '0 0 0 1px var(--line)' }} aria-label="QR code placeholder" />
              <dl className="kv" style={{ gridTemplateColumns: '110px 1fr' }}><dt>Invoice</dt><dd>RA-102-05</dd><dt>IRN</dt><dd className="mono" style={{ wordBreak: 'break-all' }}>a3f9c1…7e20b4</dd><dt>Ack no.</dt><dd className="mono">1826 1009 4471 22</dd><dt>Ack date</dt><dd>24 Oct 2026 16:42</dd></dl>
            </div>
            <button className="btn" onClick={() => toast('Invoice with IRN and QR sent to Coromandel on email and WhatsApp')}><Send size={15} />Send to client</button>
          </> : <div className="empty">Post a bill to generate its IRN and QR code.</div>}
        </Card>
        <Card title="E-way bill" sub="For supply invoices that move goods">
          <dl className="kv"><dt>Invoice</dt><dd>INV-2026-0412 · PRJ-24-101</dd><dt>Goods</dt><dd>Fabricated structural steel, HSN 7308 · 24.2 MT</dd><dt>Vehicle</dt><dd>KA-35-D-4410 · Ballari works → Ballari plant</dd><dt>E-way bill</dt><dd className="mono">3412 8890 1156 · valid till 25 Oct</dd></dl>
          <button className="btn" onClick={() => toast('E-way bill extended by 1 day', 'info')}><Truck size={15} />Extend validity</button>
          <Why compact>E-invoice and e-way bill are generated from the same invoice, so there is no re-keying on the government portal and no mismatch between the two.</Why>
        </Card>
      </div>}
    </>
  );
}
