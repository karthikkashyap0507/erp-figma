import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRightLeft, PackageCheck, Lock, Sparkles, ShieldCheck, Undo2, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Seg, Progress } from '../components/ui';
import { ITEMS } from '../data/core';
import { money, inr } from '../lib/format';
import { toast } from '../lib/store';

const STORES = ['All stores', 'Ballari workshop', 'Raichur site store', 'Hospet O&M store'] as const;
const MOVES = [
  { doc: 'GRN-2026-0519', type: 'Receipt', item: 'MS plate 10 mm — 6.0 MT', from: 'Karnataka Steel Traders', to: 'Ballari workshop', project: 'PRJ-24-101', qc: 'Awaiting QC', date: '24 Oct' },
  { doc: 'GRN-2026-0517', type: 'Receipt', item: 'ISMC 150, ISA 65 — 4.1 MT', from: 'Sri Balaji Iron & Steel', to: 'Ballari workshop', project: 'PRJ-24-103', qc: 'QC passed', date: '23 Oct' },
  { doc: 'MIS-2026-1182', type: 'Issue', item: 'ISMB 300 — 3.4 MT', from: 'Ballari workshop', to: 'Fabrication · truss T4', project: 'PRJ-24-103', qc: '—', date: '23 Oct' },
  { doc: 'TRF-2026-0094', type: 'Transfer', item: 'HSFG bolts M20 — 600 nos', from: 'Ballari workshop', to: 'Raichur site store', project: 'PRJ-24-107', qc: '—', date: '22 Oct' },
  { doc: 'RTN-2026-0041', type: 'Return', item: 'MS plate offcuts — 0.38 MT', from: 'Raichur site', to: 'Ballari workshop', project: 'PRJ-24-103', qc: '—', date: '21 Oct' },
  { doc: 'MIS-2026-1176', type: 'Issue', item: 'Oxygen cylinders — 6', from: 'Ballari workshop', to: 'Cutting bay', project: 'PRJ-24-101', qc: '—', date: '21 Oct' }
];
const CLIENT_STEEL = [
  { project: 'PRJ-24-102', client: 'Coromandel Cement Ltd', item: 'Shell plate 20 mm (client)', received: 64.0, used: 51.6, scrap: 5.8, atSite: 5.52, allowance: 1.5, variance: 2.1 },
  { project: 'PRJ-24-107', client: 'Kaveri Power Ltd', item: 'Sections — cooling tower (client)', received: 18.2, used: 4.6, scrap: 0.3, atSite: 13.27, allowance: 2.0, variance: 0.7 },
  { project: 'PRJ-23-087', client: 'Vijayanagar Alloys Ltd', item: 'Profile sheets & purlins (client)', received: 42.5, used: 39.8, scrap: 2.15, atSite: 0, allowance: 1.5, variance: 1.4 }
];
const typeIcon: Record<string, ReactNode> = { Receipt: <ArrowDownToLine size={13} />, Issue: <ArrowUpFromLine size={13} />, Transfer: <ArrowRightLeft size={13} />, Return: <Undo2 size={13} /> };

export default function Inventory() {
  const [tab, setTab] = useState<'stock' | 'moves' | 'client'>('stock');
  const [store, setStore] = useState<(typeof STORES)[number]>('All stores');
  const [qc, setQc] = useState(false);
  const items = ITEMS.filter(i => store === 'All stores' || i.store === store);
  const value = ITEMS.reduce((a, i) => a + i.onHand * i.rate, 0);
  const low = ITEMS.filter(i => i.onHand < i.min);
  return (
    <>
      <PageHeader num={9} eyebrow="Resource" title="Inventory & stores" sub="Receipts, issues, transfers, returns, site stock, minimum levels and valuation for every store, plus a separate register for client-supplied steel."
        actions={<><button className="btn" onClick={() => toast('Transfer note TRF-2026-0095 drafted', 'info')}><ArrowRightLeft size={15} />Transfer</button><button className="btn btn-primary" onClick={() => toast('Material issue slip opened', 'info')}><Plus size={15} />Issue to site</button></>} />
      <div className="grid g4">
        <Stat label="Stock value (our material)" value={money(value)} meta="Weighted average cost" />
        <Stat label="Below minimum level" value={low.length} valueColor="var(--red)" meta={low.map(l => l.name.split(' ').slice(0, 3).join(' ')).join(', ')} />
        <Stat label="Client steel held" value="18.8 MT" meta="Tracked separately, never valued as ours" />
        <Stat label="Idle stock (60 days)" value={money(126720)} meta="E7018 electrodes, 640 kg" />
      </div>
      <Why points={['Site stock is no longer a guess: every receipt, issue, transfer and return is booked to a store and a project.', 'Material leakage becomes visible because issues are tied to the job that used them, and returns come back against the same job.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'stock', label: 'Stock', count: ITEMS.length }, { key: 'moves', label: 'Movements', count: MOVES.length }, { key: 'client', label: 'Client-supplied steel', count: CLIENT_STEEL.length }]} />

      {tab === 'stock' && <Card flush title="Stock by item" actions={<Seg options={STORES.map(s => ({ key: s, label: s }))} value={store} onChange={setStore} />}>
        <div className="table-wrap"><table className="table"><thead><tr><th>Item</th><th>Store</th><th className="r">On hand</th><th>Against minimum</th><th className="r">Rate</th><th className="r">Value</th><th /></tr></thead>
          <tbody>{items.map(i => { const isLow = i.onHand < i.min; return (
            <tr key={i.code}><td><div className="cell-2"><span className="strong">{i.name}</span><span className="s mono">{i.code}</span></div></td><td>{i.store}</td><td className="r strong" style={{ color: isLow ? 'var(--red)' : undefined }}>{i.onHand} {i.uom}</td>
              <td><div className="meter-row"><Progress value={Math.min(100, (i.onHand / (i.min * 2)) * 100)} width={90} tone={isLow ? 'red' : 'green'} /><span className="xs muted">min {i.min}</span></div></td><td className="r">{inr(i.rate)}</td><td className="r">{money(i.onHand * i.rate)}</td>
              <td>{isLow ? <Link to="/procurement" className="btn btn-sm"><Sparkles size={12} color="var(--violet)" />Reorder</Link> : null}</td></tr>); })}</tbody></table></div>
      </Card>}

      {tab === 'moves' && <>
        <div className={qc ? 'callout ok' : 'callout warn'}>{qc ? <ShieldCheck size={16} style={{ flexShrink: 0 }} /> : <Lock size={16} style={{ flexShrink: 0 }} />}<span>{qc ? <>GRN-2026-0519 passed QC (mill test certificate matched, thickness checked). 6.0 MT is now available to issue.</> : <><b>Stage gate Receipt → Stores:</b> GRN-2026-0519 cannot be issued until the Quality Head passes incoming inspection.</>}</span>{!qc && <button className="btn btn-sm ml-auto" onClick={() => { setQc(true); toast('Incoming QC passed for GRN-2026-0519'); }}><PackageCheck size={13} />Record QC pass</button>}</div>
        <Card flush title="Stock movements" sub="Every movement has its source document">
          <div className="table-wrap"><table className="table"><thead><tr><th>Document</th><th>Type</th><th>Item</th><th>From → to</th><th>Project</th><th>QC</th><th>Date</th></tr></thead>
            <tbody>{MOVES.map(m => <tr key={m.doc}><td className="mono">{m.doc}</td><td><Badge tone={m.type === 'Receipt' ? 'green' : m.type === 'Issue' ? 'blue' : m.type === 'Transfer' ? 'violet' : 'amber'} icon={typeIcon[m.type]}>{m.type}</Badge></td><td className="strong">{m.item}</td><td className="small">{m.from} → {m.to}</td><td className="code-link">{m.project}</td>
              <td>{m.qc === 'Awaiting QC' && !qc ? <Badge tone="amber">Awaiting QC</Badge> : m.qc === '—' ? '—' : <Badge tone="green">QC passed</Badge>}</td><td>{m.date}</td></tr>)}</tbody></table></div>
        </Card>
      </>}

      {tab === 'client' && <>
        <Card flush title="Client-supplied steel register" sub="Received, used, scrap returned, balance at site — for service projects" actions={<WhyPin text="Steel issued by the client is reconciled continuously instead of at the end, so wastage recoveries and retention release are not delayed or disputed." />}>
          <div className="table-wrap"><table className="table"><thead><tr><th>Project</th><th>Material</th><th className="r">Received</th><th className="r">Used</th><th className="r">Scrap returned</th><th className="r">At site</th><th className="r">Variance</th><th>Against allowance</th></tr></thead>
            <tbody>{CLIENT_STEEL.map(c => <tr key={c.project}><td><div className="cell-2"><span className="code-link">{c.project}</span><span className="s">{c.client}</span></div></td><td className="strong">{c.item}</td><td className="r">{c.received} MT</td><td className="r">{c.used} MT</td><td className="r">{c.scrap} MT</td><td className="r">{c.atSite} MT</td>
              <td className="r strong" style={{ color: c.variance > c.allowance ? 'var(--red)' : 'var(--green)' }}>{c.variance}%</td><td>{c.variance > c.allowance ? <Badge tone="red">Above {c.allowance}% allowance</Badge> : <Badge tone="green">Within {c.allowance}%</Badge>}</td></tr>)}</tbody></table></div>
        </Card>
        <div className="row"><Link to="/reconciliation" className="btn">Open reconciliation & retention</Link></div>
      </>}
    </>
  );
}
