import { useState } from 'react';
import { Plus, Lock, Check, Camera, ShieldCheck, CircleCheck, Circle } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Drawer, Timeline } from '../components/ui';
import { useApp, decideApproval, toast } from '../lib/store';
import { roleByKey } from '../lib/roles';

const IRS = [
  { no: 'IR-0388', what: 'Bolt torque check — truss T4 splices', project: 'PRJ-24-103', type: 'Hold point', by: 'Ravi Teja', when: '25 Oct 10:00', state: 'Scheduled' },
  { no: 'IR-0387', what: 'Incoming plates GRN-2026-0519 — MTC & thickness', project: 'PRJ-24-101', type: 'Incoming', by: 'Mahesh Kumar', when: '24 Oct 15:00', state: 'Pending' },
  { no: 'IR-0386', what: 'DPT on shell plate welds, seam 4', project: 'PRJ-24-102', type: 'Hold point', by: 'Naveen Kumar', when: '23 Oct', state: 'Passed' },
  { no: 'IR-0384', what: 'Dimensional check — Bay 4 rafters R7–R9', project: 'PRJ-24-101', type: 'Stage', by: 'Suresh Gowda', when: '22 Oct', state: 'Passed' },
  { no: 'IR-0381', what: 'UT of butt welds — truss T3', project: 'PRJ-24-103', type: 'Hold point', by: 'Ravi Teja', when: '19 Oct', state: 'Failed' }
];
const NCRS = [
  { no: 'NCR-0412', title: 'Weld undercut on truss T3 bottom chord', project: 'PRJ-24-103', raised: '19 Oct', boq: '3.04', value: '₹4.8 L', cause: 'Excess current on 4 mm electrode; welder not on approved WPS for this position', action: ['Grind out undercut on 6 joints', 'Re-weld with approved WPS-07 by 6G-certified welder', 'Repeat UT on all T3 joints'], state: 'Corrective action done — awaiting closure' },
  { no: 'NCR-0398', title: 'Undersize bolts found at cooling tower bracings', project: 'PRJ-24-107', raised: '11 Oct', boq: '3.02', value: '₹1.2 L', cause: 'M16 bolts used in place of M20 from mixed site stock', action: ['Replace 84 bolts with M20 grade 8.8', 'Segregate site bolt stock by size'], state: 'Corrective action overdue 4 days' },
  { no: 'NCR-0391', title: 'Primer DFT below specification — Bay 4 columns', project: 'PRJ-24-101', raised: '02 Oct', boq: '2.04', value: '₹0.6 L', cause: 'Single coat applied in place of two', action: ['Apply second coat', 'Re-measure DFT'], state: 'Closed 09 Oct' }
];

export default function QAQC() {
  const role = roleByKey(useApp(s => s.role));
  const a9 = useApp(s => s.approvals.find(a => a.id === 'A9'));
  const closed = a9?.status === 'Approved';
  const [tab, setTab] = useState<'ir' | 'ncr'>('ncr');
  const [open, setOpen] = useState<typeof NCRS[number] | null>(null);
  const canClose = role.key === 'quality' || role.key === 'md';
  return (
    <>
      <PageHeader num={14} eyebrow="Execute" title="QA / QC" sub="Inspection requests, inspection reports, NCRs and corrective actions, with approval and closure by the Quality Head."
        actions={<button className="btn btn-primary" onClick={() => toast('Inspection request IR-0389 raised and sent to Kavya Hegde', 'info')}><Plus size={15} />Inspection request</button>} />
      <div className="grid g4">
        <Stat label="Inspections this month" value="46" meta="91% passed first time" />
        <Stat label="Open NCRs" value={closed ? 1 : 2} valueColor="var(--red)" meta="1 overdue on corrective action" />
        <Stat label="Hold points waiting" value="2" meta="Work cannot continue past them" />
        <Stat label="Billing held by NCRs" value={closed ? '₹1.2 L' : '₹6.0 L'} valueColor="var(--amber)" meta="Released when the NCR closes" />
      </div>
      <Why points={['Work does not move past a hold point until it is inspected, and an item with an open NCR cannot be billed, so quality problems never reach the client as a bill.', 'Every NCR records its root cause and corrective action, so the same defect is not repeated on the next project.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'ncr', label: 'Non-conformance reports', count: NCRS.length }, { key: 'ir', label: 'Inspection requests & reports', count: IRS.length }]} />
      {tab === 'ncr' && <Card flush title="NCRs" actions={<WhyPin text="Stage gate Site work → Billing: an item with an open NCR stays out of the RA bill until the Quality Head closes it." />}>
        <div className="table-wrap"><table className="table"><thead><tr><th>NCR</th><th>Defect</th><th>Project</th><th>Raised</th><th>Billing hold</th><th>State</th></tr></thead>
          <tbody>{NCRS.map(n => { const st = n.no === 'NCR-0412' && closed ? 'Closed 24 Oct' : n.state; return (
            <tr key={n.no} className="clickable" onClick={() => setOpen(n)}><td className="mono">{n.no}</td><td className="strong">{n.title}</td><td className="code-link">{n.project}</td><td>{n.raised}</td>
              <td>{st.startsWith('Closed') ? <Badge tone="grey" dot={false}>Released</Badge> : <Badge tone="red" icon={<Lock size={11} />}>BOQ {n.boq} · {n.value}</Badge>}</td>
              <td><Badge tone={st.startsWith('Closed') ? 'green' : st.includes('overdue') ? 'red' : 'amber'}>{st}</Badge></td></tr>); })}</tbody></table></div>
      </Card>}
      {tab === 'ir' && <Card flush title="Inspection requests" sub="Raised from site; inspected by Quality">
        <div className="table-wrap"><table className="table"><thead><tr><th>Request</th><th>Inspection</th><th>Project</th><th>Type</th><th>Raised by</th><th>When</th><th>Result</th></tr></thead>
          <tbody>{IRS.map(i => <tr key={i.no}><td className="mono">{i.no}</td><td className="strong">{i.what}</td><td className="code-link">{i.project}</td><td>{i.type === 'Hold point' ? <Badge tone="violet" icon={<Lock size={11} />}>Hold point</Badge> : <Badge tone="grey" dot={false}>{i.type}</Badge>}</td><td>{i.by}</td><td className="nowrap">{i.when}</td>
            <td><Badge tone={i.state === 'Passed' ? 'green' : i.state === 'Failed' ? 'red' : i.state === 'Scheduled' ? 'blue' : 'amber'}>{i.state}</Badge></td></tr>)}</tbody></table></div>
      </Card>}
      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.no || ''} sub={open?.title}
        footer={open && open.no === 'NCR-0412' && !closed ? <button className="btn btn-primary" disabled={!canClose} onClick={() => { decideApproval('A9', 'Approved'); toast('NCR-0412 closed by Quality Head. Billing hold on BOQ 3.04 (₹4.8 L) released.'); setOpen(null); }}><ShieldCheck size={15} />Close NCR (Quality Head)</button> : undefined}>
        {open && <>
          <dl className="kv"><dt>Project</dt><dd>{open.project}</dd><dt>Raised</dt><dd>{open.raised}</dd><dt>Billing held</dt><dd>BOQ {open.boq} · {open.value}</dd><dt>Root cause</dt><dd>{open.cause}</dd></dl>
          <span className="label">Corrective action</span>
          {open.action.map((a, i) => { const done = open.no !== 'NCR-0398' || i === 0; return <div key={a} className="row small" style={{ gap: 8 }}>{done ? <CircleCheck size={16} color="var(--green)" /> : <Circle size={16} color="var(--ink-3)" />}{a}</div>; })}
          <div className="row wrap" style={{ gap: 8 }}>{['Before', 'After grinding', 'UT report'].map(p => <div key={p} style={{ width: 110, height: 76, borderRadius: 8, background: 'repeating-linear-gradient(135deg,#EEF2F7 0 8px,#E3E8F0 8px 16px)', display: 'flex', alignItems: 'flex-end', padding: 6, fontSize: 11 }}><Camera size={11} style={{ marginRight: 4 }} />{p}</div>)}</div>
          <Timeline items={[{ when: '23 Oct', who: 'Ravi Teja', what: 'Re-weld and repeat UT completed; report attached', tone: 'green' }, { when: '20 Oct', who: 'Kavya Hegde', what: 'Corrective action approved', tone: 'blue' }, { when: open.raised, who: 'Kavya Hegde', what: `${open.no} raised from failed inspection`, tone: 'red' }]} />
          {!canClose && open.no === 'NCR-0412' && !closed && <div className="callout info"><Lock size={15} style={{ flexShrink: 0 }} /><span>Only the Quality Head can close an NCR. Switch "View as" to Quality Head to close it.</span></div>}
          {closed && open.no === 'NCR-0412' && <div className="callout ok"><Check size={15} style={{ flexShrink: 0 }} /><span>Closed. BOQ 3.04 is now billable in the next RA bill.</span></div>}
        </>}
      </Drawer>
    </>
  );
}
