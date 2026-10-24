import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Sparkles, Lightbulb, Menu, ChevronsUpDown, LogOut, RotateCcw, Check, Building2, CircleCheck, Info, TriangleAlert, ArrowRight, MessageCircle, Mail, Monitor } from 'lucide-react';
import { NAV, ALL_ITEMS } from '../lib/nav';
import { ROLES, roleByKey, canSee } from '../lib/roles';
import { useApp, setState, resetDemo, toast } from '../lib/store';
import { COMPANIES, COMPANY } from '../data/core';
import { PARTIES, ITEMS } from '../data/core';
import { Avatar, Switch } from './ui';

function Sidebar() {
  const role = roleByKey(useApp(s => s.role));
  const navOpen = useApp(s => s.navOpen);
  const company = useApp(s => s.company);
  const pending = useApp(s => s.approvals.filter(a => a.status === 'Pending').length);
  const [coOpen, setCoOpen] = useState(false);
  return (
    <>
      <div className={'sidebar-scrim' + (navOpen ? ' show' : '')} onClick={() => setState({ navOpen: false })} />
      <aside className={'sidebar' + (navOpen ? ' open' : '')} aria-label="Main navigation">
        <Link to="/dashboard" className="brand" style={{ textDecoration: 'none' }}>
          <span className="brand-mark">S</span>
          <span className="col" style={{ gap: 0 }}><span className="brand-name">Streamlyned ERP</span><span className="brand-sub">{COMPANY.name}</span></span>
        </Link>
        <div style={{ position: 'relative' }}>
          <button className="company-switch" onClick={() => setCoOpen(o => !o)} aria-expanded={coOpen}>
            <Building2 size={16} color="#8FA8FF" />
            <span className="col grow" style={{ gap: 0 }}><span style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{COMPANIES[company].name}</span><span style={{ fontSize: 11, color: 'var(--nav-muted)' }}>GSTIN {COMPANIES[company].gstin}</span></span>
            <ChevronsUpDown size={14} color="var(--nav-muted)" />
          </button>
          {coOpen && (
            <div className="card" style={{ position: 'absolute', zIndex: 20, left: 0, right: 0, top: 'calc(100% - 4px)', padding: 6, color: 'var(--ink)' }}>
              <div className="xs muted" style={{ padding: '4px 8px 6px' }}>Unlimited companies, GSTINs and branches</div>
              {COMPANIES.map((c, i) => (
                <button key={c.gstin} className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start', height: 'auto', padding: '8px', color: 'var(--ink)' }} onClick={() => { setState({ company: i }); setCoOpen(false); toast(`Switched to ${c.name}`, 'info'); }}>
                  <span className="col" style={{ gap: 0, alignItems: 'flex-start', textAlign: 'left' }}><span className="small strong">{c.name}</span><span className="xs muted">{c.gstin} · {c.branches.length} branch{c.branches.length > 1 ? 'es' : ''}</span></span>
                  {i === company && <Check size={15} className="ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>
        {NAV.map(g => {
          const items = g.items.filter(i => canSee(role, i.key));
          if (!items.length) return null;
          return (
            <div key={g.title}>
              <div className="nav-group">{g.title}</div>
              {items.map(i => (
                <NavLink key={i.key} to={i.path} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '') + (i.key === 'ai' ? ' nav-ai' : '')} onClick={() => setState({ navOpen: false })}>
                  <i.icon size={17} />
                  <span>{i.short || i.label}</span>
                  {i.key === 'approvals' && pending > 0 ? <span className="nav-badge">{pending}</span> : i.num ? <span className="nav-num">{String(i.num).padStart(2, '0')}</span> : null}
                </NavLink>
              ))}
            </div>
          );
        })}
        <div className="sidebar-foot"><Avatar name={role.person} size={24} /><span className="col" style={{ gap: 0 }}><span style={{ color: '#fff', fontWeight: 600 }}>{role.person}</span><span>{role.name}</span></span></div>
      </aside>
    </>
  );
}

const CH: Record<string, React.ReactNode> = { WhatsApp: <MessageCircle size={12} />, Email: <Mail size={12} />, 'In-app': <Monitor size={12} /> };

function Notifications({ onClose }: { onClose: () => void }) {
  const alerts = useApp(s => s.alerts);
  const nav = useNavigate();
  return (
    <div className="card" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 'min(400px, calc(100vw - 24px))', zIndex: 40, boxShadow: 'var(--shadow-lg)' }}>
      <div className="card-h"><h2>Alerts</h2><span className="sub">Event-driven · in-app, email and WhatsApp</span><Link to="/automation" className="small ml-auto" onClick={onClose}>Rules</Link></div>
      <div style={{ maxHeight: 420, overflowY: 'auto' }}>
        {alerts.map(a => (
          <button key={a.id} className="list-row clickable" style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--line-2)', background: 'none', textAlign: 'left', cursor: 'pointer' }} onClick={() => { nav(a.path); onClose(); }}>
            <span className={`ico-box t-${a.tone}`} style={{ width: 30, height: 30 }}>{a.tone === 'red' ? <TriangleAlert size={15} /> : a.tone === 'amber' ? <Info size={15} /> : <CircleCheck size={15} />}</span>
            <span className="col grow" style={{ gap: 2 }}><span className="small strong">{a.title}</span><span className="xs muted">{a.detail}</span><span className="xs muted row" style={{ gap: 6 }}>{a.module} · {a.when} · <span className="row" style={{ gap: 3 }}>{CH[a.channel]}{a.channel}</span></span></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function UserMenu({ onClose }: { onClose: () => void }) {
  const nav = useNavigate();
  return (
    <div className="card" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 240, zIndex: 40, padding: 6, boxShadow: 'var(--shadow-lg)' }}>
      <button className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start', color: 'var(--ink)' }} onClick={() => { resetDemo(); toast('Demo data reset'); onClose(); }}><RotateCcw size={15} />Reset demo data</button>
      <button className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start', color: 'var(--ink)' }} onClick={() => { onClose(); nav('/'); }}><LogOut size={15} />Sign out</button>
    </div>
  );
}

function SearchPalette() {
  const open = useApp(s => s.searchOpen);
  const projects = useApp(s => s.projects);
  const approvals = useApp(s => s.approvals);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(() => inputRef.current?.focus(), 10); } }, [open]);
  const results = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const r: { group: string; label: string; sub: string; path: string }[] = [];
    ALL_ITEMS.forEach(i => r.push({ group: 'Modules', label: i.label, sub: i.blurb, path: i.path }));
    projects.forEach(p => r.push({ group: 'Projects', label: `${p.code} · ${p.name}`, sub: `${p.client} · ${p.status}`, path: `/projects/${p.id}` }));
    approvals.forEach(a => r.push({ group: 'Approvals', label: `${a.ref} · ${a.title}`, sub: `${a.kind} · ${a.status}`, path: '/approvals' }));
    PARTIES.forEach(p => r.push({ group: 'Parties', label: `${p.code} · ${p.name}`, sub: `${p.type} · ${p.city}`, path: '/masters' }));
    ITEMS.forEach(i => r.push({ group: 'Items', label: `${i.code} · ${i.name}`, sub: `${i.onHand} ${i.uom} at ${i.store}`, path: '/inventory' }));
    if (!ql) return r.filter(x => x.group === 'Modules').slice(0, 8);
    return r.filter(x => (x.label + ' ' + x.sub).toLowerCase().includes(ql)).slice(0, 12);
  }, [q, projects, approvals]);
  if (!open) return null;
  const go = (i: number) => { const r = results[i]; if (!r) return; setState({ searchOpen: false }); nav(r.path); };
  return (
    <div className="overlay" style={{ alignItems: 'flex-start', paddingTop: '10vh' }} onClick={() => setState({ searchOpen: false })}>
      <div className="modal" style={{ margin: '0 auto', width: 'min(640px, calc(100% - 24px))' }} onClick={e => e.stopPropagation()} role="dialog" aria-label="Search">
        <div className="row" style={{ padding: '0 16px', height: 56, borderBottom: '1px solid var(--line)' }}>
          <Search size={18} color="var(--primary)" />
          <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setSel(0); }} aria-label="Search everything" placeholder="Search modules, projects, POs, parties, items…" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15.5, background: 'transparent' }}
            onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, results.length - 1)); } if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); } if (e.key === 'Enter') go(sel); if (e.key === 'Escape') setState({ searchOpen: false }); }} />
          <span className="kbd">Esc</span>
        </div>
        <div style={{ maxHeight: '56vh', overflowY: 'auto', padding: 6 }}>
          {results.length === 0 && <div className="empty">Nothing matches “{q}”.</div>}
          {results.map((r, i) => (
            <button key={r.group + r.label} onMouseEnter={() => setSel(i)} onClick={() => go(i)} className="row" style={{ width: '100%', padding: '9px 10px', border: 'none', borderRadius: 8, background: i === sel ? 'var(--primary-soft)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}>
              <span className="tag" style={{ minWidth: 74, justifyContent: 'center' }}>{r.group}</span>
              <span className="col grow" style={{ gap: 1 }}><span className="small strong">{r.label}</span><span className="xs muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}</span></span>
              <ArrowRight size={14} color="var(--ink-3)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Topbar() {
  const roleKey = useApp(s => s.role);
  const showWhy = useApp(s => s.showWhy);
  const role = roleByKey(roleKey);
  const [pop, setPop] = useState<'' | 'bell' | 'user'>('');
  const nav = useNavigate();
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setState({ searchOpen: true }); } };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  }, []);
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setState({ navOpen: true })}><Menu size={20} /></button>
      <button className="search-trigger" onClick={() => setState({ searchOpen: true })}>
        <Search size={16} /><span className="grow hide-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Search modules, projects, POs, parties…</span><span className="kbd">Ctrl K</span>
      </button>
      <div className="row ml-auto" style={{ gap: 8 }}>
        <label className="row hide-sm" style={{ gap: 8, padding: '0 10px', height: 36, borderRadius: 9, background: showWhy ? 'var(--why-bg)' : 'var(--surface-3)', border: `1px solid ${showWhy ? 'var(--why-line)' : 'var(--line)'}`, cursor: 'pointer' }} title="Show or hide the 'Why it matters' notes">
          <Lightbulb size={15} color={showWhy ? 'var(--why-ink)' : 'var(--ink-3)'} />
          <span className="small strong" style={{ color: showWhy ? 'var(--why-ink)' : 'var(--ink-3)' }}>Why it matters</span>
          <Switch on={showWhy} onChange={v => setState({ showWhy: v })} label="Show why-it-matters notes" />
        </label>
        <label className="row" style={{ gap: 6 }}>
          <span className="xs muted hide-sm">View as</span>
          <select className="select" aria-label="View as role" value={roleKey} onChange={e => { setState({ role: e.target.value as typeof roleKey }); toast(`Now viewing as ${roleByKey(e.target.value as typeof roleKey).name}`, 'info'); }} style={{ height: 36, width: 'auto', maxWidth: 190, fontSize: 13, fontWeight: 600 }}>
            {ROLES.map(r => <option key={r.key} value={r.key}>{r.name}</option>)}
          </select>
        </label>
        <button className="btn btn-sm hide-sm" style={{ height: 36, background: 'var(--nav)', color: '#fff', borderColor: 'var(--nav)' }} onClick={() => nav('/ai')}><Sparkles size={15} color="#9FB3FF" />Ask AI</button>
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" aria-label="Alerts" onClick={() => setPop(p => p === 'bell' ? '' : 'bell')}><Bell size={19} /><span className="dot-badge" /></button>
          {pop === 'bell' && <Notifications onClose={() => setPop('')} />}
        </div>
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" style={{ width: 'auto', padding: '0 4px' }} aria-label="Account menu" onClick={() => setPop(p => p === 'user' ? '' : 'user')}><Avatar name={role.person} size={32} /></button>
          {pop === 'user' && <UserMenu onClose={() => setPop('')} />}
        </div>
      </div>
    </header>
  );
}

function Toasts() {
  const toasts = useApp(s => s.toasts);
  return <div className="toasts" aria-live="polite">{toasts.map(t => <div key={t.id} className="toast">{t.tone === 'warn' ? <TriangleAlert size={16} color="#FBBF24" /> : t.tone === 'info' ? <Info size={16} color="#93C5FD" /> : <CircleCheck size={16} color="#4ADE80" />}{t.text}</div>)}</div>;
}

export default function Layout() {
  const loc = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="content"><Suspense fallback={<div className="muted small" style={{ padding: 24 }}>Loading…</div>}><Outlet /></Suspense></main>
      </div>
      <SearchPalette />
      <Toasts />
    </div>
  );
}

export { Toasts };
