import { useState } from 'react';
import { ArrowRightLeft, Sparkles, Fingerprint, Check, TriangleAlert } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Progress } from '../components/ui';
import { HBars, Legend } from '../components/charts';
import { inr, money } from '../lib/format';
import { toast } from '../lib/store';

interface Crew { code: string; name: string; trade: string; site: string; project: string; heads: number; need: number; present: number; ot: number; state: 'Working' | 'Idle' | 'Short'; }
const CREWS: Crew[] = [
  { code: 'C-01', name: 'Fabrication A', trade: 'Fitters, welders', site: 'Ballari works', project: 'PRJ-24-101', heads: 26, need: 26, present: 25, ot: 18, state: 'Working' },
  { code: 'C-03', name: 'Erection', trade: 'Riggers, fitters, welders', site: 'Raichur TPS', project: 'PRJ-24-103', heads: 22, need: 22, present: 21, ot: 12, state: 'Working' },
  { code: 'C-05', name: 'Shell repair', trade: 'Welders, gas cutters', site: 'Kalaburagi plant', project: 'PRJ-24-102', heads: 18, need: 18, present: 16, ot: 6, state: 'Working' },
  { code: 'C-07', name: 'Riggers', trade: 'Riggers', site: 'Raichur TPS', project: '— (idle since 22 Oct)', heads: 6, need: 0, present: 6, ot: 0, state: 'Idle' },
  { code: 'C-08', name: 'Bolting', trade: 'Fitters, riggers', site: 'Raichur TPS', project: 'PRJ-24-107', heads: 8, need: 14, present: 8, ot: 10, state: 'Short' },
  { code: 'C-10', name: 'Slag O&M shifts A/B/C', trade: 'Loader operators, helpers', site: 'Hospet steel plant', project: 'PRJ-24-104', heads: 54, need: 54, present: 52, ot: 22, state: 'Working' },
  { code: 'C-12', name: 'BF-2 shutdown', trade: 'Fitters, welders, helpers', site: 'Ballari BF-2', project: 'PRJ-24-105', heads: 120, need: 120, present: 114, ot: 64, state: 'Working' },
  { code: 'C-14', name: 'AMC team', trade: 'Crane technicians', site: 'Hospet rolling mill', project: 'PRJ-24-108', heads: 6, need: 6, present: 6, ot: 0, state: 'Working' }
];
const SUPPLY = [
  { trade: 'Fitters', heads: 50, rate: 1250, days: 28, billable: 1380 },
  { trade: 'Welders', heads: 40, rate: 1350, days: 28, billable: 1060 },
  { trade: 'Helpers', heads: 30, rate: 950, days: 28, billable: 820 }
];

export default function Manpower() {
  const [crews, setCrews] = useState(CREWS);
  const [tab, setTab] = useState<'deploy' | 'attendance' | 'productivity' | 'supply'>('deploy');
  const moved = crews.find(c => c.code === 'C-07')?.state !== 'Idle';
  const total = crews.reduce((a, c) => a + c.heads, 0);
  const present = crews.reduce((a, c) => a + c.present, 0);
  const redeploy = () => {
    setCrews(cs => cs.map(c => c.code === 'C-07' ? { ...c, project: 'PRJ-24-107', need: 6, state: 'Working' } : c.code === 'C-08' ? { ...c, state: 'Working', need: 8 } : c));
    toast('Crew C-07 moved to PRJ-24-107 from 25 Oct. Cost now books to the cooling tower project.');
  };
  return (
    <>
      <PageHeader num={10} eyebrow="Resource" title="Manpower deployment" sub="Crews and contract labour deployed to sites, daily attendance, man-hours, productivity, and manpower supply contracts billed from attendance." />
      <div className="grid g4">
        <Stat label="Deployed today" value={total} meta={`${crews.length} crews on 6 sites`} />
        <Stat label="Attendance today" value={`${Math.round((present / total) * 100)}%`} meta={`${present} present · face scan at gate`} />
        <Stat label="Overtime hours this week" value={crews.reduce((a, c) => a + c.ot, 0) * 3} meta="Approved by PM before payroll" />
        <Stat label="Idle crews" value={moved ? 0 : 1} valueColor={moved ? 'var(--green)' : 'var(--red)'} meta={moved ? 'All crews booked to work' : 'C-07 idle 2 days at Raichur'} />
      </div>
      {!moved && <div className="callout warn"><Sparkles size={16} style={{ flexShrink: 0 }} /><span><b>HR Agent:</b> crew C-07 (6 riggers) has been marked present with no DPR quantity since 22 Oct. At the same site, PRJ-24-107 is short by 6 on bolting.</span><button className="btn btn-sm ml-auto" onClick={redeploy}><ArrowRightLeft size={13} />Move C-07 to PRJ-24-107</button></div>}
      <Why points={['Idle crews and attendance gaps are flagged the same day, not discovered at the month-end wage bill.', 'Labour cost reaches the right project: every head is booked to a project, department, team and job description.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'deploy', label: 'Deployment', count: crews.length }, { key: 'attendance', label: 'Attendance' }, { key: 'productivity', label: 'Productivity' }, { key: 'supply', label: 'Manpower supply contracts' }]} />

      {tab === 'deploy' && <Card flush title="Crews by site">
        <div className="table-wrap"><table className="table"><thead><tr><th>Crew</th><th>Trade</th><th>Site</th><th>Project</th><th className="r">Heads</th><th>Against need</th><th>State</th></tr></thead>
          <tbody>{crews.map(c => <tr key={c.code}><td><div className="cell-2"><span className="mono">{c.code}</span><span className="strong">{c.name}</span></div></td><td>{c.trade}</td><td>{c.site}</td><td className="code-link">{c.project}</td><td className="r strong">{c.heads}</td>
            <td>{c.need ? <div className="meter-row"><Progress value={(c.heads / c.need) * 100} width={80} tone={c.heads < c.need ? 'red' : 'green'} /><span className="xs muted">need {c.need}</span></div> : <span className="xs muted">No assignment</span>}</td>
            <td><Badge tone={c.state === 'Working' ? 'green' : c.state === 'Idle' ? 'red' : 'amber'}>{c.state}</Badge></td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'attendance' && <Card flush title="Attendance · 24 Oct" sub="Face scan at the gate, matched to the crew's DPR" actions={<WhyPin text="When attendance comes from the gate scan and is matched to DPR output, paying for workers who were not there, or not working, becomes visible." />}>
        <div className="table-wrap"><table className="table"><thead><tr><th>Crew</th><th>Site</th><th className="r">Present</th><th className="r">Absent</th><th className="r">OT hours</th><th className="r">Man-hours</th><th>Matched to DPR</th></tr></thead>
          <tbody>{crews.map(c => <tr key={c.code}><td><span className="mono">{c.code}</span> {c.name}</td><td>{c.site}</td><td className="r">{c.present}</td><td className="r" style={{ color: c.heads - c.present > 2 ? 'var(--red)' : undefined }}>{c.heads - c.present}</td><td className="r">{c.ot}</td><td className="r">{c.present * 8 + c.ot}</td>
            <td>{c.state === 'Idle' ? <Badge tone="red" icon={<TriangleAlert size={11} />}>No DPR quantity</Badge> : <Badge tone="green" icon={<Check size={11} />}>Matched</Badge>}</td></tr>)}</tbody></table></div>
        <div className="card-f small muted"><Fingerprint size={15} />Biometric and face-scan devices are hardware outside this quotation; attendance can also be marked on the phone by site engineers.</div>
      </Card>}

      {tab === 'productivity' && <div className="grid g2">
        <Card title="Output per man-day against standard" sub="This week">
          <HBars labelW={170} fmt={n => `${n}% of standard`} max={130} rows={[
            { label: 'Fabrication · PRJ-24-101', sub: '0.86 vs 0.80 MT', value: 108, color: 'var(--c3)' },
            { label: 'Slag O&M · PRJ-24-104', sub: '118 vs 110 t', value: 107, color: 'var(--c3)' },
            { label: 'Shell repair · PRJ-24-102', sub: '0.41 vs 0.45 MT', value: 91, color: 'var(--c2)' },
            { label: 'Erection · PRJ-24-103', sub: '0.62 vs 0.72 MT', value: 86, color: 'var(--c2)' }]} />
          <Legend items={[{ name: 'At or above standard', color: 'var(--c3)' }, { name: 'Below standard', color: 'var(--c2)' }]} />
        </Card>
        <Card title="Why erection is below standard">
          <div className="callout info"><Sparkles size={16} style={{ flexShrink: 0 }} /><span><b>Project Agent:</b> truss T3 rework under NCR-0412 took 46 man-days with no new quantity. Excluding rework, erection productivity is 0.71 MT per man-day, close to standard.</span></div>
          <Why compact>Productivity is measured from DPR output against attendance, so a drop shows the same week and its cause is traced to a job, not argued about at month-end.</Why>
        </Card>
      </div>}

      {tab === 'supply' && <Card title="PRJ-24-105 · Shutdown manpower — Blast Furnace 2" sub="Manpower supply: deployment and attendance only. Stores are blocked for this line (zero inventory)." actions={<Badge tone="green">⑤ Manpower supply</Badge>}>
        <div className="grid g4">
          <Stat label="Contract" value="120 heads × 45 days" meta="15 Sep – 29 Oct" />
          <Stat label="Billable head-days" value="3,260" meta="From client-signed attendance" />
          <Stat label="Billed so far" value={money(3840000)} meta="Weekly bills" />
          <Stat label="This week to bill" value={money(SUPPLY.reduce((a, s) => a + s.billable * s.rate, 0) - 3840000)} meta="Waiting for client attendance sign-off" />
        </div>
        <div className="table-wrap"><table className="table"><thead><tr><th>Trade</th><th className="r">Heads</th><th className="r">Rate / head-day</th><th className="r">Billable head-days</th><th className="r">Amount</th></tr></thead>
          <tbody>{SUPPLY.map(s => <tr key={s.trade}><td className="strong">{s.trade}</td><td className="r">{s.heads}</td><td className="r">{inr(s.rate)}</td><td className="r">{s.billable.toLocaleString('en-IN')}</td><td className="r strong">{inr(s.billable * s.rate)}</td></tr>)}
            <tr className="total"><td>Total</td><td className="r">{SUPPLY.reduce((a, s) => a + s.heads, 0)}</td><td /><td className="r">{SUPPLY.reduce((a, s) => a + s.billable, 0).toLocaleString('en-IN')}</td><td className="r">{inr(SUPPLY.reduce((a, s) => a + s.billable * s.rate, 0))}</td></tr></tbody></table></div>
        <Why compact>Head-day bills are built straight from attendance the client has signed, so every bill can be defended line by line.</Why>
      </Card>}
    </>
  );
}
