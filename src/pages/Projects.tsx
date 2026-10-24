import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, ArrowRight, ArrowLeft, Upload, CircleCheck, Circle, Lock, FolderTree } from 'lucide-react';
import { PageHeader, Card, Why, Badge, Modal, Field, LineChip, StatusBadge, PctCell, Sensitive, Stat, Stages } from '../components/ui';
import { useApp, setState, toast } from '../lib/store';
import { money } from '../lib/format';
import { LINES, type LineKey, type Project } from '../data/core';

export default function Projects() {
  const projects = useApp(s => s.projects);
  const nav = useNavigate();
  const [line, setLine] = useState<'all' | LineKey>('all');
  const [wiz, setWiz] = useState(false);
  const [step, setStep] = useState(0);
  const [nl, setNl] = useState<LineKey>('salesService');
  const [f, setF] = useState({ name: 'Boiler house structure — supply & erection', client: 'Nandi Sugars Ltd', site: 'Haveri sugar plant', contract: 4860000, start: '01 Nov 2026', end: '15 Jan 2027', pm: 'Arjun Patil' });
  const [po, setPo] = useState(false);
  const shown = projects.filter(p => line === 'all' || p.line === line);
  const tpl = LINES.find(l => l.key === nl)!;
  const gatesOk = po;
  const create = () => {
    const id = String(109 + projects.length - 9);
    const p: Project = { id, code: `PRJ-24-${id}`, name: f.name, line: nl, client: f.client, site: f.site, pm: f.pm, engineer: 'Ravi Teja', start: f.start, end: f.end, contract: f.contract, budget: Math.round(f.contract * 0.86), committed: 0, actual: 0, billed: 0, received: 0, retention: 0, progress: 0, status: 'On track', stage: 0 };
    setState(s => ({ projects: [p, ...s.projects] }));
    setWiz(false); setStep(0); setPo(false);
    toast(`${p.code} created with the ${tpl.name} template`);
    nav(`/projects/${id}`);
  };
  return (
    <>
      <PageHeader num={5} eyebrow="Plan" title="Projects & controls" sub="Every project starts from its business-line template: Project → Department → Team → Job description, with WBS, BOQ, budget, schedule, variations and a live project P&L."
        actions={<button className="btn btn-primary" onClick={() => setWiz(true)}><Plus size={15} />New project</button>} />
      <div className="grid g4">
        <Stat label="Running projects" value={projects.filter(p => p.status !== 'Completed').length} meta={`${projects.length} including completed`} />
        <Stat label="Budget locked" value={money(projects.filter(p => p.status !== 'Completed').reduce((a, p) => a + p.budget, 0))} meta="Baseline for every purchase" />
        <Stat label="Committed + actual" value={money(projects.filter(p => p.status !== 'Completed').reduce((a, p) => a + p.committed + p.actual, 0))} meta="Open POs plus posted cost" />
        <Stat label="Behind schedule" value={projects.filter(p => p.status === 'Delayed' || p.status === 'At risk').length} valueColor="var(--red)" meta="Flagged by the Project Agent" />
      </div>
      <div className="row wrap" style={{ gap: 8 }}>
        <button className={'btn btn-sm' + (line === 'all' ? ' btn-primary' : '')} onClick={() => setLine('all')}>All lines · {projects.length}</button>
        {LINES.map(l => <button key={l.key} className={'btn btn-sm' + (line === l.key ? ' btn-primary' : '')} onClick={() => setLine(l.key)}>{l.no} {l.name} · {projects.filter(p => p.line === l.key).length}</button>)}
      </div>
      <Card flush>
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Project</th><th>Business line</th><th>Client · site</th><th>PM</th><th>Progress</th><th className="r">Contract</th><th className="r">Budget used</th><th className="r">Margin</th><th>Status</th></tr></thead>
          <tbody>{shown.map(p => {
            const used = Math.round(((p.committed + p.actual) / p.budget) * 100);
            const m = p.billed ? ((p.billed - p.actual) / p.billed) * 100 : 0;
            return (
              <tr key={p.id} className="clickable" onClick={() => nav(`/projects/${p.id}`)}>
                <td><div className="cell-2"><span className="code-link">{p.code}</span><span className="strong">{p.name}</span></div></td>
                <td><LineChip line={p.line} /></td>
                <td><div className="cell-2"><span>{p.client}</span><span className="s">{p.site}</span></div></td>
                <td className="nowrap">{p.pm}</td>
                <td><PctCell value={p.progress} tone={p.status === 'Delayed' ? 'red' : p.status === 'At risk' ? 'amber' : undefined} w={60} /></td>
                <td className="r">{money(p.contract)}</td>
                <td className="r" style={{ color: used > p.progress + 15 ? 'var(--red)' : undefined }}>{used}%</td>
                <td className="r"><Sensitive kind="margin">{p.billed ? `${m.toFixed(1)}%` : '—'}</Sensitive></td>
                <td><StatusBadge s={p.status} /></td>
              </tr>
            );
          })}</tbody>
        </table></div>
      </Card>
      <Why points={['Workshop and site jobs no longer get mixed up: each project carries its business line, so margins are reported line by line.', 'Budget used is compared with physical progress, so a project spending faster than it progresses is visible weeks before the final bill.']} />

      <Modal open={wiz} onClose={() => setWiz(false)} title={`New project · step ${step + 1} of 4`}
        footer={<>
          {step > 0 && <button className="btn" onClick={() => setStep(s => s - 1)}><ArrowLeft size={15} />Back</button>}
          {step < 3 ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Continue<ArrowRight size={15} /></button>
            : <button className="btn btn-primary" disabled={!gatesOk} onClick={create}><Check size={15} />Create project</button>}
        </>}>
        <div className="row" style={{ gap: 6 }}>{['Business line', 'Details', 'Structure', 'Gate check'].map((s, i) => <span key={s} className="row xs strong" style={{ gap: 6, color: i <= step ? 'var(--primary-ink)' : 'var(--ink-3)', flex: 1 }}><span style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--primary)' : 'var(--line)' }} /></span>)}</div>
        {step === 0 && <>
          <p className="small muted">Choosing the line loads the right stages, documents, approvals and billing basis.</p>
          <div className="grid g2" style={{ gap: 10 }}>
            {LINES.map(l => (
              <button key={l.key} onClick={() => setNl(l.key)} aria-pressed={nl === l.key} className="agent-card" style={{ textAlign: 'left', borderColor: nl === l.key ? 'var(--primary)' : undefined, background: nl === l.key ? 'var(--primary-soft)' : '#fff', padding: 12, gap: 6 }}>
                <LineChip line={l.key} /><span className="xs muted">{l.notes}</span><span className="xs"><b>Billing:</b> {l.billing}</span>
              </button>
            ))}
          </div>
          <div className="col" style={{ gap: 6 }}><span className="label">Stages this template loads</span><Stages stages={tpl.stages} current={-1} /></div>
        </>}
        {step === 1 && <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Project name" span={2}><input className="input" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Client"><input className="input" value={f.client} onChange={e => setF({ ...f, client: e.target.value })} /></Field>
          <Field label="Site"><input className="input" value={f.site} onChange={e => setF({ ...f, site: e.target.value })} /></Field>
          <Field label="Contract value (₹)"><input className="input num" type="number" value={f.contract} onChange={e => setF({ ...f, contract: Number(e.target.value) || 0 })} /></Field>
          <Field label="Project Manager"><select className="select" value={f.pm} onChange={e => setF({ ...f, pm: e.target.value })}><option>Arjun Patil</option><option>Farhan Ali</option></select></Field>
          <Field label="Start"><input className="input" value={f.start} onChange={e => setF({ ...f, start: e.target.value })} /></Field>
          <Field label="End"><input className="input" value={f.end} onChange={e => setF({ ...f, end: e.target.value })} /></Field>
        </div>}
        {step === 2 && <>
          <p className="small muted">Pre-filled from the {tpl.name} template. Edit freely before creating.</p>
          <div className="col" style={{ gap: 6, fontSize: 13.5 }}>
            <div className="row strong"><FolderTree size={15} color="var(--primary)" />{f.name}</div>
            {(nl === 'manpower' ? [['Deployment', ['Crew A — fitters', 'Crew B — riggers']]] : nl === 'consultation' ? [['Estimation', ['Costing team']]] : [['Workshop', ['Fabrication team', 'Painting team']], ['Site', ['Erection team', 'Safety team']], ['Quality', ['QC inspectors']]]).map(([d, teams]) => (
              <div key={d as string} style={{ paddingLeft: 22 }} className="col">
                <span className="strong small">Department · {d as string}</span>
                {(teams as string[]).map(t => <div key={t} style={{ paddingLeft: 22 }} className="col" ><span className="small">Team · {t}</span><span className="xs muted" style={{ paddingLeft: 22 }}>Job descriptions: {t.includes('Fabrication') ? 'cutting, fit-up, welding' : t.includes('Erection') ? 'rigging, bolting, alignment' : t.includes('QC') ? 'DPT, UT, dimensional check' : 'as per template'}</span></div>)}
              </div>
            ))}
          </div>
        </>}
        {step === 3 && <>
          <span className="label">Stage gate · Quotation → Project</span>
          {[['Quotation approved at the right value level', true, 'QT-2026-0144 · approved by Managing Director'], ['Business line chosen', true, tpl.name], ['Client PO or work order uploaded', po, po ? 'NS/PO/2026/1187.pdf' : 'Required before the project can be created']].map(([t, ok, d]) => (
            <div key={t as string} className="row-top" style={{ gap: 10 }}>{ok ? <CircleCheck size={18} color="var(--green)" /> : <Circle size={18} color="var(--ink-3)" />}<div className="col" style={{ gap: 0 }}><span className="strong small">{t as string}</span><span className="xs muted">{d as string}</span></div></div>
          ))}
          {!po ? <button className="btn" onClick={() => { setPo(true); toast('Client PO uploaded', 'info'); }}><Upload size={15} />Upload client PO</button> : <Badge tone="green">All conditions met</Badge>}
          {!gatesOk && <div className="callout warn"><Lock size={15} style={{ flexShrink: 0 }} /><span>The project cannot be created until every condition is met.</span></div>}
          <Why compact>A project that starts without an approved quotation and a client PO is how unbillable work begins. The gate makes that impossible.</Why>
        </>}
      </Modal>
    </>
  );
}
