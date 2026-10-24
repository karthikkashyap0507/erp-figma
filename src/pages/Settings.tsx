import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Lock, Link2, ShieldCheck, Database, KeyRound, RefreshCw, FileText, Plug, Minus } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Switch, Avatar, Field } from '../components/ui';
import { ROLES, canSee } from '../lib/roles';
import { COMPANIES } from '../data/core';
import { useApp, setState, toast } from '../lib/store';

const MODS: [string, Parameters<typeof canSee>[1]][] = [['Projects', 'projects'], ['DPR', 'dpr'], ['Procurement', 'procurement'], ['Stores', 'inventory'], ['QA / QC', 'qaqc'], ['Billing', 'billing'], ['Accounts', 'accounts'], ['MIS', 'mis'], ['Payroll', 'hr'], ['Sales', 'sales']];
const INTEGRATIONS = [
  { name: 'Tally', purpose: 'Accounts sync / export for teams that keep Tally running', note: 'Tally licence held by you', state: 'Connected' },
  { name: 'GST e-invoice & e-way bill', purpose: 'IRN, QR code and e-way bill from the invoice screen', note: 'Through a GST Suvidha Provider', state: 'Connected' },
  { name: 'WhatsApp Business', purpose: 'Alerts, approvals, DPR digest, payslips, payment reminders', note: 'Account in your name', state: 'Connected' },
  { name: 'Email', purpose: 'Documents, reminders and reports', note: 'Your domain email', state: 'Connected' },
  { name: 'Bank statements', purpose: 'Upload for bank reconciliation', note: 'Excel / CSV from your bank', state: 'Ready' },
  { name: 'IndiaMART', purpose: 'Pull leads straight into the CRM', note: 'Needs your IndiaMART lead-API access', state: 'Connected' },
  { name: 'Weighbridge / production data', purpose: 'Import production and tonnage for O&M billing', note: 'Excel / CSV import', state: 'Ready' }
];
const USERS = [['Shah Rukh', 'Managing Director', 'All'], ['Deepa Nair', 'Accounts / Finance', 'All'], ['Arjun Patil', 'Project Manager', 'PRJ-24-101, 103, 105'], ['Farhan Ali', 'Project Manager', 'PRJ-24-102, 104, 107, 108'], ['Suresh Gowda', 'Site Engineer', 'PRJ-24-101, 105'], ['Kavya Hegde', 'Quality Head', 'All'], ['Imran Sheikh', 'Purchase', 'All'], ['Lakshmi Rao', 'HR & Payroll', 'All']];

export default function Settings() {
  const role = useApp(s => s.role);
  const [tab, setTab] = useState<'roles' | 'users' | 'company' | 'numbering' | 'formats' | 'integrations' | 'security'>('roles');
  const [timeout, setTo] = useState(true);
  return (
    <>
      <PageHeader eyebrow="Platform" title="Settings & roles" sub="Users and roles, companies and GSTINs, numbering, document formats, integrations and security. There is no limit on users, companies, GSTINs, branches or sites." />
      <div className="grid g4">
        <Stat label="Users" value="64" meta="No licence limit" />
        <Stat label="Roles" value={ROLES.length + 1} meta="Including external dealers and vendors" />
        <Stat label="Companies · GSTINs" value={`${COMPANIES.length} · ${COMPANIES.length}`} meta="Unlimited" />
        <Stat label="Last backup" value="03:00 today" meta="Daily · kept 30 days" />
      </div>
      <Why points={['Each person sees only the modules, projects and figures their role needs, down to project and site level.', 'Salary and margin figures are hidden from roles that do not need them. Switch "View as" in the top bar to see the difference.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'roles', label: 'Roles & access' }, { key: 'users', label: 'Users', count: 64 }, { key: 'company', label: 'Companies & GSTINs' }, { key: 'numbering', label: 'Numbering' }, { key: 'formats', label: 'Document formats' }, { key: 'integrations', label: 'Integrations', count: INTEGRATIONS.length }, { key: 'security', label: 'Security & backup' }]} />

      {tab === 'roles' && <Card flush title="Role access matrix" sub="Configured with you during design" actions={<WhyPin text="Access follows the role, so a new site engineer sees the right screens on day one without anyone setting permissions by hand." />}>
        <div className="table-wrap"><table className="table dense"><thead><tr><th style={{ minWidth: 240 }}>Role</th>{MODS.map(m => <th key={m[0]} style={{ textAlign: 'center' }}>{m[0]}</th>)}<th style={{ textAlign: 'center' }}>Margin</th><th style={{ textAlign: 'center' }}>Salary</th><th /></tr></thead>
          <tbody>{ROLES.map(r => <tr key={r.key} className={role === r.key ? 'selected' : ''}><td><div className="cell-2"><span className="strong">{r.name}</span><span className="s">Approves: {r.approves}</span></div></td>
            {MODS.map(m => <td key={m[0]} style={{ textAlign: 'center' }}>{canSee(r, m[1]) ? <Check size={15} color="var(--green)" aria-label="Has access" /> : <Minus size={15} color="#C9D0DA" aria-label="No access" />}</td>)}
            <td style={{ textAlign: 'center' }}>{r.seesMargin ? <Check size={15} color="var(--green)" /> : <Lock size={13} color="var(--ink-3)" />}</td><td style={{ textAlign: 'center' }}>{r.seesSalary ? <Check size={15} color="var(--green)" /> : <Lock size={13} color="var(--ink-3)" />}</td>
            <td>{role === r.key ? <Badge tone="primary" dot={false}>Viewing</Badge> : <button className="btn btn-sm" onClick={() => { setState({ role: r.key }); toast(`Now viewing as ${r.name}`, 'info'); }}>View as</button>}</td></tr>)}
            <tr><td><div className="cell-2"><span className="strong">External — dealers, vendors</span><span className="s">Secure links only: dealer orders and statements, vendor quotes</span></div></td><td colSpan={MODS.length + 3}><span className="row small" style={{ gap: 6 }}><Link2 size={14} color="var(--ink-3)" />No login to the ERP; each link opens one document and expires</span></td></tr>
          </tbody></table></div>
      </Card>}

      {tab === 'users' && <Card flush title="Users" actions={<button className="btn btn-sm btn-primary" onClick={() => toast('Invite sent by WhatsApp and email', 'info')}><Plus size={13} />Invite user</button>}>
        <div className="table-wrap"><table className="table"><thead><tr><th>User</th><th>Role</th><th>Projects</th><th>Login</th><th>Status</th></tr></thead>
          <tbody>{USERS.map(u => <tr key={u[0]}><td><span className="row" style={{ gap: 8 }}><Avatar name={u[0]} size={26} /><b>{u[0]}</b></span></td><td>{u[1]}</td><td className="small">{u[2]}</td><td className="small">Mobile OTP</td><td><Badge tone="green">Active</Badge></td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'company' && <div className="grid g3">{COMPANIES.map(c => <Card key={c.gstin} title={c.name} sub={`${c.state} · GSTIN ${c.gstin}`}>
        <span className="label">Branches</span>{c.branches.map(b => <span key={b} className="small">{b}</span>)}
        <button className="btn btn-sm" onClick={() => toast('Branch form opened', 'info')}><Plus size={13} />Branch</button></Card>)}</div>}

      {tab === 'numbering' && <Card flush title="Document and voucher numbering" sub="Series per company and financial year">
        <div className="table-wrap"><table className="table"><thead><tr><th>Document</th><th>Pattern</th><th>Next number</th><th>Resets</th></tr></thead>
          <tbody>{[['Project', 'PRJ-{YY}-{###}', 'PRJ-24-109'], ['Quotation', 'QT-{YYYY}-{####}', 'QT-2026-0145'], ['Purchase requisition', 'PR-{YYYY}-{####}', 'PR-2026-0392'], ['Purchase order', 'PO-{YYYY}-{####}', 'PO-2026-0219'], ['Goods receipt', 'GRN-{YYYY}-{####}', 'GRN-2026-0520'], ['RA bill', 'RA-{PRJ}-{##}', 'RA-102-06'], ['Tax invoice', 'INV-{YYYY}-{####}', 'INV-2026-0413'], ['Payslip', 'PS-{MMM}-{YY}-{EMP}', 'PS-OCT-26-…']].map(r => <tr key={r[0]}><td className="strong">{r[0]}</td><td className="mono">{r[1]}</td><td className="mono">{r[2]}</td><td>Each financial year</td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'formats' && <div className="grid g3">{['Quotation', 'Purchase order', 'RA bill', 'Tax invoice', 'Payslip', 'Delivery challan'].map(f => (
        <Card key={f} title={f} sub="Your format, logo and company details">
          <div style={{ height: 150, borderRadius: 8, border: '1px solid var(--line)', background: '#fff', padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="row"><span className="brand-mark" style={{ width: 22, height: 22, fontSize: 11 }}>S</span><span className="xs strong">Deccan Ridge Engineering Pvt Ltd</span><span className="xs muted ml-auto">{f.toUpperCase()}</span></div>
            {[80, 64, 72, 50, 60].map((w, i) => <span key={i} style={{ height: 6, width: `${w}%`, background: 'var(--surface-3)', borderRadius: 3 }} />)}
          </div>
          <button className="btn btn-sm" onClick={() => toast(`${f} template opened for editing`, 'info')}><FileText size={13} />Edit format</button>
        </Card>))}</div>}

      {tab === 'integrations' && <Card flush title="Integrations" sub="Accounts in your company's name">
        <div className="table-wrap"><table className="table"><thead><tr><th>Integration</th><th>Purpose</th><th>Note</th><th>Status</th><th /></tr></thead>
          <tbody>{INTEGRATIONS.map(i => <tr key={i.name}><td className="strong"><span className="row" style={{ gap: 6 }}><Plug size={14} color="var(--ink-3)" />{i.name}</span></td><td className="small">{i.purpose}</td><td className="small muted">{i.note}</td><td><Badge tone={i.state === 'Connected' ? 'green' : 'blue'}>{i.state}</Badge></td><td><button className="btn btn-sm" onClick={() => toast(`${i.name}: connection tested OK`)}><RefreshCw size={13} />Test</button></td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'security' && <div className="grid g2">
        <Card title="Access & sessions">
          <div className="row"><KeyRound size={16} color="var(--ink-3)" /><span className="grow small">Individual logins with OTP verification</span><Badge tone="green">On</Badge></div>
          <div className="row"><Lock size={16} color="var(--ink-3)" /><span className="grow small">Automatic logout after 30 minutes of inactivity</span><Switch on={timeout} onChange={setTo} label="Automatic logout" /></div>
          <div className="row"><ShieldCheck size={16} color="var(--ink-3)" /><span className="grow small">Encryption in transit (HTTPS / TLS) and at rest</span><Badge tone="green">On</Badge></div>
          <div className="row"><Check size={16} color="var(--ink-3)" /><span className="grow small">Maker-checker on masters and payments</span><Badge tone="green">On</Badge></div>
        </Card>
        <Card title="Backup & your data">
          <dl className="kv"><dt>Backups</dt><dd>Daily, kept for 30 days</dd><dt>Last backup</dt><dd>Today 03:00 · verified</dd><dt>Recovery targets</dt><dd>No more than 24 hours of data at risk; service restored within 8 hours</dd><dt>Hosting</dt><dd>India region, in your company's cloud account</dd></dl>
          <button className="btn" onClick={() => toast('Full data export to Excel started', 'info')}><Database size={15} />Export all data to Excel</button>
          <Why compact>Your data is yours: a full export is available at any time, and the system runs in your own cloud account.</Why>
        </Card>
        <Card title="Approval matrix & alert rules">
          <Field label="Delegation"><input className="input" defaultValue="Shah Rukh → Deepa Nair · payments up to ₹10 L · 28 Oct – 2 Nov" /></Field>
          <div className="row" style={{ gap: 8 }}><Link to="/approvals" className="btn btn-sm">Open approval matrix</Link><Link to="/analytics" className="btn btn-sm">Open alert rules</Link></div>
        </Card>
      </div>}
    </>
  );
}
