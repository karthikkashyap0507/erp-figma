import type { Tone } from './core';

export type AgentKey = 'project' | 'finance' | 'procurement' | 'hr' | 'sales' | 'documents' | 'workflow';

export interface Finding { id: string; tone: Tone; title: string; detail: string; action: string; path: string; prepared?: string; }
export interface Agent { key: AgentKey; name: string; area: string; worksAcross: string; does: string; modules: string[]; color: string; stats: { label: string; value: string }[]; findings: Finding[]; }

export const AGENTS: Agent[] = [
  { key: 'project', name: 'Project Agent', area: 'projects · billing estimate · DPR · QA/QC · O&M', color: '#2a78d6',
    worksAcross: 'Projects, monthly billing estimation, engineering, DPR & production, QA / QC, O&M',
    does: 'Reads DPRs and flags delays, cost overruns and drops in productivity; drafts the monthly billing estimate; tracks NCRs and hold points; summarises project health',
    modules: ['/projects', '/billing-estimate', '/documents', '/dpr', '/qaqc', '/om'],
    stats: [{ label: 'DPRs read today', value: '9' }, { label: 'Open flags', value: '4' }, { label: 'Drafts for review', value: '1' }],
    findings: [
      { id: 'pf1', tone: 'red', title: 'Cooling tower refurbishment is 18 days behind', detail: 'PRJ-24-107: the bolting crew has been short by 6 people for 9 days (DPRs 12–21 Oct), and 3 hold points are waiting for inspection.', action: 'Resource request drafted for the PM', path: '/projects/107', prepared: 'Request for 6 riggers from crew C-07 (idle at Raichur), 28 Oct – 15 Nov' },
      { id: 'pf2', tone: 'amber', title: 'Erection productivity down 14% this week', detail: 'PRJ-24-103: 0.62 MT per man-day against the 0.72 standard, mainly on truss T3 and T4 while NCR-0412 rework is under way.', action: 'Open DPR trend', path: '/dpr' },
      { id: 'pf3', tone: 'blue', title: 'November billing estimate drafted', detail: '7 running projects, ₹1.42 Cr in total. Built from DPR quantities, certified measurements and O&M tonnage run-rate.', action: 'Review the draft', path: '/billing-estimate', prepared: 'Draft BE-NOV-26 waiting for site engineers and Accounts' },
      { id: 'pf4', tone: 'amber', title: 'Open NCR blocks a billable item', detail: 'NCR-0412 (weld undercut on truss T3) holds RA bill item 3.04 worth ₹4.8 L on PRJ-24-103.', action: 'Go to QA / QC', path: '/qaqc' }
    ] },
  { key: 'finance', name: 'Finance Agent (CA & CFO)', area: 'CA & CFO · accounts · billing · MIS', color: '#1baf7a',
    worksAcross: 'Accounts, client billing, reconciliation & retention, finance management & MIS',
    does: 'CA work: compliance checks, input-credit matching, statutory calendar, pre-audit checks. CFO work: cash-flow forecast, working capital, budget variance, MIS commentary, follow-up of receivables and retention; drafts bills for review',
    modules: ['/accounts', '/billing', '/reconciliation', '/mis'],
    stats: [{ label: 'Checks run', value: '214' }, { label: 'Exceptions', value: '5' }, { label: 'Drafts for review', value: '2' }],
    findings: [
      { id: 'ff1', tone: 'amber', title: '3 vendor invoices not in GSTR-2B', detail: '₹1.86 L of input credit for September cannot be claimed until the vendors file. Karnataka Steel Traders (2) and Nandi Weld Consumables (1).', action: 'Open GST reconciliation', path: '/accounts', prepared: 'Reminder emails drafted to 2 vendors' },
      { id: 'ff2', tone: 'red', title: 'TDS deducted at the wrong rate', detail: 'Rajesh Erectors bill SB-0388: deducted at 1%, but section 194C requires 2% for a firm. The short deduction is ₹3,840.', action: 'Correct before the payment batch', path: '/accounts' },
      { id: 'ff3', tone: 'amber', title: 'Cash dips to ₹18.6 L in week 46', detail: 'October payroll, GST and PF/ESI fall in the same fortnight. Collecting ₹21.6 L from Kaveri Power by 10 Nov keeps cash above ₹35 L.', action: 'Open the cash-flow forecast', path: '/mis', prepared: 'Payment reminder for Kaveri Power drafted' },
      { id: 'ff4', tone: 'blue', title: 'Retention of ₹6.40 L can be claimed', detail: 'PRJ-23-087: the defects period ends 31 Oct. The client-steel reconciliation still needs acceptance by Accounts before the claim can go out.', action: 'Open reconciliation', path: '/reconciliation' }
    ] },
  { key: 'procurement', name: 'Procurement & Inventory Agent', area: 'purchase · stores · hiring · fleet', color: '#eb6834',
    worksAcross: 'Procurement, inventory & stores, client steel, equipment hiring, vehicles & fleet',
    does: 'Suggests reorders from stock and upcoming project needs; compares vendor quotes; flags excess buying, slow-moving stock and client-steel variances; reminds hire renewals and vehicle document expiry',
    modules: ['/procurement', '/inventory', '/hiring', '/fleet'],
    stats: [{ label: 'Reorders suggested', value: '3' }, { label: 'Variances', value: '2' }, { label: 'Renewals due', value: '4' }],
    findings: [
      { id: 'pr1', tone: 'amber', title: 'Reorder MS plate 16 mm — 14 MT', detail: 'On hand 6.2 MT against a minimum of 10 MT. PRJ-24-103 needs 9.8 MT in the next 3 weeks (BOQ 2.11).', action: 'Requisition drafted', path: '/procurement', prepared: 'PR-2026-0391 · 14 MT · 3 vendors shortlisted' },
      { id: 'pr2', tone: 'red', title: 'Client-steel variance 2.1% on kiln repair', detail: 'PRJ-24-102: 51.6 MT used, 5.8 MT scrap returned. Unaccounted 1.08 MT is above the 1.5% wastage allowance.', action: 'Open client-steel register', path: '/reconciliation' },
      { id: 'pr3', tone: 'amber', title: 'Electrodes bought at 2× consumption', detail: 'E7018: 1,200 kg bought in 60 days against 610 kg consumed. 640 kg is now idle at Ballari.', action: 'Open stock', path: '/inventory' },
      { id: 'pr4', tone: 'blue', title: 'Hydra 14 T hire ends in 3 days', detail: 'HIRE-0031 for PRJ-24-101 ends 27 Oct. The extension request is waiting for approval.', action: 'Open hiring', path: '/hiring' }
    ] },
  { key: 'hr', name: 'HR Agent', area: 'manpower · payroll · statutory · rents', color: '#7A3E9D',
    worksAcross: 'Manpower deployment, payroll, HR & statutory, room rents',
    does: 'Flags attendance gaps and idle crews; tracks weekly advance recovery and deductions with evidence; reminds PF, ESI, PT, licence and rent due dates; drafts payroll for review',
    modules: ['/manpower', '/hr', '/hiring'],
    stats: [{ label: 'Workers tracked', value: '312' }, { label: 'Open flags', value: '4' }, { label: 'Drafts for review', value: '1' }],
    findings: [
      { id: 'hf1', tone: 'red', title: 'PF & ESI challan overdue by 9 days', detail: 'September wages: PF ₹4.62 L and ESI ₹1.18 L. Interest under section 7Q accrues daily.', action: 'Open statutory calendar', path: '/hr', prepared: 'Challan working ready for upload' },
      { id: 'hf2', tone: 'amber', title: 'Crew C-07 idle for 2 days at Raichur', detail: '6 riggers have been marked present with no DPR quantity since 22 Oct, while PRJ-24-107 is short of riggers.', action: 'Open deployment', path: '/manpower' },
      { id: 'hf3', tone: 'amber', title: '₹48,600 of advances not yet recovered', detail: '14 workers have left with advances outstanding. Recovery can be made from final settlement for 9 of them.', action: 'Open advances', path: '/hr' },
      { id: 'hf4', tone: 'blue', title: 'October payroll drafted', detail: '312 employees and workers: net ₹28.4 L after weekly advances, LPG, damage and safety deductions.', action: 'Review the payroll draft', path: '/hr', prepared: 'Payroll run PR-OCT-26 waiting for HR & Accounts' }
    ] },
  { key: 'sales', name: 'Sales & CRM Agent', area: 'marketing · estimation · sales · dealers', color: '#0E6A72',
    worksAcross: 'Marketing, consultation & estimation, sales & dealers',
    does: 'Scores leads and suggests the next follow-up; drafts quotations from approved estimates; flags expiring quotations and dealer dues',
    modules: ['/leads', '/estimates', '/sales'],
    stats: [{ label: 'Leads scored', value: '9' }, { label: 'Follow-ups due', value: '4' }, { label: 'Dealer dues', value: '₹5.98 L' }],
    findings: [
      { id: 'sf1', tone: 'amber', title: 'Quotation QT-2026-0144 expires in 5 days', detail: 'Nandi Sugars, ₹48.6 L. The client asked for 6% off; that is above the 3% sales limit, so it is waiting for MD approval.', action: 'Open quotation', path: '/sales' },
      { id: 'sf2', tone: 'blue', title: 'New IndiaMART lead scored 44', detail: 'Raichur Agro Processing, silo platform. It is a small ticket but a repeat buyer type; call within 4 hours.', action: 'Open pipeline', path: '/leads' },
      { id: 'sf3', tone: 'red', title: 'Dealer dues overdue 18 days', detail: 'Raichur Steel Agencies owes ₹4.12 L. New dealer orders are held until it is paid.', action: 'Open dealers', path: '/sales' }
    ] },
  { key: 'documents', name: 'Documents & Data Agent', area: 'bills · BOQs · Excel · document import', color: '#B45309',
    worksAcross: 'Master data, document control, data import',
    does: 'Reads vendor bills, BOQs, Excel sheets and documents and turns them into ERP entries for review; checks for duplicates and missing details; answers questions from your documents',
    modules: ['/masters', '/documents'],
    stats: [{ label: 'Bills read today', value: '14' }, { label: 'Entries drafted', value: '12' }, { label: 'Duplicates', value: '2' }],
    findings: [
      { id: 'df1', tone: 'blue', title: '12 vendor bills turned into draft entries', detail: 'Read from email and WhatsApp today. Each is matched to its PO and GRN and waiting for Accounts to review.', action: 'Review drafts', path: '/accounts' },
      { id: 'df2', tone: 'red', title: '2 duplicate bills caught', detail: 'Deccan Gases DG/1182 was sent twice, by email and on WhatsApp. ₹18,400 would have been paid twice.', action: 'Open payables', path: '/accounts' },
      { id: 'df3', tone: 'amber', title: 'BOQ extracted — Nandi Sugars, 86 lines', detail: '81 lines matched to rate analysis items; 5 need an estimator to map.', action: 'Open estimate', path: '/estimates' }
    ] },
  { key: 'workflow', name: 'Workflow & Automation Agent', area: 'tasks · approvals · escalations · alerts', color: '#5B6474',
    worksAcross: 'Approvals, tasks, event automation, alerts',
    does: 'Watches business events; creates tasks, chases pending approvals and escalates overdue items; suggests new automation rules from patterns it sees',
    modules: ['/approvals', '/automation', '/analytics'],
    stats: [{ label: 'Events today', value: '386' }, { label: 'Escalations', value: '3' }, { label: 'Rules suggested', value: '1' }],
    findings: [
      { id: 'wf1', tone: 'amber', title: '3 overdue tasks escalated', detail: 'PF & ESI challan (to MD), RA bill 05 measurement (to PM) and NCR-0398 closure (to PM).', action: 'Open tasks', path: '/approvals' },
      { id: 'wf2', tone: 'blue', title: 'New rule suggested', detail: '4 DPRs came in after 9 PM last week. Suggest a WhatsApp reminder at 7 PM to any site engineer who has not submitted.', action: 'Review rule', path: '/automation' }
    ] }
];

export const agentByKey = (k: string) => AGENTS.find(a => a.key === k);

export const BRIEF = [
  { tone: 'red' as Tone, text: 'PRJ-24-107 cooling tower is 18 days behind; idle crew C-07 can fill the gap.' },
  { tone: 'amber' as Tone, text: 'Cash dips to ₹18.6 L in week 46; chase Kaveri Power for ₹21.6 L.' },
  { tone: 'red' as Tone, text: 'PF & ESI for September is 9 days overdue; challan is ready to file.' },
  { tone: 'blue' as Tone, text: '₹6.40 L retention can be claimed once the PRJ-23-087 steel reconciliation is accepted.' },
  { tone: 'green' as Tone, text: 'O&M slag handling hit 6,240 t this week, 4% above plan.' }
];

export const SAMPLE_QUESTIONS = [
  'Which projects are behind schedule this week, and why?',
  'How much retention is due for release this month?',
  'What is our cash position for the next four weeks?',
  'Which workers still have weekly advances to recover?',
  "Draft this month's billing estimate for every running project",
  'Which vehicles or licences expire in the next 30 days?'
];
