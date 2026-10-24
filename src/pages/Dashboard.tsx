import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Download, TriangleAlert, Info, CircleCheck, ListChecks, Wallet, FolderKanban, Receipt, Scale, Landmark, TrendingUp } from 'lucide-react';
import { PageHeader, Card, Stat, Why, StatusBadge, LineChip, PctCell, Sensitive, Badge, WhyPin } from '../components/ui';
import { ColumnChart, LineChart, Legend, StackBar } from '../components/charts';
import { useApp } from '../lib/store';
import { roleByKey } from '../lib/roles';
import { money } from '../lib/format';
import { COMPANY, LINES } from '../data/core';
import { BRIEF } from '../data/ai';
import { CASH_OPENING, CASH_WEEKS, RETENTIONS, MONTHS, REVENUE_TREND } from '../data/finance';

export default function Dashboard() {
  const role = roleByKey(useApp(s => s.role));
  const projects = useApp(s => s.projects);
  const approvals = useApp(s => s.approvals.filter(a => a.status === 'Pending' || a.status === 'Blocked'));
  const alerts = useApp(s => s.alerts);
  const nav = useNavigate();
  const running = projects.filter(p => p.status !== 'Completed');
  const orderBook = running.reduce((a, p) => a + p.contract, 0);
  const billed = projects.reduce((a, p) => a + p.billed, 0);
  const received = projects.reduce((a, p) => a + p.received, 0);
  const retention = RETENTIONS.reduce((a, r) => a + r.held, 0);
  const cost = projects.reduce((a, p) => a + p.actual, 0);
  const margin = ((billed - cost) / billed) * 100;
  const byLine = LINES.map(l => {
    const ps = projects.filter(p => p.line === l.key);
    const b = ps.reduce((a, p) => a + p.billed, 0), c = ps.reduce((a, p) => a + p.actual, 0);
    return { line: l, billed: b, cost: c, margin: b ? ((b - c) / b) * 100 : 0, count: ps.length };
  });
  const statusCount = (s: string) => projects.filter(p => p.status === s).length;

  return (
    <>
      <PageHeader eyebrow={`${COMPANY.today} · ${role.name} view`} title={`Good morning, ${role.person}`} sub="Live numbers from every module. Nothing here is typed in twice: it comes straight from DPRs, stores, bills and accounts."
        actions={<><button className="btn" onClick={() => nav('/mis')}><Download size={15} />MIS pack</button><button className="btn btn-primary" onClick={() => nav('/ai')}><Sparkles size={15} />Ask AI Manager</button></>} />

      <section className="card ai-grad" style={{ border: 'none' }}>
        <div className="card-b" style={{ gap: 14 }}>
          <div className="row wrap" style={{ gap: 10 }}>
            <span className="ai-avatar" style={{ background: 'rgba(255,255,255,.1)' }}><Sparkles size={17} /></span>
            <div className="col grow" style={{ gap: 0 }}><span style={{ fontWeight: 700, fontSize: 15 }}>AI Manager — daily brief</span><span style={{ fontSize: 12.5, color: '#B9C5E8' }}>Prepared 07:00 from 9 DPRs, 14 bills, stores and accounts · 7 agents reporting</span></div>
            <Link to="/ai" className="btn btn-sm" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', borderColor: 'rgba(255,255,255,.2)' }}>Open AI Manager<ArrowRight size={14} /></Link>
          </div>
          <div className="grid g5" style={{ gap: 10 }}>
            {BRIEF.map((b, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', fontSize: 13, lineHeight: 1.5, display: 'flex', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0, background: b.tone === 'red' ? '#F87171' : b.tone === 'amber' ? '#FBBF24' : b.tone === 'green' ? '#4ADE80' : '#93C5FD' }} />{b.text}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Why points={['Problems are spotted earlier: the AI Manager reads every DPR, bill and register overnight and raises only what needs a decision.', 'Less time spent chasing reports: the brief replaces calls and WhatsApp follow-ups to each site.']} />

      <div className="grid g4">
        <Stat label="Running projects" icon={<FolderKanban size={14} />} value={running.length} meta={`${statusCount('On track')} on track · ${statusCount('At risk')} at risk · ${statusCount('Delayed')} delayed`} />
        <Stat label="Order book" icon={<TrendingUp size={14} />} value={money(orderBook)} meta="Contract value of running projects" />
        <Stat label="Billed to date" icon={<Receipt size={14} />} value={money(billed)} delta="₹1.53 Cr" up meta="billed in October, 4.8% above September" />
        <Stat label="Gross margin on billed work" icon={<Scale size={14} />} value={<Sensitive kind="margin">{margin.toFixed(1)}%</Sensitive>} meta="Billed less actual cost" />
        <Stat label="Cash & bank" icon={<Landmark size={14} />} value={money(CASH_OPENING)} meta={`Low point ${money(1860000)} in W46`} />
        <Stat label="Receivable from clients" icon={<Wallet size={14} />} value={money(billed - received)} meta={`incl. ${money(retention)} retention held`} />
        <Stat label="Retention due this month" icon={<Scale size={14} />} value={money(640000)} meta="PRJ-23-087 · blocked by steel reconciliation" />
        <Stat label="Waiting for your approval" icon={<ListChecks size={14} />} value={approvals.length} meta={<Link to="/approvals">Open approvals</Link>} />
      </div>

      <div className="split-wide">
        <Card title="Profit by business line" sub="Billed against actual cost, all projects" actions={<WhyPin text="Every line runs and bills differently. When they share one spreadsheet, workshop and site jobs get mixed up and the margin of each line is invisible." />}>
          <ColumnChart aria="Billed and actual cost by business line" categories={byLine.map(b => b.line.name.replace(' supply', ''))} series={[{ name: 'Billed', color: 'var(--c1)', values: byLine.map(b => b.billed / 1e5) }, { name: 'Actual cost', color: 'var(--c2)', values: byLine.map(b => b.cost / 1e5) }]} fmt={n => `₹${Math.round(n)} L`} height={210} />
          <Legend items={[{ name: 'Billed', color: 'var(--c1)' }, { name: 'Actual cost', color: 'var(--c2)' }]} />
          <div className="table-wrap"><table className="table dense">
            <thead><tr><th>Line</th><th className="r">Projects</th><th className="r">Billed</th><th className="r">Cost</th><th className="r">Margin</th></tr></thead>
            <tbody>{byLine.map(b => <tr key={b.line.key}><td><LineChip line={b.line.key} /></td><td className="r">{b.count}</td><td className="r">{money(b.billed)}</td><td className="r">{money(b.cost)}</td><td className="r"><Sensitive kind="margin"><b style={{ color: b.margin < 12 ? 'var(--red)' : 'var(--green)' }}>{b.margin.toFixed(1)}%</b></Sensitive></td></tr>)}</tbody>
          </table></div>
        </Card>
        <Card title="Cash position — next 4 weeks" sub="From billing estimates, payables, payroll and statutory dues" actions={<Link to="/mis" className="small">Forecast</Link>}>
          <LineChart aria="Closing cash balance by week" labels={['Today', ...CASH_WEEKS.map(w => w.wk)]} series={[{ name: 'Closing balance', color: 'var(--c1)', values: [CASH_OPENING / 1e5, ...CASH_WEEKS.map(w => w.close / 1e5)] }]} fmt={n => `₹${n.toFixed(0)} L`} yMin={0} yMax={60} height={200} endLabels />
          <div className="callout warn"><TriangleAlert size={16} style={{ flexShrink: 0 }} /><span>Cash dips to <b>₹18.6 L</b> in W46, when October payroll, GST and PF/ESI fall in the same fortnight. The Finance Agent suggests chasing Kaveri Power for ₹21.6 L before 10 Nov.</span></div>
          <Why compact>Decisions on borrowing and vendor payments are made on current numbers, not last month's Excel.</Why>
        </Card>
      </div>

      <div className="split-wide">
        <Card title="Project health" sub="Every running project, across all six business lines" flush actions={<Link to="/projects" className="small">All projects</Link>}>
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Project</th><th>Line</th><th>Progress</th><th className="r">Billed / contract</th><th>Status</th></tr></thead>
            <tbody>{running.map(p => (
              <tr key={p.id} className="clickable" onClick={() => nav(`/projects/${p.id}`)}>
                <td><div className="cell-2"><span className="code-link">{p.code}</span><span className="strong">{p.name}</span></div></td>
                <td><LineChip line={p.line} short /></td>
                <td><PctCell value={p.progress} tone={p.status === 'Delayed' ? 'red' : p.status === 'At risk' ? 'amber' : undefined} /></td>
                <td className="r">{money(p.billed)} / {money(p.contract)}</td>
                <td><StatusBadge s={p.status} /></td>
              </tr>))}</tbody>
          </table></div>
        </Card>
        <div className="col" style={{ gap: 16 }}>
          <Card title="Waiting for approval" sub="Approvals are a state change, not a WhatsApp message" flush actions={<Link to="/approvals" className="small">Open queue</Link>}>
            {approvals.slice(0, 5).map(a => (
              <Link key={a.id} to="/approvals" className="list-row clickable" style={{ color: 'var(--ink)' }}>
                <span className={`ico-box ${a.status === 'Blocked' ? 't-red' : 't-primary'}`}><ListChecks size={16} /></span>
                <div className="col grow" style={{ gap: 1 }}><span className="small strong">{a.title}</span><span className="xs muted">{a.kind} · {a.ref} · {a.age}</span></div>
                {a.amount > 0 && <span className="small strong num">{money(a.amount)}</span>}
                {a.status === 'Blocked' && <Badge tone="red">Blocked</Badge>}
              </Link>
            ))}
          </Card>
          <Card title="Alerts" sub="Reach the right person in-app, on email or WhatsApp" flush>
            {alerts.slice(0, 4).map(a => (
              <Link key={a.id} to={a.path} className="list-row clickable" style={{ color: 'var(--ink)' }}>
                <span className={`ico-box t-${a.tone}`}>{a.tone === 'red' ? <TriangleAlert size={16} /> : a.tone === 'amber' ? <Info size={16} /> : <CircleCheck size={16} />}</span>
                <div className="col grow" style={{ gap: 1 }}><span className="small strong">{a.title}</span><span className="xs muted">{a.detail}</span></div>
              </Link>
            ))}
          </Card>
        </div>
      </div>

      <div className="grid g2">
        <Card title="Billing and collections" sub="₹ lakh per month, all business lines">
          <LineChart aria="Billed and collected per month" labels={MONTHS} series={[{ name: 'Billed', color: 'var(--c1)', values: REVENUE_TREND.billed }, { name: 'Collected', color: 'var(--c3)', values: REVENUE_TREND.collected }]} fmt={n => `₹${Math.round(n)} L`} yMin={0} height={200} endLabels />
          <Legend line items={[{ name: 'Billed', color: 'var(--c1)' }, { name: 'Collected', color: 'var(--c3)' }]} />
        </Card>
        <Card title="Where the money is" sub="Contract value of running projects">
          <StackBar fmt={money} parts={[{ label: 'Collected', value: running.reduce((a, p) => a + p.received, 0), color: 'var(--c3)' }, { label: 'Billed, not collected', value: running.reduce((a, p) => a + p.billed - p.received, 0), color: 'var(--c2)' }, { label: 'Not yet billed', value: running.reduce((a, p) => a + Math.max(0, p.contract - p.billed), 0), color: '#D7DEE9' }]} height={16} />
          <Why compact points={['Billable work no longer slips into the next month: the monthly billing estimate shows what should be billed before the month ends.', 'Retention is tracked per project, so money already earned is claimed on time.']} />
        </Card>
      </div>
    </>
  );
}
