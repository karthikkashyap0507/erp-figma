import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, FileText, Camera, MapPin, Sparkles, ArrowRight, Copy, CircleCheck, Circle } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Field, Stat, StatusBadge, Sensitive } from '../components/ui';
import { inr, money } from '../lib/format';
import { toast } from '../lib/store';

const REGISTER = [
  { no: 'EST-2026-031', client: 'Nandi Sugars Ltd', title: 'Boiler house structural steel — 44 MT supply & erection', ver: 'v3', value: 4860000, status: 'Approved', by: 'Meera Iyer' },
  { no: 'EST-2026-034', client: 'Krishna Fertilisers', title: 'Shutdown manpower — 80 heads × 20 days', ver: 'v1', value: 1920000, status: 'Draft', by: 'Meera Iyer' },
  { no: 'EST-2026-035', client: 'Coromandel Cement Ltd', title: 'Clinker cooler duct repair (client steel)', ver: 'v1', value: 2740000, status: 'Site assessment', by: 'Meera Iyer' },
  { no: 'EST-2026-029', client: 'Hosur Auto Components', title: 'PEB shed costing & design review — fee', ver: 'v2', value: 650000, status: 'Won', by: 'Meera Iyer' }
];

interface RLine { id: string; head: string; basis: string; qty: number; rate: number; kind: 'Material' | 'Labour' | 'Equipment' | 'Other'; }
const BASE: RLine[] = [
  { id: 'r1', head: 'Structural steel (ISMB, plates, channels)', basis: '1.03 MT per MT incl. 3% cut-loss', qty: 1.03, rate: 62400, kind: 'Material' },
  { id: 'r2', head: 'Welding consumables, gases, grinding', basis: 'Per MT fabricated', qty: 1, rate: 2650, kind: 'Material' },
  { id: 'r3', head: 'Primer + 2 coats enamel', basis: '28 m² per MT', qty: 28, rate: 118, kind: 'Material' },
  { id: 'r4', head: 'Fabrication labour (workshop)', basis: '9.5 man-days per MT', qty: 9.5, rate: 980, kind: 'Labour' },
  { id: 'r5', head: 'Erection labour (site)', basis: '6 man-days per MT', qty: 6, rate: 1050, kind: 'Labour' },
  { id: 'r6', head: 'Hydra crane + trailer transport', basis: 'Per MT erected', qty: 1, rate: 3400, kind: 'Equipment' },
  { id: 'r7', head: 'Site establishment & safety', basis: 'Per MT', qty: 1, rate: 1200, kind: 'Other' }
];

export default function Estimates() {
  const nav = useNavigate();
  const [sel, setSel] = useState(REGISTER[0].no);
  const [tab, setTab] = useState<'req' | 'site' | 'rate' | 'versions' | 'approve'>('rate');
  const [lines, setLines] = useState(BASE);
  const [qty, setQty] = useState(44.4);
  const [overhead, setOverhead] = useState(8);
  const [margin, setMargin] = useState(12);
  const [approved, setApproved] = useState(true);
  const perMT = useMemo(() => lines.reduce((a, l) => a + l.qty * l.rate, 0), [lines]);
  const direct = perMT * qty;
  const oh = direct * overhead / 100;
  const mg = (direct + oh) * margin / 100;
  const price = direct + oh + mg;
  const est = REGISTER.find(r => r.no === sel)!;
  const kindTotals = (['Material', 'Labour', 'Equipment', 'Other'] as const).map(k => ({ k, v: lines.filter(l => l.kind === k).reduce((a, l) => a + l.qty * l.rate, 0) * qty }));
  return (
    <>
      <PageHeader num={3} eyebrow="Win the work" title="Consultation, costing & estimation" sub="Requirement capture, site assessment, rate analysis, estimate versions and approval, then a quotation in one click."
        actions={<button className="btn btn-primary" onClick={() => toast('New estimate EST-2026-036 created from lead', 'info')}><Plus size={15} />New estimate</button>} />
      <div className="split" style={{ gridTemplateColumns: '340px minmax(0, 1fr)' }}>
        <Card title="Estimate register" flush>
          {REGISTER.map(r => (
            <button key={r.no} onClick={() => setSel(r.no)} className="list-row clickable" style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--line-2)', background: sel === r.no ? 'var(--primary-soft)' : 'transparent', textAlign: 'left', cursor: 'pointer', alignItems: 'flex-start' }}>
              <div className="col grow" style={{ gap: 3 }}>
                <div className="row"><span className="mono">{r.no}</span><span className="tag">{r.ver}</span><span className="ml-auto"><Badge tone={r.status === 'Approved' || r.status === 'Won' ? 'green' : r.status === 'Draft' ? 'grey' : 'amber'}>{r.status}</Badge></span></div>
                <span className="small strong">{r.client}</span><span className="xs muted">{r.title}</span><span className="small strong num">{money(r.value)}</span>
              </div>
            </button>
          ))}
        </Card>
        <div className="col" style={{ gap: 16 }}>
          <Card title={`${est.no} · ${est.client}`} sub={est.title} actions={<><span className="tag">{est.ver}</span><StatusBadge s={est.status === 'Approved' ? 'Approved' : 'Draft'} /></>}>
            <Tabs value={tab} onChange={setTab} tabs={[{ key: 'req', label: 'Requirement' }, { key: 'site', label: 'Site assessment' }, { key: 'rate', label: 'Rate analysis' }, { key: 'versions', label: 'Versions', count: 3 }, { key: 'approve', label: 'Approve & quote' }]} />
            {tab === 'req' && <>
              <div className="form-grid">
                <Field label="Client"><input className="input" defaultValue={est.client} /></Field>
                <Field label="Business line"><select className="select" defaultValue="Sales & service"><option>Sales</option><option>Service</option><option>Sales & service</option><option>O&M</option><option>Manpower supply</option><option>Consultation</option></select></Field>
                <Field label="Required by"><input className="input" defaultValue="15 Jan 2027" /></Field>
                <Field label="Scope" span={3}><textarea className="textarea" defaultValue="Supply, fabrication, painting and erection of boiler house structure: columns, beams, bracings, staircase and platforms. Approx. 44 MT as per client GA drawing BH-GA-02 rev 1. Foundations and bolts by client." /></Field>
                <Field label="Drawings received"><input className="input" defaultValue="BH-GA-02 rev 1, BH-ST-05" /></Field>
                <Field label="Material scope"><select className="select" defaultValue="Our steel"><option>Our steel</option><option>Client-supplied steel</option></select></Field>
                <Field label="Source lead"><input className="input" defaultValue="L-311 · IndiaMART" /></Field>
              </div>
            </>}
            {tab === 'site' && <>
              <div className="grid g2">
                <div className="col">
                  {[['Access for 40-ft trailer up to the boiler house', true], ['Crane standing area (Hydra 14 T) firm and level', true], ['Live plant area — hot work permit needed', true], ['Power for welding available within 50 m', false], ['Night work allowed', false]].map(([t, ok]) => <div key={t as string} className="row small">{ok ? <CircleCheck size={16} color="var(--green)" /> : <Circle size={16} color="var(--ink-3)" />}{t as string}</div>)}
                </div>
                <div className="col">
                  <div className="row small"><MapPin size={15} color="var(--ink-3)" />Nandi Sugars, Haveri · visited 18 Oct by Meera Iyer</div>
                  <div className="grid g3" style={{ gap: 8 }}>{['Boiler bay', 'Crane access', 'Existing steel'].map(p => <div key={p} style={{ height: 70, borderRadius: 8, background: 'repeating-linear-gradient(135deg,#EEF2F7 0 8px,#E3E8F0 8px 16px)', display: 'flex', alignItems: 'flex-end', padding: 6, fontSize: 11, color: 'var(--ink-2)' }}><Camera size={11} style={{ marginRight: 4 }} />{p}</div>)}</div>
                </div>
              </div>
              <Field label="Assessment notes"><textarea className="textarea" defaultValue="Existing platform at +12 m to be retained. DG power for welding to be included (not in client scope). Erection only in day shift." /></Field>
            </>}
            {tab === 'rate' && <>
              <div className="row wrap" style={{ gap: 12 }}>
                <Field label="Quantity (MT)"><input className="input num" type="number" value={qty} onChange={e => setQty(Number(e.target.value) || 0)} style={{ width: 120 }} /></Field>
                <Field label="Overhead %"><input className="input num" type="number" value={overhead} onChange={e => setOverhead(Number(e.target.value) || 0)} style={{ width: 110 }} /></Field>
                <Field label="Margin %"><input className="input num" type="number" value={margin} onChange={e => setMargin(Number(e.target.value) || 0)} style={{ width: 110 }} /></Field>
                <span className="ml-auto"><WhyPin text="Rate analysis builds the price from material, labour and equipment per unit. When steel prices move, every estimate is re-priced from the same rates instead of being re-typed." /></span>
              </div>
              <div className="table-wrap"><table className="table dense">
                <thead><tr><th>Cost head (per MT)</th><th>Basis</th><th>Type</th><th className="r">Qty</th><th className="r">Rate</th><th className="r">Per MT</th></tr></thead>
                <tbody>{lines.map(l => (
                  <tr key={l.id}><td className="strong">{l.head}</td><td className="small muted">{l.basis}</td><td><Badge tone={l.kind === 'Material' ? 'blue' : l.kind === 'Labour' ? 'violet' : l.kind === 'Equipment' ? 'amber' : 'grey'} dot={false}>{l.kind}</Badge></td>
                    <td className="r"><input className="input input-sm num" style={{ width: 80 }} type="number" step="0.01" value={l.qty} onChange={e => setLines(ls => ls.map(x => x.id === l.id ? { ...x, qty: Number(e.target.value) || 0 } : x))} aria-label={`Quantity for ${l.head}`} /></td>
                    <td className="r"><input className="input input-sm num" style={{ width: 96 }} type="number" value={l.rate} onChange={e => setLines(ls => ls.map(x => x.id === l.id ? { ...x, rate: Number(e.target.value) || 0 } : x))} aria-label={`Rate for ${l.head}`} /></td>
                    <td className="r strong">{inr(l.qty * l.rate)}</td></tr>
                ))}
                  <tr className="total"><td colSpan={5}>Direct cost per MT</td><td className="r">{inr(perMT)}</td></tr></tbody>
              </table></div>
              <div className="grid g4">
                <Stat label={`Direct cost (${qty} MT)`} value={money(direct)} />
                <Stat label={`Overhead ${overhead}%`} value={money(oh)} />
                <Stat label={`Margin ${margin}%`} value={<Sensitive kind="margin">{money(mg)}</Sensitive>} />
                <Stat label="Quoted price" value={money(price)} valueColor="var(--primary-ink)" meta={`${inr(Math.round(price / (qty || 1)))} per MT`} />
              </div>
              <div className="row wrap" style={{ gap: 14 }}>{kindTotals.map(k => <span key={k.k} className="small"><b>{k.k}</b> {money(k.v)}</span>)}</div>
            </>}
            {tab === 'versions' && <>
              <div className="table-wrap"><table className="table">
                <thead><tr><th>Version</th><th>Date</th><th>Change</th><th className="r">Steel rate / MT</th><th className="r">Margin</th><th className="r">Price</th></tr></thead>
                <tbody>
                  <tr><td><span className="tag">v1</span></td><td>08 Oct</td><td>First estimate from client GA drawing, 41 MT</td><td className="r">₹64,200</td><td className="r"><Sensitive kind="margin">15%</Sensitive></td><td className="r">₹47.9 L</td></tr>
                  <tr><td><span className="tag">v2</span></td><td>14 Oct</td><td>Qty revised to 44.4 MT after BH-ST-05; DG power added</td><td className="r">₹63,100</td><td className="r"><Sensitive kind="margin">14%</Sensitive></td><td className="r">₹51.2 L</td></tr>
                  <tr className="selected"><td><span className="tag">v3</span></td><td>19 Oct</td><td>Steel rate updated to today's quote; margin cut to win</td><td className="r">₹62,400</td><td className="r"><Sensitive kind="margin">12%</Sensitive></td><td className="r"><b>₹48.6 L</b></td></tr>
                </tbody>
              </table></div>
              <button className="btn" onClick={() => toast('v4 created as a copy of v3', 'info')}><Copy size={15} />New version from v3</button>
              <Why compact>Every version is kept with what changed and why, so when a client asks why the price moved, the answer takes seconds.</Why>
            </>}
            {tab === 'approve' && <>
              <div className={approved ? 'callout ok' : 'callout warn'}>{approved ? <Check size={16} /> : <FileText size={16} />}<span>{approved ? <><b>v3 approved</b> by Meera Iyer (Estimation lead) on 19 Oct. Stage gate Enquiry → Quotation is cleared.</> : <>Estimate must be approved before a quotation can be created (stage gate Enquiry → Quotation).</>}</span></div>
              <div className="row wrap" style={{ gap: 8 }}>
                {!approved && <button className="btn btn-success" onClick={() => { setApproved(true); toast('Estimate v3 approved'); }}><Check size={15} />Approve estimate</button>}
                <button className="btn btn-primary" disabled={!approved} onClick={() => { toast('Quotation QT-2026-0144 created from EST-2026-031 v3'); nav('/sales'); }}><FileText size={15} />Create quotation in one click<ArrowRight size={15} /></button>
              </div>
              <div className="callout info"><Sparkles size={16} style={{ flexShrink: 0 }} /><span><b>Documents & Data Agent:</b> 86 lines extracted from the client's BOQ; 81 matched to rate analysis items, 5 need an estimator.</span></div>
            </>}
          </Card>
          <Why points={['Estimates are built from one rate library, so two estimators never price the same job differently.', 'An approved estimate becomes a quotation in one click: no re-typing, no copy-paste errors.']} />
        </div>
      </div>
    </>
  );
}
