import type { ModuleKey } from './nav';

export type RoleKey =
  | 'md' | 'accounts' | 'ca' | 'hr' | 'pm' | 'site' | 'estimation' | 'engineering'
  | 'quality' | 'purchase' | 'stores' | 'sales' | 'fleet';

export interface Role {
  key: RoleKey;
  name: string;
  person: string;
  work: string;
  approves: string;
  modules: ModuleKey[] | 'all';
  seesMargin: boolean;
  seesSalary: boolean;
  readOnly?: boolean;
}

const common: ModuleKey[] = ['dashboard', 'ai', 'modules', 'approvals', 'analytics'];

export const ROLES: Role[] = [
  { key: 'md', name: 'Managing Director', person: 'Shah Rukh', work: 'All dashboards, MIS, profitability, cash position', approves: 'High-value POs, quotations, payments, budgets', modules: 'all', seesMargin: true, seesSalary: true },
  { key: 'accounts', name: 'Accounts / Finance', person: 'Deepa Nair', work: 'Billing, receipts, payments, equipment hire charges, reconciliation & retention, MIS', approves: 'Invoices, payments, client-steel reconciliation, retention claims', modules: [...common, 'billing', 'reconciliation', 'accounts', 'mis', 'billing-estimate', 'hiring', 'projects', 'masters', 'om'], seesMargin: true, seesSalary: true },
  { key: 'ca', name: 'CA / Auditor', person: 'R. Srinivasan & Co.', work: 'Read-only books, Finance Agent findings, audit trail', approves: 'Reviews tax and compliance workings', modules: ['dashboard', 'ai', 'modules', 'accounts', 'mis', 'reconciliation', 'hr'], seesMargin: true, seesSalary: true, readOnly: true },
  { key: 'hr', name: 'HR & Payroll', person: 'Lakshmi Rao', work: 'Employees, attendance, payroll, weekly cash advances, room rents, statutory documents', approves: 'Advances, deductions, payroll run', modules: [...common, 'hr', 'manpower', 'hiring', 'masters'], seesMargin: false, seesSalary: true },
  { key: 'pm', name: 'Project Manager', person: 'Arjun Patil', work: 'Project setup, budget, schedule, progress, project P&L', approves: 'Requisitions, variations, measurements', modules: [...common, 'projects', 'billing-estimate', 'documents', 'procurement', 'inventory', 'manpower', 'hiring', 'dpr', 'qaqc', 'billing', 'reconciliation'], seesMargin: true, seesSalary: false },
  { key: 'site', name: 'Site Engineer', person: 'Suresh Gowda', work: 'DPR, production, attendance, measurements, monthly billing estimate', approves: 'Site material requests', modules: ['dashboard', 'ai', 'modules', 'dpr', 'billing-estimate', 'manpower', 'inventory', 'procurement', 'qaqc', 'projects'], seesMargin: false, seesSalary: false },
  { key: 'estimation', name: 'Consultation & Estimation', person: 'Meera Iyer', work: 'Requirements, rate analysis, estimates', approves: 'Estimates before quotation', modules: [...common, 'estimates', 'leads', 'sales', 'projects', 'documents'], seesMargin: true, seesSalary: false },
  { key: 'engineering', name: 'Engineering', person: 'Kiran Desai', work: 'Drawings, BOQ, revisions, document control', approves: 'Technical approvals', modules: [...common, 'documents', 'projects', 'qaqc', 'estimates'], seesMargin: false, seesSalary: false },
  { key: 'quality', name: 'Quality Head', person: 'Kavya Hegde', work: 'Inspections, inspection reports, NCRs', approves: 'QC approval, NCR closure', modules: [...common, 'qaqc', 'dpr', 'projects', 'documents', 'inventory'], seesMargin: false, seesSalary: false },
  { key: 'purchase', name: 'Purchase', person: 'Imran Sheikh', work: 'RFQs, vendor comparison, purchase orders', approves: 'Vendor selection (within limits)', modules: [...common, 'procurement', 'inventory', 'masters', 'hiring'], seesMargin: false, seesSalary: false },
  { key: 'stores', name: 'Stores', person: 'Mahesh Kumar', work: 'Receipts, issues, transfers, client-steel register', approves: 'Stock adjustments (with approval)', modules: [...common, 'inventory', 'procurement'], seesMargin: false, seesSalary: false },
  { key: 'sales', name: 'Sales / Marketing', person: 'Rohit Menon', work: 'Leads, follow-ups, quotations, dealers', approves: 'Discounts within limits', modules: [...common, 'leads', 'sales', 'estimates', 'masters'], seesMargin: true, seesSalary: false },
  { key: 'fleet', name: 'Fleet / O&M in-charge', person: 'Venkatesh Reddy', work: 'Vehicles, trips, fuel, O&M production logs, service tickets', approves: 'Service and fuel entries', modules: [...common, 'fleet', 'om', 'hiring', 'dpr'], seesMargin: false, seesSalary: false }
];

export const roleByKey = (k: RoleKey) => ROLES.find(r => r.key === k)!;
export const canSee = (r: Role, m: ModuleKey) => r.modules === 'all' || r.modules.includes(m) || m === 'settings' && r.key === 'md';
