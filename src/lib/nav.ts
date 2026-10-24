import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, LayoutGrid, Sparkles, Database, Megaphone, Calculator, Handshake, FolderKanban, CalendarClock,
  FileStack, ShoppingCart, Boxes, Users, Construction, Truck, ClipboardList, ShieldCheck, Receipt, Scale, Wrench,
  Landmark, BarChart3, Wallet, ListChecks, Activity, Zap, Settings
} from 'lucide-react';

export type ModuleKey =
  | 'dashboard' | 'modules' | 'ai'
  | 'masters' | 'leads' | 'estimates' | 'sales'
  | 'projects' | 'billing-estimate' | 'documents'
  | 'procurement' | 'inventory' | 'manpower' | 'hiring' | 'fleet'
  | 'dpr' | 'qaqc'
  | 'billing' | 'reconciliation' | 'om'
  | 'accounts' | 'mis' | 'hr'
  | 'approvals' | 'analytics' | 'automation' | 'settings';

export interface NavItem { key: ModuleKey; num?: number; label: string; short?: string; path: string; icon: LucideIcon; blurb: string; }
export interface NavGroup { title: string; items: NavItem[]; }

export const NAV: NavGroup[] = [
  { title: 'Overview', items: [
    { key: 'dashboard', label: 'Home', path: '/dashboard', icon: LayoutDashboard, blurb: 'Management dashboard, cash position and today\'s brief' },
    { key: 'ai', label: 'AI Manager', path: '/ai', icon: Sparkles, blurb: 'Central AI Manager and 7 agents' },
    { key: 'modules', label: 'All modules', path: '/modules', icon: LayoutGrid, blurb: 'Every module in the quotation, mapped to its screen' }
  ] },
  { title: 'Win the work', items: [
    { key: 'masters', num: 1, label: 'Master data', path: '/masters', icon: Database, blurb: 'Parties, items, employees, sites, stores, vehicles, equipment, tax masters, templates' },
    { key: 'leads', num: 2, label: 'Marketing & BD', path: '/leads', icon: Megaphone, blurb: 'Leads from website, WhatsApp, phone and IndiaMART; pipeline, campaigns, tenders' },
    { key: 'estimates', num: 3, label: 'Consultation & estimation', short: 'Estimation', path: '/estimates', icon: Calculator, blurb: 'Requirement capture, site assessment, rate analysis, estimate versions, one-click quotation' },
    { key: 'sales', num: 4, label: 'Sales, quotes & dealers', short: 'Sales & dealers', path: '/sales', icon: Handshake, blurb: 'Quotations, negotiation, orders; purchase-to-sell, dealer and direct channels' }
  ] },
  { title: 'Plan', items: [
    { key: 'projects', num: 5, label: 'Projects & controls', path: '/projects', icon: FolderKanban, blurb: 'Business-line templates, WBS, BOQ, budget, schedule, variations, project P&L' },
    { key: 'billing-estimate', num: 6, label: 'Monthly billing estimate', short: 'Billing estimate', path: '/billing-estimate', icon: CalendarClock, blurb: 'Site engineers and Accounts estimate each project\'s billing every month' },
    { key: 'documents', num: 7, label: 'Engineering & documents', path: '/documents', icon: FileStack, blurb: 'Drawings, BOQ, specifications, revisions, transmittals and register' }
  ] },
  { title: 'Resource', items: [
    { key: 'procurement', num: 8, label: 'Procurement', path: '/procurement', icon: ShoppingCart, blurb: 'Requisition, RFQ, vendor comparison, value-based approval, PO, delivery, vendor rating' },
    { key: 'inventory', num: 9, label: 'Inventory & stores', path: '/inventory', icon: Boxes, blurb: 'Receipts, issues, transfers, site stock, minimum levels; client-steel register' },
    { key: 'manpower', num: 10, label: 'Manpower deployment', path: '/manpower', icon: Users, blurb: 'Crews and contract labour to sites, attendance, man-hours, productivity' },
    { key: 'hiring', num: 11, label: 'Hiring & rents', path: '/hiring', icon: Construction, blurb: 'Hydra cranes and vehicles hired in; rooms rented for workers and staff' },
    { key: 'fleet', num: 12, label: 'Vehicles & fleet', path: '/fleet', icon: Truck, blurb: 'Vehicle and driver documents, trips, fuel, service, cost per km and per project' }
  ] },
  { title: 'Execute', items: [
    { key: 'dpr', num: 13, label: 'DPR & production', path: '/dpr', icon: ClipboardList, blurb: 'Daily work, production output, manpower, equipment, material, photos, delays, safety' },
    { key: 'qaqc', num: 14, label: 'QA / QC', path: '/qaqc', icon: ShieldCheck, blurb: 'Inspection requests, reports, NCRs, corrective actions, Quality Head closure' }
  ] },
  { title: 'Bill & close', items: [
    { key: 'billing', num: 15, label: 'Client billing', path: '/billing', icon: Receipt, blurb: 'RA, measurement and milestone bills; GST e-invoice and e-way bill' },
    { key: 'reconciliation', num: 16, label: 'Reconciliation & retention', short: 'Reconciliation', path: '/reconciliation', icon: Scale, blurb: 'Client-steel reconciliation, retention held and released, work and money reconciliation' },
    { key: 'om', num: 17, label: 'O&M & service', path: '/om', icon: Wrench, blurb: 'O&M on client production, workshop service, AMC, service tickets, spares' }
  ] },
  { title: 'Back office & finance', items: [
    { key: 'accounts', num: 18, label: 'Accounts & audit', path: '/accounts', icon: Landmark, blurb: 'Receivables, payables, bank, GST and TDS, audit trail, Tally sync' },
    { key: 'mis', num: 19, label: 'Finance & MIS', path: '/mis', icon: BarChart3, blurb: 'Budgeting, cash flow, working capital, MIS pack, cost control, risk register' },
    { key: 'hr', num: 20, label: 'Payroll, HR & statutory', short: 'Payroll & HR', path: '/hr', icon: Wallet, blurb: 'Attendance, salary, weekly cash advances, deductions; PF, ESI, PT, WCP, licence' }
  ] },
  { title: 'Platform', items: [
    { key: 'approvals', num: 21, label: 'Approvals & tasks', path: '/approvals', icon: ListChecks, blurb: 'Approval matrix by value and role, escalation, tasks and due dates' },
    { key: 'analytics', num: 22, label: 'Dashboards & alerts', path: '/analytics', icon: Activity, blurb: 'Role-based dashboards and alert rules for every module' },
    { key: 'automation', num: 23, label: 'Automation & notifications', short: 'Automation', path: '/automation', icon: Zap, blurb: 'Business events trigger tasks and alerts in-app, by email and on WhatsApp' },
    { key: 'settings', label: 'Settings & roles', path: '/settings', icon: Settings, blurb: 'Users, roles, companies, GSTINs, approval matrix, formats, integrations' }
  ] }
];

export const ALL_ITEMS: NavItem[] = NAV.flatMap(g => g.items);
export const itemByKey = (k: ModuleKey) => ALL_ITEMS.find(i => i.key === k)!;
