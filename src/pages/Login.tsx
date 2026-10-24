import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, ArrowRight, Sparkles, Layers, Users, Lock } from 'lucide-react';
import { COMPANY } from '../data/core';
import { ROLES } from '../lib/roles';
import { setState, useApp } from '../lib/store';

export default function Login() {
  const nav = useNavigate();
  const role = useApp(s => s.role);
  const [step, setStep] = useState<1 | 2>(1);
  const [id, setId] = useState('98450 12345');
  const [otp, setOtp] = useState(['4', '8', '2', '1', '9', '6']);
  return (
    <div className="login">
      <section className="login-hero ai-grad">
        <div className="row" style={{ gap: 12 }}>
          <span className="brand-mark" style={{ width: 42, height: 42, fontSize: 20 }}>S</span>
          <span className="col" style={{ gap: 0 }}><span style={{ fontSize: 20, fontWeight: 800 }}>Streamlyned ERP</span><span style={{ color: '#AFC0F0', fontSize: 13 }}>{COMPANY.legal}</span></span>
        </div>
        <div className="col" style={{ gap: 18, maxWidth: 560 }}>
          <h1 style={{ fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.08, letterSpacing: '-.03em' }}>One system from the first enquiry to the final bill.</h1>
          <p style={{ color: '#C9D4F2', fontSize: 16, lineHeight: 1.6 }}>Six business lines, one database and one login. Data is entered once — at the site, in the store or in accounts — and flows to every module that needs it.</p>
          <div className="grid g3" style={{ gap: 12 }}>
            {[[Layers, '6 business lines', 'Sales, service, O&M, manpower, consultation'], [Sparkles, 'AI Manager', '7 agents that prepare the work; people approve'], [Users, 'Unlimited users', 'Companies, GSTINs, branches and sites']].map(([I, t, d]) => {
              const Icon = I as typeof Layers;
              return <div key={t as string} style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}><Icon size={18} color="#9FB3FF" /><div style={{ fontWeight: 700, marginTop: 8 }}>{t as string}</div><div style={{ fontSize: 12.5, color: '#B9C5E8', marginTop: 2 }}>{d as string}</div></div>;
            })}
          </div>
        </div>
        <div className="row" style={{ gap: 8, color: '#9FB0DA', fontSize: 12.5 }}><Lock size={14} />Encrypted in transit and at rest · every action in the audit trail</div>
      </section>
      <section className="login-form">
        <div className="col" style={{ width: 'min(400px, 100%)', gap: 20 }}>
          <div className="col" style={{ gap: 6 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800 }}>{step === 1 ? 'Sign in' : 'Enter the code'}</h2>
            <p className="muted">{step === 1 ? 'Use your registered mobile number or work email. We will send a one-time code.' : `We sent a 6-digit code to +91 ${id} on WhatsApp.`}</p>
          </div>
          {step === 1 ? (
            <>
              <label className="field"><span className="label">Mobile number or email</span>
                <div className="row" style={{ gap: 0 }}><span className="input" style={{ width: 64, display: 'grid', placeItems: 'center', borderRadius: '9px 0 0 9px', borderRight: 'none', background: 'var(--surface-2)' }}>+91</span><input className="input" style={{ borderRadius: '0 9px 9px 0', height: 46 }} value={id} onChange={e => setId(e.target.value)} /></div>
              </label>
              <label className="field"><span className="label">Sign in as (demo)</span>
                <select className="select" value={role} onChange={e => setState({ role: e.target.value as typeof role })} style={{ height: 46 }}>
                  {ROLES.map(r => <option key={r.key} value={r.key}>{r.person} — {r.name}</option>)}
                </select>
                <span className="hint">Each role sees only the modules, projects and figures it needs.</span>
              </label>
              <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}><Smartphone size={17} />Send code<ArrowRight size={17} /></button>
            </>
          ) : (
            <>
              <div className="row" style={{ gap: 8 }} role="group" aria-label="One-time code">
                {otp.map((d, i) => <input key={i} aria-label={`Digit ${i + 1}`} className="input" inputMode="numeric" maxLength={1} value={d} onChange={e => setOtp(o => o.map((x, j) => j === i ? e.target.value.slice(-1) : x))} style={{ width: 52, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700 }} />)}
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => nav('/dashboard')}><ShieldCheck size={17} />Verify and sign in</button>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Use a different number</button>
            </>
          )}
          <div className="callout info"><ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} /><span>Individual logins with OTP. Sessions sign out automatically after inactivity.</span></div>
        </div>
      </section>
    </div>
  );
}
