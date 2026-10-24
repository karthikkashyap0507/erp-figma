import { lazy, type ReactNode } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Layout, { Toasts } from './components/Layout';
import { useApp } from './lib/store';
import { roleByKey, canSee } from './lib/roles';
import { itemByKey, type ModuleKey } from './lib/nav';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
const Modules = lazy(() => import('./pages/Modules'));
const AIManager = lazy(() => import('./pages/AIManager'));
const AgentDetail = lazy(() => import('./pages/AgentDetail'));
const Masters = lazy(() => import('./pages/Masters'));
const Leads = lazy(() => import('./pages/Leads'));
const Estimates = lazy(() => import('./pages/Estimates'));
const Sales = lazy(() => import('./pages/Sales'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const BillingEstimate = lazy(() => import('./pages/BillingEstimate'));
const Documents = lazy(() => import('./pages/Documents'));
const Procurement = lazy(() => import('./pages/Procurement'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Manpower = lazy(() => import('./pages/Manpower'));
const Hiring = lazy(() => import('./pages/Hiring'));
const Fleet = lazy(() => import('./pages/Fleet'));
const DPR = lazy(() => import('./pages/DPR'));
const QAQC = lazy(() => import('./pages/QAQC'));
const Billing = lazy(() => import('./pages/Billing'));
const Reconciliation = lazy(() => import('./pages/Reconciliation'));
const OM = lazy(() => import('./pages/OM'));
const Accounts = lazy(() => import('./pages/Accounts'));
const MIS = lazy(() => import('./pages/MIS'));
const HR = lazy(() => import('./pages/HR'));
const Approvals = lazy(() => import('./pages/Approvals'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Automation = lazy(() => import('./pages/Automation'));
const Settings = lazy(() => import('./pages/Settings'));

function Guard({ m, children }: { m: ModuleKey; children: ReactNode }) {
  const role = roleByKey(useApp(s => s.role));
  if (canSee(role, m)) return <>{children}</>;
  const item = itemByKey(m);
  return (
    <div className="card" style={{ maxWidth: 560, margin: '48px auto' }}>
      <div className="card-b" style={{ alignItems: 'center', textAlign: 'center', padding: 32 }}>
        <span className="ico-box t-grey" style={{ width: 48, height: 48 }}><Lock size={22} /></span>
        <h2 style={{ fontSize: 18 }}>{item.label} is not part of the {role.name} role</h2>
        <p className="muted">Each person sees only the modules, projects and figures their role needs. Switch the “View as” role in the top bar to see this screen.</p>
        <Link to="/dashboard" className="btn">Back to home</Link>
      </div>
    </div>
  );
}

const g = (m: ModuleKey, el: ReactNode) => <Guard m={m}>{el}</Guard>;

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/ai" element={<AIManager />} />
          <Route path="/ai/:agent" element={<AgentDetail />} />
          <Route path="/masters" element={g('masters', <Masters />)} />
          <Route path="/leads" element={g('leads', <Leads />)} />
          <Route path="/estimates" element={g('estimates', <Estimates />)} />
          <Route path="/sales" element={g('sales', <Sales />)} />
          <Route path="/projects" element={g('projects', <Projects />)} />
          <Route path="/projects/:id" element={g('projects', <ProjectDetail />)} />
          <Route path="/billing-estimate" element={g('billing-estimate', <BillingEstimate />)} />
          <Route path="/documents" element={g('documents', <Documents />)} />
          <Route path="/procurement" element={g('procurement', <Procurement />)} />
          <Route path="/inventory" element={g('inventory', <Inventory />)} />
          <Route path="/manpower" element={g('manpower', <Manpower />)} />
          <Route path="/hiring" element={g('hiring', <Hiring />)} />
          <Route path="/fleet" element={g('fleet', <Fleet />)} />
          <Route path="/dpr" element={g('dpr', <DPR />)} />
          <Route path="/qaqc" element={g('qaqc', <QAQC />)} />
          <Route path="/billing" element={g('billing', <Billing />)} />
          <Route path="/reconciliation" element={g('reconciliation', <Reconciliation />)} />
          <Route path="/om" element={g('om', <OM />)} />
          <Route path="/accounts" element={g('accounts', <Accounts />)} />
          <Route path="/mis" element={g('mis', <MIS />)} />
          <Route path="/hr" element={g('hr', <HR />)} />
          <Route path="/approvals" element={g('approvals', <Approvals />)} />
          <Route path="/analytics" element={g('analytics', <Analytics />)} />
          <Route path="/automation" element={g('automation', <Automation />)} />
          <Route path="/settings" element={g('settings', <Settings />)} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toasts />
    </>
  );
}
