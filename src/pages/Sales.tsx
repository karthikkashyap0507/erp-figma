import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Download, Send, Lock, ArrowRight, TriangleAlert, Check, Truck } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Drawer, Stat, Timeline, Seg } from '../components/ui';
import { StackBar } from '../components/charts';
import { inr, money } from '../lib/format';
import { useApp, toast } from '../lib/store';

type QState = 'Draft' | 'Pending approval' | 'Sent' | 'Accepted' | 'Expired';
const QUOTES: { no: string; client: string; work: string; channel: string; value: number; discount: number; validTill: string; state: QState; owner: string }[] = [
  { no: 'QT-2026-0144', client: 'Nandi Sugars Ltd', work: 'Boiler house structure — supply & erection', channel: 'Direct client', value: 4860000, discount: 6, validTill: '29 Oct', state: 'Pending approval', owner: 'Rohit Menon' },
  { no: 'QT-2026-0141', client: 'Krishna Fertilisers', work: 'Shutdown manpower — 80 heads × 20 days', channel: 'Direct client', value: 1920000, discount: 0, validTill: '15 Nov', state: 'Draft', owner: 'Rohit Menon' },
  { no: 'QT-2026-0139', client: 'Sri Sai Rolling Mills', work: 'EOT crane girder fabrication', channel: 'Direct client', value: 1180000, discount: 2, validTill: '04 Nov', state: 'Sent', owner: 'Rohit Menon' },
  { no: 'QT-2026-0136', client: 'Kalaburagi Industrial Supplies', work: 'ISMB 300 — 22 MT (purchase-to-sell)', channel: 'Purchase-to-sell', value: 1490000, discount: 1, validTill: '31 Oct', state: 'Accepted', owner: 'Rohit Menon' },
  { no: 'QT-2026-0133', client: 'Kaveri Power Ltd', work: 'Conveyor gallery — package 2', channel: 'Direct client', value: 24800000, discount: 3, validTill: '—', state: 'Accepted', owner: 'Rohit Menon' },
  { no: 'QT-2026-0128', client: 'Raichur Agro Processing', work: 'Silo platform and walkways', channel: 'Direct client', value: 860000, discount: 0, validTill: '12 Oct', state: 'Expired', owner: 'Rohit Menon' }
];
const ORDERS = [
  { no: 'SO-2026-0412', channel: 'Direct client', party: 'Tungabhadra Steel Works Ltd', what: 'Bay 4 structural steel', value: 18600000, status: 'In execution', link: 'PRJ-24-101' },
  { no: 'SO-2026-0418', channel: 'Purchase-to-sell', party: 'Kalaburagi Industrial Supplies', what: 'ISMB 300 — 22 MT, bought from Karnataka Steel Traders', value: 1490000, status: 'Dispatched', link: 'Margin ₹1.1 L' },
  { no: 'DO-2026-0094', channel: 'Dealer', party: 'Kalaburagi Industrial Supplies', what: 'Floor gratings — 180 nos', value: 260000, status: 'Dispatched', link: 'E-way bill raised' },
  { no: 'DO-2026-0091', channel: 'Dealer', party: 'Raichur Steel Agencies', what: 'Chequered plates — 6 MT', value: 420000, status: 'On hold', link: 'Dealer dues overdue 18 days' }
];
const PRICE = [
  { code: 'FG-GRT-25', item: 'Floor grating 25×5 mm, galvanised', uom: 'm²', list: 2850, a: 2620, b: 2710 },
  { code: 'FG-CHQ-06', item: 'Chequered plate 6 mm', uom: 'MT', list: 74500, a: 70200, b: 71800 },
  { code: 'FG-STR-01', item: 'Standard staircase module 1 m', uom: 'nos', list: 18400, a: 16900, b: 17600 },
  { code: 'FG-HRL-42', item: 'Handrail 42 mm pipe, 2-tier', uom: 'm', list: 1340, a: 1210, b: 1270 }
];
const DEALERS = [
  { name: 'Raichur Steel Agencies', tier: 'A', limit: 600000, due: 412000, overdue: 18, orders: 14 },
  { name: 'Kalaburagi Industrial Supplies', tier: 'A', limit: 800000, due: 186000, overdue: 0, orders: 22 },
  { name: 'Hubballi Engineering Mart', tier: 'B', limit: 300000, due: 0, overdue: 0, orders: 0 }
];
const qTone = (s: QState) => s === 'Accepted' ? 'green' : s === 'Pending approval' ? 'amber' : s === 'Sent' ? 'blue' : s === 'Expired' ? 'red' : 'grey';

export default function Sales() {
  const nav = useNavigate();
  const approvals = useApp(s => s.approvals);
  const a2 = approvals.find(a => a.ref === 'QT-2026-0144');
  const [tab, setTab] = useState<'quotes' | 'orders' | 'dealers'>('quotes');
  const [qf, setQf] = useState<'All' | QState>('All');
  const [open, setOpen] = useState<typeof QUOTES[number] | null>(null);
  const quotes = QUOTES.map(q => q.no === 'QT-2026-0144' && a2?.status === 'Approved' ? { ...q, state: 'Sent' as QState } : q);
  return (
    <>
      <PageHeader num={4} eyebrow="Win the work" title="Sales, quotations & dealers" sub="Quotations, negotiation and orders across three channels: purchase-to-sell, dealer and direct client. Dealer price lists and dealer orders in the same place."
        actions={<button className="btn btn-primary" onClick={() => nav('/estimates')}><Plus size={15} />Quotation from estimate</button>} />
      <div className="grid g4">
        <Stat label="Open quotations" value={money(quotes.filter(q => q.state === 'Draft' || q.state === 'Sent' || q.state === 'Pending approval').reduce((a, q) => a + q.value, 0))} meta="3 quotations" />
        <Stat label="Orders this quarter" value={money(20770000)} delta="+21%" up meta="vs last quarter" />
        <Stat label="Dealer dues" value={money(598000)} meta="₹4.12 L overdue" />
        <Stat label="Expiring in 7 days" value="2" meta="Flagged by Sales & CRM Agent" />
      </div>
      <Card title="Orders by channel" sub="This quarter" actions={<WhyPin text="Purchase-to-sell, dealer and direct-client sales each keep their own pricing and margin, but share one stock, one ledger and one customer record." />}>
        <StackBar fmt={money} parts={[{ label: 'Direct client', value: 18600000, color: 'var(--c1)' }, { label: 'Purchase-to-sell', value: 1490000, color: 'var(--c2)' }, { label: 'Dealer', value: 680000, color: 'var(--c3)' }]} height={14} />
      </Card>
      <Why points={['Discounts above your limit go to you for approval automatically; no quotation leaves at a price nobody signed off.', 'Dealer orders are held when a dealer is past due, so credit does not keep growing on unpaid bills.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'quotes', label: 'Quotations', count: quotes.length }, { key: 'orders', label: 'Orders', count: ORDERS.length }, { key: 'dealers', label: 'Dealers & price lists', count: DEALERS.length }]} />

      {tab === 'quotes' && (
        <Card flush actions={<Seg options={(['All', 'Draft', 'Pending approval', 'Sent', 'Accepted', 'Expired'] as const).map(k => ({ key: k, label: k }))} value={qf} onChange={setQf} />} title="Quotation register" sub="Draft, pending and accepted">
          <div className="table-wrap"><table className="table"><thead><tr><th>Quotation</th><th>Client · work</th><th>Channel</th><th className="r">Value</th><th className="r">Discount</th><th>Valid till</th><th>State</th></tr></thead>
            <tbody>{quotes.filter(q => qf === 'All' || q.state === qf).map(q => (
              <tr key={q.no} className="clickable" onClick={() => setOpen(q)}><td className="mono">{q.no}</td><td><div className="cell-2"><span className="strong">{q.client}</span><span className="s">{q.work}</span></div></td><td>{q.channel}</td><td className="r strong">{money(q.value)}</td><td className="r" style={{ color: q.discount > 3 ? 'var(--red)' : undefined }}>{q.discount}%</td><td>{q.validTill}</td><td><Badge tone={qTone(q.state)}>{q.state}</Badge></td></tr>
            ))}</tbody></table></div>
        </Card>
      )}

      {tab === 'orders' && (
        <Card flush title="Orders" sub="Sales orders (SO) and dealer orders (DO)">
          <div className="table-wrap"><table className="table"><thead><tr><th>Order</th><th>Channel</th><th>Party · what</th><th className="r">Value</th><th>Status</th><th>Linked</th></tr></thead>
            <tbody>{ORDERS.map(o => <tr key={o.no}><td className="mono">{o.no}</td><td><Badge tone={o.channel === 'Dealer' ? 'violet' : o.channel === 'Purchase-to-sell' ? 'amber' : 'blue'} dot={false}>{o.channel}</Badge></td><td><div className="cell-2"><span className="strong">{o.party}</span><span className="s">{o.what}</span></div></td><td className="r strong">{money(o.value)}</td><td>{o.status === 'On hold' ? <Badge tone="red" icon={<Lock size={11} />}>On hold</Badge> : <Badge tone={o.status === 'Dispatched' ? 'green' : 'blue'}>{o.status}</Badge>}</td><td className="small muted">{o.link}</td></tr>)}</tbody></table></div>
        </Card>
      )}

      {tab === 'dealers' && (
        <div className="grid g2">
          <Card flush title="Dealers" sub="Credit limit, dues and order history">
            {DEALERS.map(d => (
              <div key={d.name} className="list-row">
                <div className="col grow" style={{ gap: 4 }}><div className="row"><span className="strong">{d.name}</span><span className="tag">Tier {d.tier}</span></div>
                  <div className="meter-row"><div className="progress" style={{ width: 160 }}><span style={{ width: `${(d.due / d.limit) * 100}%`, background: d.overdue ? 'var(--crit)' : 'var(--c1)' }} /></div><span className="xs muted">{money(d.due)} of {money(d.limit)} limit</span></div></div>
                {d.overdue ? <Badge tone="red">Overdue {d.overdue} d</Badge> : <Badge tone="green">Clear</Badge>}
              </div>
            ))}
          </Card>
          <Card flush title="Dealer price list" sub="Effective 01 Oct 2026 · tier A and B prices" actions={<button className="btn btn-sm" onClick={() => toast('Price list PDF sent to 3 dealers on WhatsApp', 'info')}><Send size={13} />Share</button>}>
            <div className="table-wrap"><table className="table dense"><thead><tr><th>Item</th><th>UoM</th><th className="r">List</th><th className="r">Tier A</th><th className="r">Tier B</th></tr></thead>
              <tbody>{PRICE.map(p => <tr key={p.code}><td><div className="cell-2"><span className="strong">{p.item}</span><span className="s mono">{p.code}</span></div></td><td>{p.uom}</td><td className="r">{inr(p.list)}</td><td className="r">{inr(p.a)}</td><td className="r">{inr(p.b)}</td></tr>)}</tbody></table></div>
          </Card>
        </div>
      )}

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.no || ''} sub={open ? `${open.client} · ${open.channel}` : ''}
        footer={open && <><button className="btn" onClick={() => toast('Branded PDF downloaded', 'info')}><Download size={15} />PDF</button>
          {open.state === 'Accepted' ? <button className="btn btn-primary" onClick={() => nav('/projects')}>Create project<ArrowRight size={15} /></button>
            : open.state === 'Pending approval' ? <button className="btn btn-primary" onClick={() => nav('/approvals')}>Open approval<ArrowRight size={15} /></button>
              : <button className="btn btn-primary" onClick={() => toast(`${open.no} sent to ${open.client} by email and WhatsApp`)}><Send size={15} />Send to client</button>}</>}>
        {open && <>
          <div className="grid g3" style={{ gap: 10 }}><Stat label="Value" value={money(open.value)} /><Stat label="Discount" value={`${open.discount}%`} valueColor={open.discount > 3 ? 'var(--red)' : undefined} /><Stat label="Valid till" value={<span style={{ fontSize: 18 }}>{open.validTill}</span>} /></div>
          {open.discount > 3 && open.state === 'Pending approval' && <div className="callout warn"><TriangleAlert size={16} style={{ flexShrink: 0 }} /><span>Discount of {open.discount}% is above the 3% limit for Sales, so it is waiting for the Managing Director. The quotation cannot be sent until approved.</span></div>}
          {open.state === 'Accepted' && <div className="callout ok"><Check size={16} style={{ flexShrink: 0 }} /><span>Accepted. To create the project, upload the client PO or work order and choose the business line (stage gate Quotation → Project).</span></div>}
          <div className="table-wrap"><table className="table dense"><thead><tr><th>Line</th><th className="r">Amount</th></tr></thead><tbody>
            <tr><td>Supply of fabricated structure</td><td className="r">{inr(Math.round(open.value * 0.62))}</td></tr>
            <tr><td>Erection at site</td><td className="r">{inr(Math.round(open.value * 0.31))}</td></tr>
            <tr><td>Transport and cranage</td><td className="r">{inr(Math.round(open.value * 0.07))}</td></tr>
            <tr className="total"><td>Total before GST</td><td className="r">{inr(open.value)}</td></tr></tbody></table></div>
          <span className="label">Negotiation</span>
          <Timeline items={[{ when: '22 Oct', who: open.client, what: `Asked for ${open.discount}% off and 45-day credit`, tone: 'amber', icon: <FileText size={13} /> }, { when: '20 Oct', who: open.owner, what: 'Quotation sent with branded PDF', tone: 'blue', icon: <Send size={13} /> }, { when: '19 Oct', who: 'Meera Iyer', what: 'Estimate v3 approved', tone: 'green', icon: <Check size={13} /> }]} />
          <div className="row small muted" style={{ gap: 6 }}><Truck size={14} />Delivery: 10 weeks from drawing approval · Payment: 30 days</div>
          <Why compact>Quotations are built from approved estimates and carry their own negotiation history, so anyone can pick up a deal where a colleague left it.</Why>
        </>}
      </Drawer>
    </>
  );
}
