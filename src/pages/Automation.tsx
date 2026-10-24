import { useState, type ReactNode } from 'react';
import { Zap, MessageCircle, Mail, Monitor, ArrowRight, Sparkles, Check, Plus, ListChecks } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Switch, Field } from '../components/ui';
import { toast } from '../lib/store';

interface Rule { id: string; when: string; cond: string; then: string; ch: string[]; on: boolean; runs: number; }
const RULES: Rule[] = [
  { id: 'R1', when: 'Purchase order approved', cond: 'Any value', then: 'Send PO PDF to the vendor; create a delivery follow-up task for Purchase', ch: ['WhatsApp', 'Email'], on: true, runs: 31 },
  { id: 'R2', when: 'Item falls below minimum stock', cond: 'Store is not blocked for the line', then: 'Procurement Agent drafts a requisition; alert Stores and Purchase', ch: ['In-app'], on: true, runs: 12 },
  { id: 'R3', when: 'Document expires in 15 days', cond: 'Vehicle, driver, licence, insurance, hire or rent', then: 'Create a renewal task for the owner; remind at 7 and 2 days', ch: ['WhatsApp'], on: true, runs: 9 },
  { id: 'R4', when: 'Measurement sheet certified by client', cond: 'No open NCR on the BOQ items', then: 'Draft the RA bill for Accounts', ch: ['In-app', 'Email'], on: true, runs: 6 },
  { id: 'R5', when: 'Approval pending for 24 hours', cond: 'Value above ₹50,000', then: 'Escalate to the next approver in the matrix', ch: ['WhatsApp'], on: true, runs: 14 },
  { id: 'R6', when: 'Invoice unpaid 7 days after due', cond: 'Client', then: 'Finance Agent drafts a reminder for Accounts to send', ch: ['Email'], on: true, runs: 8 },
  { id: 'R7', when: 'Payroll approved', cond: 'Every month', then: 'Send payslips to each employee', ch: ['WhatsApp'], on: true, runs: 1 }
];
const LOG = [
  { at: '16:42', ev: 'RA bill RA-102-05 posted', fired: 'E-invoice generated; invoice sent to Coromandel', ch: 'Email' },
  { at: '15:10', ev: 'TDS rate mismatch found on SB-0388', fired: 'Task for Deepa Nair', ch: 'In-app' },
  { at: '11:00', ev: 'Approval PO-2026-0218 pending 6 h', fired: 'Reminder to Shah Rukh', ch: 'WhatsApp' },
  { at: '07:00', ev: 'Daily brief ready', fired: 'Brief sent to MD and PMs', ch: 'WhatsApp' },
  { at: '06:00', ev: 'MS plate 16 mm below minimum', fired: 'PR-2026-0391 drafted by Procurement Agent', ch: 'In-app' }
];
const ICON: Record<string, ReactNode> = { WhatsApp: <MessageCircle size={11} />, Email: <Mail size={11} />, 'In-app': <Monitor size={11} /> };

export default function Automation() {
  const [rules, setRules] = useState(RULES);
  const [tab, setTab] = useState<'rules' | 'builder' | 'log'>('rules');
  const [suggest, setSuggest] = useState(true);
  return (
    <>
      <PageHeader num={23} eyebrow="Platform" title="Event automation & notifications" sub="Business events trigger tasks and alerts in-app, by email and on WhatsApp."
        actions={<button className="btn btn-primary" onClick={() => setTab('builder')}><Plus size={15} />New rule</button>} />
      <div className="grid g4">
        <Stat label="Events today" value="386" meta="From every module" />
        <Stat label="Notifications sent" value="142" meta="91 WhatsApp · 33 email · 18 in-app" />
        <Stat label="Tasks created" value="17" meta="Each with an owner and due date" />
        <Stat label="Active rules" value={rules.filter(r => r.on).length} meta={`${rules.length} defined`} />
      </div>
      <Why points={['Nobody has to remember to send the PO, chase the approval or renew the insurance: the event itself triggers the next step.', 'Alerts go where people already are: WhatsApp for site and management, email for clients and vendors, in-app for desk work.']} />
      {suggest && <div className="callout info"><Sparkles size={16} style={{ flexShrink: 0 }} /><span><b>Workflow & Automation Agent suggests:</b> 4 DPRs came in after 9 PM last week. Add a rule to send a WhatsApp reminder at 19:00 to any site engineer who has not submitted.</span>
        <button className="btn btn-sm btn-primary ml-auto" onClick={() => { setRules(rs => [{ id: 'R8', when: 'No DPR from a running site by 19:00', cond: 'Working day', then: 'Remind the site engineer; tell the PM at 21:00 if still missing', ch: ['WhatsApp'], on: true, runs: 0 }, ...rs]); setSuggest(false); toast('Rule added: DPR reminder at 19:00'); }}><Check size={13} />Add rule</button>
        <button className="btn btn-sm" onClick={() => setSuggest(false)}>Dismiss</button></div>}
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'rules', label: 'Rules', count: rules.length }, { key: 'builder', label: 'Rule builder' }, { key: 'log', label: 'Event log' }]} />
      {tab === 'rules' && <div className="col" style={{ gap: 10 }}>{rules.map(r => (
        <section key={r.id} className="card"><div className="card-b row wrap" style={{ gap: 12 }}>
          <span className="ico-box t-primary"><Zap size={16} /></span>
          <div className="col grow" style={{ gap: 4, minWidth: 260 }}>
            <div className="row wrap small" style={{ gap: 6 }}><b>When</b> {r.when}<ArrowRight size={13} color="var(--ink-3)" /><b>If</b> {r.cond}</div>
            <div className="small" style={{ color: 'var(--ink-2)' }}><b style={{ color: 'var(--ink)' }}>Then</b> {r.then}</div>
          </div>
          <div className="row wrap" style={{ gap: 4 }}>{r.ch.map(c => <Badge key={c} tone={c === 'WhatsApp' ? 'green' : c === 'Email' ? 'blue' : 'grey'} dot={false} icon={ICON[c]}>{c}</Badge>)}</div>
          <span className="xs muted" style={{ width: 90 }}>{r.runs} runs this month</span>
          <Switch on={r.on} label={`Rule ${r.when}`} onChange={v => setRules(rs => rs.map(x => x.id === r.id ? { ...x, on: v } : x))} />
        </div></section>))}</div>}
      {tab === 'builder' && <div className="split">
        <Card title="New rule" footer={<button className="btn btn-primary" onClick={() => { setTab('rules'); toast('Rule saved and active', 'ok'); }}><Check size={15} />Save rule</button>}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <Field label="When this happens"><select className="select" defaultValue="Retention becomes due"><option>Retention becomes due</option><option>Purchase order approved</option><option>Measurement certified</option><option>NCR raised</option><option>Weekly advance requested above limit</option></select></Field>
            <Field label="Only if"><input className="input" defaultValue="Defects liability period has ended" /></Field>
            <Field label="Then"><select className="select" defaultValue="Create task for Accounts and notify MD"><option>Create task for Accounts and notify MD</option><option>Notify the record owner</option><option>Ask an AI agent to prepare the document</option></select></Field>
            <div className="row wrap" style={{ gap: 16 }}>{['In-app', 'Email', 'WhatsApp'].map(c => <label key={c} className="check"><input type="checkbox" defaultChecked={c !== 'Email'} />{c}</label>)}</div>
          </div>
        </Card>
        <Card title="WhatsApp preview" actions={<WhyPin text="Messages are sent from your company's WhatsApp Business account, with buttons to approve or open the record." />}>
          <div className="phone" style={{ width: 300, margin: '0 auto', borderWidth: 6 }}>
            <div style={{ background: '#075E54', color: '#fff', padding: '10px 14px', fontWeight: 700, fontSize: 13 }}>Streamlyned ERP</div>
            <div style={{ background: '#ECE5DD', padding: 12, minHeight: 230, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ background: '#fff', borderRadius: '0 10px 10px 10px', padding: '10px 12px', fontSize: 13, lineHeight: 1.5, maxWidth: 240 }}>
                <b>Retention due: ₹6.40 L</b><br />PRJ-23-087 Mill building re-sheeting. The defects period ended 31 Oct.<br /><span style={{ color: '#667' }}>Task created for Deepa Nair.</span>
                <div className="col" style={{ gap: 4, marginTop: 8 }}><span style={{ textAlign: 'center', color: '#128C7E', fontWeight: 700, borderTop: '1px solid #eee', paddingTop: 6 }}>Open in ERP</span></div>
              </div>
              <span style={{ alignSelf: 'flex-end', fontSize: 10.5, color: '#667' }}>09:00</span>
            </div>
          </div>
        </Card>
      </div>}
      {tab === 'log' && <Card flush title="Event log · today" actions={<span className="row small muted" style={{ gap: 6 }}><ListChecks size={14} />Every automated action is in the audit trail</span>}>
        <div className="table-wrap"><table className="table"><thead><tr><th>Time</th><th>Event</th><th>What happened</th><th>Channel</th></tr></thead>
          <tbody>{LOG.map(l => <tr key={l.at}><td className="mono">{l.at}</td><td className="strong">{l.ev}</td><td>{l.fired}</td><td><Badge tone="grey" dot={false} icon={ICON[l.ch]}>{l.ch}</Badge></td></tr>)}</tbody></table></div>
      </Card>}
    </>
  );
}
