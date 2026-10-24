import { useState } from 'react';
import { Camera, Send, CircleCheck, Clock, TriangleAlert, Sparkles, ShieldCheck, Monitor, Smartphone, Plus, Minus } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Badge, Stat, Seg, Field, Progress } from '../components/ui';
import { ColumnChart } from '../components/charts';
import { inr, money } from '../lib/format';
import { toast } from '../lib/store';

const WORK = [
  { boq: '3.02', item: 'Erection at site incl. cranage', uom: 'MT', rate: 14200, total: 180, before: 61.4, today: 2.6 },
  { boq: '4.01', item: 'Gratings and handrails', uom: 'm²', rate: 2850, total: 620, before: 128, today: 12 },
  { boq: '3.04', item: 'Truss T3 rework (NCR-0412)', uom: 'MT', rate: 0, total: 18, before: 6, today: 0 }
];
const CREWS = [{ crew: 'C-03 Erection', heads: 21 }, { crew: 'Welders (6G)', heads: 4 }, { crew: 'Helpers', heads: 6 }];
const SITES = [
  { site: 'Raichur TPS · PRJ-24-103', by: 'Ravi Teja', at: '—', state: 'Pending' },
  { site: 'Ballari works · PRJ-24-101', by: 'Suresh Gowda', at: '18:05', state: 'Submitted' },
  { site: 'Kalaburagi · PRJ-24-102', by: 'Naveen Kumar', at: '19:22', state: 'Submitted' },
  { site: 'Hospet SMS-2 · PRJ-24-104', by: 'Venkatesh Reddy', at: '07:10', state: 'Submitted' },
  { site: 'Ballari BF-2 · PRJ-24-105', by: 'Suresh Gowda', at: '18:15', state: 'Submitted' },
  { site: 'Raichur TPS · PRJ-24-107', by: 'Ravi Teja', at: '—', state: 'Pending' },
  { site: 'Hospet rolling mill · PRJ-24-108', by: 'Venkatesh Reddy', at: '—', state: 'Pending' }
];

export default function DPR() {
  const small = typeof window !== 'undefined' && window.innerWidth <= 680;
  const [view, setView] = useState<'desk' | 'phone'>(small ? 'phone' : 'desk');
  const [work, setWork] = useState(WORK);
  const [crews, setCrews] = useState(CREWS);
  const [hydra, setHydra] = useState(9);
  const [delay, setDelay] = useState('Waiting for client hot-work permit on truss T4 (2 h)');
  const [safety, setSafety] = useState({ toolbox: true, ppe: true, incidents: 0, nearMiss: 1 });
  const [submitted, setSubmitted] = useState(false);
  const heads = crews.reduce((a, c) => a + c.heads, 0);
  const value = work.reduce((a, w) => a + w.today * w.rate, 0);
  const submit = () => { setSubmitted(true); toast('DPR submitted for PRJ-24-103 · 24 Oct. Project Agent summary sent to the PM on WhatsApp.'); };
  const form = (
    <div className="col" style={{ gap: 16 }}>
      <div className="form-grid">
        <Field label="Project"><select className="select"><option>PRJ-24-103 · Conveyor gallery</option></select></Field>
        <Field label="Date"><input className="input" defaultValue="24 Oct 2026" /></Field>
        <Field label="Weather"><select className="select"><option>Clear</option><option>Rain — work stopped</option></select></Field>
      </div>
      <div className="col" style={{ gap: 8 }}><span className="label">Work done today (against BOQ)</span>
        <div className="table-wrap"><table className="table dense"><thead><tr><th>BOQ</th><th>Item</th><th className="r">Before</th><th className="r">Today</th><th>Cumulative</th></tr></thead>
          <tbody>{work.map(w => <tr key={w.boq}><td className="mono">{w.boq}</td><td className="strong">{w.item}{w.rate === 0 && <> <Badge tone="red">Not billable</Badge></>}</td><td className="r">{w.before} {w.uom}</td>
            <td className="r"><input className="input input-sm num" type="number" step="0.1" value={w.today} style={{ width: 80 }} onChange={e => setWork(ws => ws.map(x => x.boq === w.boq ? { ...x, today: Number(e.target.value) || 0 } : x))} aria-label={`Quantity today for ${w.item}`} /></td>
            <td><div className="meter-row"><Progress value={((w.before + w.today) / w.total) * 100} width={70} /><span className="xs num">{Math.round(((w.before + w.today) / w.total) * 100)}%</span></div></td></tr>)}</tbody></table></div>
      </div>
      <div className="grid g2">
        <div className="col" style={{ gap: 8 }}><span className="label">Manpower</span>
          {crews.map(c => <div key={c.crew} className="row"><span className="small grow">{c.crew}</span><button className="btn btn-sm btn-icon" aria-label={`Fewer in ${c.crew}`} onClick={() => setCrews(cs => cs.map(x => x.crew === c.crew ? { ...x, heads: Math.max(0, x.heads - 1) } : x))}><Minus size={13} /></button><span className="strong num" style={{ width: 28, textAlign: 'center' }}>{c.heads}</span><button className="btn btn-sm btn-icon" aria-label={`More in ${c.crew}`} onClick={() => setCrews(cs => cs.map(x => x.crew === c.crew ? { ...x, heads: x.heads + 1 } : x))}><Plus size={13} /></button></div>)}
        </div>
        <div className="col" style={{ gap: 8 }}><span className="label">Equipment hours</span>
          <div className="row"><span className="small grow">Hydra crane 23 T (HIRE-0026)</span><input className="input input-sm num" type="number" value={hydra} onChange={e => setHydra(Number(e.target.value) || 0)} style={{ width: 70 }} aria-label="Hydra hours" /><span className="xs muted">h</span></div>
          <div className="row"><span className="small grow">Welding inverters × 6</span><input className="input input-sm num" type="number" defaultValue={42} style={{ width: 70 }} aria-label="Welding inverter hours" /><span className="xs muted">h</span></div>
          <span className="label" style={{ marginTop: 4 }}>Material consumed</span>
          <div className="row"><span className="small grow">HSFG bolts M20</span><input className="input input-sm num" type="number" defaultValue={180} style={{ width: 70 }} aria-label="Bolts used" /><span className="xs muted">nos</span></div>
          <div className="row"><span className="small grow">E7018 electrodes</span><input className="input input-sm num" type="number" defaultValue={14} style={{ width: 70 }} aria-label="Electrodes used" /><span className="xs muted">kg</span></div>
        </div>
      </div>
      <div className="grid g2">
        <Field label="Delays"><textarea className="textarea" value={delay} onChange={e => setDelay(e.target.value)} style={{ minHeight: 64 }} /></Field>
        <div className="col" style={{ gap: 8 }}><span className="label">Safety</span>
          <label className="check"><input type="checkbox" checked={safety.toolbox} onChange={e => setSafety({ ...safety, toolbox: e.target.checked })} />Toolbox talk held</label>
          <label className="check"><input type="checkbox" checked={safety.ppe} onChange={e => setSafety({ ...safety, ppe: e.target.checked })} />PPE checked for all crew</label>
          <div className="row small">Incidents <input className="input input-sm num" type="number" value={safety.incidents} onChange={e => setSafety({ ...safety, incidents: Number(e.target.value) || 0 })} style={{ width: 60 }} aria-label="Incidents" /> Near misses <input className="input input-sm num" type="number" value={safety.nearMiss} onChange={e => setSafety({ ...safety, nearMiss: Number(e.target.value) || 0 })} style={{ width: 60 }} aria-label="Near misses" /></div>
        </div>
      </div>
      <div className="col" style={{ gap: 8 }}><span className="label">Photos & measurements</span>
        <div className="row wrap" style={{ gap: 8 }}>{['Truss T4 lifted', 'Grating bay 6', 'Bolt torque check'].map(p => <div key={p} style={{ width: 120, height: 84, borderRadius: 8, background: 'repeating-linear-gradient(135deg,#EEF2F7 0 8px,#E3E8F0 8px 16px)', display: 'flex', alignItems: 'flex-end', padding: 6, fontSize: 11, color: 'var(--ink-2)' }}><Camera size={11} style={{ marginRight: 4 }} />{p}</div>)}
          <button className="btn" style={{ width: 120, height: 84 }} onClick={() => toast('Camera opened (on phone)', 'info')}><Camera size={16} />Add</button></div>
      </div>
    </div>
  );
  return (
    <>
      <PageHeader num={13} eyebrow="Execute" title="Site operations — DPR & production" sub="Daily work, production output, manpower, equipment, material, photos, delays, safety and measurements, entered once at site and used everywhere."
        actions={<Seg options={[{ key: 'desk', label: 'Desktop' }, { key: 'phone', label: 'Phone view' }]} value={view} onChange={setView} />} />
      <div className="grid g4">
        <Stat label="DPRs today" value={`${SITES.filter(s => s.state === 'Submitted').length + (submitted ? 1 : 0)} of ${SITES.length}`} meta={`${SITES.filter(s => s.state !== 'Submitted').length - (submitted ? 1 : 0)} pending · reminder at 19:00`} />
        <Stat label="Man-hours today" value={(heads * 8).toLocaleString('en-IN')} meta="This site" />
        <Stat label="Billable work today" value={money(value)} meta="Qty × BOQ rate, this site" />
        <Stat label="Safety" value={safety.incidents ? `${safety.incidents} incident` : 'No incidents'} valueColor={safety.incidents ? 'var(--red)' : 'var(--green)'} meta={`${safety.nearMiss} near miss reported`} />
      </div>
      <Why points={['Progress, production and labour cost reach management the same evening, not days later on WhatsApp and paper.', "Quantities entered here move the BOQ, the billing estimate, the client bill and the project's productivity, so nothing is typed twice."]} />
      <div className="split">
        {view === 'desk' ? (
          <Card title="DPR · PRJ-24-103 · 24 Oct" sub="Ravi Teja · Raichur TPS" actions={submitted ? <Badge tone="green">Submitted 18:40</Badge> : <Badge tone="amber">Draft</Badge>} footer={<><span className="small muted grow">Summary: {heads} people · {hydra} crane hours · {inr(value)} billable</span><button className="btn btn-primary" disabled={submitted} onClick={submit}><Send size={15} />{submitted ? 'Submitted' : 'Submit DPR'}</button></>}>
            {form}
          </Card>
        ) : (
          <div className="row" style={{ justifyContent: 'center' }}>
            <div className={small ? 'card' : 'phone'} style={small ? { width: '100%', overflow: 'hidden' } : undefined}>
              <div style={{ background: 'var(--nav)', color: '#fff', padding: '14px 16px' }}><div style={{ fontWeight: 700 }}>DPR · 24 Oct</div><div style={{ fontSize: 12, color: '#B9C5E8' }}>PRJ-24-103 · Raichur TPS</div></div>
              <div className="col" style={{ padding: 14, gap: 12 }}>
                {work.slice(0, 2).map(w => <div key={w.boq} className="card" style={{ padding: 12, gap: 8 }}><span className="small strong">{w.boq} · {w.item}</span><div className="row"><span className="xs muted grow">Today ({w.uom})</span><button className="btn btn-sm btn-icon" aria-label="Less" onClick={() => setWork(ws => ws.map(x => x.boq === w.boq ? { ...x, today: Math.max(0, +(x.today - 0.5).toFixed(1)) } : x))}><Minus size={13} /></button><b className="num" style={{ width: 40, textAlign: 'center' }}>{w.today}</b><button className="btn btn-sm btn-icon" aria-label="More" onClick={() => setWork(ws => ws.map(x => x.boq === w.boq ? { ...x, today: +(x.today + 0.5).toFixed(1) } : x))}><Plus size={13} /></button></div></div>)}
                <div className="card" style={{ padding: 12, gap: 6 }}><span className="small strong">Manpower</span><span className="small">{heads} people on site</span></div>
                <button className="btn btn-block" style={{ height: 48 }}><Camera size={16} />Add photo</button>
                <button className="btn btn-primary btn-block" style={{ height: 50 }} disabled={submitted} onClick={submit}><Send size={16} />{submitted ? 'Submitted' : 'Submit DPR'}</button>
                <span className="xs muted" style={{ textAlign: 'center' }}>Works offline; sends when the phone reconnects</span>
              </div>
            </div>
          </div>
        )}
        <div className="col" style={{ gap: 16 }}>
          <Card title="Today's DPRs" flush actions={<WhyPin text="Missing DPRs are chased automatically at 19:00 on WhatsApp, so management has every site's report by night." />}>
            {SITES.map(s => { const st = s.site.includes('PRJ-24-103') && submitted ? 'Submitted' : s.state; return (
              <div key={s.site} className="list-row" style={{ padding: '10px 16px' }}>{st === 'Submitted' ? <CircleCheck size={16} color="var(--green)" /> : <Clock size={16} color="var(--amber)" />}<div className="col grow" style={{ gap: 0 }}><span className="small strong">{s.site}</span><span className="xs muted">{s.by} · {st === 'Submitted' ? (s.at === '—' ? 'just now' : s.at) : 'not yet'}</span></div></div>); })}
          </Card>
          <Card title="Project Agent summary" sub="Yesterday's DPRs, read overnight">
            <div className="row-top small" style={{ gap: 8 }}><TriangleAlert size={15} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} /><span>PRJ-24-107: bolting crew short by 6 for the 9th day; 18 days behind.</span></div>
            <div className="row-top small" style={{ gap: 8 }}><Sparkles size={15} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} /><span>PRJ-24-103: 46 man-days on truss T3 rework with no billable quantity.</span></div>
            <div className="row-top small" style={{ gap: 8 }}><ShieldCheck size={15} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} /><span>All sites: toolbox talks held; 1 near miss logged at Raichur.</span></div>
          </Card>
          <Card title="Slag handled · PRJ-24-104" sub="O&M production, tonnes per day">
            <ColumnChart aria="Tonnes of slag handled per day" categories={['18', '19', '20', '21', '22', '23', '24']} series={[{ name: 'Tonnes', color: 'var(--c1)', values: [880, 912, 864, 930, 896, 902, 856] }]} fmt={n => `${Math.round(n)} t`} height={170} />
          </Card>
        </div>
      </div>
    </>
  );
}
