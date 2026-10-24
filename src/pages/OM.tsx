import { useState } from 'react';
import { Upload, Plus, Check, Wrench, Clock, CircleCheck, Receipt } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Progress } from '../components/ui';
import { ColumnChart } from '../components/charts';
import { inr, money } from '../lib/format';
import { toast } from '../lib/store';

const LOG = [
  { date: '24 Oct', a: 296, b: 302, c: 258, down: 0.5, loader: 21, note: 'Pot 7 jammed 30 min' },
  { date: '23 Oct', a: 310, b: 298, c: 294, down: 0, loader: 22, note: '' },
  { date: '22 Oct', a: 288, b: 316, c: 292, down: 0, loader: 22, note: '' },
  { date: '21 Oct', a: 320, b: 304, c: 306, down: 0, loader: 23, note: '' },
  { date: '20 Oct', a: 276, b: 300, c: 288, down: 1.5, loader: 19, note: 'Loader EQ-014 hose burst' }
];
const TICKETS = [
  { no: 'SRV-0291', what: 'EOT crane 20 T — hoist brake slipping', client: 'Vijayanagar Alloys · rolling mill', type: 'AMC breakdown', sla: '4 h', age: '2 h 10 m', state: 'In progress', tech: 'Venkatesh Reddy' },
  { no: 'SRV-0290', what: 'Gearbox overhaul — conveyor drive', client: 'Kaveri Power Ltd', type: 'Workshop service', sla: '5 days', age: '3 days', state: 'In workshop', tech: 'Ballari workshop' },
  { no: 'SRV-0287', what: 'Long-travel wheel alignment — crane 3', client: 'Vijayanagar Alloys · rolling mill', type: 'AMC planned', sla: 'Visit 26 Oct', age: '—', state: 'Scheduled', tech: 'AMC team C-14' },
  { no: 'SRV-0284', what: 'Limit switch replacement — crane 1', client: 'Vijayanagar Alloys · rolling mill', type: 'AMC breakdown', sla: '4 h', age: 'Closed in 3 h 20 m', state: 'Closed', tech: 'Venkatesh Reddy' }
];
const SPARES = [
  { code: 'SP-EOT-BRK', name: 'EOT brake liner set', onHand: 2, used: 3, min: 2, rate: 7400 },
  { code: 'SP-EOT-LSW', name: 'Rotary limit switch', onHand: 4, used: 1, min: 2, rate: 5200 },
  { code: 'SP-LDR-HOS', name: 'Loader hydraulic hose kit', onHand: 1, used: 2, min: 2, rate: 9800 }
];

export default function OM() {
  const [tab, setTab] = useState<'production' | 'amc' | 'tickets' | 'spares'>('production');
  const [certified, setCertified] = useState(false);
  const octTonnes = 20860;
  const projected = 26900;
  return (
    <>
      <PageHeader num={17} eyebrow="Bill & close" title="O&M, maintenance & service" sub="O&M on client production, with or without our equipment; workshop service, AMC, service tickets and spares."
        actions={<><button className="btn" onClick={() => toast('Weighbridge CSV imported: 3 shifts, 24 Oct, 856 t', 'info')}><Upload size={15} />Import weighbridge CSV</button><button className="btn btn-primary" onClick={() => toast('Service ticket SRV-0292 opened', 'info')}><Plus size={15} />Service ticket</button></>} />
      <div className="grid g4">
        <Stat label="Slag handled · October to date" value={`${octTonnes.toLocaleString('en-IN')} t`} meta={`Projected ${projected.toLocaleString('en-IN')} t for the month`} />
        <Stat label="October bill (projected)" value={money(projected * 212)} meta="₹212 per tonne" />
        <Stat label="AMC visits this quarter" value="9 of 12" meta="Next visit 26 Oct" />
        <Stat label="Open service tickets" value="3" meta="1 breakdown within SLA" />
      </div>
      <Why points={['O&M bills come straight from the daily production log and weighbridge data, so the monthly bill on tonnage is ready on the 1st.', 'Equipment cost is tracked only where your machines are deployed, so you see the true margin of "with equipment" versus "manpower only" O&M contracts.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'production', label: 'O&M production', count: 'PRJ-24-104' }, { key: 'amc', label: 'AMC' }, { key: 'tickets', label: 'Service tickets', count: TICKETS.length }, { key: 'spares', label: 'Spares' }]} />

      {tab === 'production' && <>
        <div className="split-wide">
          <Card flush title="Daily production log · Slag handling SMS-2" sub="Tonnes by shift from the weighbridge; downtime and loader hours from the shift log" actions={<WhyPin text="Production is logged by shift and matched to weighbridge data, so the client certifies the same tonnage you bill." />}>
            <div className="table-wrap"><table className="table dense"><thead><tr><th>Date</th><th className="r">Shift A</th><th className="r">Shift B</th><th className="r">Shift C</th><th className="r">Total t</th><th className="r">Downtime h</th><th className="r">Our loader h</th><th>Note</th></tr></thead>
              <tbody>{LOG.map(l => <tr key={l.date}><td>{l.date}</td><td className="r">{l.a}</td><td className="r">{l.b}</td><td className="r">{l.c}</td><td className="r strong">{l.a + l.b + l.c}</td><td className="r" style={{ color: l.down ? 'var(--amber)' : undefined }}>{l.down || '—'}</td><td className="r">{l.loader}</td><td className="small muted">{l.note}</td></tr>)}</tbody></table></div>
          </Card>
          <Card title="October tonnage bill" sub="Monthly bill on client production">
            <dl className="kv" style={{ gridTemplateColumns: '1fr auto' }}>
              <dt>Tonnes 1–24 Oct (weighbridge)</dt><dd className="num r">{octTonnes.toLocaleString('en-IN')} t</dd>
              <dt>Projected 25–31 Oct</dt><dd className="num r">{(projected - octTonnes).toLocaleString('en-IN')} t</dd>
              <dt>Rate</dt><dd className="num r">₹212 / t</dd>
              <dt className="strong" style={{ color: 'var(--ink)' }}>Projected bill</dt><dd className="num r strong">{inr(projected * 212)}</dd>
              <dt>Our equipment cost (loader EQ-014)</dt><dd className="num r">{inr(185000)}</dd>
            </dl>
            {certified ? <div className="callout ok"><Check size={15} style={{ flexShrink: 0 }} /><span>Client production certificate for 1–24 Oct uploaded. The bill is raised on the 1st.</span></div>
              : <button className="btn" onClick={() => { setCertified(true); toast('Client certificate for 1–24 Oct uploaded'); }}><CircleCheck size={15} />Upload client certificate</button>}
            <button className="btn btn-primary" onClick={() => toast('Draft tonnage bill TON-104-OCT created', 'info')}><Receipt size={15} />Draft tonnage bill</button>
          </Card>
        </div>
        <Card title="Tonnes per month" sub="PRJ-24-104 since April">
          <ColumnChart aria="Tonnes of slag handled per month" categories={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct*']} series={[{ name: 'Tonnes', color: 'var(--c1)', values: [23100, 24800, 22900, 25600, 26300, 25425, 26900] }]} fmt={n => `${(n / 1000).toFixed(0)}k t`} height={180} />
          <span className="xs muted">* October projected from the run-rate</span>
        </Card>
      </>}

      {tab === 'amc' && <Card title="EOT crane AMC — rolling mill · PRJ-24-108" sub="Vijayanagar Alloys Ltd · ₹18 L per year, billed quarterly">
        <div className="grid g4">
          <Stat label="Cranes covered" value="6" />
          <Stat label="Planned visits done" value="9 of 12" meta="This quarter" />
          <Stat label="Breakdown response" value="2 h 40 m" meta="Average · SLA 4 h" />
          <Stat label="Uptime" value="99.2%" valueColor="var(--green)" />
        </div>
        <div className="col" style={{ gap: 8 }}>{[['Crane 1 · 20 T', 100], ['Crane 2 · 20 T', 100], ['Crane 3 · 10 T', 50], ['Crane 4 · 10 T', 100], ['Crane 5 · 5 T', 50], ['Crane 6 · 5 T', 50]].map(([c, v]) => <div key={c as string} className="row" style={{ gap: 12 }}><span className="small strong" style={{ width: 130 }}>{c as string}</span><Progress value={v as number} width={200} tone={(v as number) === 100 ? 'green' : undefined} /><span className="xs muted">{(v as number) === 100 ? '2 of 2 visits' : '1 of 2 visits · next 26 Oct'}</span></div>)}</div>
      </Card>}

      {tab === 'tickets' && <Card flush title="Service tickets" sub="AMC breakdowns, planned visits and workshop service jobs">
        <div className="table-wrap"><table className="table"><thead><tr><th>Ticket</th><th>Job</th><th>Type</th><th>SLA</th><th>Age</th><th>Assigned</th><th>State</th></tr></thead>
          <tbody>{TICKETS.map(t => <tr key={t.no}><td className="mono">{t.no}</td><td><div className="cell-2"><span className="strong">{t.what}</span><span className="s">{t.client}</span></div></td><td>{t.type}</td><td>{t.sla}</td><td className="nowrap"><span className="row" style={{ gap: 4 }}><Clock size={12} />{t.age}</span></td><td className="nowrap">{t.tech}</td><td><Badge tone={t.state === 'Closed' ? 'green' : t.state === 'Scheduled' ? 'blue' : 'amber'}>{t.state}</Badge></td></tr>)}</tbody></table></div>
      </Card>}

      {tab === 'spares' && <Card flush title="Spares" sub="Hospet O&M store · issued against tickets">
        <div className="table-wrap"><table className="table"><thead><tr><th>Spare</th><th className="r">On hand</th><th className="r">Used this month</th><th className="r">Minimum</th><th className="r">Rate</th><th /></tr></thead>
          <tbody>{SPARES.map(s => <tr key={s.code}><td><div className="cell-2"><span className="strong"><Wrench size={13} /> {s.name}</span><span className="s mono">{s.code}</span></div></td><td className="r strong" style={{ color: s.onHand < s.min ? 'var(--red)' : undefined }}>{s.onHand}</td><td className="r">{s.used}</td><td className="r">{s.min}</td><td className="r">{inr(s.rate)}</td><td>{s.onHand < s.min && <button className="btn btn-sm" onClick={() => toast(`Requisition raised for ${s.name}`)}>Reorder</button>}</td></tr>)}</tbody></table></div>
      </Card>}
    </>
  );
}
