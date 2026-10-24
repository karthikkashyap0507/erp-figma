// Shared finance figures, used by the dashboard, MIS, retention, payroll and the AI Manager.

export const CASH_OPENING = 4260000; // bank + cash on 24 Oct 2026

export interface CashWeek { wk: string; dates: string; inflow: number; outflow: number; close: number; notes: string; }
export const CASH_WEEKS: CashWeek[] = [
  { wk: 'W44', dates: '27 Oct – 2 Nov', inflow: 3840000, outflow: 5120000, close: 2980000, notes: 'October payroll ₹28.4 L, vendors ₹14.6 L, hire and rents ₹5.6 L' },
  { wk: 'W45', dates: '3 – 9 Nov', inflow: 2160000, outflow: 1640000, close: 3500000, notes: 'Coromandel RA 05 and dealer collections' },
  { wk: 'W46', dates: '10 – 16 Nov', inflow: 1280000, outflow: 2920000, close: 1860000, notes: 'GST ₹11.8 L, PF/ESI ₹6.9 L, vendors ₹8.0 L' },
  { wk: 'W47', dates: '17 – 23 Nov', inflow: 4620000, outflow: 1840000, close: 4640000, notes: 'O&M October tonnage bill ₹34 L collected' }
];

export interface Retention { project: string; name: string; client: string; held: number; due: string; condition: string; state: 'Due this month' | 'Held' | 'Blocked'; gate?: string; }
export const RETENTIONS: Retention[] = [
  { project: 'PRJ-23-087', name: 'Mill building re-sheeting', client: 'Vijayanagar Alloys Ltd', held: 640000, due: '31 Oct 2026', condition: 'Defects period ends 31 Oct', state: 'Blocked', gate: 'Client-steel reconciliation not yet accepted by Accounts' },
  { project: 'PRJ-24-103', name: 'Conveyor gallery', client: 'Kaveri Power Ltd', held: 430000, due: 'After final bill', condition: '5% of service RA bills', state: 'Held' },
  { project: 'PRJ-24-102', name: 'Kiln shell & cyclone repair', client: 'Coromandel Cement Ltd', held: 224000, due: 'After final bill', condition: '5% of RA bills; steel reconciliation required', state: 'Held' },
  { project: 'PRJ-24-107', name: 'Cooling tower refurbishment', client: 'Kaveri Power Ltd', held: 78000, due: 'After final bill', condition: '5% of RA bills', state: 'Held' }
];

export interface Advance { code: string; name: string; trade: string; site: string; given: number; recovered: number; status: 'Active' | 'Left'; weeks: number; }
export const ADVANCES: Advance[] = [
  { code: 'W-1042', name: 'Ramesh Naik', trade: 'Fitter', site: 'Ballari works', given: 14000, recovered: 10500, status: 'Active', weeks: 4 },
  { code: 'W-1088', name: 'Basavaraj H', trade: 'Welder', site: 'Raichur TPS', given: 12000, recovered: 6000, status: 'Active', weeks: 4 },
  { code: 'W-1131', name: 'Anil Kumar', trade: 'Rigger', site: 'Raichur TPS', given: 9000, recovered: 3000, status: 'Active', weeks: 3 },
  { code: 'W-1177', name: 'Shivu M', trade: 'Helper', site: 'Kalaburagi plant', given: 7000, recovered: 7000, status: 'Active', weeks: 2 },
  { code: 'W-0954', name: 'Mohammed Irfan', trade: 'Gas cutter', site: 'Kalaburagi plant', given: 10500, recovered: 3500, status: 'Left', weeks: 3 },
  { code: 'W-0991', name: 'Prakash R', trade: 'Helper', site: 'Ballari BF-2', given: 6000, recovered: 0, status: 'Left', weeks: 2 },
  { code: 'W-1203', name: 'Mallikarjun K', trade: 'Welder', site: 'Ballari BF-2', given: 8000, recovered: 2000, status: 'Active', weeks: 2 }
];

export interface BillEstimate { project: string; name: string; basis: string; engineer: number; accounts: number; lastMonthEst: number; lastMonthActual: number; status: 'Agreed' | 'Under review' | 'Draft'; }
export const BILL_ESTIMATES: BillEstimate[] = [
  { project: 'PRJ-24-101', name: 'Bay 4 structural steel', basis: 'Dispatch plan · 42 MT', engineer: 2860000, accounts: 2740000, lastMonthEst: 2600000, lastMonthActual: 2480000, status: 'Agreed' },
  { project: 'PRJ-24-102', name: 'Kiln shell & cyclone repair', basis: 'RA 05 measurement', engineer: 1420000, accounts: 1180000, lastMonthEst: 1300000, lastMonthActual: 960000, status: 'Under review' },
  { project: 'PRJ-24-103', name: 'Conveyor gallery', basis: 'Supply 38 MT + erection RA 03', engineer: 3640000, accounts: 3520000, lastMonthEst: 3200000, lastMonthActual: 3080000, status: 'Agreed' },
  { project: 'PRJ-24-104', name: 'Slag handling O&M', basis: '₹212/t × 26,000 t run-rate', engineer: 5510000, accounts: 5400000, lastMonthEst: 5300000, lastMonthActual: 5390000, status: 'Agreed' },
  { project: 'PRJ-24-105', name: 'Shutdown manpower BF-2', basis: '120 heads × 4 days to 29 Oct', engineer: 576000, accounts: 576000, lastMonthEst: 2880000, lastMonthActual: 2780000, status: 'Agreed' },
  { project: 'PRJ-24-106', name: 'PEB shed costing', basis: 'Fee milestone 2 (report)', engineer: 195000, accounts: 195000, lastMonthEst: 0, lastMonthActual: 0, status: 'Agreed' },
  { project: 'PRJ-24-107', name: 'Cooling tower refurbishment', basis: 'RA 02 — behind schedule', engineer: 980000, accounts: 640000, lastMonthEst: 900000, lastMonthActual: 580000, status: 'Under review' }
];

export interface Expiry { item: string; kind: string; owner: string; date: string; days: number; module: string; }
export const EXPIRIES: Expiry[] = [
  { item: 'HIRE-0031 Hydra 14 T agreement', kind: 'Equipment hire', owner: 'Arjun Patil', date: '27 Oct 2026', days: 3, module: '/hiring' },
  { item: 'KA-34-AB-1123 Bolero pickup — insurance', kind: 'Vehicle document', owner: 'Venkatesh Reddy', date: '05 Nov 2026', days: 12, module: '/fleet' },
  { item: 'Driver licence — Ramesh N (HMV)', kind: 'Driver document', owner: 'Venkatesh Reddy', date: '12 Nov 2026', days: 19, module: '/fleet' },
  { item: 'KA-35-C-8812 Tata 407 — fitness certificate', kind: 'Vehicle document', owner: 'Venkatesh Reddy', date: '18 Nov 2026', days: 25, module: '/fleet' },
  { item: 'Labour licence (CLRA) — Ballari BF-2', kind: 'Statutory licence', owner: 'Lakshmi Rao', date: '20 Nov 2026', days: 27, module: '/hr' }
];

export const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
export const REVENUE_TREND = { billed: [118, 126, 131, 138, 146, 153], collected: [104, 112, 120, 125, 131, 140] }; // ₹ lakh per month
