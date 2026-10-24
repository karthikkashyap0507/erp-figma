import type { Tone } from './core';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Blocked';
export interface ApprovalStep { role: string; who: string; state: 'done' | 'waiting' | 'next'; }
export interface Approval {
  id: string; kind: string; title: string; ref: string; amount: number; project: string; raisedBy: string; age: string;
  route: ApprovalStep[]; status: ApprovalStatus; note?: string; blockReason?: string; module: string; escalated?: boolean;
}

export const APPROVALS: Approval[] = [
  { id: 'A1', kind: 'Purchase order', title: 'ISMB 300 + MS plates — 11.2 MT', ref: 'PO-2026-0218', amount: 684000, project: 'PRJ-24-103', raisedBy: 'Imran Sheikh', age: '6 h', module: 'procurement',
    route: [{ role: 'Purchase', who: 'Imran Sheikh', state: 'done' }, { role: 'Project Manager', who: 'Arjun Patil', state: 'done' }, { role: 'Managing Director', who: 'Shah Rukh', state: 'waiting' }], status: 'Pending', note: 'Above ₹5 L, so it needs MD approval. Stock check and budget check passed.' },
  { id: 'A2', kind: 'Quotation', title: 'Nandi Sugars — boiler structure, 6% discount', ref: 'QT-2026-0144', amount: 4860000, project: '—', raisedBy: 'Rohit Menon', age: '1 d', module: 'sales',
    route: [{ role: 'Sales', who: 'Rohit Menon', state: 'done' }, { role: 'Managing Director', who: 'Shah Rukh', state: 'waiting' }], status: 'Pending', note: 'Discount is above the 3% sales limit.' },
  { id: 'A3', kind: 'Variation', title: 'Extra cyclone duct liner plates', ref: 'VO-102-03', amount: 340000, project: 'PRJ-24-102', raisedBy: 'Farhan Ali', age: '2 d', module: 'projects', escalated: true,
    route: [{ role: 'Project Manager', who: 'Farhan Ali', state: 'done' }, { role: 'Managing Director', who: 'Shah Rukh', state: 'waiting' }], status: 'Pending', note: 'Client has agreed the rate in writing; scope added to BOQ item 2.07.' },
  { id: 'A4', kind: 'Payment batch', title: 'Vendor payments — week 43', ref: 'PB-2026-41', amount: 1840000, project: 'Multiple', raisedBy: 'Deepa Nair', age: '4 h', module: 'accounts',
    route: [{ role: 'Accounts', who: 'Deepa Nair', state: 'done' }, { role: 'Managing Director', who: 'Shah Rukh', state: 'waiting' }], status: 'Pending', note: '9 vendor bills, each three-way matched to PO and GRN.' },
  { id: 'A5', kind: 'Weekly advances', title: 'Worker cash advances — week 43 (86 workers)', ref: 'ADV-W43', amount: 258000, project: 'Multiple', raisedBy: 'Lakshmi Rao', age: '3 h', module: 'hr',
    route: [{ role: 'HR & Payroll', who: 'Lakshmi Rao', state: 'done' }, { role: 'Accounts', who: 'Deepa Nair', state: 'waiting' }], status: 'Pending', note: 'Each worker is within the weekly advance limit of ₹3,500.' },
  { id: 'A6', kind: 'Equipment hire', title: 'Hydra 14 T — extend hire by 15 days', ref: 'HIRE-0031', amount: 336000, project: 'PRJ-24-101', raisedBy: 'Arjun Patil', age: '5 h', module: 'hiring',
    route: [{ role: 'Project Manager', who: 'Arjun Patil', state: 'done' }, { role: 'Accounts', who: 'Deepa Nair', state: 'waiting' }], status: 'Pending' },
  { id: 'A7', kind: 'Stock adjustment', title: 'Plate cut-loss write-off — 0.42 MT', ref: 'ADJ-0041', amount: 25700, project: 'PRJ-24-101', raisedBy: 'Mahesh Kumar', age: '1 d', module: 'inventory',
    route: [{ role: 'Stores', who: 'Mahesh Kumar', state: 'done' }, { role: 'Project Manager', who: 'Arjun Patil', state: 'waiting' }], status: 'Pending' },
  { id: 'A8', kind: 'Retention claim', title: 'Release retention — mill building re-sheeting', ref: 'RET-087', amount: 640000, project: 'PRJ-23-087', raisedBy: 'Deepa Nair', age: '2 d', module: 'reconciliation',
    route: [{ role: 'Accounts', who: 'Deepa Nair', state: 'waiting' }, { role: 'Managing Director', who: 'Shah Rukh', state: 'next' }], status: 'Blocked', blockReason: 'Stage gate: the client-steel reconciliation for PRJ-23-087 is not yet accepted by Accounts.' },
  { id: 'A9', kind: 'NCR closure', title: 'NCR-0412 weld undercut — gallery truss T3', ref: 'NCR-0412', amount: 0, project: 'PRJ-24-103', raisedBy: 'Ravi Teja', age: '7 h', module: 'qaqc',
    route: [{ role: 'Site Engineer', who: 'Ravi Teja', state: 'done' }, { role: 'Quality Head', who: 'Kavya Hegde', state: 'waiting' }], status: 'Pending' }
];

export interface Task { id: string; title: string; owner: string; due: string; overdueDays: number; module: string; project: string; done: boolean; escalation?: string; }
export const TASKS: Task[] = [
  { id: 'T1', title: 'Submit RA bill 05 measurement sheet for client signature', owner: 'Naveen Kumar', due: '22 Oct', overdueDays: 2, module: 'billing', project: 'PRJ-24-102', done: false, escalation: 'Escalated to Farhan Ali' },
  { id: 'T2', title: 'Renew insurance — Bolero pickup KA-34-AB-1123', owner: 'Venkatesh Reddy', due: '05 Nov', overdueDays: 0, module: 'fleet', project: '—', done: false },
  { id: 'T3', title: 'File PF & ESI challan for September wages', owner: 'Lakshmi Rao', due: '15 Oct', overdueDays: 9, module: 'hr', project: '—', done: false, escalation: 'Escalated to Shah Rukh' },
  { id: 'T4', title: 'Accept client-steel reconciliation — PRJ-23-087', owner: 'Deepa Nair', due: '25 Oct', overdueDays: 0, module: 'reconciliation', project: 'PRJ-23-087', done: false },
  { id: 'T5', title: 'Issue revision C of gallery truss drawing to site', owner: 'Kiran Desai', due: '23 Oct', overdueDays: 1, module: 'documents', project: 'PRJ-24-103', done: false },
  { id: 'T6', title: 'Follow up Nandi Sugars on quotation QT-2026-0144', owner: 'Rohit Menon', due: '26 Oct', overdueDays: 0, module: 'sales', project: '—', done: false },
  { id: 'T7', title: 'Close NCR-0398 corrective action (cooling tower bolts)', owner: 'Kavya Hegde', due: '20 Oct', overdueDays: 4, module: 'qaqc', project: 'PRJ-24-107', done: false, escalation: 'Escalated to Farhan Ali' },
  { id: 'T8', title: 'Monthly billing estimate — November, all running projects', owner: 'Deepa Nair', due: '28 Oct', overdueDays: 0, module: 'billing-estimate', project: 'All', done: false }
];

export interface Alert { id: string; tone: Tone; title: string; detail: string; module: string; path: string; when: string; channel: string; }
export const ALERTS: Alert[] = [
  { id: 'N1', tone: 'red', title: 'Cooling tower refurbishment is 18 days behind', detail: 'PRJ-24-107 · bolting crew short by 6 for 9 days', module: 'Projects', path: '/projects/107', when: '08:10', channel: 'WhatsApp' },
  { id: 'N2', tone: 'red', title: 'PF & ESI challan overdue by 9 days', detail: 'September wages · interest accrues daily', module: 'Payroll & statutory', path: '/hr', when: '07:00', channel: 'Email' },
  { id: 'N3', tone: 'amber', title: '3 items below minimum stock', detail: 'MS plate 16 mm, ISA 65 angle, oxygen cylinders', module: 'Inventory', path: '/inventory', when: '06:00', channel: 'In-app' },
  { id: 'N4', tone: 'amber', title: 'Bolero pickup insurance expires in 12 days', detail: 'KA-34-AB-1123 · renewal task created', module: 'Fleet', path: '/fleet', when: 'Yesterday', channel: 'WhatsApp' },
  { id: 'N5', tone: 'amber', title: 'Client-steel variance 2.1% on kiln repair', detail: 'PRJ-24-102 · above the 1.5% wastage allowance', module: 'Reconciliation', path: '/reconciliation', when: 'Yesterday', channel: 'In-app' },
  { id: 'N6', tone: 'blue', title: 'Retention of ₹6.40 L due for release on 31 Oct', detail: 'PRJ-23-087 · steel reconciliation needs acceptance', module: 'Retention', path: '/reconciliation', when: 'Mon', channel: 'Email' },
  { id: 'N7', tone: 'blue', title: 'Hydra crane hire ends in 3 days', detail: 'HIRE-0031 · PRJ-24-101 · extension awaiting approval', module: 'Hiring', path: '/hiring', when: 'Mon', channel: 'WhatsApp' }
];

export type LeadStage = 'New' | 'Contacted' | 'Site visit' | 'Estimating' | 'Quoted' | 'Won' | 'Lost';
export const LEAD_STAGES: LeadStage[] = ['New', 'Contacted', 'Site visit', 'Estimating', 'Quoted', 'Won'];
export interface Lead { id: string; company: string; need: string; source: 'Website' | 'WhatsApp' | 'Phone' | 'IndiaMART' | 'Tender' | 'Referral'; value: number; stage: LeadStage; owner: string; score: number; next: string; line: string; campaign?: string; }
export const LEADS: Lead[] = [
  { id: 'L-311', company: 'Nandi Sugars Ltd', need: 'Boiler house structural steel', source: 'IndiaMART', value: 4860000, stage: 'Quoted', owner: 'Rohit Menon', score: 82, next: 'Discount approval, then call on 26 Oct', line: 'Sales & service' },
  { id: 'L-314', company: 'Krishna Fertilisers', need: 'Shutdown manpower, 80 heads × 20 days', source: 'Phone', value: 1920000, stage: 'Estimating', owner: 'Rohit Menon', score: 74, next: 'Head-day rate sheet by 27 Oct', line: 'Manpower supply' },
  { id: 'L-318', company: 'Coromandel Cement Ltd', need: 'Clinker cooler duct repair', source: 'Referral', value: 2740000, stage: 'Site visit', owner: 'Meera Iyer', score: 88, next: 'Site assessment on 28 Oct', line: 'Service' },
  { id: 'L-320', company: 'Tungabhadra Steel Works Ltd', need: 'Slag yard O&M — SMS-1', source: 'Tender', value: 31800000, stage: 'Estimating', owner: 'Rohit Menon', score: 69, next: 'Tender closes 06 Nov · pre-bid query sent', line: 'O&M' },
  { id: 'L-322', company: 'Sri Sai Rolling Mills', need: 'EOT crane girder fabrication', source: 'Website', value: 1180000, stage: 'Contacted', owner: 'Rohit Menon', score: 57, next: 'Send capability deck', line: 'Sales' },
  { id: 'L-325', company: 'Bellary Ferro Alloys', need: 'Furnace shed costing study', source: 'WhatsApp', value: 420000, stage: 'New', owner: 'Meera Iyer', score: 61, next: 'Qualify on call', line: 'Consultation' },
  { id: 'L-326', company: 'Raichur Agro Processing', need: 'Silo platform and walkways', source: 'IndiaMART', value: 860000, stage: 'New', owner: 'Rohit Menon', score: 44, next: 'Auto-reply sent · call within 4 h', line: 'Sales' },
  { id: 'L-301', company: 'Kaveri Power Ltd', need: 'Conveyor gallery — package 2', source: 'Referral', value: 24800000, stage: 'Won', owner: 'Rohit Menon', score: 95, next: 'Converted to PRJ-24-103', line: 'Sales & service' },
  { id: 'L-307', company: 'Hosur Auto Components', need: 'PEB shed costing & design review', source: 'Website', value: 650000, stage: 'Won', owner: 'Meera Iyer', score: 90, next: 'Converted to PRJ-24-106', line: 'Consultation' }
];
