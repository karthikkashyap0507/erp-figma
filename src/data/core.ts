// Sample company data. All names and figures are illustrative.

export const COMPANY = {
  name: 'Deccan Ridge Engineering',
  legal: 'Deccan Ridge Engineering Pvt Ltd',
  product: 'Streamlyned ERP',
  fy: 'FY 2026–27',
  today: '24 Oct 2026',
  month: 'Oct 2026'
};

export const COMPANIES = [
  { name: 'Deccan Ridge Engineering Pvt Ltd', gstin: '29AAKCD4821M1Z6', state: 'Karnataka', branches: ['Ballari works (workshop)', 'Bengaluru head office', 'Hospet O&M base'] },
  { name: 'Deccan Ridge Manpower Services LLP', gstin: '29AAPFD7710Q1ZK', state: 'Karnataka', branches: ['Ballari'] },
  { name: 'Deccan Ridge Engineering — Tamil Nadu', gstin: '33AAKCD4821M1ZB', state: 'Tamil Nadu', branches: ['Hosur'] }
];

export type LineKey = 'sales' | 'service' | 'salesService' | 'om' | 'manpower' | 'consultation';
export type Tone = 'blue' | 'teal' | 'violet' | 'amber' | 'green' | 'grey' | 'red' | 'primary';

export interface BusinessLine {
  key: LineKey; no: string; name: string; notes: string; handles: string; billing: string; tone: Tone;
  stages: string[]; documents: string[]; approvals: string[]; stores: string;
}

export const LINES: BusinessLine[] = [
  { key: 'sales', no: '①', name: 'Sales', tone: 'blue', notes: 'With our own material (steel), workshop activity; also dealership',
    handles: 'Workshop job card, steel from our stores, dealer price lists and orders', billing: 'Tax invoice; dealer invoice',
    stages: ['Order', 'Workshop job card', 'Material issue', 'Fabrication', 'QC', 'Dispatch', 'Tax invoice'],
    documents: ['Customer PO', 'Workshop job card', 'Delivery challan', 'Tax invoice', 'E-way bill'], approvals: ['Quotation by value', 'PO above ₹5 L', 'Discount above limit'], stores: 'Own stock from our stores' },
  { key: 'service', no: '②', name: 'Service', tone: 'teal', notes: 'Without steel — material in client scope; work out of workshop',
    handles: 'Client-steel register: received, used, scrap returned; reconciliation at final bill', billing: 'RA bills on measurement; final bill; retention',
    stages: ['Work order', 'Mobilise', 'Client steel received', 'Execution', 'Measurement', 'RA bills', 'Final bill', 'Steel reconciliation', 'Retention release'],
    documents: ['Work order', 'Client-steel receipt', 'Measurement sheet', 'RA bill', 'Reconciliation statement'], approvals: ['Measurement certification', 'Variation', 'Retention claim'], stores: 'Client-supplied steel register' },
  { key: 'salesService', no: '③', name: 'Sales & service', tone: 'violet', notes: 'Combined ① + ②',
    handles: 'One project with a workshop part and a site part', billing: 'Supply invoice + service bills',
    stages: ['Order', 'Workshop part', 'Dispatch & supply invoice', 'Site mobilise', 'Erection', 'Measurement', 'Service RA bills', 'Final bill'],
    documents: ['Customer PO', 'Job card', 'Supply invoice', 'Measurement sheet', 'Service RA bill'], approvals: ['PO above ₹5 L', 'Measurement certification'], stores: 'Own stock for supply; site stock for erection' },
  { key: 'om', no: '④', name: 'O&M', tone: 'amber', notes: 'With or without our equipment / machines; client-production oriented',
    handles: 'Daily production log; equipment cost tracked only where we deploy it', billing: 'Monthly bill on client production / tonnage',
    stages: ['Contract', 'Deploy crew & equipment', 'Daily production log', 'Client certification', 'Monthly bill'],
    documents: ['O&M contract', 'Daily production log', 'Weighbridge summary', 'Monthly certificate', 'Tonnage bill'], approvals: ['Monthly production certificate'], stores: 'Spares and consumables only' },
  { key: 'manpower', no: '⑤', name: 'Manpower supply', tone: 'green', notes: 'Only manpower — no material, tools or tackle (zero inventory)',
    handles: 'Deployment and attendance only; stores blocked for this line', billing: 'Per head-day or monthly, from attendance',
    stages: ['Supply order', 'Deploy', 'Daily attendance', 'Client attendance sign-off', 'Bill'],
    documents: ['Supply order', 'Deployment list', 'Attendance sheet', 'Head-day bill'], approvals: ['Deployment above order', 'Overtime'], stores: 'Blocked — zero inventory' },
  { key: 'consultation', no: '⑥', name: 'Consultation', tone: 'grey', notes: 'Technical consultation, costing and estimation',
    handles: 'Consultation records, estimate versions, fee milestones', billing: 'Fee or milestone',
    stages: ['Engagement', 'Site assessment', 'Estimate versions', 'Report', 'Fee milestone'],
    documents: ['Engagement letter', 'Site assessment', 'Estimate', 'Technical report', 'Fee invoice'], approvals: ['Estimate before issue'], stores: 'Not used' }
];
export const lineOf = (k: LineKey) => LINES.find(l => l.key === k)!;

export type Status = 'On track' | 'At risk' | 'Delayed' | 'Completed';

export interface Project {
  id: string; code: string; name: string; line: LineKey; client: string; site: string; pm: string; engineer: string;
  start: string; end: string; contract: number; budget: number; committed: number; actual: number; billed: number;
  received: number; retention: number; progress: number; status: Status; stage: number; billingNote?: string;
}

export const PROJECTS: Project[] = [
  { id: '101', code: 'PRJ-24-101', name: 'Bay 4 structural steel — fabrication & supply', line: 'sales', client: 'Tungabhadra Steel Works Ltd', site: 'Ballari works', pm: 'Arjun Patil', engineer: 'Suresh Gowda', start: '10 Jun 2026', end: '20 Dec 2026', contract: 18600000, budget: 15800000, committed: 1840000, actual: 9860000, billed: 11200000, received: 9650000, retention: 0, progress: 64, status: 'On track', stage: 3 },
  { id: '102', code: 'PRJ-24-102', name: 'Kiln shell & cyclone repair', line: 'service', client: 'Coromandel Cement Ltd', site: 'Kalaburagi plant', pm: 'Farhan Ali', engineer: 'Naveen Kumar', start: '02 Aug 2026', end: '15 Jan 2027', contract: 9240000, budget: 7600000, committed: 420000, actual: 4130000, billed: 4480000, received: 3810000, retention: 224000, progress: 48, status: 'At risk', stage: 5 },
  { id: '103', code: 'PRJ-24-103', name: 'Conveyor gallery fabrication & erection', line: 'salesService', client: 'Kaveri Power Ltd', site: 'Raichur TPS', pm: 'Arjun Patil', engineer: 'Ravi Teja', start: '20 Jul 2026', end: '31 Mar 2027', contract: 24800000, budget: 21000000, committed: 3650000, actual: 7240000, billed: 8600000, received: 7020000, retention: 430000, progress: 37, status: 'On track', stage: 4 },
  { id: '104', code: 'PRJ-24-104', name: 'Slag handling O&M — SMS-2', line: 'om', client: 'Vijayanagar Alloys Ltd', site: 'Hospet steel plant', pm: 'Farhan Ali', engineer: 'Venkatesh Reddy', start: '01 Apr 2026', end: '31 Mar 2027', contract: 43200000, budget: 36000000, committed: 0, actual: 17400000, billed: 20500000, received: 16800000, retention: 0, progress: 50, status: 'On track', stage: 2, billingNote: '₹212 per tonne of slag handled' },
  { id: '105', code: 'PRJ-24-105', name: 'Shutdown manpower — Blast Furnace 2', line: 'manpower', client: 'Tungabhadra Steel Works Ltd', site: 'Ballari BF-2', pm: 'Arjun Patil', engineer: 'Suresh Gowda', start: '15 Sep 2026', end: '29 Oct 2026', contract: 6480000, budget: 5200000, committed: 0, actual: 3120000, billed: 3840000, received: 2560000, retention: 0, progress: 60, status: 'On track', stage: 2, billingNote: '₹1,200 per head-day · 120 heads' },
  { id: '106', code: 'PRJ-24-106', name: 'PEB shed costing & design review', line: 'consultation', client: 'Hosur Auto Components Pvt Ltd', site: 'Hosur', pm: 'Meera Iyer', engineer: 'Meera Iyer', start: '01 Sep 2026', end: '30 Nov 2026', contract: 650000, budget: 320000, committed: 0, actual: 190000, billed: 325000, received: 325000, retention: 0, progress: 55, status: 'On track', stage: 2 },
  { id: '107', code: 'PRJ-24-107', name: 'Cooling tower structure refurbishment', line: 'service', client: 'Kaveri Power Ltd', site: 'Raichur TPS', pm: 'Farhan Ali', engineer: 'Ravi Teja', start: '01 Sep 2026', end: '28 Feb 2027', contract: 7120000, budget: 5900000, committed: 680000, actual: 1960000, billed: 1560000, received: 980000, retention: 78000, progress: 22, status: 'Delayed', stage: 3 },
  { id: '108', code: 'PRJ-24-108', name: 'EOT crane AMC — rolling mill', line: 'om', client: 'Vijayanagar Alloys Ltd', site: 'Hospet rolling mill', pm: 'Farhan Ali', engineer: 'Venkatesh Reddy', start: '01 Apr 2026', end: '31 Mar 2027', contract: 1800000, budget: 1260000, committed: 0, actual: 740000, billed: 900000, received: 900000, retention: 0, progress: 50, status: 'On track', stage: 4, billingNote: 'Quarterly AMC fee' },
  { id: '087', code: 'PRJ-23-087', name: 'Mill building re-sheeting', line: 'service', client: 'Vijayanagar Alloys Ltd', site: 'Hospet steel plant', pm: 'Farhan Ali', engineer: 'Naveen Kumar', start: '05 Jan 2025', end: '30 Apr 2026', contract: 12800000, budget: 10900000, committed: 0, actual: 10450000, billed: 12800000, received: 12160000, retention: 640000, progress: 100, status: 'Completed', stage: 7 }
];
export const projectById = (id: string) => PROJECTS.find(p => p.id === id);

export const PEOPLE: Record<string, string> = {
  'Shah Rukh': 'Managing Director', 'Deepa Nair': 'Accounts head', 'Lakshmi Rao': 'HR & Payroll', 'Arjun Patil': 'Project Manager',
  'Farhan Ali': 'Project Manager', 'Suresh Gowda': 'Site Engineer', 'Naveen Kumar': 'Site Engineer', 'Ravi Teja': 'Site Engineer',
  'Meera Iyer': 'Consultation & Estimation', 'Kiran Desai': 'Engineering', 'Kavya Hegde': 'Quality Head', 'Imran Sheikh': 'Purchase',
  'Mahesh Kumar': 'Stores', 'Rohit Menon': 'Sales / Marketing', 'Venkatesh Reddy': 'Fleet / O&M in-charge'
};

export type PartyType = 'Client' | 'Dealer' | 'Vendor' | 'Subcontractor';
export interface Party { code: string; name: string; type: PartyType; city: string; gstin: string; terms: string; contact: string; outstanding: number; status: 'Active' | 'Pending check'; }
export const PARTIES: Party[] = [
  { code: 'CL-0001', name: 'Tungabhadra Steel Works Ltd', type: 'Client', city: 'Ballari', gstin: '29AABCT1234K1Z5', terms: '45 days', contact: 'P. Venkatesh · Purchase', outstanding: 2830000, status: 'Active' },
  { code: 'CL-0002', name: 'Coromandel Cement Ltd', type: 'Client', city: 'Kalaburagi', gstin: '29AACCC5521F1Z2', terms: '30 days', contact: 'S. Hiremath · Projects', outstanding: 670000, status: 'Active' },
  { code: 'CL-0003', name: 'Kaveri Power Ltd', type: 'Client', city: 'Raichur', gstin: '29AABCK7788P1ZQ', terms: '60 days', contact: 'R. Kulkarni · Maintenance', outstanding: 2160000, status: 'Active' },
  { code: 'CL-0004', name: 'Vijayanagar Alloys Ltd', type: 'Client', city: 'Hospet', gstin: '29AADCV3301L1ZX', terms: '30 days', contact: 'M. Rao · SMS-2', outstanding: 4340000, status: 'Active' },
  { code: 'CL-0005', name: 'Hosur Auto Components Pvt Ltd', type: 'Client', city: 'Hosur', gstin: '33AAECH9012R1Z1', terms: '15 days', contact: 'K. Raman · Projects', outstanding: 0, status: 'Active' },
  { code: 'DL-0001', name: 'Raichur Steel Agencies', type: 'Dealer', city: 'Raichur', gstin: '29AAJFR1145C1ZT', terms: 'Advance / 15 days', contact: 'A. Jain', outstanding: 412000, status: 'Active' },
  { code: 'DL-0002', name: 'Kalaburagi Industrial Supplies', type: 'Dealer', city: 'Kalaburagi', gstin: '29AAKFK2210D1ZS', terms: '15 days', contact: 'M. Patil', outstanding: 186000, status: 'Active' },
  { code: 'DL-0003', name: 'Hubballi Engineering Mart', type: 'Dealer', city: 'Hubballi', gstin: '29AAHFH6612B1ZM', terms: 'Advance', contact: 'S. Kamat', outstanding: 0, status: 'Pending check' },
  { code: 'VN-0001', name: 'Karnataka Steel Traders', type: 'Vendor', city: 'Bengaluru', gstin: '29AAGFK4471M1ZQ', terms: '30 days', contact: 'Prakash Jain', outstanding: 1840000, status: 'Active' },
  { code: 'VN-0002', name: 'Sri Balaji Iron & Steel', type: 'Vendor', city: 'Hosapete', gstin: '29AAKFS3390H1Z8', terms: '15 days', contact: 'V. Reddy', outstanding: 620000, status: 'Active' },
  { code: 'VN-0003', name: 'Hospet Crane Services', type: 'Vendor', city: 'Hospet', gstin: '29AAHFH8820N1ZD', terms: 'Monthly', contact: 'Imtiaz K', outstanding: 268800, status: 'Active' },
  { code: 'VN-0004', name: 'Deccan Gases', type: 'Vendor', city: 'Ballari', gstin: '29AAEFD1192J1Z3', terms: '15 days', contact: 'N. Shetty', outstanding: 96000, status: 'Active' },
  { code: 'VN-0005', name: 'Nandi Weld Consumables', type: 'Vendor', city: 'Bengaluru', gstin: '29AAEFN5521E1ZJ', terms: '30 days', contact: 'R. Murthy', outstanding: 142000, status: 'Active' },
  { code: 'SC-0001', name: 'Rajesh Erectors', type: 'Subcontractor', city: 'Raichur', gstin: '29AAPFR2210K1ZC', terms: 'Bill-wise', contact: 'Rajesh B', outstanding: 384000, status: 'Active' },
  { code: 'SC-0002', name: 'Manjunath Labour Contractors', type: 'Subcontractor', city: 'Ballari', gstin: '29AAOFM4419A1ZG', terms: 'Weekly', contact: 'Manjunath H', outstanding: 0, status: 'Active' }
];

export interface Item { code: string; name: string; group: string; uom: string; onHand: number; min: number; rate: number; store: string; }
export const ITEMS: Item[] = [
  { code: 'ST-PL-010', name: 'MS plate 10 mm IS 2062 E250', group: 'Steel', uom: 'MT', onHand: 18.4, min: 12, rate: 61200, store: 'Ballari workshop' },
  { code: 'ST-PL-016', name: 'MS plate 16 mm IS 2062 E250', group: 'Steel', uom: 'MT', onHand: 6.2, min: 10, rate: 61800, store: 'Ballari workshop' },
  { code: 'ST-BM-300', name: 'ISMB 300 beam', group: 'Steel', uom: 'MT', onHand: 22.8, min: 15, rate: 63400, store: 'Ballari workshop' },
  { code: 'ST-CH-150', name: 'ISMC 150 channel', group: 'Steel', uom: 'MT', onHand: 9.6, min: 8, rate: 62900, store: 'Ballari workshop' },
  { code: 'ST-AN-065', name: 'ISA 65×65×6 angle', group: 'Steel', uom: 'MT', onHand: 4.1, min: 6, rate: 62100, store: 'Ballari workshop' },
  { code: 'WC-E7018', name: 'Welding electrode E7018 3.15 mm', group: 'Consumables', uom: 'kg', onHand: 640, min: 400, rate: 198, store: 'Ballari workshop' },
  { code: 'GS-OXY-47', name: 'Oxygen cylinder 47 L', group: 'Gases', uom: 'cyl', onHand: 18, min: 24, rate: 380, store: 'Ballari workshop' },
  { code: 'GS-LPG-19', name: 'LPG cylinder 19 kg (cutting)', group: 'Gases', uom: 'cyl', onHand: 11, min: 8, rate: 1840, store: 'Raichur site store' },
  { code: 'FX-HSFG-20', name: 'HSFG bolt M20 × 70 with nut', group: 'Fasteners', uom: 'nos', onHand: 2400, min: 1500, rate: 46, store: 'Raichur site store' },
  { code: 'PT-ZP-020', name: 'Zinc phosphate primer', group: 'Paints', uom: 'L', onHand: 160, min: 120, rate: 285, store: 'Ballari workshop' },
  { code: 'SP-EOT-BRK', name: 'EOT brake liner set', group: 'Spares', uom: 'set', onHand: 2, min: 2, rate: 7400, store: 'Hospet O&M store' },
  { code: 'SF-HRN-01', name: 'Full-body safety harness', group: 'Safety', uom: 'nos', onHand: 46, min: 40, rate: 2150, store: 'Ballari workshop' }
];
