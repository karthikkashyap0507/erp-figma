import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, MessageCircle, Phone, Globe, Store, Gavel, Users, ArrowRight, Sparkles, Calculator, Send } from 'lucide-react';
import { PageHeader, Card, Why, WhyPin, Tabs, Badge, Drawer, Stat, Timeline, Avatar, Field } from '../components/ui';
import { HBars } from '../components/charts';
import { useApp, setState, toast } from '../lib/store';
import { money } from '../lib/format';
import { LEAD_STAGES, type Lead, type LeadStage } from '../data/workflow';

const SRC_ICON: Record<string, ReactNode> = { Website: <Globe size={13} />, WhatsApp: <MessageCircle size={13} />, Phone: <Phone size={13} />, IndiaMART: <Store size={13} />, Tender: <Gavel size={13} />, Referral: <Users size={13} /> };
const TENDERS = [
  { no: 'TSW/SMS1/2026/114', client: 'Tungabhadra Steel Works Ltd', work: 'Slag yard O&M — SMS-1, 3 years', value: 31800000, emd: 318000, prebid: '29 Oct', closes: '06 Nov', status: 'Preparing' },
  { no: 'KPL/RCH/MECH/88', client: 'Kaveri Power Ltd', work: 'Ash handling structure repairs', value: 9400000, emd: 94000, prebid: '—', closes: '14 Nov', status: 'Bid / no-bid' },
  { no: 'CCL/KLB/2026/31', client: 'Coromandel Cement Ltd', work: 'Annual shutdown manpower', value: 4200000, emd: 0, prebid: '—', closes: '02 Nov', status: 'Submitted' }
];
const CAMPAIGNS = [
  { name: 'IndiaMART premium listing', source: 'IndiaMART', leads: 38, won: 4, spend: 72000, value: 2140000 },
  { name: 'Plant maintenance mailer — Oct', source: 'Website', leads: 14, won: 1, spend: 18000, value: 650000 },
  { name: 'WhatsApp broadcast to past clients', source: 'WhatsApp', leads: 11, won: 2, spend: 0, value: 4120000 },
  { name: 'Steel plant shutdown season calls', source: 'Phone', leads: 9, won: 1, spend: 0, value: 6480000 }
];

export default function Leads() {
  const leads = useApp(s => s.leads);
  const nav = useNavigate();
  const [tab, setTab] = useState<'pipeline' | 'sources' | 'tenders'>('pipeline');
  const [open, setOpen] = useState<Lead | null>(null);
  const [note, setNote] = useState('Spoke to plant head; wants a site visit before the 30 Oct shutdown planning meeting.');
  const active = leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost');
  const move = (l: Lead, stage: LeadStage) => { setState(s => ({ leads: s.leads.map(x => x.id === l.id ? { ...x, stage } : x) })); setOpen(o => o && o.id === l.id ? { ...o, stage } : o); toast(`${l.company} moved to ${stage}`); };
  const nextOf = (s: LeadStage): LeadStage | null => { const i = LEAD_STAGES.indexOf(s); return i >= 0 && i < LEAD_STAGES.length - 1 ? LEAD_STAGES[i + 1] : null; };
  return (
    <>
      <PageHeader num={2} eyebrow="Win the work" title="Marketing & business development" sub="Leads from the website, WhatsApp, phone and IndiaMART in one pipeline, with follow-ups, campaign and source tracking, and a tender tracker."
        actions={<><span className="row small muted" style={{ gap: 6 }}><RefreshCw size={14} />IndiaMART synced 09:12</span><button className="btn btn-primary" onClick={() => toast('New lead form opened', 'info')}><Plus size={15} />New lead</button></>} />
      <div className="grid g4">
        <Stat label="Active pipeline" value={money(active.reduce((a, l) => a + l.value, 0))} meta={`${active.length} open leads`} />
        <Stat label="New this month" value="72" delta="+18%" up meta="vs September" />
        <Stat label="Win rate (90 days)" value="23%" meta="8 won of 35 decided" />
        <Stat label="Follow-ups due today" value="4" meta="Suggested by Sales & CRM Agent" />
      </div>
      <Why points={['No enquiry is lost in a WhatsApp chat or a call log: every lead from every channel lands in one pipeline with an owner and a next step.', 'Campaign and source tracking shows which channel actually brings work, so marketing money goes where it pays.']} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'pipeline', label: 'Pipeline', count: active.length }, { key: 'sources', label: 'Sources & campaigns' }, { key: 'tenders', label: 'Tender tracker', count: TENDERS.length }]} />

      {tab === 'pipeline' && (
        <div className="kanban">
          {LEAD_STAGES.map(st => {
            const col = leads.filter(l => l.stage === st);
            return (
              <div key={st} className="kcol">
                <div className="kcol-h">{st}<span className="tag">{col.length}</span><span className="xs muted ml-auto">{money(col.reduce((a, l) => a + l.value, 0))}</span></div>
                {col.map(l => (
                  <div key={l.id} className="kcard" role="button" tabIndex={0} onClick={() => setOpen(l)} onKeyDown={e => e.key === 'Enter' && setOpen(l)}>
                    <div className="row"><span className="strong small grow">{l.company}</span><span className="tag">{l.id}</span></div>
                    <span className="small muted">{l.need}</span>
                    <div className="row wrap" style={{ gap: 6 }}><Badge tone="grey" dot={false} icon={SRC_ICON[l.source]}>{l.source}</Badge><span className="small strong num">{money(l.value)}</span></div>
                    <div className="row" style={{ gap: 6 }}><span className="xs muted grow">{l.line}</span><span className="xs strong" style={{ color: l.score >= 75 ? 'var(--green)' : l.score >= 55 ? 'var(--amber)' : 'var(--ink-3)' }}>Score {l.score}</span></div>
                  </div>
                ))}
                {col.length === 0 && <div className="empty xs">No leads</div>}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'sources' && (
        <div className="grid g2">
          <Card title="Leads by source" sub="Last 90 days">
            <HBars rows={[{ label: 'IndiaMART', value: 38 }, { label: 'Website', value: 14 }, { label: 'WhatsApp', value: 11 }, { label: 'Phone', value: 9 }, { label: 'Referral', value: 6 }, { label: 'Tender', value: 4 }]} labelW={100} />
          </Card>
          <Card title="Campaigns" sub="Spend against the value of work won" flush>
            <div className="table-wrap"><table className="table"><thead><tr><th>Campaign</th><th className="r">Leads</th><th className="r">Won</th><th className="r">Spend</th><th className="r">Won value</th></tr></thead>
              <tbody>{CAMPAIGNS.map(c => <tr key={c.name}><td><div className="cell-2"><span className="strong">{c.name}</span><span className="s">{c.source}</span></div></td><td className="r">{c.leads}</td><td className="r">{c.won}</td><td className="r">{c.spend ? money(c.spend) : '—'}</td><td className="r strong">{money(c.value)}</td></tr>)}</tbody></table></div>
          </Card>
        </div>
      )}

      {tab === 'tenders' && (
        <Card flush title="Tender tracker" sub="Pre-bid, EMD and closing dates, with reminders" actions={<WhyPin text="Tender dates and EMD deadlines are tracked with alerts, so a closing date is never missed because it sat in someone's inbox." />}>
          <div className="table-wrap"><table className="table"><thead><tr><th>Tender</th><th>Work</th><th className="r">Value</th><th className="r">EMD</th><th>Pre-bid</th><th>Closes</th><th>Status</th></tr></thead>
            <tbody>{TENDERS.map(t => <tr key={t.no}><td><div className="cell-2"><span className="mono">{t.no}</span><span className="s">{t.client}</span></div></td><td className="strong">{t.work}</td><td className="r">{money(t.value)}</td><td className="r">{t.emd ? money(t.emd) : '—'}</td><td>{t.prebid}</td><td><b>{t.closes}</b></td><td><Badge tone={t.status === 'Submitted' ? 'green' : t.status === 'Preparing' ? 'amber' : 'grey'}>{t.status}</Badge></td></tr>)}</tbody></table></div>
        </Card>
      )}

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.company || ''} sub={open ? `${open.id} · ${open.need}` : ''}
        footer={open && <>
          <button className="btn" onClick={() => toast('WhatsApp message sent with capability deck', 'info')}><MessageCircle size={15} />WhatsApp</button>
          {open.stage === 'Estimating' || open.stage === 'Site visit' ? <button className="btn" onClick={() => nav('/estimates')}><Calculator size={15} />Open estimate</button> : null}
          {nextOf(open.stage) && <button className="btn btn-primary" onClick={() => move(open, nextOf(open.stage)!)}>Move to {nextOf(open.stage)}<ArrowRight size={15} /></button>}
        </>}>
        {open && <>
          <div className="grid g3" style={{ gap: 10 }}>
            <Stat label="Value" value={money(open.value)} />
            <Stat label="Stage" value={<span style={{ fontSize: 18 }}>{open.stage}</span>} />
            <Stat label="Lead score" value={open.score} valueColor={open.score >= 75 ? 'var(--green)' : undefined} />
          </div>
          <div className="callout info"><Sparkles size={16} style={{ flexShrink: 0 }} /><span><b>Sales & CRM Agent:</b> next step — {open.next}. Score is based on ticket size, repeat-client history, source quality and response time.</span></div>
          <dl className="kv"><dt>Business line</dt><dd>{open.line}</dd><dt>Source</dt><dd>{open.source}</dd><dt>Owner</dt><dd className="row" style={{ gap: 8 }}><Avatar name={open.owner} size={22} />{open.owner}</dd></dl>
          <Field label="Log a follow-up"><textarea className="textarea" value={note} onChange={e => setNote(e.target.value)} /></Field>
          <button className="btn" onClick={() => toast('Follow-up logged · reminder set for 27 Oct')}><Send size={15} />Log follow-up</button>
          <span className="label">Activity</span>
          <Timeline items={[{ when: '23 Oct 16:40', who: open.owner, what: 'Call: confirmed budget and timeline', tone: 'blue', icon: <Phone size={13} /> }, { when: '21 Oct 10:05', who: 'Sales & CRM Agent', what: 'Auto-reply sent and lead scored', tone: 'violet', icon: <Sparkles size={13} /> }, { when: '21 Oct 09:58', what: `Lead received from ${open.source}`, tone: 'grey', icon: SRC_ICON[open.source] }]} />
        </>}
      </Drawer>
    </>
  );
}
