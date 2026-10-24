import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Send, ArrowDown, ShieldCheck, Gauge, ArrowRight, Bot, CircleCheck, FileText } from 'lucide-react';
import { PageHeader, Card, Why, Badge, Progress, Seg } from '../components/ui';
import { AGENTS, BRIEF, SAMPLE_QUESTIONS, agentByKey, type AgentKey } from '../data/ai';
import { CASH_OPENING, CASH_WEEKS, RETENTIONS, ADVANCES, BILL_ESTIMATES, EXPIRIES } from '../data/finance';
import { useApp, toast } from '../lib/store';
import { roleByKey } from '../lib/roles';
import { money, inr } from '../lib/format';

interface Msg { from: 'user' | 'ai'; text?: string; body?: ReactNode; agent?: AgentKey; sources?: string[]; }

function Src({ s }: { s: string }) { return <span className="src"><FileText size={11} />{s}</span>; }

function answer(q: string, seesMargin: boolean): Msg {
  const t = q.toLowerCase();
  if (/behind|schedule|delay/.test(t)) return { from: 'ai', agent: 'project', sources: ['DPR 12–23 Oct', 'PRJ-24-107', 'PRJ-24-102', 'Manpower deployment'], body: <>
    <p>Two projects are behind this week:</p>
    <table className="table dense"><thead><tr><th>Project</th><th className="r">Behind</th><th>Why</th></tr></thead><tbody>
      <tr><td><b>PRJ-24-107</b> Cooling tower</td><td className="r">18 days</td><td>Bolting crew short by 6 people for 9 days; 3 hold points waiting for inspection</td></tr>
      <tr><td><b>PRJ-24-102</b> Kiln repair</td><td className="r">6 days</td><td>Client has not yet sent 4 MT of the shell plate it supplies; the RA 05 measurement sheet is unsigned</td></tr>
    </tbody></table>
    <p>Suggested action: move crew C-07 (6 riggers, idle at Raichur since 22 Oct) to PRJ-24-107. A resource request is drafted for the Project Manager to approve.</p></> };
  if (/retention/.test(t)) {
    const due = RETENTIONS.filter(r => r.state !== 'Held');
    return { from: 'ai', agent: 'finance', sources: ['Retention register', 'PRJ-23-087', 'Client-steel register'], body: <>
      <p><b>{money(due.reduce((a, r) => a + r.held, 0))}</b> is due for release this month, out of {money(RETENTIONS.reduce((a, r) => a + r.held, 0))} held across 4 projects.</p>
      <table className="table dense"><thead><tr><th>Project</th><th className="r">Held</th><th>Status</th></tr></thead><tbody>
        {RETENTIONS.map(r => <tr key={r.project}><td><b>{r.project}</b> {r.name}</td><td className="r">{money(r.held)}</td><td>{r.state === 'Blocked' ? 'Due 31 Oct, blocked: steel reconciliation not accepted' : r.due}</td></tr>)}
      </tbody></table>
      <p>To release PRJ-23-087, Accounts needs to accept the client-steel reconciliation (task assigned to Deepa Nair, due 25 Oct). The retention claim is drafted and goes out the moment that is done.</p></> };
  }
  if (/cash|position|four weeks|4 weeks|liquidity/.test(t)) return { from: 'ai', agent: 'finance', sources: ['Bank balance 24 Oct', 'Billing estimate Nov', 'Payables', 'Payroll draft', 'GST & PF calendar'], body: <>
    <p>Cash and bank today: <b>{money(CASH_OPENING)}</b>. Week by week:</p>
    <table className="table dense"><thead><tr><th>Week</th><th className="r">In</th><th className="r">Out</th><th className="r">Closing</th></tr></thead><tbody>
      {CASH_WEEKS.map(w => <tr key={w.wk}><td><b>{w.wk}</b> {w.dates}</td><td className="r">{money(w.inflow)}</td><td className="r">{money(w.outflow)}</td><td className="r" style={{ color: w.close < 2000000 ? 'var(--red)' : undefined }}><b>{money(w.close)}</b></td></tr>)}
    </tbody></table>
    <p>The low point is <b>₹18.6 L in W46</b>, when October payroll, GST and PF/ESI fall in the same fortnight. Collecting the ₹21.6 L Kaveri Power owes (₹15.8 L of it over 60 days) by 10 Nov keeps cash above ₹35 L. A reminder is drafted for Accounts to send.</p></> };
  if (/advance/.test(t)) {
    const open = ADVANCES.filter(a => a.given > a.recovered);
    return { from: 'ai', agent: 'hr', sources: ['Weekly advance register', 'Attendance', 'Final settlements'], body: <>
      <p><b>{open.length} workers</b> still owe {inr(open.reduce((a, x) => a + x.given - x.recovered, 0))}:</p>
      <table className="table dense"><thead><tr><th>Worker</th><th>Site</th><th className="r">Outstanding</th><th>Recovery</th></tr></thead><tbody>
        {open.map(a => <tr key={a.code}><td><b>{a.name}</b> {a.code}</td><td>{a.site}</td><td className="r">{inr(a.given - a.recovered)}</td><td>{a.status === 'Left' ? 'Left: recover from final settlement' : 'Weekly deduction from wages'}</td></tr>)}
      </tbody></table></> };
  }
  if (/billing estimate|billing|estimate/.test(t)) return { from: 'ai', agent: 'project', sources: ['DPR quantities', 'Certified measurements', 'O&M tonnage run-rate', 'Manpower attendance'], body: <>
    <p>Draft billing estimate for November across 7 running projects: <b>{money(BILL_ESTIMATES.reduce((a, b) => a + b.engineer, 0))}</b> (site view) against <b>{money(BILL_ESTIMATES.reduce((a, b) => a + b.accounts, 0))}</b> (Accounts view).</p>
    <table className="table dense"><thead><tr><th>Project</th><th>Basis</th><th className="r">Estimate</th></tr></thead><tbody>
      {BILL_ESTIMATES.map(b => <tr key={b.project}><td><b>{b.project}</b></td><td>{b.basis}</td><td className="r">{money(b.engineer)}</td></tr>)}
    </tbody></table>
    <p>Two need a decision: PRJ-24-102 (the RA 05 sheet is unsigned) and PRJ-24-107 (behind schedule). The draft is saved as BE-NOV-26 for site engineers and Accounts to confirm.</p></> };
  if (/vehicle|licen|expire|insurance|document/.test(t)) return { from: 'ai', agent: 'procurement', sources: ['Fleet documents', 'Driver register', 'Statutory licences', 'Hire agreements'], body: <>
    <p>{EXPIRIES.length} items expire in the next 30 days:</p>
    <table className="table dense"><thead><tr><th>Item</th><th>Expires</th><th>Owner</th></tr></thead><tbody>
      {EXPIRIES.map(e => <tr key={e.item}><td><b>{e.item}</b></td><td>{e.date} ({e.days} days)</td><td>{e.owner}</td></tr>)}
    </tbody></table>
    <p>A renewal task is open for each item, and WhatsApp reminders go to the owners at 15, 7 and 2 days.</p></> };
  if (/margin|profit/.test(t)) return { from: 'ai', agent: 'finance', sources: ['Project P&L', 'Cost centres'], body: seesMargin ? <p>Gross margin on billed work is 14.2% across all projects. Consultation is highest at 41.5%, and the cooling tower refurbishment is lowest at −25.6% because it is behind schedule with cost ahead of billing.</p> : <p>Margin figures are not available for your role. I can tell you about progress, quantities and schedule instead.</p> };
  return { from: 'ai', agent: 'workflow', body: <><p>I answer from your ERP records only, not general knowledge, and only within what your role can see. Try one of these:</p><ul style={{ margin: 0, paddingLeft: 18 }}>{SAMPLE_QUESTIONS.slice(0, 4).map(s => <li key={s}>{s}</li>)}</ul></> };
}

export default function AIManager() {
  const role = roleByKey(useApp(s => s.role));
  const nav = useNavigate();
  const [msgs, setMsgs] = useState<Msg[]>(() => [{ from: 'ai', agent: 'workflow', body: <p>Good morning, {role.person}. I watch every module and route your question to the right agent. Every answer comes from your own records and stays within what the <b>{role.name}</b> role is allowed to see.</p> }, { from: 'user', text: SAMPLE_QUESTIONS[0] }, answer(SAMPLE_QUESTIONS[0], role.seesMargin)]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [brief, setBrief] = useState<'daily' | 'weekly'>('daily');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [msgs, typing]);
  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs(m => [...m, { from: 'user', text: q }]);
    setInput(''); setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs(m => [...m, answer(q, role.seesMargin)]); }, 700);
  };
  return (
    <>
      <PageHeader eyebrow="AI layer · Section 6" title="AI Manager" sub="A central AI Manager understands what is happening across the business, coordinates a specialist agent for each area, monitors for problems and recommends what to do next."
        chips={<Badge tone="primary" dot={false}>Understands · Coordinates · Monitors · Recommends</Badge>} />

      <div className="split-wide">
        <section className="card" style={{ minHeight: 560 }}>
          <div className="card-h"><span className="ai-avatar"><Sparkles size={16} /></span><div className="col grow" style={{ gap: 0 }}><h2>Ask in plain language</h2><span className="sub">Answers grounded in your ERP data · respects your role's permissions</span></div></div>
          <div className="card-b" style={{ background: 'var(--surface-2)', flex: 1, maxHeight: 620, overflowY: 'auto' }}>
            <div className="chat">
              {msgs.map((m, i) => m.from === 'user' ? <div key={i} className="msg-user">{m.text}</div> : (
                <div key={i} className="msg-ai">
                  <span className="ai-avatar"><Sparkles size={15} /></span>
                  <div className="bubble" style={{ minWidth: 0 }}>
                    {m.agent && <span className="xs strong row" style={{ gap: 6, color: agentByKey(m.agent)!.color }}><Bot size={13} />Routed to {agentByKey(m.agent)!.name}</span>}
                    <div className="table-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{m.body}</div>
                    {m.sources && <div className="row wrap" style={{ gap: 6 }}><span className="xs muted">Sources</span>{m.sources.map(s => <Src key={s} s={s} />)}</div>}
                  </div>
                </div>
              ))}
              {typing && <div className="msg-ai"><span className="ai-avatar"><Sparkles size={15} /></span><div className="bubble muted small">Checking your records…</div></div>}
              <div ref={endRef} />
            </div>
          </div>
          <div className="card-f" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
            <div className="row wrap" style={{ gap: 6 }}>{SAMPLE_QUESTIONS.map(q => <button key={q} className="btn btn-sm" style={{ borderRadius: 999, fontWeight: 500 }} onClick={() => ask(q)}>{q}</button>)}</div>
            <form className="row" onSubmit={e => { e.preventDefault(); ask(input); }}>
              <input className="input" aria-label="Ask the AI Manager" placeholder="Ask about projects, cash, retention, advances, vehicles…" value={input} onChange={e => setInput(e.target.value)} style={{ height: 46 }} />
              <button className="btn btn-primary btn-lg" type="submit" aria-label="Send"><Send size={17} /></button>
            </form>
          </div>
        </section>

        <div className="col" style={{ gap: 16 }}>
          <Card title="Management brief" actions={<Seg options={[{ key: 'daily', label: 'Daily' }, { key: 'weekly', label: 'Weekly' }]} value={brief} onChange={setBrief} />}>
            {(brief === 'daily' ? BRIEF : [
              { tone: 'green' as const, text: 'Billed ₹1.53 Cr in October, 4.8% up on September.' },
              { tone: 'amber' as const, text: 'Two projects are behind schedule; resource moves suggested.' },
              { tone: 'red' as const, text: 'Statutory: PF/ESI overdue; labour licence renewal due 20 Nov.' },
              { tone: 'blue' as const, text: 'Pipeline: ₹6.2 Cr in active leads; SMS-1 slag tender closes 06 Nov.' }
            ]).map((b, i) => <div key={i} className="row-top small" style={{ gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0, background: b.tone === 'red' ? 'var(--crit)' : b.tone === 'amber' ? 'var(--warn)' : b.tone === 'green' ? 'var(--good)' : 'var(--c1)' }} /><span>{b.text}</span></div>)}
            <button className="btn btn-sm" onClick={() => toast('Brief sent to Shah Rukh on WhatsApp and email')}><Send size={14} />Send to WhatsApp</button>
          </Card>
          <Card title="Guardrails" sub="How the AI layer is kept safe">
            {['Agents work only through the Streamlyned ERP database and workflow engine — never around it', "Every answer respects the role-based permissions of the person asking", 'Agents suggest and prepare; a person approves anything that posts, pays, files or sends', 'Every agent action is recorded in the audit log', 'AI cost is held under a monthly usage cap; the AI provider can be changed without rebuilding', 'AI providers are chosen whose terms do not use your data to train their models'].map(g => (
              <div key={g} className="row-top small" style={{ gap: 8 }}><ShieldCheck size={15} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} /><span>{g}</span></div>
            ))}
          </Card>
          <Card title="Usage this month" sub="Held under a monthly cap">
            <div className="row"><Gauge size={16} color="var(--ink-3)" /><span className="small grow">₹4,860 of ₹10,000 cap</span><b className="small">49%</b></div>
            <Progress value={49} lg />
            <span className="xs muted">2,140 questions · 386 bills and BOQs read · 270 DPR summaries</span>
          </Card>
        </div>
      </div>
      <Why points={['Anyone can get an answer without waiting for a report: the MD, a site engineer or the CA asks in plain language.', 'Every answer shows its sources, so it can be checked against the record behind it.', 'Agents prepare the work, such as a bill, a payroll draft or a reorder, but nothing posts, pays or sends until a person approves it.']} />

      <Card title="How the AI layer is organised" sub="Central AI Manager → 7 specialist agents → the shared ERP database and workflow engine">
        <div className="ai-grad" style={{ borderRadius: 12, padding: '14px 18px', textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: 16 }}>Central AI Manager</div><div style={{ fontSize: 11, letterSpacing: '.14em', color: '#AFC0F0', marginTop: 2 }}>UNDERSTANDS · COORDINATES · MONITORS · RECOMMENDS</div></div>
        <div style={{ textAlign: 'center', color: 'var(--ink-3)' }}><ArrowDown size={18} /></div>
        <div className="grid g4">
          {AGENTS.map(a => (
            <Link key={a.key} to={`/ai/${a.key}`} className="agent-card">
              <div className="row"><span className="ico-box" style={{ background: a.color + '1A', color: a.color }}><Bot size={17} /></span><span className="strong grow">{a.name}</span><ArrowRight size={14} color="var(--ink-3)" /></div>
              <span className="xs muted">{a.area}</span>
              <div className="row" style={{ gap: 14 }}>{a.stats.slice(0, 2).map(s => <span key={s.label} className="col" style={{ gap: 0 }}><b>{s.value}</b><span className="xs muted">{s.label}</span></span>)}</div>
              <div className="row small" style={{ gap: 6, color: a.findings.some(f => f.tone === 'red') ? 'var(--red)' : 'var(--amber)' }}><CircleCheck size={13} />{a.findings.length} items for review</div>
            </Link>
          ))}
          <div className="agent-card" style={{ background: 'var(--surface-2)', cursor: 'default' }} onClick={() => nav('/automation')}>
            <span className="strong">Shared Streamlyned ERP database & workflow engine</span>
            <span className="small muted">Role-based permissions · Approvals · Audit logs · Notifications</span>
          </div>
        </div>
      </Card>
    </>
  );
}
