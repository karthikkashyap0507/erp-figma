import { useState } from 'react';
import { Plus, Fuel, Wrench, MapPin, TriangleAlert, Sparkles, Truck } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Avatar } from '../components/ui';
import { HBars } from '../components/charts';
import { inr, money } from '../lib/format';
import { toast } from '../lib/store';

type Doc = { name: string; till: string; days: number };
const VEHICLES: { code: string; reg: string; model: string; driver: string; base: string; odo: number; kmpl: number; cpk: number; docs: Doc[] }[] = [
  { code: 'VH-001', reg: 'KA-34-AB-1123', model: 'Mahindra Bolero pickup', driver: 'Ramesh N', base: 'Ballari works', odo: 84210, kmpl: 11.2, cpk: 14.8, docs: [{ name: 'RC', till: '2034', days: 999 }, { name: 'Insurance', till: '05 Nov', days: 12 }, { name: 'PUC', till: '18 Jan', days: 86 }] },
  { code: 'VH-002', reg: 'KA-35-C-8812', model: 'Tata 407', driver: 'Raju K', base: 'Raichur TPS', odo: 126480, kmpl: 7.4, cpk: 21.6, docs: [{ name: 'Insurance', till: '12 Mar', days: 139 }, { name: 'Fitness', till: '18 Nov', days: 25 }, { name: 'Permit', till: '30 Jun', days: 249 }] },
  { code: 'VH-003', reg: 'KA-35-D-4410', model: 'Eicher Pro trailer', driver: 'Mallappa B', base: 'Ballari works', odo: 211900, kmpl: 4.1, cpk: 38.2, docs: [{ name: 'Insurance', till: '21 Jan', days: 89 }, { name: 'Permit', till: '14 Feb', days: 113 }, { name: 'Fitness', till: '02 Apr', days: 160 }] },
  { code: 'VH-004', reg: 'KA-01-MK-7702', model: 'Mahindra Scorpio (staff)', driver: 'Abdul S', base: 'Bengaluru HO', odo: 58340, kmpl: 12.6, cpk: 12.1, docs: [{ name: 'Insurance', till: '09 Aug', days: 289 }, { name: 'PUC', till: '11 Feb', days: 110 }] },
  { code: 'VH-005', reg: 'KA-34-AA-5521', model: 'Tata Ace', driver: 'Shivanna', base: 'Hospet steel plant', odo: 47110, kmpl: 14.9, cpk: 9.4, docs: [{ name: 'Insurance', till: '30 Dec', days: 67 }, { name: 'PUC', till: '22 Oct', days: -2 }] }
];
const TRIPS = [
  { date: '24 Oct', vh: 'KA-35-C-8812', driver: 'Raju K', route: 'Ballari works → Raichur TPS', project: 'PRJ-24-103', km: 186, purpose: 'Truss T4 members, 3.4 MT' },
  { date: '23 Oct', vh: 'KA-34-AB-1123', driver: 'Ramesh N', route: 'Ballari → Kalaburagi plant', project: 'PRJ-24-102', km: 212, purpose: 'LPG and consumables' },
  { date: '23 Oct', vh: 'KA-35-D-4410', driver: 'Mallappa B', route: 'Bengaluru → Ballari works', project: 'PRJ-24-101', km: 308, purpose: 'Steel from Karnataka Steel Traders' },
  { date: '22 Oct', vh: 'KA-34-AA-5521', driver: 'Shivanna', route: 'Hospet O&M base → slag yard', project: 'PRJ-24-104', km: 46, purpose: 'Loader spares' }
];
const FUEL = [
  { date: '23 Oct', vh: 'KA-35-C-8812', litres: 62, amount: 5890, kmSince: 378, kmpl: 6.1, flag: true },
  { date: '22 Oct', vh: 'KA-35-D-4410', litres: 140, amount: 13300, kmSince: 574, kmpl: 4.1, flag: false },
  { date: '21 Oct', vh: 'KA-34-AB-1123', litres: 38, amount: 3610, kmSince: 426, kmpl: 11.2, flag: false },
  { date: '19 Oct', vh: 'KA-34-AA-5521', litres: 24, amount: 2280, kmSince: 358, kmpl: 14.9, flag: false }
];
const tone = (d: number) => d < 0 ? 'red' : d <= 30 ? 'amber' : 'green';

export default function Fleet() {
  const [tab, setTab] = useState<'vehicles' | 'trips' | 'fuel' | 'service' | 'cost'>('vehicles');
  return (
    <>
      <PageHeader num={12} eyebrow="Resource" title="Vehicles & fleet" sub="Vehicle and driver documents with expiry alerts, trips, fuel and service, with cost per km and per project."
        actions={<button className="btn btn-primary" onClick={() => toast('Trip sheet opened', 'info')}><Plus size={15} />Log trip</button>} />
      <div className="grid g4">
        <Stat label="Vehicles" value={VEHICLES.length} meta="4 owned · 1 staff car" />
        <Stat label="Documents expiring in 30 days" value="3" valueColor="var(--amber)" meta="1 PUC already expired" />
        <Stat label="Fuel this month" value={money(84600)} meta="1 mileage anomaly flagged" />
        <Stat label="Average cost per km" value="₹19.2" meta="Fuel, service, insurance, driver" />
      </div>
      <div className="callout danger"><TriangleAlert size={16} style={{ flexShrink: 0 }} /><span><b>KA-34-AA-5521 Tata Ace:</b> PUC expired 2 days ago. The vehicle is blocked from new trip sheets until the certificate is uploaded.</span><button className="btn btn-sm ml-auto" onClick={() => toast('PUC renewal task assigned to Venkatesh Reddy')}>Create renewal task</button></div>
      <Why points={['Insurance, fitness, permit and PUC expiries are reminded on WhatsApp at 15, 7 and 2 days, so a vehicle is never stopped on the road for a lapsed document.', 'Every trip and every litre of fuel is booked to a project, so transport cost shows up in the project P&L instead of overheads.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'vehicles', label: 'Vehicles & documents', count: VEHICLES.length }, { key: 'trips', label: 'Trips' }, { key: 'fuel', label: 'Fuel' }, { key: 'service', label: 'Service' }, { key: 'cost', label: 'Cost per project' }]} />
      {tab === 'vehicles' && <Card flush>
        <div className="table-wrap"><table className="table"><thead><tr><th>Vehicle</th><th>Driver</th><th>Base</th><th>Documents</th><th className="r">Odometer</th><th className="r">km / litre</th><th className="r">Cost / km</th></tr></thead>
          <tbody>{VEHICLES.map(v => <tr key={v.code}><td><div className="cell-2"><span className="strong row" style={{ gap: 6 }}><Truck size={14} color="var(--ink-3)" />{v.reg}</span><span className="s">{v.model}</span></div></td><td><span className="row" style={{ gap: 8 }}><Avatar name={v.driver} size={24} />{v.driver}</span></td><td>{v.base}</td>
            <td><div className="row wrap" style={{ gap: 4 }}>{v.docs.map(d => <Badge key={d.name} tone={tone(d.days)} dot={false}>{d.name} · {d.days < 0 ? 'expired' : d.days <= 30 ? `${d.days} d` : d.till}</Badge>)}</div></td>
            <td className="r">{v.odo.toLocaleString('en-IN')}</td><td className="r">{v.kmpl}</td><td className="r">₹{v.cpk}</td></tr>)}</tbody></table></div>
        <div className="card-f small muted">Driver licences are tracked the same way: Ramesh N's HMV licence expires on 12 Nov (19 days).</div>
      </Card>}
      {tab === 'trips' && <Card flush title="Trip log" actions={<WhyPin text="Trips are booked to projects, so the cost of moving material shows up in the job that caused it." />}>
        <div className="table-wrap"><table className="table"><thead><tr><th>Date</th><th>Vehicle · driver</th><th>Route</th><th>Project</th><th className="r">km</th><th>Purpose</th></tr></thead>
          <tbody>{TRIPS.map((t, i) => <tr key={i}><td>{t.date}</td><td><div className="cell-2"><span className="mono">{t.vh}</span><span className="s">{t.driver}</span></div></td><td><span className="row" style={{ gap: 6 }}><MapPin size={13} color="var(--ink-3)" />{t.route}</span></td><td className="code-link">{t.project}</td><td className="r">{t.km}</td><td className="small">{t.purpose}</td></tr>)}</tbody></table></div>
      </Card>}
      {tab === 'fuel' && <>
        <div className="callout warn"><Sparkles size={16} style={{ flexShrink: 0 }} /><span><b>Procurement & Inventory Agent:</b> KA-35-C-8812 gave 6.1 km/l on its last fill against its usual 7.4 km/l. That is about 10 litres unaccounted for. Check the trip sheet and the fuel slip.</span></div>
        <Card flush title="Fuel entries"><div className="table-wrap"><table className="table"><thead><tr><th>Date</th><th>Vehicle</th><th className="r">Litres</th><th className="r">Amount</th><th className="r">km since last fill</th><th className="r">km / litre</th><th /></tr></thead>
          <tbody>{FUEL.map((f, i) => <tr key={i}><td>{f.date}</td><td className="mono">{f.vh}</td><td className="r">{f.litres}</td><td className="r">{inr(f.amount)}</td><td className="r">{f.kmSince}</td><td className="r strong" style={{ color: f.flag ? 'var(--red)' : undefined }}>{f.kmpl}</td><td>{f.flag ? <Badge tone="red">Below normal</Badge> : <Badge tone="green" dot={false}><Fuel size={11} />Normal</Badge>}</td></tr>)}</tbody></table></div></Card>
      </>}
      {tab === 'service' && <Card flush title="Service schedule"><div className="table-wrap"><table className="table"><thead><tr><th>Vehicle</th><th>Service</th><th>Due at</th><th>Last done</th><th className="r">Last cost</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td className="mono">KA-35-D-4410</td><td><span className="row" style={{ gap: 6 }}><Wrench size={13} />15,000 km service</span></td><td>212,500 km</td><td>197,400 km</td><td className="r">{inr(18400)}</td><td><Badge tone="amber">Due in 600 km</Badge></td></tr>
          <tr><td className="mono">KA-35-C-8812</td><td>Clutch plate</td><td>On complaint</td><td>—</td><td className="r">—</td><td><Badge tone="amber">Reported 22 Oct</Badge></td></tr>
          <tr><td className="mono">KA-34-AB-1123</td><td>10,000 km service</td><td>90,000 km</td><td>80,100 km</td><td className="r">{inr(6200)}</td><td><Badge tone="green">OK</Badge></td></tr>
        </tbody></table></div></Card>}
      {tab === 'cost' && <div className="grid g2">
        <Card title="Transport cost by project" sub="October, fuel and running cost of trips">
          <HBars fmt={money} labelW={150} rows={[{ label: 'PRJ-24-103', sub: 'Conveyor gallery', value: 38600 }, { label: 'PRJ-24-101', sub: 'Bay 4 steel', value: 26400 }, { label: 'PRJ-24-102', sub: 'Kiln repair', value: 14200 }, { label: 'PRJ-24-104', sub: 'Slag O&M', value: 9800 }]} />
        </Card>
        <Card title="Cost per km by vehicle">
          <HBars fmt={n => `₹${n}`} labelW={150} rows={VEHICLES.map(v => ({ label: v.reg, sub: v.model, value: v.cpk }))} />
        </Card>
      </div>}
    </>
  );
}
