import { useState } from 'react';
import { Plus, CircleCheck, CircleX, Star, Check, Truck, Sparkles, ArrowRight, Send } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Drawer, Stat, Field, Progress } from '../components/ui';
import { money, inr } from '../lib/format';
import { toast, useApp } from '../lib/store';

const FLOW = ['Material requirement', 'Requisition', 'RFQ', 'Vendor comparison', 'Value-based approval', 'Purchase order', 'Delivery tracking', 'Vendor rating'];
const PRS = [
  { no: 'PR-2026-0391', item: 'MS plate 16 mm IS 2062 — 14 MT', project: 'PRJ-24-103 · BOQ 2.11', by: 'Procurement Agent', value: 865000, stock: 'ok', budget: 'ok', state: 'RFQ sent', note: 'Raised from minimum-level breach and upcoming BOQ need' },
  { no: 'PR-2026-0388', item: 'ISMB 300 8 MT + MS plates 3.2 MT', project: 'PRJ-24-103 · BOQ 1.01', by: 'Ravi Teja', value: 684000, stock: 'ok', budget: 'ok', state: 'PO awaiting MD', note: 'PO-2026-0218' },
  { no: 'PR-2026-0386', item: 'Welding electrode E7018 — 400 kg', project: 'PRJ-24-101 · BOQ 2.04', by: 'Suresh Gowda', value: 79200, stock: 'fail', budget: 'ok', state: 'Stopped', note: '640 kg already in stock at Ballari: issue from stock instead' },
  { no: 'PR-2026-0384', item: 'HSFG bolt M20 × 70 — 1,200 nos', project: 'PRJ-24-107 · BOQ 3.02', by: 'Ravi Teja', value: 55200, stock: 'ok', budget: 'ok', state: 'Approved by PM', note: 'RFQ to 3 vendors' },
  { no: 'PR-2026-0381', item: 'LPG cylinders 19 kg — 10', project: 'PRJ-24-102 · Consumables', by: 'Naveen Kumar', value: 18400, stock: 'ok', budget: 'ok', state: 'PO issued', note: 'PO-2026-0205' }
];
const QUOTES = [
  { vendor: 'Karnataka Steel Traders', rate: 61400, lead: '4 days', terms: '30 days credit', rating: 4.6, freight: 'Included', total: 859600 },
  { vendor: 'Sri Balaji Iron & Steel', rate: 60800, lead: '9 days', terms: '15 days credit', rating: 3.9, freight: '₹14,000', total: 865200 },
  { vendor: 'Vijayanagar Metal Corp', rate: 62100, lead: '3 days', terms: '45 days credit', rating: 4.2, freight: 'Included', total: 869400 }
];
const POS = [
  { no: 'PO-2026-0218', vendor: 'Karnataka Steel Traders', what: 'ISMB 300 + plates — 11.2 MT', value: 684000, ordered: 11.2, received: 0, uom: 'MT', status: 'Awaiting MD', eta: '—' },
  { no: 'PO-2026-0214', vendor: 'Sri Balaji Iron & Steel', what: 'ISMC 150, ISA 65 — 6.4 MT', value: 402000, ordered: 6.4, received: 4.1, uom: 'MT', status: 'Part-delivered', eta: '26 Oct' },
  { no: 'PO-2026-0209', vendor: 'Nandi Weld Consumables', what: 'Electrode E7018 — 600 kg', value: 118800, ordered: 600, received: 600, uom: 'kg', status: 'Delivered', eta: 'Done' },
  { no: 'PO-2026-0205', vendor: 'Deccan Gases', what: 'Oxygen cylinders — 40', value: 15200, ordered: 40, received: 0, uom: 'cyl', status: 'In transit', eta: '25 Oct' }
];
const VENDORS = [
  { name: 'Karnataka Steel Traders', ontime: 94, reject: 0.8, price: 'Best in 6 of 9 RFQs', rating: 4.6, pos: 18 },
  { name: 'Nandi Weld Consumables', ontime: 96, reject: 0.4, price: 'Market', rating: 4.5, pos: 11 },
  { name: 'Vijayanagar Metal Corp', ontime: 88, reject: 1.2, price: 'Slightly above market', rating: 4.2, pos: 9 },
  { name: 'Deccan Gases', ontime: 90, reject: 0, price: 'Market', rating: 4.1, pos: 22 },
  { name: 'Sri Balaji Iron & Steel', ontime: 81, reject: 2.4, price: 'Often lowest', rating: 3.9, pos: 11 }
];

function Stars({ v }: { v: number }) { return <span className="row" style={{ gap: 1 }} aria-label={`${v} out of 5`}>{[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill={i <= Math.round(v) ? '#F59E0B' : 'none'} color={i <= Math.round(v) ? '#F59E0B' : '#C9D0DA'} />)}<span className="xs strong" style={{ marginLeft: 4 }}>{v}</span></span>; }
const level = (v: number) => v <= 50000 ? 'Purchase (up to ₹50,000)' : v <= 500000 ? 'Project Manager (₹50,000 – ₹5 L)' : 'Managing Director (above ₹5 L)';

export default function Procurement() {
  const po218 = useApp(s => s.approvals.find(a => a.ref === 'PO-2026-0218'));
  const [tab, setTab] = useState<'prs' | 'rfq' | 'pos' | 'vendors'>('prs');
  const [picked, setPicked] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [qty, setQty] = useState(2.5);
  const item = { name: 'ISA 65×65×6 angle', onHand: 4.1, reserved: 3.6, rate: 62100, budgetLeft: 412000 };
  const free = Math.max(0, item.onHand - item.reserved);
  const value = qty * item.rate;
  const stockOk = qty > free;
  const budgetOk = value <= item.budgetLeft;
  const pos = POS.map(p => p.no === 'PO-2026-0218' && po218?.status === 'Approved' ? { ...p, status: 'Issued' } : p);
  return (
    <>
      <PageHeader num={8} eyebrow="Resource" title="Procurement" sub="Material requirement, requisition, RFQ, vendor comparison, value-based approval, PO, delivery tracking and vendor rating, with a stock and budget check before anything is bought."
        actions={<button className="btn btn-primary" onClick={() => setDrawer(true)}><Plus size={15} />New requisition</button>} />
      <div className="stages">{FLOW.map((f, i) => <div key={f} className={'stage' + (i < 5 ? ' done' : i === 5 ? ' now' : '')}><span className="st-n">Step {i + 1}</span><span className="st-t">{f}</span></div>)}</div>
      <div className="grid g4">
        <Stat label="Open requisitions" value="4" meta="1 stopped by stock check" />
        <Stat label="POs this month" value={money(4280000)} meta="31 orders" />
        <Stat label="Saved by stock check" value={money(79200)} valueColor="var(--green)" meta="E7018 issued from stock" />
        <Stat label="Deliveries due this week" value="3" meta="1 part-delivered" />
      </div>
      <Why points={['Purchases are no longer raised without a stock or budget check, which ends excess buying and shortages at site.', 'Approval follows the value: up to ₹50,000 Purchase approves, up to ₹5 L the Project Manager, above that the MD. There is a full trail of who approved what.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'prs', label: 'Requisitions', count: PRS.length }, { key: 'rfq', label: 'RFQ & comparison' }, { key: 'pos', label: 'Purchase orders', count: POS.length }, { key: 'vendors', label: 'Vendor rating' }]} />

      {tab === 'prs' && <Card flush title="Requisitions" sub="Stage gate: stock checked, budget check passed, value-based approval given">
        <div className="table-wrap"><table className="table"><thead><tr><th>Requisition</th><th>Item</th><th>Project · BOQ</th><th className="r">Value</th><th>Stock check</th><th>Budget check</th><th>State</th></tr></thead>
          <tbody>{PRS.map(p => <tr key={p.no}><td><div className="cell-2"><span className="mono">{p.no}</span><span className="s">{p.by === 'Procurement Agent' ? <span className="row" style={{ gap: 4, color: 'var(--violet)' }}><Sparkles size={11} />Procurement Agent</span> : p.by}</span></div></td><td><div className="cell-2"><span className="strong">{p.item}</span><span className="s">{p.note}</span></div></td><td className="small">{p.project}</td><td className="r">{inr(p.value)}</td>
            <td>{p.stock === 'ok' ? <Badge tone="green" icon={<CircleCheck size={12} />}>Passed</Badge> : <Badge tone="red" icon={<CircleX size={12} />}>In stock</Badge>}</td>
            <td><Badge tone="green" icon={<CircleCheck size={12} />}>Passed</Badge></td>
            <td><Badge tone={p.state === 'Stopped' ? 'red' : p.state.startsWith('PO') ? 'blue' : 'amber'}>{p.state}</Badge></td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'rfq' && <>
        <Card title="RFQ-2026-0144 · MS plate 16 mm, 14 MT" sub="For PR-2026-0391 · sent to 3 shortlisted vendors from the supplier directory" actions={<WhyPin text="Comparing on landed cost, lead time, credit terms and the vendor's own track record avoids the 'cheapest quote, late delivery' trap." />}>
          <div className="table-wrap"><table className="table"><thead><tr><th>Vendor</th><th className="r">Rate / MT</th><th>Freight</th><th className="r">Landed total</th><th>Lead time</th><th>Terms</th><th>Rating</th><th /></tr></thead>
            <tbody>{QUOTES.map((q, i) => (
              <tr key={q.vendor} className={picked === q.vendor || (!picked && i === 0) ? 'selected' : ''}>
                <td className="strong">{q.vendor}{i === 0 && <> <Badge tone="violet" icon={<Sparkles size={11} />}>Recommended</Badge></>}</td><td className="r">{inr(q.rate)}</td><td>{q.freight}</td><td className="r strong">{inr(q.total)}</td><td>{q.lead}</td><td>{q.terms}</td><td><Stars v={q.rating} /></td>
                <td><button className="btn btn-sm" onClick={() => { setPicked(q.vendor); toast(`${q.vendor} selected. PO drafted for ${q.total > 500000 ? 'MD' : 'PM'} approval.`); }}>Select</button></td>
              </tr>))}</tbody></table></div>
          <div className="callout info"><Sparkles size={16} style={{ flexShrink: 0 }} /><span><b>Procurement & Inventory Agent:</b> Karnataka Steel Traders is ₹5,600 cheaper landed than Sri Balaji once freight is added, delivers 5 days sooner, and has a 94% on-time record. Sri Balaji's lowest rate does not cover its freight.</span></div>
          <Field label="Purchase manager's recommendation"><textarea className="textarea" defaultValue="Recommend Karnataka Steel Traders: lowest landed cost and the 4-day lead time meets the T4 truss fabrication start on 30 Oct." /></Field>
        </Card>
      </>}

      {tab === 'pos' && <Card flush title="Purchase orders" sub="Delivery tracked against each PO line">
        <div className="table-wrap"><table className="table"><thead><tr><th>PO</th><th>Vendor · what</th><th className="r">Value</th><th>Delivery</th><th>ETA</th><th>Status</th></tr></thead>
          <tbody>{pos.map(p => <tr key={p.no}><td className="mono">{p.no}</td><td><div className="cell-2"><span className="strong">{p.vendor}</span><span className="s">{p.what}</span></div></td><td className="r">{money(p.value)}</td>
            <td><div className="meter-row"><Progress value={(p.received / p.ordered) * 100} width={80} tone={p.received === p.ordered ? 'green' : undefined} /><span className="xs num">{p.received}/{p.ordered} {p.uom}</span></div></td><td>{p.eta}</td>
            <td><Badge tone={p.status === 'Delivered' ? 'green' : p.status === 'Awaiting MD' ? 'amber' : p.status === 'Part-delivered' ? 'blue' : 'teal'} icon={p.status === 'In transit' ? <Truck size={11} /> : undefined}>{p.status}</Badge></td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'vendors' && <Card flush title="Vendor rating" sub="Built automatically from every PO, GRN and QC result">
        <div className="table-wrap"><table className="table"><thead><tr><th>Vendor</th><th>On-time delivery</th><th className="r">QC rejections</th><th>Price</th><th className="r">POs</th><th>Rating</th></tr></thead>
          <tbody>{VENDORS.map(v => <tr key={v.name}><td className="strong">{v.name}</td><td><div className="meter-row"><Progress value={v.ontime} width={80} tone={v.ontime < 85 ? 'amber' : 'green'} /><span className="xs num">{v.ontime}%</span></div></td><td className="r">{v.reject}%</td><td className="small">{v.price}</td><td className="r">{v.pos}</td><td><Stars v={v.rating} /></td></tr>)}</tbody></table></div>
      </Card>}

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="New requisition" sub="Stock and budget are checked as you type"
        footer={<><button className="btn" onClick={() => setDrawer(false)}>Cancel</button><button className="btn btn-primary" disabled={!stockOk || !budgetOk} onClick={() => { setDrawer(false); toast(`PR-2026-0392 raised · goes to ${level(value).split(' (')[0]}`); }}><Send size={15} />Raise requisition</button></>}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Item" span={2}><select className="select"><option>ST-AN-065 · ISA 65×65×6 angle</option></select></Field>
          <Field label="Quantity (MT)"><input className="input num" type="number" step="0.1" value={qty} onChange={e => setQty(Number(e.target.value) || 0)} /></Field>
          <Field label="Needed by"><input className="input" defaultValue="30 Oct 2026" /></Field>
          <Field label="Project · BOQ item" span={2}><select className="select"><option>PRJ-24-103 · BOQ 4.01 Handrails & bracing</option></select></Field>
        </div>
        <span className="label">Live checks</span>
        <div className="row-top" style={{ gap: 10 }}>{stockOk ? <CircleCheck size={18} color="var(--green)" /> : <CircleX size={18} color="var(--red)" />}<div className="col" style={{ gap: 0 }}><span className="strong small">Stock check</span><span className="xs muted">{item.onHand} MT on hand, {item.reserved} MT reserved, so {free.toFixed(1)} MT free. {stockOk ? `Buying ${(qty - free).toFixed(1)} MT more is justified.` : 'Enough free stock: issue from stores instead.'}</span></div></div>
        <div className="row-top" style={{ gap: 10 }}>{budgetOk ? <CircleCheck size={18} color="var(--green)" /> : <CircleX size={18} color="var(--red)" />}<div className="col" style={{ gap: 0 }}><span className="strong small">Budget check</span><span className="xs muted">{inr(value)} against {inr(item.budgetLeft)} left on BOQ 4.01.</span></div></div>
        <div className="row-top" style={{ gap: 10 }}><ArrowRight size={18} color="var(--primary)" /><div className="col" style={{ gap: 0 }}><span className="strong small">Approval route</span><span className="xs muted">{level(value)}</span></div></div>
        <Why compact>The requisition cannot be raised until both checks pass, so nobody can buy what is already sitting in the store or what the budget does not cover.</Why>
      </Drawer>
    </>
  );
}
