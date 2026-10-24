// Indian number formatting helpers.

function group(intPart: string): string {
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  return (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' : '') + last3;
}

export function num(n: number, dec = 0): string {
  const neg = n < 0;
  const [i, f] = Math.abs(n).toFixed(dec).split('.');
  return (neg ? '−' : '') + group(i) + (f ? '.' + f : '');
}

export function inr(n: number, dec = 0): string {
  return (n < 0 ? '−' : '') + '₹' + num(Math.abs(n), dec);
}

/** Compact rupees: ₹8,450 · ₹4.86 L · ₹1.86 Cr */
export function money(n: number): string {
  const a = Math.abs(n);
  const s = n < 0 ? '−' : '';
  if (a >= 1e7) return `${s}₹${(a / 1e7).toFixed(2)} Cr`;
  if (a >= 1e5) return `${s}₹${(a / 1e5).toFixed(a >= 1e6 ? 1 : 2)} L`;
  return s + '₹' + num(a);
}

export function pct(n: number, dec = 0): string {
  return `${n.toFixed(dec)}%`;
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

const AV = ['#2445C4', '#0E6A72', '#7A3E9D', '#B45309', '#1F7A4D', '#9F1D47', '#3B5998', '#5B6474'];
export function avatarColor(name: string): string {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AV[h % AV.length];
}
