import { useState, type ReactNode } from 'react';
import { Bell, MessageCircle, Mail, Monitor } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Switch } from '../components/ui';
import { HBars, LineChart, Legend } from '../components/charts';
import { ROLES, type RoleKey } from '../lib/roles';
import { useApp, toast } from '../lib/store';

const DASH: Partial<Record<RoleKey, { k: [string, string, string][]; chart: { title: string; rows: { label: string; value: number }[]; fmt: (n: number) => string } }>> = {
  md: { k: [['Order book', '₹11.19 Cr', '8 running projects'], ['Cash & bank', '₹42.6 L', 'Low ₹18.6 L in W46'], ['Gross margin', '14.2%', 'On billed work'], ['Approvals waiting', '8', '₹83.4 L']], chart: { title: 'Billed by business line, ₹ lakh', rows: [{ label: 'O&M', value: 214 }, { label: 'Service', value: 188 }, { label: 'Sales', value: 112 }, { label: 'Sales & service', value: 86 }, { label: 'Manpower', value: 38 }, { label: 'Consultation', value: 3 }], fmt: n => `₹${n} L` } },
  accounts: { k: [['Receivables', '₹1.00 Cr', '₹15.8 L over 60 days'], ['Payables this week', '₹18.4 L', 'Batch PB-2026-41'], ['GST 2B mismatch', '₹1.86 L', '3 invoices'], ['Retention due', '₹6.40 L', 'Needs steel acceptance']], chart: { title: 'Receivables by client, ₹ lakh', rows: [{ label: 'Vijayanagar', value: 43.4 }, { label: 'Tungabhadra', value: 28.3 }, { label: 'Kaveri Power', value: 21.6 }, { label: 'Coromandel', value: 6.7 }], fmt: n => `₹${n} L` } },
  pm: { k: [['My projects', '5', '1 delayed, 1 at risk'], ['Budget used vs progress', '+6 pts', 'Cooling tower ahead on cost'], ['Open requisitions', '3', '₹15.5 L'], ['Measurements to certify', '2', 'RA 05, RA 03']], chart: { title: 'Physical progress, %', rows: [{ label: 'PRJ-24-101', value: 64 }, { label: 'PRJ-24-102', value: 48 }, { label: 'PRJ-24-103', value: 37 }, { label: 'PRJ-24-105', value: 60 }, { label: 'PRJ-24-107', value: 22 }], fmt: n => `${n}%` } },
  site: { k: [['DPR today', 'Draft', 'Submit by 19:00'], ['Crew present', '31 of 33', 'Raichur TPS'], ['Hold points', '1', 'IR-0388 tomorrow 10:00'], ['Material requests', '2', 'Bolts, electrodes']], chart: { title: 'Erection this week, MT per day', rows: [{ label: 'Mon', value: 2.1 }, { label: 'Tue', value: 2.8 }, { label: 'Wed', value: 1.9 }, { label: 'Thu', value: 2.4 }, { label: 'Fri', value: 2.6 }], fmt: n => `${n} MT` } },
  hr: { k: [['People on payroll', '312', '22 joined in October'], ['Advances outstanding', '₹34,500', '6 workers'], ['Statutory overdue', '2', 'PF & ESI September'], ['Rents due 1 Nov', '₹46,500', '3 rooms']], chart: { title: 'Headcount by site', rows: [{ label: 'Ballari BF-2', value: 120 }, { label: 'Hospet', value: 60 }, { label: 'Raichur', value: 36 }, { label: 'Ballari works', value: 26 }, { label: 'Kalaburagi', value: 18 }], fmt: n => `${n}` } },
  purchase: { k: [['Open requisitions', '4', '1 stopped by stock check'], ['RFQs out', '2', 'Steel 14 MT, bolts'], ['POs to approve', '1', '₹6.84 L with MD'], ['Late deliveries', '1', 'Sri Balaji 2.3 MT']], chart: { title: 'Vendor on-time delivery, %', rows: [{ label: 'Nandi Weld', value: 96 }, { label: 'Karnataka Steel', value: 94 }, { label: 'Deccan Gases', value: 90 }, { label: 'Vijayanagar Metal', value: 88 }, { label: 'Sri Balaji', value: 81 }], fmt: n => `${n}%` } },
  stores: { k: [['Below minimum', '3', 'Reorders raised'], ['Awaiting QC', '1', 'GRN-2026-0519'], ['Transfers in transit', '1', 'To Raichur'], ['Client steel held', '18.8 MT', 'Not our stock']], chart: { title: 'Stock value by store, ₹ lakh', rows: [{ label: 'Ballari workshop', value: 38.4 }, { label: 'Raichur site', value: 3.4 }, { label: 'Hospet O&M', value: 0.5 }], fmt: n => `₹${n} L` } },
  quality: { k: [['Open NCRs', '2', '1 overdue'], ['Inspections today', '2', 'IR-0387, IR-0388'], ['First-time pass rate', '91%', 'This month'], ['Billing held by NCRs', '₹6.0 L', 'BOQ 3.04, 3.02']], chart: { title: 'Inspections this month by result', rows: [{ label: 'Passed', value: 42 }, { label: 'Failed', value: 4 }], fmt: n => `${n}` } },
  sales: { k: [['Pipeline', '₹4.38 Cr', '7 open leads'], ['Quotes expiring', '2', 'In 7 days'], ['Dealer dues', '₹5.98 L', '₹4.12 L overdue'], ['Win rate', '23%', '90 days']], chart: { title: 'Leads by source, last 90 days', rows: [{ label: 'IndiaMART', value: 38 }, { label: 'Website', value: 14 }, { label: 'WhatsApp', value: 11 }, { label: 'Phone', value: 9 }], fmt: n => `${n}` } },
  fleet: { k: [['Documents expiring', '3', '1 PUC expired'], ['Trips today', '4', '752 km'], ['Fuel anomaly', '1', 'KA-35-C-8812'], ['O&M tonnes today', '856 t', 'SMS-2']], chart: { title: 'Cost per km by vehicle, ₹', rows: [{ label: 'Eicher trailer', value: 38.2 }, { label: 'Tata 407', value: 21.6 }, { label: 'Bolero', value: 14.8 }, { label: 'Scorpio', value: 12.1 }, { label: 'Tata Ace', value: 9.4 }], fmt: n => `₹${n}` } }
};
const RULES = [
  { name: 'Project behind schedule', cond: 'Physical progress more than 10% behind plan', to: 'PM, MD', ch: ['WhatsApp', 'In-app'], on: true },
  { name: 'Low stock', cond: 'Item falls below its minimum level', to: 'Stores, Purchase', ch: ['In-app'], on: true },
  { name: 'Pending payment from client', cond: 'Invoice unpaid 7 days after due date', to: 'Accounts, Sales', ch: ['Email', 'WhatsApp'], on: true },
  { name: 'Expiring documents', cond: 'Vehicle, driver, licence or hire document within 15 days of expiry', to: 'Owner of the record', ch: ['WhatsApp'], on: true },
  { name: 'Budget overrun', cond: 'Committed + actual above budget on any cost head', to: 'PM, Accounts', ch: ['In-app', 'Email'], on: true },
  { name: 'DPR not submitted', cond: 'No DPR from a running site by 19:00', to: 'Site engineer, PM', ch: ['WhatsApp'], on: false }
];
const CH: Record<string, ReactNode> = { WhatsApp: <MessageCircle size={11} />, Email: <Mail size={11} />, 'In-app': <Monitor size={11} /> };

export default function Analytics() {
  const current = useApp(s => s.role);
  const [role, setRole] = useState<RoleKey>(current in DASH ? current : 'md');
  const [tab, setTab] = useState<'dash' | 'rules'>('dash');
  const [rules, setRules] = useState(RULES);
  const d = DASH[role] || DASH.md!;
  return (
    <>
      <PageHeader num={22} eyebrow="Platform" title="Analytics, dashboards & alerts" sub="A role-based dashboard for every role, plus alert rules for delays, low stock, pending payments and expiring documents." />
      <Why points={['Each person opens the system to their own numbers. A site engineer sees today\'s DPR and hold points; the MD sees cash, margin and approvals.', 'Alerts replace chasing: a delay, a low stock item or an expiring document reaches the right person before it becomes a problem.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'dash', label: 'Role dashboards' }, { key: 'rules', label: 'Alert rules', count: rules.filter(r => r.on).length }]} />
      {tab === 'dash' && <>
        <div className="row wrap" style={{ gap: 6 }}>{ROLES.filter(r => DASH[r.key]).map(r => <button key={r.key} className={'btn btn-sm' + (role === r.key ? ' btn-primary' : '')} onClick={() => setRole(r.key)}>{r.name}</button>)}</div>
        <div className="grid g4">{d.k.map(([l, v, m]) => <Stat key={l} label={l} value={v} meta={m} />)}</div>
        <div className="grid g2">
          <Card title={d.chart.title}><HBars rows={d.chart.rows} fmt={d.chart.fmt} labelW={130} /></Card>
          <Card title="Trend" sub="Last 6 weeks" actions={<WhyPin text="Every tile and chart is set per role during design, from the KPIs you agree with us. New ones can be added during the warranty at no cost." />}>
            <LineChart aria="Six-week trend" labels={['W38', 'W39', 'W40', 'W41', 'W42', 'W43']} series={[{ name: 'This role\'s main measure', color: 'var(--c1)', values: [62, 66, 64, 71, 74, 78] }, { name: 'Target', color: 'var(--c2)', values: [70, 70, 72, 72, 75, 75], dashed: true }]} height={190} endLabels />
            <Legend line items={[{ name: 'Actual', color: 'var(--c1)' }, { name: 'Target', color: 'var(--c2)' }]} />
          </Card>
        </div>
      </>}
      {tab === 'rules' && <Card flush title="Alert rules" sub="Who is told, when, and on which channel">
        <div className="table-wrap"><table className="table"><thead><tr><th>Alert</th><th>Condition</th><th>Sent to</th><th>Channels</th><th>On</th></tr></thead>
          <tbody>{rules.map(r => <tr key={r.name}><td className="strong"><span className="row" style={{ gap: 6 }}><Bell size={14} color="var(--ink-3)" />{r.name}</span></td><td className="small">{r.cond}</td><td className="small">{r.to}</td><td><div className="row wrap" style={{ gap: 4 }}>{r.ch.map(c => <Badge key={c} tone="grey" dot={false} icon={CH[c]}>{c}</Badge>)}</div></td>
            <td><Switch on={r.on} label={`Alert ${r.name}`} onChange={v => { setRules(rs => rs.map(x => x.name === r.name ? { ...x, on: v } : x)); toast(`${r.name} alert ${v ? 'on' : 'off'}`, 'info'); }} /></td></tr>)}</tbody></table></div>
      </Card>}
    </>
  );
}
