import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Lock, ChevronRight, CircleCheck, Clock, Circle, TriangleAlert, Plus, ArrowUpRight } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Seg, Avatar } from '../components/ui';
import { money } from '../lib/format';
import { useApp, setState, decideApproval, toast } from '../lib/store';
import { roleByKey } from '../lib/roles';

const ROLE_OF: Record<string, string> = { 'Managing Director': 'md', Accounts: 'accounts', 'Project Manager': 'pm', 'Quality Head': 'quality', 'HR & Payroll': 'hr', Purchase: 'purchase', Stores: 'stores', Sales: 'sales', 'Site Engineer': 'site' };
const MATRIX = [
  ['Purchase requisition', 'Site engineer raises · PM approves', 'PM approves', 'PM, then MD above ₹5 L'],
  ['Purchase order', 'Purchase approves', 'Project Manager', 'Managing Director'],
  ['Quotation discount', 'Sales within 3%', 'Sales head up to 5%', 'Managing Director'],
  ['Variation', 'PM', 'PM', 'Managing Director'],
  ['Vendor payment batch', 'Accounts', 'Accounts', 'Managing Director'],
  ['Weekly advances', 'HR, ₹3,500 per worker', 'HR + Accounts', 'Accounts + MD'],
  ['Stock adjustment', 'Stores + PM', 'PM', 'Managing Director'],
  ['NCR closure', 'Quality Head', 'Quality Head', 'Quality Head'],
  ['Retention claim', 'Accounts', 'Accounts', 'Accounts + MD']
];

export default function Approvals() {
  const roleKey = useApp(s => s.role);
  const role = roleByKey(roleKey);
  const approvals = useApp(s => s.approvals);
  const tasks = useApp(s => s.tasks);
  const [tab, setTab] = useState<'inbox' | 'tasks' | 'matrix'>('inbox');
  const [scope, setScope] = useState<'mine' | 'all'>('all');
  const waitingRole = (a: typeof approvals[number]) => a.route.find(r => r.state === 'waiting')?.role || '';
  const mine = (a: typeof approvals[number]) => ROLE_OF[waitingRole(a)] === roleKey;
  const list = approvals.filter(a => scope === 'all' || mine(a));
  const pending = approvals.filter(a => a.status === 'Pending');
  return (
    <>
      <PageHeader num={21} eyebrow="Platform" title="Approvals & tasks" sub="Approval matrix by value and role, escalation, task assignment, due dates and a pending-task dashboard. Approvals are a state change with a trail, not a phone call." />
      <div className="grid g4">
        <Stat label="Waiting for approval" value={pending.length} meta={money(pending.reduce((a, x) => a + x.amount, 0))} />
        <Stat label="Waiting for you" value={approvals.filter(a => a.status === 'Pending' && mine(a)).length} meta={`As ${role.name}`} />
        <Stat label="Blocked by stage gates" value={approvals.filter(a => a.status === 'Blocked').length} valueColor="var(--red)" meta="Conditions not yet met" />
        <Stat label="Overdue tasks" value={tasks.filter(t => !t.done && t.overdueDays > 0).length} meta="3 escalated automatically" />
      </div>
      <Why points={['There is a trail of who approved what and when, so approvals stop happening over calls and messages that nobody can find later.', 'Work does not wait on people: overdue approvals and tasks escalate automatically to the next level.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'inbox', label: 'Approval inbox', count: pending.length }, { key: 'tasks', label: 'Tasks', count: tasks.filter(t => !t.done).length }, { key: 'matrix', label: 'Approval matrix' }]} />

      {tab === 'inbox' && <>
        <div className="row"><Seg options={[{ key: 'all', label: 'All approvals' }, { key: 'mine', label: `Waiting for ${role.name}` }]} value={scope} onChange={setScope} /></div>
        <div className="col" style={{ gap: 12 }}>
          {list.length === 0 && <Card><div className="empty">Nothing is waiting for {role.name} right now.</div></Card>}
          {list.map(a => {
            const can = a.status === 'Pending' && mine(a);
            return (
              <section key={a.id} className="card" style={{ borderColor: a.status === 'Blocked' ? '#F0C7C2' : undefined }}>
                <div className="card-b" style={{ gap: 10 }}>
                  <div className="row wrap" style={{ gap: 10 }}>
                    <Badge tone="primary" dot={false}>{a.kind}</Badge><span className="mono">{a.ref}</span><span className="xs muted">{a.project} · raised by {a.raisedBy} · {a.age} ago</span>
                    {a.escalated && <Badge tone="red" icon={<ArrowUpRight size={11} />}>Escalated</Badge>}
                    <span className="ml-auto"><Badge tone={a.status === 'Approved' ? 'green' : a.status === 'Rejected' || a.status === 'Blocked' ? 'red' : 'amber'}>{a.status}</Badge></span>
                  </div>
                  <div className="row wrap" style={{ gap: 12 }}><span className="strong" style={{ fontSize: 15.5 }}>{a.title}</span>{a.amount > 0 && <span className="strong num ml-auto" style={{ fontSize: 17 }}>{money(a.amount)}</span>}</div>
                  <div className="row wrap" style={{ gap: 6 }}>{a.route.map((r, i) => (
                    <span key={i} className="row" style={{ gap: 6 }}>
                      {i > 0 && <ChevronRight size={14} color="var(--ink-3)" />}
                      <span className="row small" style={{ gap: 6, padding: '4px 10px', borderRadius: 999, background: r.state === 'done' ? 'var(--green-soft)' : r.state === 'waiting' ? 'var(--amber-soft)' : 'var(--surface-3)', color: r.state === 'done' ? 'var(--green)' : r.state === 'waiting' ? 'var(--amber)' : 'var(--ink-3)', fontWeight: 600 }}>
                        {r.state === 'done' ? <CircleCheck size={13} /> : r.state === 'waiting' ? <Clock size={13} /> : <Circle size={13} />}{r.role} · {r.who}
                      </span>
                    </span>))}</div>
                  {a.note && <span className="small" style={{ color: 'var(--ink-2)' }}>{a.note}</span>}
                  {a.status === 'Blocked' && <div className="callout danger"><Lock size={15} style={{ flexShrink: 0 }} /><span>{a.blockReason}</span><Link to={`/${a.module}`} className="btn btn-sm ml-auto">Resolve</Link></div>}
                  {a.status === 'Pending' && (
                    <div className="row wrap" style={{ gap: 8 }}>
                      <button className="btn btn-success btn-sm" disabled={!can} onClick={() => { decideApproval(a.id, 'Approved'); toast(`${a.ref} approved by ${role.person}`); }}><Check size={14} />Approve</button>
                      <button className="btn btn-danger btn-sm" disabled={!can} onClick={() => { decideApproval(a.id, 'Rejected'); toast(`${a.ref} rejected and returned to ${a.raisedBy}`, 'warn'); }}><X size={14} />Reject</button>
                      <Link to={`/${a.module}`} className="btn btn-ghost btn-sm">Open record</Link>
                      {!can && <span className="xs muted">Waiting for {waitingRole(a)}. Switch "View as" to act on it.</span>}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </>}

      {tab === 'tasks' && <Card flush title="Tasks" sub="Assigned with due dates; overdue items escalate" actions={<button className="btn btn-sm" onClick={() => toast('New task form opened', 'info')}><Plus size={13} />Task</button>}>
        <div className="table-wrap"><table className="table"><thead><tr><th /><th>Task</th><th>Owner</th><th>Project</th><th>Due</th><th>Escalation</th></tr></thead>
          <tbody>{tasks.map(t => <tr key={t.id} style={{ opacity: t.done ? 0.55 : 1 }}>
            <td><input type="checkbox" checked={t.done} aria-label={`Mark ${t.title} done`} onChange={e => { const done = e.target.checked; setState(s => ({ tasks: s.tasks.map(x => x.id === t.id ? { ...x, done } : x) })); if (done) toast('Task completed'); }} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} /></td>
            <td className="strong" style={{ textDecoration: t.done ? 'line-through' : undefined }}>{t.title}</td>
            <td><span className="row" style={{ gap: 8 }}><Avatar name={t.owner} size={24} />{t.owner}</span></td><td className="code-link">{t.project}</td>
            <td>{t.overdueDays > 0 && !t.done ? <Badge tone="red" icon={<TriangleAlert size={11} />}>{t.due} · {t.overdueDays} d late</Badge> : <span className="nowrap">{t.due}</span>}</td>
            <td className="small">{t.escalation || '—'}</td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'matrix' && <Card flush title="Approval matrix" sub="By value, project and role, with delegation when someone is away" actions={<WhyPin text="The matrix is set once with you. After that, every document finds its own approver by value and role, so nothing is approved by the wrong person." />}>
        <div className="table-wrap"><table className="table"><thead><tr><th>Document</th><th>Up to ₹50,000</th><th>₹50,000 – ₹5 L</th><th>Above ₹5 L</th></tr></thead>
          <tbody>{MATRIX.map(m => <tr key={m[0]}><td className="strong">{m[0]}</td><td className="small">{m[1]}</td><td className="small">{m[2]}</td><td className="small">{m[3]}</td></tr>)}</tbody></table></div>
        <div className="card-f small muted">Delegation: Shah Rukh → Deepa Nair for payments up to ₹10 L, 28 Oct – 2 Nov.</div>
      </Card>}
    </>
  );
}
