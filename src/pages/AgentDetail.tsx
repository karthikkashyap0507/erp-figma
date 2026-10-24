import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, Check, X, ArrowRight, ShieldCheck, FileCheck, Sparkles } from 'lucide-react';
import { PageHeader, Card, Why, Badge, Stat, Timeline } from '../components/ui';
import { AGENTS, agentByKey } from '../data/ai';
import { ALL_ITEMS } from '../lib/nav';
import { toast } from '../lib/store';

export default function AgentDetail() {
  const { agent = 'project' } = useParams();
  const a = agentByKey(agent) || AGENTS[0];
  const nav = useNavigate();
  const [state, setStateMap] = useState<Record<string, 'approved' | 'dismissed'>>({});
  const open = a.findings.filter(f => !state[f.id]);
  return (
    <>
      <Link to="/ai" className="small row" style={{ gap: 4 }}><ArrowLeft size={14} />AI Manager</Link>
      <PageHeader eyebrow={`Works across: ${a.worksAcross}`} title={a.name} sub={a.does}
        chips={<span className="ico-box" style={{ background: a.color + '1A', color: a.color }}><Bot size={18} /></span>} />
      <div className="grid g4">
        {a.stats.map(s => <Stat key={s.label} label={s.label} value={s.value} />)}
        <Stat label="Waiting for a person" value={open.length} meta="Nothing posts without approval" />
      </div>
      <div className="split">
        <Card title="Findings and prepared work" sub="The agent suggests and prepares. You decide." flush>
          {a.findings.map(f => {
            const st = state[f.id];
            return (
              <div key={f.id} className="list-row" style={{ alignItems: 'flex-start', opacity: st ? 0.6 : 1 }}>
                <span className={`ico-box t-${f.tone}`}><Sparkles size={16} /></span>
                <div className="col grow" style={{ gap: 6 }}>
                  <div className="row wrap" style={{ gap: 8 }}><span className="strong">{f.title}</span>{st && <Badge tone={st === 'approved' ? 'green' : 'grey'}>{st === 'approved' ? 'Approved' : 'Dismissed'}</Badge>}</div>
                  <span className="small" style={{ color: 'var(--ink-2)', lineHeight: 1.5 }}>{f.detail}</span>
                  {f.prepared && <div className="callout info" style={{ padding: '8px 10px' }}><FileCheck size={15} style={{ flexShrink: 0 }} /><span><b>Prepared:</b> {f.prepared}</span></div>}
                  {!st && (
                    <div className="row wrap" style={{ gap: 6 }}>
                      {f.prepared && <button className="btn btn-sm btn-success" onClick={() => { setStateMap(m => ({ ...m, [f.id]: 'approved' })); toast(`Approved: ${f.prepared}`); }}><Check size={14} />Approve</button>}
                      <button className="btn btn-sm" onClick={() => nav(f.path)}>{f.action}<ArrowRight size={13} /></button>
                      <button className="btn btn-sm btn-ghost" onClick={() => { setStateMap(m => ({ ...m, [f.id]: 'dismissed' })); toast('Dismissed and noted in the audit log', 'info'); }}><X size={14} />Dismiss</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
        <div className="col" style={{ gap: 16 }}>
          <Card title="Modules it watches">
            {a.modules.map(m => { const it = ALL_ITEMS.find(i => i.path === m); return it ? <Link key={m} to={m} className="row small" style={{ color: 'var(--ink)' }}><it.icon size={15} color="var(--ink-3)" /><span className="grow">{it.label}</span><ArrowRight size={13} color="var(--ink-3)" /></Link> : null; })}
          </Card>
          <Card title="Agent audit log" sub="Every agent action is recorded">
            <Timeline items={[
              { when: 'Today 07:02', what: 'Read overnight DPRs and registers', tone: 'blue', icon: <Bot size={13} /> },
              { when: 'Today 07:05', what: `Raised ${a.findings.length} findings for review`, tone: 'amber', icon: <Sparkles size={13} /> },
              { when: 'Yesterday 18:40', who: 'Approved by a person', what: 'Prepared draft accepted and posted by its owner', tone: 'green', icon: <Check size={13} /> },
              { when: 'Yesterday 11:15', what: 'Answer restricted to the asker\'s role permissions', tone: 'grey', icon: <ShieldCheck size={13} /> }
            ]} />
          </Card>
        </div>
      </div>
      <Why>Each agent covers one area of the business, so problems are caught by a specialist, while the AI Manager sees across all of them. The agent works through the same database and approvals as your team, so it sees only what the user is allowed to see.</Why>
      <Card title="Other agents">
        <div className="row wrap" style={{ gap: 8 }}>{AGENTS.filter(x => x.key !== a.key).map(x => <Link key={x.key} to={`/ai/${x.key}`} className="btn btn-sm"><Bot size={14} color={x.color} />{x.name}</Link>)}</div>
      </Card>
    </>
  );
}
