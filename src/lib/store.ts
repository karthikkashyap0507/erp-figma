import { useRef, useSyncExternalStore } from 'react';
import type { RoleKey } from './roles';
import { APPROVALS, TASKS, ALERTS, LEADS, type Approval, type Task, type Alert, type Lead } from '../data/workflow';
import { PROJECTS, type Project } from '../data/core';

export interface Toast { id: number; text: string; tone?: 'ok' | 'info' | 'warn'; }

export interface AppState {
  role: RoleKey;
  showWhy: boolean;
  company: number;
  toasts: Toast[];
  approvals: Approval[];
  tasks: Task[];
  alerts: Alert[];
  leads: Lead[];
  projects: Project[];
  aiOpen: boolean;
  searchOpen: boolean;
  navOpen: boolean;
}

function load<T>(k: string, d: T): T {
  try { const v = localStorage.getItem('sl.' + k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
}
function save(k: string, v: unknown) { try { localStorage.setItem('sl.' + k, JSON.stringify(v)); } catch { /* ignore */ } }

let state: AppState = {
  role: load<RoleKey>('role', 'md'),
  showWhy: load<boolean>('showWhy', true),
  company: 0,
  toasts: [],
  approvals: APPROVALS.map(a => ({ ...a, route: a.route.map(r => ({ ...r })) })),
  tasks: TASKS.map(t => ({ ...t })),
  alerts: ALERTS.slice(),
  leads: LEADS.map(l => ({ ...l })),
  projects: PROJECTS.map(p => ({ ...p })),
  aiOpen: false,
  searchOpen: false,
  navOpen: false
};

const subs = new Set<() => void>();
function emit() { subs.forEach(f => f()); }

export function setState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p };
  if ('role' in p) save('role', state.role);
  if ('showWhy' in p) save('showWhy', state.showWhy);
  emit();
}

export function getState() { return state; }

function subscribe(cb: () => void) { subs.add(cb); return () => { subs.delete(cb); }; }

/** Selects from the store. Results are cached per state version so selectors may build new arrays safely. */
export function useApp<T>(sel: (s: AppState) => T): T {
  const cache = useRef<{ s: AppState | null; v: T }>({ s: null, v: undefined as T });
  const get = () => {
    if (cache.current.s !== state) cache.current = { s: state, v: sel(state) };
    return cache.current.v;
  };
  return useSyncExternalStore(subscribe, get, get);
}

let toastId = 0;
export function toast(text: string, tone: Toast['tone'] = 'ok') {
  const id = ++toastId;
  setState(s => ({ toasts: [...s.toasts, { id, text, tone }] }));
  setTimeout(() => setState(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3200);
}

export function decideApproval(id: string, decision: 'Approved' | 'Rejected') {
  setState(s => ({
    approvals: s.approvals.map(a => a.id !== id ? a : {
      ...a, status: decision,
      route: a.route.map(r => r.state === 'waiting' ? { ...r, state: 'done' } : r)
    })
  }));
}

export function resetDemo() {
  setState({
    approvals: APPROVALS.map(a => ({ ...a, route: a.route.map(r => ({ ...r })) })),
    tasks: TASKS.map(t => ({ ...t })), alerts: ALERTS.slice(), leads: LEADS.map(l => ({ ...l })), projects: PROJECTS.map(p => ({ ...p }))
  });
}
