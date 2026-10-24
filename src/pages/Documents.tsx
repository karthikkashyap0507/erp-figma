import { useState } from 'react';
import { Upload, Send, FileText, History, Check, Search, Hash, Sparkles } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Drawer, Stat, Timeline, Field } from '../components/ui';
import { toast } from '../lib/store';

interface Doc { no: string; title: string; type: 'Drawing' | 'BOQ' | 'Specification' | 'Calculation'; project: string; rev: string; status: 'Current' | 'For approval' | 'Superseded'; by: string; date: string; }
const DOCS: Doc[] = [
  { no: 'DRE-103-DWG-ST-0012', title: 'Conveyor gallery truss T3 — fabrication', type: 'Drawing', project: 'PRJ-24-103', rev: 'C', status: 'For approval', by: 'Kiran Desai', date: '23 Oct' },
  { no: 'DRE-103-DWG-ST-0011', title: 'Conveyor gallery — general arrangement', type: 'Drawing', project: 'PRJ-24-103', rev: 'B', status: 'Current', by: 'Kiran Desai', date: '02 Oct' },
  { no: 'DRE-101-DWG-ST-0004', title: 'Bay 4 column & rafter details', type: 'Drawing', project: 'PRJ-24-101', rev: 'D', status: 'Current', by: 'Kiran Desai', date: '18 Sep' },
  { no: 'DRE-102-BOQ-0001', title: 'Kiln shell repair — BOQ with client steel', type: 'BOQ', project: 'PRJ-24-102', rev: '2', status: 'Current', by: 'Meera Iyer', date: '28 Aug' },
  { no: 'DRE-102-SPC-0003', title: 'Welding procedure specification — shell plates', type: 'Specification', project: 'PRJ-24-102', rev: '1', status: 'Current', by: 'Kavya Hegde', date: '05 Aug' },
  { no: 'DRE-107-CAL-0002', title: 'Cooling tower — member capacity check', type: 'Calculation', project: 'PRJ-24-107', rev: 'A', status: 'Current', by: 'Kiran Desai', date: '09 Sep' },
  { no: 'DRE-103-DWG-ST-0008', title: 'Gallery truss T3 — fabrication', type: 'Drawing', project: 'PRJ-24-103', rev: 'B', status: 'Superseded', by: 'Kiran Desai', date: '12 Sep' }
];
const TRANSMITTALS = [
  { no: 'TR-103-021', to: 'Kaveri Power Ltd (client)', docs: 'DRE-103-DWG-ST-0012 rev C', purpose: 'For approval', sent: '23 Oct', ack: 'Pending' },
  { no: 'TR-103-020', to: 'Raichur site — Ravi Teja', docs: 'DRE-103-DWG-ST-0011 rev B', purpose: 'For construction', sent: '02 Oct', ack: 'Acknowledged 02 Oct' },
  { no: 'TR-101-014', to: 'Ballari workshop — Suresh Gowda', docs: 'DRE-101-DWG-ST-0004 rev D', purpose: 'For fabrication', sent: '18 Sep', ack: 'Acknowledged 18 Sep' },
  { no: 'TR-102-009', to: 'Coromandel Cement Ltd (client)', docs: 'DRE-102-BOQ-0001 rev 2', purpose: 'For information', sent: '28 Aug', ack: 'Acknowledged 30 Aug' }
];

export default function Documents() {
  const [tab, setTab] = useState<'register' | 'transmittals' | 'numbering'>('register');
  const [open, setOpen] = useState<Doc | null>(null);
  const [q, setQ] = useState('');
  const [drag, setDrag] = useState(false);
  const shown = DOCS.filter(d => (d.no + d.title + d.project).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader num={7} eyebrow="Plan" title="Engineering & document control" sub="Drawings, BOQs, specifications and calculations with revisions, transmittals, document numbering and one register."
        actions={<button className="btn btn-primary" onClick={() => toast('Transmittal TR-103-022 drafted', 'info')}><Send size={15} />New transmittal</button>} />
      <div className="grid g4">
        <Stat label="Documents in register" value="1,284" meta="7 running projects" />
        <Stat label="Waiting for client approval" value="3" meta="Oldest 6 days" />
        <Stat label="Superseded revisions" value="212" meta="Kept, never deleted" />
        <Stat label="Transmittals this month" value="18" meta="2 not acknowledged" />
      </div>
      <Why points={['Site always builds from the current revision: when rev C is approved, rev B is marked superseded everywhere and the site is told.', 'Every drawing sent out has a transmittal and an acknowledgement, so "we never got that drawing" disputes end.']} />
      <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); toast('2 files uploaded and numbered: DRE-103-DWG-ST-0013, DRE-103-DWG-ST-0014'); }}
        style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderRadius: 12, border: `1.5px dashed ${drag ? 'var(--primary)' : '#B9C3D6'}`, background: drag ? 'var(--primary-soft)' : '#FAFBFD', flexWrap: 'wrap' }}>
        <span className="ico-box t-primary" style={{ width: 44, height: 44 }}><Upload size={20} /></span>
        <div className="col grow" style={{ gap: 2 }}><span className="strong">Drop drawings, BOQs or specifications here</span><span className="small muted">PDF, DWG, Excel or Word. Each file gets the next number in its series and is linked to its project.</span></div>
        <button className="btn" onClick={() => toast('2 files uploaded and numbered', 'info')}>Browse files</button>
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'register', label: 'Register', count: DOCS.length }, { key: 'transmittals', label: 'Transmittals', count: TRANSMITTALS.length }, { key: 'numbering', label: 'Numbering series' }]} />
      {tab === 'register' && <Card flush actions={<div className="row" style={{ border: '1px solid var(--line)', borderRadius: 9, padding: '0 10px', height: 34 }}><Search size={15} color="var(--ink-3)" /><input aria-label="Search documents" value={q} onChange={e => setQ(e.target.value)} placeholder="Search number or title" style={{ border: 'none', outline: 'none', width: 180 }} /></div>} title="Document register">
        <div className="table-wrap"><table className="table"><thead><tr><th>Number</th><th>Title</th><th>Type</th><th>Project</th><th>Rev</th><th>Status</th><th>By</th><th>Date</th></tr></thead>
          <tbody>{shown.map(d => <tr key={d.no} className="clickable" onClick={() => setOpen(d)} style={{ opacity: d.status === 'Superseded' ? 0.6 : 1 }}><td className="mono">{d.no}</td><td className="strong">{d.title}</td><td>{d.type}</td><td className="code-link">{d.project}</td><td><span className="tag">{d.rev}</span></td><td><Badge tone={d.status === 'Current' ? 'green' : d.status === 'For approval' ? 'amber' : 'grey'}>{d.status}</Badge></td><td className="nowrap">{d.by}</td><td>{d.date}</td></tr>)}</tbody></table></div>
      </Card>}
      {tab === 'transmittals' && <Card flush title="Transmittals" sub="What was sent, to whom, why, and whether it was acknowledged">
        <div className="table-wrap"><table className="table"><thead><tr><th>Transmittal</th><th>To</th><th>Documents</th><th>Purpose</th><th>Sent</th><th>Acknowledgement</th></tr></thead>
          <tbody>{TRANSMITTALS.map(t => <tr key={t.no}><td className="mono">{t.no}</td><td className="strong">{t.to}</td><td className="mono small">{t.docs}</td><td>{t.purpose}</td><td>{t.sent}</td><td>{t.ack === 'Pending' ? <Badge tone="amber">Pending</Badge> : <Badge tone="green">{t.ack}</Badge>}</td></tr>)}</tbody></table></div>
      </Card>}
      {tab === 'numbering' && <Card title="Document numbering series" sub="Set once, applied to every upload" actions={<WhyPin text="A fixed numbering pattern means anyone can tell from the number alone which project, discipline and type a document is." />}>
        <div className="row wrap" style={{ gap: 6, fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 600 }}>
          {[['DRE', 'Company'], ['103', 'Project'], ['DWG', 'Type'], ['ST', 'Discipline'], ['0012', 'Running number']].map(([v, l], i) => <span key={l} className="col" style={{ alignItems: 'center', gap: 2 }}><span style={{ padding: '6px 10px', borderRadius: 8, background: ['var(--blue-soft)', 'var(--violet-soft)', 'var(--teal-soft)', 'var(--amber-soft)', 'var(--grey-soft)'][i] }}>{v}</span><span className="xs muted" style={{ fontFamily: 'var(--font)', fontWeight: 500 }}>{l}</span></span>)}
        </div>
        <div className="form-grid">
          <Field label="Types"><input className="input" defaultValue="DWG, BOQ, SPC, CAL, TR" /></Field>
          <Field label="Disciplines"><input className="input" defaultValue="ST (structural), ME (mechanical), EL (electrical)" /></Field>
          <Field label="Revision style"><select className="select" defaultValue="Letters for drawings, numbers for BOQs"><option>Letters for drawings, numbers for BOQs</option><option>Numbers for all</option></select></Field>
        </div>
      </Card>}
      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.no || ''} sub={open?.title}
        footer={open && <><button className="btn" onClick={() => toast('New revision uploaded as rev D (draft)', 'info')}><Upload size={15} />New revision</button>{open.status === 'For approval' ? <button className="btn btn-primary" onClick={() => { toast(`${open.no} rev ${open.rev} approved; rev B superseded and site notified`); setOpen(null); }}><Check size={15} />Approve rev {open.rev}</button> : <button className="btn btn-primary" onClick={() => toast('Transmittal drafted', 'info')}><Send size={15} />Transmit</button>}</>}>
        {open && <>
          <div style={{ height: 200, borderRadius: 10, border: '1px solid var(--line)', background: 'repeating-linear-gradient(0deg,#F6F8FB 0 23px,#E7ECF3 23px 24px), repeating-linear-gradient(90deg,#F6F8FB 0 23px,#E7ECF3 23px 24px)', backgroundBlendMode: 'multiply', display: 'grid', placeItems: 'center' }}><span className="row small muted" style={{ gap: 6, background: '#fff', padding: '4px 10px', borderRadius: 6 }}><FileText size={14} />Preview · {open.no} rev {open.rev}</span></div>
          <dl className="kv"><dt>Project</dt><dd>{open.project}</dd><dt>Type</dt><dd>{open.type}</dd><dt>Revision</dt><dd>{open.rev} · {open.status}</dd><dt>Owner</dt><dd>{open.by}</dd><dt>Linked to</dt><dd>BOQ 3.04 · QA inspection IR-0388</dd></dl>
          <span className="label row" style={{ gap: 6 }}><History size={14} />Revision history</span>
          <Timeline items={[{ when: '23 Oct', who: 'Kiran Desai', what: 'Rev C: splice plate thickened after NCR-0412', tone: 'amber' }, { when: '12 Sep', who: 'Kiran Desai', what: 'Rev B: issued for construction', tone: 'green' }, { when: '28 Aug', who: 'Kiran Desai', what: 'Rev A: issued for approval', tone: 'grey' }]} />
          <div className="callout info"><Sparkles size={15} style={{ flexShrink: 0 }} /><span><b>Documents & Data Agent</b> can answer questions from this drawing, for example "what is the splice plate thickness on T3?"</span></div>
        </>}
      </Drawer>
    </>
  );
}
