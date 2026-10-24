import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TriangleAlert, Check, BedDouble, Construction, CalendarClock } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat } from '../components/ui';
import { inr, money } from '../lib/format';
import { toast, useApp } from '../lib/store';

const HIRES = [
  { no: 'HIRE-0031', what: 'Hydra crane 14 T', vendor: 'Hospet Crane Services', project: 'PRJ-24-101', basis: '₹2,800 / hour · min 8 h', from: '12 Oct', to: '27 Oct', toDate: 313600, days: 3 },
  { no: 'HIRE-0026', what: 'Hydra crane 23 T', vendor: 'Hospet Crane Services', project: 'PRJ-24-103', basis: '₹2,10,000 / month', from: '01 Sep', to: '30 Nov', toDate: 378000, days: 37 },
  { no: 'HIRE-0028', what: 'Trailer 40 ft', vendor: 'Ballari Transport Co', project: 'PRJ-24-103', basis: '₹6,500 / trip', from: '20 Aug', to: 'Open', toDate: 91000, days: 0 },
  { no: 'HIRE-0022', what: 'Tippers × 2', vendor: 'Ballari Transport Co', project: 'PRJ-24-104', basis: '₹1,20,000 / month for both', from: '01 Apr', to: '31 Mar 27', toDate: 840000, days: 158 }
];
const ROOMS = [
  { no: 'RENT-01', what: 'Worker room, 8 beds — Cowl Bazaar, Ballari', for: 'Workers · PRJ-24-101, PRJ-24-105', rent: 18000, due: '01 Nov', agreement: '31 Mar 2027', tds: 'Below 194I threshold' },
  { no: 'RENT-02', what: 'Staff room — Raichur', for: 'Site engineer · PRJ-24-103, PRJ-24-107', rent: 12500, due: '01 Nov', agreement: '30 Nov 2026', tds: 'Below 194I threshold' },
  { no: 'RENT-03', what: 'Worker dormitory, 20 beds — Kalaburagi', for: 'Workers · PRJ-24-102', rent: 22000, due: '05 Nov', agreement: '15 Jan 2027', tds: '194I @ 10% (above ₹2.4 L / year)' },
  { no: 'RENT-04', what: 'Staff flat — Hospet', for: 'O&M in-charge · PRJ-24-104', rent: 16000, due: '01 Nov', agreement: '31 Mar 2027', tds: 'Below 194I threshold' }
];

export default function Hiring() {
  const ext = useApp(s => s.approvals.find(a => a.ref === 'HIRE-0031'));
  const [tab, setTab] = useState<'equipment' | 'rooms'>('equipment');
  const [checked, setChecked] = useState(false);
  return (
    <>
      <PageHeader num={11} eyebrow="Resource" title="Hiring & rents" sub="Equipment hired in, such as Hydra cranes and vehicles, with hire charges booked to projects by Accounts; and rooms rented for workers and staff, managed by HR."
        actions={<button className="btn btn-primary" onClick={() => toast('New hire agreement form opened', 'info')}><Plus size={15} />New hire / rent</button>} />
      <div className="grid g4">
        <Stat label="Hire charges this month" value={money(782000)} meta="Booked to 3 projects" />
        <Stat label="Room rents per month" value={money(ROOMS.reduce((a, r) => a + r.rent, 0))} meta={`${ROOMS.length} rooms, charged to projects`} />
        <Stat label="Renewals in 30 days" value="2" valueColor="var(--amber)" meta="HIRE-0031 · RENT-02" />
        <Stat label="Over-billing caught" value={money(33600)} valueColor="var(--green)" meta="Crane hours vs DPR, this month" />
      </div>
      <Why points={['Hire and rent costs land on the right project instead of sitting in a general expense account.', 'Renewals are not missed: agreements end with an alert days ahead, not with a crane standing idle or a landlord at the door.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'equipment', label: 'Equipment hire', count: HIRES.length }, { key: 'rooms', label: 'Room rents', count: ROOMS.length }]} />
      {tab === 'equipment' && <>
        <Card flush title="Equipment hired in" sub="Charges posted to the project by Accounts">
          <div className="table-wrap"><table className="table"><thead><tr><th>Hire</th><th>Equipment · vendor</th><th>Project</th><th>Basis</th><th>Period</th><th className="r">Charged to date</th><th>Renewal</th></tr></thead>
            <tbody>{HIRES.map(h => <tr key={h.no}><td className="mono">{h.no}</td><td><div className="cell-2"><span className="strong row" style={{ gap: 6 }}><Construction size={14} color="var(--ink-3)" />{h.what}</span><span className="s">{h.vendor}</span></div></td><td className="code-link">{h.project}</td><td className="small">{h.basis}</td><td className="small">{h.from} – {h.to}</td><td className="r strong">{inr(h.toDate)}</td>
              <td>{h.no === 'HIRE-0031' ? (ext?.status === 'Approved' ? <Badge tone="green">Extended to 11 Nov</Badge> : <Link to="/approvals"><Badge tone="red" icon={<CalendarClock size={11} />}>Ends in 3 days · extension pending</Badge></Link>) : h.days && h.days < 45 ? <Badge tone="amber">Ends in {h.days} days</Badge> : <Badge tone="grey" dot={false}>{h.to === 'Open' ? 'Per trip' : 'Running'}</Badge>}</td></tr>)}</tbody></table></div>
        </Card>
        <Card title="Crane hours: vendor bill against DPR" sub="HIRE-0031 · Hospet Crane Services · bill HCS/26/0418" actions={<WhyPin text="Hire bills are checked against the hours your own site recorded in the DPR, so you pay for the hours the crane actually worked." />}>
          <div className="grid g4">
            <Stat label="Hours on vendor bill" value="124 h" />
            <Stat label="Hours in DPRs" value="112 h" meta="12–23 Oct" />
            <Stat label="Difference" value="12 h" valueColor="var(--red)" meta={`${inr(12 * 2800)} at ₹2,800 / h`} />
            <Stat label="Bill to pass" value={inr(112 * 2800)} />
          </div>
          {checked ? <div className="callout ok"><Check size={16} style={{ flexShrink: 0 }} /><span>Bill passed for 112 hours ({inr(313600)}). The vendor has been sent the DPR hour log for the 12-hour difference.</span></div>
            : <div className="callout warn"><TriangleAlert size={16} style={{ flexShrink: 0 }} /><span>The vendor billed 12 hours more than your DPRs show on 16, 18 and 21 Oct.</span><button className="btn btn-sm ml-auto" onClick={() => { setChecked(true); toast('Hire bill passed at DPR hours; difference raised with vendor'); }}>Pass at DPR hours</button></div>}
        </Card>
      </>}
      {tab === 'rooms' && <Card flush title="Rooms rented for workers and staff" sub="Rent split to the projects the occupants work on">
        <div className="table-wrap"><table className="table"><thead><tr><th>Rent</th><th>Room</th><th>For</th><th className="r">Rent / month</th><th>Next due</th><th>Agreement ends</th><th>TDS</th><th /></tr></thead>
          <tbody>{ROOMS.map(r => <tr key={r.no}><td className="mono">{r.no}</td><td className="strong"><span className="row" style={{ gap: 6 }}><BedDouble size={14} color="var(--ink-3)" />{r.what}</span></td><td className="small">{r.for}</td><td className="r strong">{inr(r.rent)}</td><td>{r.due}</td><td>{r.agreement === '30 Nov 2026' ? <Badge tone="amber">{r.agreement}</Badge> : r.agreement}</td><td className="small">{r.tds}</td><td><button className="btn btn-sm" onClick={() => toast(`${r.no} rent of ${inr(r.rent)} sent for payment`)}>Pay</button></td></tr>)}</tbody></table></div>
      </Card>}
    </>
  );
}
