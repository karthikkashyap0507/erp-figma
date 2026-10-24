import { useState } from 'react';
import { Download, Sparkles, CircleCheck, TriangleAlert, ShieldCheck } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Stat, Seg, Sensitive } from '../components/ui';
import { ColumnChart, LineChart, Legend } from '../components/charts';
import { inr, money } from '../lib/format';
import { CASH_OPENING, CASH_WEEKS } from '../data/finance';
import { toast } from '../lib/store';

const PNL = [
  { line: 'Sales', rev: 2480000, cost: 2120000 },
  { line: 'Service', rev: 1540000, cost: 1390000 },
  { line: 'Sales & service', rev: 3080000, cost: 2610000 },
  { line: 'O&M', rev: 5840000, cost: 4910000 },
  { line: 'Manpower supply', rev: 2160000, cost: 1820000 },
  { line: 'Consultation', rev: 200000, cost: 110000 }
];
const BUDGET = [
  { head: 'Material', budget: 6400000, actual: 6680000 },
  { head: 'Labour & payroll', budget: 4200000, actual: 4060000 },
  { head: 'Equipment & hire', budget: 1100000, actual: 1360000 },
  { head: 'Subcontract', budget: 900000, actual: 820000 },
  { head: 'Overheads', budget: 1050000, actual: 980000 }
];
const CONTROLS = [
  ['Maker-checker on masters and payments', true, '12 changes checked this month'],
  ['Three-way match before vendor payment', true, '41 bills matched · 3 held'],
  ['Accounting period lock (September closed)', true, 'Locked 10 Oct by Deepa Nair'],
  ['Duplicate bill check', true, '2 duplicates blocked'],
  ['Vendor bank account change needs approval', true, '1 change approved 24 Oct'],
  ['Statutory dues paid on time', false, 'PF & ESI for September 9 days late'],
  ['Cash advances within weekly limit', true, 'All 86 within ₹3,500']
];
const RISKS = [
  { risk: 'Delay on cooling tower refurbishment (PRJ-24-107)', impact: 'High', likelihood: 'High', owner: 'Farhan Ali', mitigation: 'Move crew C-07; daily review until back on plan' },
  { risk: 'Cash dip in week 46', impact: 'Medium', likelihood: 'High', owner: 'Deepa Nair', mitigation: 'Collect ₹21.6 L from Kaveri Power; move 2 vendor payments to W47' },
  { risk: 'Steel price rise on open quotations', impact: 'Medium', likelihood: 'Medium', owner: 'Rohit Menon', mitigation: 'Price-variation clause; 15-day validity on steel-heavy quotes' },
  { risk: 'Statutory penalty on late PF/ESI', impact: 'Low', likelihood: 'High', owner: 'Lakshmi Rao', mitigation: 'File challan today; statutory calendar alerts at 7 and 2 days' }
];

export default function MIS() {
  const [tab, setTab] = useState<'pack' | 'budget' | 'cash' | 'wc' | 'controls' | 'risk'>('pack');
  const [period, setPeriod] = useState<'month' | 'quarter'>('month');
  const k = period === 'month' ? 1 : 2.86;
  const rev = PNL.reduce((a, p) => a + p.rev, 0) * k, cost = PNL.reduce((a, p) => a + p.cost, 0) * k, oh = 980000 * k;
  return (
    <>
      <PageHeader num={19} eyebrow="Back office & finance" title="Finance management & MIS" sub="Budgeting and planning, cash flow and working capital, the monthly and quarterly MIS pack, cost control, internal-control checks and the risk register."
        actions={<><Seg options={[{ key: 'month', label: 'October' }, { key: 'quarter', label: 'Q2 FY27' }]} value={period} onChange={setPeriod} /><button className="btn btn-primary" onClick={() => toast('MIS pack exported as PDF and Excel', 'info')}><Download size={15} />Export MIS pack</button></>} />
      <div className="grid g4">
        <Stat label="Revenue" value={money(rev)} delta={period === 'month' ? '+4.8%' : '+11%'} up meta={period === 'month' ? 'vs September' : 'vs Q1'} />
        <Stat label="Gross margin" value={<Sensitive kind="margin">{(((rev - cost) / rev) * 100).toFixed(1)}%</Sensitive>} meta="Before overheads" />
        <Stat label="EBITDA" value={<Sensitive kind="margin">{money(rev - cost - oh)}</Sensitive>} meta="After head-office overheads" />
        <Stat label="Cash & bank" value={money(CASH_OPENING)} meta="Low point ₹18.6 L in W46" />
      </div>
      <Why points={['The MIS pack builds itself at month-end from live numbers. Accounts stops spending a week in Excel, and you get it on the 1st.', 'Profit is visible by business line every month, so decisions about which work to chase are made on facts.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'pack', label: 'MIS pack' }, { key: 'budget', label: 'Budget vs actual' }, { key: 'cash', label: 'Cash flow' }, { key: 'wc', label: 'Working capital' }, { key: 'controls', label: 'Internal controls' }, { key: 'risk', label: 'Risk register', count: RISKS.length }]} />

      {tab === 'pack' && <div className="split-wide">
        <Card flush title={`Profit and loss by business line · ${period === 'month' ? 'October 2026' : 'Q2 FY 2026–27'}`}>
          <div className="table-wrap"><table className="table"><thead><tr><th>Business line</th><th className="r">Revenue</th><th className="r">Direct cost</th><th className="r">Gross margin</th><th className="r">Margin %</th></tr></thead>
            <tbody>{PNL.map(p => { const m = (p.rev - p.cost) / p.rev * 100; return <tr key={p.line}><td className="strong">{p.line}</td><td className="r">{money(p.rev * k)}</td><td className="r">{money(p.cost * k)}</td><td className="r"><Sensitive kind="margin">{money((p.rev - p.cost) * k)}</Sensitive></td><td className="r"><Sensitive kind="margin"><b style={{ color: m < 12 ? 'var(--red)' : 'var(--green)' }}>{m.toFixed(1)}%</b></Sensitive></td></tr>; })}
              <tr className="total"><td>Total</td><td className="r">{money(rev)}</td><td className="r">{money(cost)}</td><td className="r"><Sensitive kind="margin">{money(rev - cost)}</Sensitive></td><td className="r"><Sensitive kind="margin">{(((rev - cost) / rev) * 100).toFixed(1)}%</Sensitive></td></tr>
              <tr><td>Head-office overheads</td><td /><td className="r">{money(oh)}</td><td /><td /></tr>
              <tr className="total"><td>EBITDA</td><td /><td /><td className="r"><Sensitive kind="margin">{money(rev - cost - oh)}</Sensitive></td><td className="r"><Sensitive kind="margin">{(((rev - cost - oh) / rev) * 100).toFixed(1)}%</Sensitive></td></tr></tbody></table></div>
        </Card>
        <Card title="Finance Agent commentary" sub="Drafted for the MIS pack; edited by Accounts">
          {[['O&M carried the month', 'Slag handling ran 4% above plan and delivered 38% of revenue at a 15.9% margin.'], ['Service margin is thin', 'Kiln repair and cooling tower together made 9.7%. The cooling tower delay is costing about ₹1.1 L a week in idle hire and overtime.'], ['Material ran over budget', 'Steel came in 4.4% above budget because of the September price rise; 3 open quotations need re-pricing.'], ['Cash', 'Collections of ₹1.40 Cr against billing of ₹1.53 Cr. Kaveri Power is the main overdue account.']].map(([t, d]) => (
            <div key={t} className="row-top" style={{ gap: 10 }}><Sparkles size={15} color="var(--violet)" style={{ flexShrink: 0, marginTop: 3 }} /><div className="col" style={{ gap: 2 }}><span className="small strong">{t}</span><span className="small" style={{ color: 'var(--ink-2)' }}>{d}</span></div></div>
          ))}
        </Card>
      </div>}

      {tab === 'budget' && <Card title="Budget against actual by cost head" sub="October · ₹ lakh" actions={<WhyPin text="Overruns are visible by cost head every month, instead of surfacing at year-end when nothing can be done about them." />}>
        <ColumnChart aria="Budget versus actual by cost head" categories={BUDGET.map(b => b.head)} series={[{ name: 'Budget', color: 'var(--c1)', values: BUDGET.map(b => b.budget / 1e5) }, { name: 'Actual', color: 'var(--c2)', values: BUDGET.map(b => b.actual / 1e5) }]} fmt={n => `₹${n.toFixed(0)} L`} height={220} />
        <Legend items={[{ name: 'Budget', color: 'var(--c1)' }, { name: 'Actual', color: 'var(--c2)' }]} />
        <div className="table-wrap"><table className="table dense"><thead><tr><th>Cost head</th><th className="r">Budget</th><th className="r">Actual</th><th className="r">Variance</th></tr></thead>
          <tbody>{BUDGET.map(b => { const v = b.actual - b.budget; return <tr key={b.head}><td className="strong">{b.head}</td><td className="r">{inr(b.budget)}</td><td className="r">{inr(b.actual)}</td><td className="r strong" style={{ color: v > 0 ? 'var(--red)' : 'var(--green)' }}>{v > 0 ? '+' : ''}{inr(v)} ({((v / b.budget) * 100).toFixed(1)}%)</td></tr>; })}</tbody></table></div>
      </Card>}

      {tab === 'cash' && <div className="split-wide">
        <Card title="Cash-flow forecast · next 4 weeks" sub="From billing estimates, payables, payroll and statutory dues">
          <LineChart aria="Closing cash by week" labels={['Today', ...CASH_WEEKS.map(w => w.wk)]} series={[{ name: 'Closing cash', color: 'var(--c1)', values: [CASH_OPENING / 1e5, ...CASH_WEEKS.map(w => w.close / 1e5)] }]} fmt={n => `₹${n.toFixed(0)} L`} yMin={0} yMax={60} height={220} endLabels />
          <div className="table-wrap"><table className="table dense"><thead><tr><th>Week</th><th className="r">In</th><th className="r">Out</th><th className="r">Closing</th><th>Main items</th></tr></thead>
            <tbody>{CASH_WEEKS.map(w => <tr key={w.wk}><td><b>{w.wk}</b> <span className="xs muted">{w.dates}</span></td><td className="r">{money(w.inflow)}</td><td className="r">{money(w.outflow)}</td><td className="r strong" style={{ color: w.close < 2000000 ? 'var(--red)' : undefined }}>{money(w.close)}</td><td className="small muted">{w.notes}</td></tr>)}</tbody></table></div>
        </Card>
        <Card title="Fix the dip">
          <div className="callout warn"><TriangleAlert size={16} style={{ flexShrink: 0 }} /><span>Cash falls to ₹18.6 L in W46.</span></div>
          {[['Collect Kaveri Power by 10 Nov', '+₹21.6 L in W45'], ['Move 2 steel vendor payments to W47', '+₹6.2 L in W46'], ['Raise October O&M bill on 1 Nov', 'Collect in W47 as usual']].map(([a, b]) => <div key={a} className="row-top small" style={{ gap: 8 }}><Sparkles size={14} color="var(--violet)" style={{ flexShrink: 0, marginTop: 2 }} /><div className="col" style={{ gap: 0 }}><b>{a}</b><span className="muted">{b}</span></div></div>)}
          <Why compact>Payroll, GST and PF dates are known in advance, so a cash squeeze is seen weeks ahead instead of on the day.</Why>
        </Card>
      </div>}

      {tab === 'wc' && <div className="grid g2">
        <Card title="Working capital days" sub="Last 6 months">
          <LineChart aria="Receivable, payable and inventory days" labels={['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']} series={[{ name: 'Receivable days', color: 'var(--c1)', values: [58, 61, 57, 55, 52, 49] }, { name: 'Payable days', color: 'var(--c2)', values: [34, 36, 38, 37, 40, 41] }, { name: 'Inventory days', color: 'var(--c3)', values: [22, 24, 21, 19, 18, 17] }]} fmt={n => `${Math.round(n)} d`} height={220} endLabels />
          <Legend line items={[{ name: 'Receivable days', color: 'var(--c1)' }, { name: 'Payable days', color: 'var(--c2)' }, { name: 'Inventory days', color: 'var(--c3)' }]} />
        </Card>
        <Card title="Working capital position">
          <div className="grid g2"><Stat label="Due from clients" value={money(10000000)} /><Stat label="Due to vendors" value={money(4210000)} /><Stat label="Stock (our material)" value={money(4236000)} /><Stat label="Cash cycle" value="25 days" valueColor="var(--green)" meta="Down from 46 days in May" /></div>
        </Card>
      </div>}

      {tab === 'controls' && <Card title="Internal-control checks" sub="Run continuously by the Finance Agent; exceptions go to Accounts and the CA">
        {CONTROLS.map(([c, ok, d]) => <div key={c as string} className="row-top" style={{ gap: 10 }}>{ok ? <CircleCheck size={18} color="var(--green)" /> : <TriangleAlert size={18} color="var(--red)" />}<div className="col" style={{ gap: 0 }}><span className="strong">{c as string}</span><span className="small muted">{d as string}</span></div></div>)}
        <div className="callout ok"><ShieldCheck size={16} style={{ flexShrink: 0 }} /><span>6 of 7 controls passing. Pre-audit checks are ready for R. Srinivasan & Co.</span></div>
      </Card>}

      {tab === 'risk' && <Card flush title="Risk register" sub="Reviewed in the monthly MIS meeting">
        <div className="table-wrap"><table className="table"><thead><tr><th>Risk</th><th>Impact</th><th>Likelihood</th><th>Owner</th><th>Mitigation</th></tr></thead>
          <tbody>{RISKS.map(r => <tr key={r.risk}><td className="strong">{r.risk}</td><td><Badge tone={r.impact === 'High' ? 'red' : r.impact === 'Medium' ? 'amber' : 'grey'}>{r.impact}</Badge></td><td><Badge tone={r.likelihood === 'High' ? 'red' : 'amber'}>{r.likelihood}</Badge></td><td className="nowrap">{r.owner}</td><td className="small">{r.mitigation}</td></tr>)}</tbody></table></div>
      </Card>}
    </>
  );
}
