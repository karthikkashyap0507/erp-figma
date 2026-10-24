import { useMemo, useState } from 'react';
import { Plus, Upload, Search, ShieldCheck, Sparkles, Check, TriangleAlert, Download } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Drawer, Field, StatusBadge, LineChip, Sensitive, Stages, Seg } from '../components/ui';
import { PARTIES, ITEMS, LINES, COMPANIES, type Party, type PartyType } from '../data/core';
import { inr, money } from '../lib/format';
import { toast } from '../lib/store';

type TabKey = 'parties' | 'items' | 'employees' | 'sites' | 'vehicles' | 'tax' | 'templates';

const EMPLOYEES = [
  { code: 'EMP-0012', name: 'Arjun Patil', desig: 'Project Manager', dept: 'Projects', site: 'Ballari works', type: 'Staff', ctc: 1680000, pf: 'KN/BLR/0048211/012', esi: '—' },
  { code: 'EMP-0031', name: 'Suresh Gowda', desig: 'Site Engineer', dept: 'Projects', site: 'Ballari works', type: 'Staff', ctc: 720000, pf: 'KN/BLR/0048211/031', esi: '—' },
  { code: 'EMP-0044', name: 'Kavya Hegde', desig: 'Quality Head', dept: 'Quality', site: 'Ballari works', type: 'Staff', ctc: 1140000, pf: 'KN/BLR/0048211/044', esi: '—' },
  { code: 'EMP-0057', name: 'Mahesh Kumar', desig: 'Storekeeper', dept: 'Stores', site: 'Ballari works', type: 'Staff', ctc: 384000, pf: 'KN/BLR/0048211/057', esi: '5300112244' },
  { code: 'W-1042', name: 'Ramesh Naik', desig: 'Fitter', dept: 'Workshop', site: 'Ballari works', type: 'Worker', ctc: 312000, pf: 'KN/BLR/0048211/1042', esi: '5300119920' },
  { code: 'W-1088', name: 'Basavaraj H', desig: 'Welder (6G)', dept: 'Erection', site: 'Raichur TPS', type: 'Worker', ctc: 336000, pf: 'KN/BLR/0048211/1088', esi: '5300120415' },
  { code: 'W-1131', name: 'Anil Kumar', desig: 'Rigger', dept: 'Erection', site: 'Raichur TPS', type: 'Worker', ctc: 288000, pf: 'KN/BLR/0048211/1131', esi: '5300121007' },
  { code: 'CL-2210', name: 'Contract labour — Manjunath LC', desig: '64 workers', dept: 'Manpower supply', site: 'Ballari BF-2', type: 'Contract', ctc: 0, pf: 'Contractor PF code', esi: 'Contractor ESI code' }
];
const SITES = [
  { code: 'SITE-BLW', name: 'Ballari works (workshop)', kind: 'Workshop + central store', state: 'Karnataka', projects: 2, store: 'Ballari workshop' },
  { code: 'SITE-RCH', name: 'Raichur TPS', kind: 'Client site', state: 'Karnataka', projects: 2, store: 'Raichur site store' },
  { code: 'SITE-KLB', name: 'Kalaburagi cement plant', kind: 'Client site', state: 'Karnataka', projects: 1, store: 'Client-steel yard' },
  { code: 'SITE-HSP', name: 'Hospet steel plant', kind: 'O&M base', state: 'Karnataka', projects: 3, store: 'Hospet O&M store' },
  { code: 'SITE-HSR', name: 'Hosur', kind: 'Consultation office', state: 'Tamil Nadu', projects: 1, store: '—' }
];
const ASSETS = [
  { code: 'VH-001', name: 'Bolero pickup KA-34-AB-1123', kind: 'Vehicle', owner: 'Owned', site: 'Ballari works' },
  { code: 'VH-002', name: 'Tata 407 KA-35-C-8812', kind: 'Vehicle', owner: 'Owned', site: 'Raichur TPS' },
  { code: 'VH-003', name: 'Eicher trailer KA-35-D-4410', kind: 'Vehicle', owner: 'Owned', site: 'Ballari works' },
  { code: 'EQ-014', name: 'Wheel loader CAT 938', kind: 'Equipment', owner: 'Owned · deployed to O&M', site: 'Hospet steel plant' },
  { code: 'EQ-021', name: 'Welding inverter 400 A × 12', kind: 'Equipment', owner: 'Owned', site: 'Raichur TPS' },
  { code: 'EQ-H31', name: 'Hydra crane 14 T', kind: 'Equipment', owner: 'Hired in · Hospet Crane Services', site: 'Ballari works' }
];
const TAX = [
  { code: 'HSN 7308', name: 'Structural steel fabrications', rate: '18%', use: 'Sales line invoices' },
  { code: 'HSN 7208', name: 'Flat-rolled steel plates', rate: '18%', use: 'Purchase, trading' },
  { code: 'SAC 9987', name: 'Maintenance and repair services', rate: '18%', use: 'Service, O&M, AMC bills' },
  { code: 'SAC 9985', name: 'Manpower supply services', rate: '18%', use: 'Head-day bills' },
  { code: 'SAC 9983', name: 'Engineering consultancy', rate: '18%', use: 'Consultation fees' },
  { code: 'TDS 194C', name: 'Contractors — individual / firm', rate: '1% / 2%', use: 'Subcontractor and transport bills' },
  { code: 'TDS 194I', name: 'Rent — plant & machinery / building', rate: '2% / 10%', use: 'Crane hire / room rents' },
  { code: 'TDS 194Q', name: 'Purchase of goods above ₹50 L', rate: '0.1%', use: 'Steel purchases' }
];

const typeTone: Record<PartyType, 'blue' | 'violet' | 'amber' | 'teal'> = { Client: 'blue', Dealer: 'violet', Vendor: 'amber', Subcontractor: 'teal' };

export default function Masters() {
  const [tab, setTab] = useState<TabKey>('parties');
  const [ptype, setPtype] = useState<'All' | PartyType>('All');
  const [q, setQ] = useState('');
  const [parties, setParties] = useState<Party[]>(PARTIES);
  const [drawer, setDrawer] = useState(false);
  const [form, setForm] = useState({ name: 'Bellary Ferro Alloys Ltd', type: 'Client' as PartyType, gstin: '29AABCB2201N1Z4', city: 'Ballari', terms: '30 days' });
  const [lineSel, setLineSel] = useState(LINES[1].key);
  const gstOk = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(form.gstin);
  const dup = parties.find(p => p.name.toLowerCase().split(' ')[0] === form.name.toLowerCase().split(' ')[0] && p.type === form.type);
  const shown = useMemo(() => parties.filter(p => (ptype === 'All' || p.type === ptype) && (p.name + p.code + p.city).toLowerCase().includes(q.toLowerCase())), [parties, ptype, q]);
  const line = LINES.find(l => l.key === lineSel)!;
  return (
    <>
      <PageHeader num={1} eyebrow="Win the work" title="Master data" sub="Parties, items with item codes, employees, sites, stores, vehicles, equipment, tax masters and business-line templates — entered once, used by every module."
        actions={<><button className="btn" onClick={() => toast('Excel template downloaded', 'info')}><Download size={15} />Excel template</button><button className="btn" onClick={() => toast('Import started: 1 file, 214 rows. Documents & Data Agent is checking for duplicates.', 'info')}><Upload size={15} />Import</button><button className="btn btn-primary" onClick={() => setDrawer(true)}><Plus size={15} />New party</button></>} />
      <Why points={['One master for every party, item and site means no more three spellings of the same vendor across spreadsheets.', 'Maker-checker: a new party or item goes live only after a second person checks it, so fake vendors and wrong GSTINs never reach a payment.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'parties', label: 'Parties', count: parties.length }, { key: 'items', label: 'Items', count: ITEMS.length }, { key: 'employees', label: 'Employees', count: EMPLOYEES.length }, { key: 'sites', label: 'Sites & stores', count: SITES.length }, { key: 'vehicles', label: 'Vehicles & equipment', count: ASSETS.length }, { key: 'tax', label: 'Tax masters', count: TAX.length }, { key: 'templates', label: 'Business-line templates', count: 6 }]} />

      {tab === 'parties' && (
        <Card flush title="Parties" sub="Clients, dealers, vendors and subcontractors" actions={<><Seg options={(['All', 'Client', 'Dealer', 'Vendor', 'Subcontractor'] as const).map(k => ({ key: k, label: k }))} value={ptype} onChange={setPtype} /><div className="row" style={{ border: '1px solid var(--line)', borderRadius: 9, padding: '0 10px', height: 34 }}><Search size={15} color="var(--ink-3)" /><input aria-label="Search parties" value={q} onChange={e => setQ(e.target.value)} placeholder="Search" style={{ border: 'none', outline: 'none', width: 140 }} /></div></>}>
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Code</th><th>Name</th><th>Type</th><th>City</th><th>GSTIN</th><th>Terms</th><th className="r">Outstanding</th><th>Status</th></tr></thead>
            <tbody>{shown.map(p => (
              <tr key={p.code}><td className="mono">{p.code}</td><td><div className="cell-2"><span className="strong">{p.name}</span><span className="s">{p.contact}</span></div></td><td><Badge tone={typeTone[p.type]} dot={false}>{p.type}</Badge></td><td>{p.city}</td><td className="mono">{p.gstin}</td><td>{p.terms}</td><td className="r">{p.outstanding ? money(p.outstanding) : '—'}</td>
                <td>{p.status === 'Active' ? <StatusBadge s="Active" /> : <span className="row" style={{ gap: 6 }}><Badge tone="amber">Pending check</Badge><button className="btn btn-sm" onClick={() => { setParties(ps => ps.map(x => x.code === p.code ? { ...x, status: 'Active' } : x)); toast(`${p.name} checked and activated`); }}>Check</button></span>}</td></tr>
            ))}</tbody>
          </table></div>
        </Card>
      )}

      {tab === 'items' && (
        <>
          <Card title="Item code structure" sub="Same code everywhere — requisition, PO, GRN, stock, issue and bill" actions={<WhyPin text="When every store and site uses the same item code, stock can be compared across stores and wastage traced back to a project." />}>
            <div className="row wrap" style={{ gap: 6, fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 600 }}>
              <span style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--blue-soft)', color: 'var(--blue)' }}>ST</span>-<span style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--violet-soft)', color: 'var(--violet)' }}>PL</span>-<span style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--teal-soft)', color: 'var(--teal)' }}>016</span>
              <span className="small muted" style={{ fontFamily: 'var(--font)', fontWeight: 500, marginLeft: 12 }}>Group (steel) · Type (plate) · Size (16 mm)</span>
            </div>
          </Card>
          <Card flush>
            <div className="table-wrap"><table className="table">
              <thead><tr><th>Item code</th><th>Name</th><th>Group</th><th>UoM</th><th className="r">Minimum level</th><th className="r">Standard rate</th><th>Default store</th></tr></thead>
              <tbody>{ITEMS.map(i => <tr key={i.code}><td className="mono">{i.code}</td><td className="strong">{i.name}</td><td>{i.group}</td><td>{i.uom}</td><td className="r">{i.min} {i.uom}</td><td className="r">{inr(i.rate)}</td><td>{i.store}</td></tr>)}</tbody>
            </table></div>
          </Card>
        </>
      )}

      {tab === 'employees' && (
        <Card flush title="Employees and contract labour" sub="Salary figures are visible only to HR, Accounts, CA and the MD">
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Code</th><th>Name</th><th>Designation</th><th>Department</th><th>Site</th><th>Type</th><th className="r">CTC / year</th><th>PF number</th><th>ESI</th></tr></thead>
            <tbody>{EMPLOYEES.map(e => <tr key={e.code}><td className="mono">{e.code}</td><td className="strong">{e.name}</td><td>{e.desig}</td><td>{e.dept}</td><td>{e.site}</td><td><Badge tone={e.type === 'Staff' ? 'blue' : e.type === 'Worker' ? 'teal' : 'violet'} dot={false}>{e.type}</Badge></td><td className="r">{e.ctc ? <Sensitive kind="salary">{inr(e.ctc)}</Sensitive> : '—'}</td><td className="mono">{e.pf}</td><td className="mono">{e.esi}</td></tr>)}</tbody>
          </table></div>
        </Card>
      )}

      {tab === 'sites' && (
        <div className="grid g2">
          <Card flush title="Sites"><div className="table-wrap"><table className="table"><thead><tr><th>Code</th><th>Site</th><th>Kind</th><th className="r">Projects</th><th>Store</th></tr></thead><tbody>{SITES.map(s => <tr key={s.code}><td className="mono">{s.code}</td><td className="strong">{s.name}</td><td>{s.kind}</td><td className="r">{s.projects}</td><td>{s.store}</td></tr>)}</tbody></table></div></Card>
          <Card title="Companies, GSTINs and branches" sub="No limit on companies, GSTINs, branches or sites">
            {COMPANIES.map(c => <div key={c.gstin} className="col" style={{ gap: 4, paddingBottom: 10, borderBottom: '1px solid var(--line-2)' }}><span className="strong">{c.name}</span><span className="mono muted">{c.gstin} · {c.state}</span><div className="row wrap" style={{ gap: 6 }}>{c.branches.map(b => <span key={b} className="tag">{b}</span>)}</div></div>)}
          </Card>
        </div>
      )}

      {tab === 'vehicles' && (
        <Card flush title="Vehicles and equipment" sub="Owned and hired-in, with the site they are at today"><div className="table-wrap"><table className="table"><thead><tr><th>Code</th><th>Name</th><th>Kind</th><th>Ownership</th><th>Site</th></tr></thead><tbody>{ASSETS.map(a => <tr key={a.code}><td className="mono">{a.code}</td><td className="strong">{a.name}</td><td>{a.kind}</td><td>{a.owner}</td><td>{a.site}</td></tr>)}</tbody></table></div></Card>
      )}

      {tab === 'tax' && (
        <Card flush title="Tax masters" sub="GST HSN/SAC codes and TDS sections used on every bill"><div className="table-wrap"><table className="table"><thead><tr><th>Code</th><th>Description</th><th>Rate</th><th>Used on</th></tr></thead><tbody>{TAX.map(t => <tr key={t.code}><td className="mono strong">{t.code}</td><td>{t.name}</td><td><Badge tone="primary" dot={false}>{t.rate}</Badge></td><td>{t.use}</td></tr>)}</tbody></table></div></Card>
      )}

      {tab === 'templates' && (
        <div className="split">
          <Card title="Business-line templates" sub="Choosing the line when a project is created loads the right stages, documents, approvals and billing basis" flush>
            {LINES.map(l => (
              <button key={l.key} className="list-row clickable" onClick={() => setLineSel(l.key)} style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--line-2)', background: lineSel === l.key ? 'var(--primary-soft)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}>
                <LineChip line={l.key} /><span className="small muted grow">{l.notes}</span>
              </button>
            ))}
          </Card>
          <Card title={`${line.no} ${line.name}`} sub={line.handles}>
            <span className="label">Stages</span>
            <Stages stages={line.stages} current={-1} />
            <dl className="kv"><dt>Billing basis</dt><dd>{line.billing}</dd><dt>Stores</dt><dd>{line.stores}</dd><dt>Documents</dt><dd>{line.documents.join(' · ')}</dd><dt>Approvals</dt><dd>{line.approvals.join(' · ')}</dd></dl>
            <Why compact>New project types, such as civil or electrical turnkey jobs, can be set up from the same templates without development.</Why>
          </Card>
        </div>
      )}

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="New party" sub="Goes live after a second person checks it (maker-checker)"
        footer={<><button className="btn" onClick={() => setDrawer(false)}>Cancel</button><button className="btn btn-primary" disabled={!gstOk} onClick={() => { const code = `${form.type === 'Client' ? 'CL' : form.type === 'Dealer' ? 'DL' : form.type === 'Vendor' ? 'VN' : 'SC'}-00${parties.length + 10}`; setParties(ps => [{ code, name: form.name, type: form.type, city: form.city, gstin: form.gstin, terms: form.terms, contact: '—', outstanding: 0, status: 'Pending check' }, ...ps]); setDrawer(false); setTab('parties'); setPtype('All'); toast(`${form.name} saved. Waiting for checker.`); }}><Check size={15} />Save for checking</button></>}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Party name" span={2}><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Type"><select className="select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as PartyType })}>{(['Client', 'Dealer', 'Vendor', 'Subcontractor'] as const).map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="City"><input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></Field>
          <Field label="GSTIN" span={2} hint={gstOk ? <span className="row" style={{ gap: 4, color: 'var(--green)' }}><ShieldCheck size={13} />Valid format · state 29 (Karnataka)</span> : <span style={{ color: 'var(--red)' }}>Not a valid GSTIN format</span>}><input className="input mono" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value.toUpperCase() })} /></Field>
          <Field label="Payment terms"><select className="select" value={form.terms} onChange={e => setForm({ ...form, terms: e.target.value })}>{['Advance', '15 days', '30 days', '45 days', '60 days'].map(t => <option key={t}>{t}</option>)}</select></Field>
        </div>
        {dup ? <div className="callout warn"><TriangleAlert size={16} style={{ flexShrink: 0 }} /><span><b>Possible duplicate:</b> {dup.name} ({dup.code}) already exists. The Documents & Data Agent flags look-alike names before they are saved.</span></div>
          : <div className="callout ok"><Sparkles size={16} style={{ flexShrink: 0 }} /><span>No duplicates found by the Documents & Data Agent.</span></div>}
        <Why compact>GSTIN format, duplicates and missing details are checked as you type, so bad master data never reaches a bill or a payment.</Why>
      </Drawer>
    </>
  );
}
