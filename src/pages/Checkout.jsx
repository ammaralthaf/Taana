import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Lock, ChevronLeft, ChevronDown, Check, CreditCard, Smartphone, Banknote, ArrowRight, Truck, Package, RotateCcw, X, Minus, Plus, ShoppingBag } from 'lucide-react';
import ImageSlot from '../components/ImageSlot.jsx';
import { BRAND, FREE_SHIP_OVER, DISPATCH_DAYS, money, bySlug } from '../data/store.js';

/* ================= CHECKOUT ================= */
// <checkout>
/* Editable setup: example values, change them before you sell. */
const SHIP = {
  standard: { id: 'standard', label: 'Standard', price: 99, freeOver: FREE_SHIP_OVER, transit: [4, 6], note: 'Tracked delivery to your door.' },
  express: { id: 'express', label: 'Express', price: 249, transit: [2, 3], note: 'Priority handling and faster courier.' }
};
const PRODUCTION_DAYS = DISPATCH_DAYS; // working days to make and pack an order [CONFIRM]
const TAX_RATE = 0.05;       // estimated GST [CONFIRM THE RATE WITH YOUR ACCOUNTANT]
const COD_FEE = 49;          // cash on delivery handling fee

const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];

const digitsOnly = (s) => s.replace(/\D/g, '');

function detectBrand(d) {
  if (/^4/.test(d)) return 'visa';
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^(60|65|81|82|508)/.test(d)) return 'rupay';
  return null;
}
const BRAND_LABEL = { visa: 'VISA', mastercard: 'MASTERCARD', amex: 'AMEX', rupay: 'RUPAY' };

function formatCardNumber(raw) {
  const d = digitsOnly(raw);
  const brand = detectBrand(d);
  const x = d.slice(0, brand === 'amex' ? 15 : 16);
  const groups = brand === 'amex' ? [4, 6, 5] : [4, 4, 4, 4];
  const out = [];
  let i = 0;
  for (const g of groups) {
    if (i >= x.length) break;
    out.push(x.slice(i, i + g));
    i += g;
  }
  return out.join(' ');
}
function luhn(d) {
  let sum = 0;
  let alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = Number(d[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return d.length > 0 && sum % 10 === 0;
}
function formatExpiry(raw) {
  let d = digitsOnly(raw).slice(0, 4);
  if (d.length === 1 && Number(d) > 1) d = '0' + d;
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
}
function expiryError(v) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return 'Enter the expiry as MM/YY.';
  const mm = Number(m[1]);
  const yy = Number(m[2]);
  if (mm < 1 || mm > 12) return 'The month must be 01 to 12.';
  const now = new Date();
  const cy = now.getFullYear() % 100;
  const cm = now.getMonth() + 1;
  if (yy < cy || (yy === cy && mm < cm)) return 'This card has expired.';
  return '';
}
function formatPhone(raw) {
  const d = digitsOnly(raw).slice(0, 10);
  return d.length > 5 ? d.slice(0, 5) + ' ' + d.slice(5) : d;
}

function validateAddress(a) {
  const e = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email.trim())) e.email = 'Enter a valid email address, like name@example.com.';
  if (!/^[6-9]\d{9}$/.test(digitsOnly(a.phone))) e.phone = 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9.';
  if (a.name.trim().length < 2) e.name = 'Enter your full name.';
  if (a.line1.trim().length < 5) e.line1 = 'Enter your house number and street.';
  if (a.city.trim().length < 2) e.city = 'Enter your city or town.';
  if (!a.state) e.state = 'Choose your state.';
  if (!/^[1-9]\d{5}$/.test(a.pin.trim())) e.pin = 'Enter a 6-digit PIN code.';
  return e;
}
function validatePayment(pay, card, upi) {
  const e = {};
  if (pay === 'card') {
    const d = digitsOnly(card.number);
    const brand = detectBrand(d);
    const need = brand === 'amex' ? 15 : 16;
    if (d.length !== need || !luhn(d)) e.number = 'Check the card number. It should be ' + need + ' digits.';
    if (card.name.trim().length < 2) e.name = 'Enter the name printed on the card.';
    const ee = expiryError(card.exp);
    if (ee) e.exp = ee;
    const cl = brand === 'amex' ? 4 : 3;
    if (card.cvv.length !== cl) e.cvv = 'Enter the ' + cl + '-digit security code.';
  }
  if (pay === 'upi' && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi.trim())) e.upi = 'Enter a UPI ID like name@bank.';
  return e;
}

function addBizDays(d, n) {
  const x = new Date(d);
  let c = 0;
  while (c < n) {
    x.setDate(x.getDate() + 1);
    const w = x.getDay();
    if (w !== 0 && w !== 6) c++;
  }
  return x;
}
const fmtDay = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
function estimate(method) {
  const now = new Date();
  const t = SHIP[method].transit;
  return fmtDay(addBizDays(now, PRODUCTION_DAYS + t[0])) + ' to ' + fmtDay(addBizDays(now, PRODUCTION_DAYS + t[1]));
}

const inputCls = (err) =>
  'h-12 w-full min-w-0 border-2 bg-bg px-4 text-base transition-colors duration-200 placeholder:text-muted focus:border-fg ' +
  (err ? 'border-danger' : 'border-line');

function Field({ id, label, error, hint, children, right }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold">{label}</label>
        {right}
      </div>
      {children}
      {error
        ? <p id={id + '-err'} role="alert" className="mt-1.5 text-sm font-bold text-danger">{error}</p>
        : hint ? <p id={id + '-hint'} className="mt-1.5 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

function Section({ id, n, title, open, done, enabled, summary, onToggle, children }) {
  return (
    <section className="border border-line bg-panel">
      <h2>
        <button
          type="button" id={'acc-' + id} aria-expanded={open} aria-controls={'acc-panel-' + id}
          disabled={!enabled} onClick={onToggle}
          className="flex min-h-[72px] w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-panel2 disabled:cursor-not-allowed disabled:hover:bg-panel"
        >
          <span className={'grid h-8 w-8 shrink-0 place-items-center text-sm font-extrabold ' +
            (done ? 'bg-fg text-bg' : open ? 'border-2 border-fg' : 'border-2 border-line text-muted')}>
            {done ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : n}
          </span>
          <span className="min-w-0 flex-1">
            <span className={'caps block text-sm font-extrabold ' + (enabled ? '' : 'text-muted')}>{title}</span>
            {done && !open && summary && <span className="mt-1 block truncate text-sm text-muted">{summary}</span>}
          </span>
          {done && !open && <span className="caps text-xs font-bold underline underline-offset-4">Edit</span>}
          <ChevronDown size={20} aria-hidden="true" className={'shrink-0 transition-transform duration-200 ' + (open ? 'rotate-180' : '')} />
        </button>
      </h2>
      <div
        id={'acc-panel-' + id} role="region" aria-labelledby={'acc-' + id}
        className={'grid ' + (open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
        style={{ visibility: open ? 'visible' : 'hidden', transition: 'grid-template-rows .3s ease-out, visibility 0s linear ' + (open ? '0s' : '.3s') }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-line px-5 py-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

function CardPreview({ number, name, exp, cvv, brand, flipped }) {
  const tpl = brand === 'amex' ? '•••• •••••• •••••' : '•••• •••• •••• ••••';
  const d = digitsOnly(number);
  let di = 0;
  const shown = tpl.split('').map((ch) => (ch === '•' ? (d[di++] || '•') : ch)).join('');
  const face = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', background: '#14181F', color: '#F2F2EE', border: '1px solid rgba(255,255,255,.14)' };
  return (
    <div className="mx-auto mb-6 w-full max-w-[340px]" style={{ perspective: '900px' }} aria-hidden="true">
      <div className="relative aspect-[1.586]" style={{ transformStyle: 'preserve-3d', transition: 'transform .6s cubic-bezier(.2,.8,.2,1)', transform: flipped ? 'rotateY(180deg)' : 'none' }}>
        <div className="absolute inset-0 flex flex-col justify-between p-5" style={face}>
          <div className="flex items-start justify-between">
            <svg width="44" height="32" viewBox="0 0 44 32"><rect x="1" y="1" width="42" height="30" rx="5" fill="#E8A93A" /><path d="M1 11h42M1 21h42M15 1v30M29 1v30" stroke="rgba(0,0,0,.35)" strokeWidth="1.2" fill="none" /></svg>
            <span className="text-xs font-extrabold tracking-[0.18em] opacity-90">{brand ? BRAND_LABEL[brand] : 'CARD'}</span>
          </div>
          <p className="tnum text-[clamp(1.05rem,4.4vw,1.35rem)] font-bold tracking-[0.12em]">{shown}</p>
          <div className="flex items-end justify-between gap-3 text-[11px]">
            <div className="min-w-0"><p className="opacity-60">CARDHOLDER</p><p className="truncate text-sm font-bold uppercase tracking-wide">{name.trim() || 'Your name'}</p></div>
            <div><p className="opacity-60">EXPIRES</p><p className="tnum text-sm font-bold">{exp || 'MM/YY'}</p></div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ ...face, transform: 'rotateY(180deg)' }}>
          <div className="mt-6 h-10 bg-black" />
          <div className="mx-5 mt-5 flex items-center justify-end gap-3 bg-white px-3 py-2 text-black">
            <span className="text-[10px] font-bold opacity-60">CVV</span>
            <span className="tnum min-w-[34px] text-right text-sm font-extrabold tracking-widest">{cvv ? cvv.replace(/./g, '•') : '•••'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ order, onDone }) {
  const btn = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => { if (btn.current) btn.current.focus(); }, 80);
    const onKey = (e) => {
      if (e.key === 'Escape') onDone();
      if (e.key === 'Tab') { e.preventDefault(); if (btn.current) btn.current.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, []);
  const bits = [
    { dx: '-120px', rot: '240deg', c: '#E8A93A', l: '12%' }, { dx: '-70px', rot: '-180deg', c: 'var(--fg)', l: '24%' },
    { dx: '-20px', rot: '300deg', c: '#E8A93A', l: '36%' }, { dx: '30px', rot: '-260deg', c: 'var(--muted)', l: '48%' },
    { dx: '80px', rot: '200deg', c: '#E8A93A', l: '60%' }, { dx: '120px', rot: '-300deg', c: 'var(--fg)', l: '72%' },
    { dx: '150px', rot: '260deg', c: '#E8A93A', l: '84%' }, { dx: '-150px', rot: '-220deg', c: 'var(--muted)', l: '6%' }
  ];
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto p-4" style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 0px))', paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}>
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby="done-title" className="modal-in relative w-full max-w-[460px] overflow-hidden bg-panel p-8 text-center shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden="true">
          {bits.map((b, i) => (
            <span key={i} className="confetti-piece absolute top-10 block h-2.5 w-2.5" style={{ left: b.l, background: b.c, '--dx': b.dx, '--rot': b.rot, animationDelay: i * 60 + 'ms' }} />
          ))}
        </div>
        <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true" className="mx-auto">
          <circle cx="42" cy="42" r="38" fill="none" strokeWidth="4" className="draw" style={{ stroke: 'var(--fg)', '--len': 240 }} />
          <path d="M26 43 L38 55 L59 31" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="draw" style={{ stroke: 'var(--accent)', '--len': 60, animationDelay: '.45s' }} />
        </svg>
        <h2 id="done-title" className="mt-5 text-4xl font-extrabold uppercase leading-none" style={{ fontStretch: '85%' }}>Order placed</h2>
        <p className="mt-3 text-muted">Thanks, {order.firstName}. We will start getting your order ready.</p>
        <div className="mt-6 border border-line bg-bg p-4 text-left">
          <p className="caps text-[11px] font-bold text-muted">Order number</p>
          <p className="tnum mt-1 text-2xl font-extrabold tracking-wide">{order.number}</p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">Items</dt><dd className="tnum font-bold">{order.items}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Arrives</dt><dd className="text-right font-bold">{order.arrives}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Payment</dt><dd className="min-w-0 break-words text-right font-bold">{order.payLabel}</dd></div>
            <div className="flex justify-between gap-4 border-t border-line pt-2"><dt className="font-bold">Total</dt><dd className="tnum text-lg font-extrabold">{money(order.total)}</dd></div>
          </dl>
        </div>
        <p className="mt-4 text-sm text-muted">This is a demo order. No payment was taken and nothing will be shipped.</p>
        <button
          ref={btn} type="button" onClick={onDone}
          className="caps mt-6 flex min-h-[54px] w-full items-center justify-center gap-3 bg-fg px-6 text-sm font-bold text-bg transition-opacity duration-200 hover:opacity-90"
        >Continue shopping <ArrowRight size={18} aria-hidden="true" /></button>
      </div>
    </div>
  );
}

function SummaryItem({ it }) {
  const product = bySlug(it.slug);
  return (
    <li className="flex gap-4 border-b border-line py-4 first:pt-0">
      <div className="relative w-20 shrink-0">
        {product ? <ImageSlot product={product} small ratio="4 / 5" className="!p-0.5" /> : <div className="h-24 bg-panel2" />}
        <span className="tnum absolute -right-2 -top-2 grid h-6 min-w-[24px] place-items-center bg-fg px-1 text-xs font-extrabold text-bg">{it.qty}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="font-extrabold uppercase leading-tight" style={{ fontStretch: '85%' }}>{it.name}</p>
          <p className="tnum shrink-0 font-bold">{money(it.unit * it.qty)}</p>
        </div>
        <p className="mt-1 text-sm text-muted">Size {it.size} · {it.colour.name}</p>
      </div>
    </li>
  );
}

function Checkout({ cart, onBack, onComplete }) {
  const [open, setOpen] = useState('shipping');
  const [done, setDone] = useState({ shipping: false, method: false, payment: false });
  const [addr, setAddr] = useState({ email: '', phone: '', name: '', line1: '', line2: '', city: '', state: '', pin: '' });
  const [aErr, setAErr] = useState({});
  const [method, setMethod] = useState('standard');
  const [pay, setPay] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '' });
  const [upi, setUpi] = useState('');
  const [pErr, setPErr] = useState({});
  const [flip, setFlip] = useState(false);
  const [msg, setMsg] = useState('');
  const [order, setOrder] = useState(null);

  const subtotal = cart.reduce((s, x) => s + x.unit * x.qty, 0);
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const sm = SHIP[method];
  const shipFree = method === 'standard' && sm.freeOver && subtotal >= sm.freeOver;
  const shipPrice = shipFree ? 0 : sm.price;
  const codFee = pay === 'cod' ? COD_FEE : 0;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipPrice + codFee + tax;
  const toFree = method === 'standard' && sm.freeOver && subtotal < sm.freeOver ? sm.freeOver - subtotal : 0;

  const focusSoon = (id) => setTimeout(() => { const el = document.getElementById(id); if (el) el.focus(); }, 340);
  const firstBad = (errs, order, prefix) => {
    const k = order.find((x) => errs[x]);
    if (k) { const el = document.getElementById(prefix + k); if (el) el.focus(); }
  };

  const updAddr = (k, v) => { setAddr((a) => ({ ...a, [k]: v })); setDone((d) => ({ ...d, shipping: false })); setMsg(''); };
  const inp = (k, extra) => ({
    id: 'f-' + k, value: addr[k], onChange: (e) => updAddr(k, e.target.value),
    'aria-invalid': !!aErr[k], 'aria-describedby': aErr[k] ? 'f-' + k + '-err' : undefined,
    className: inputCls(aErr[k]), ...extra
  });
  const updCard = (k, v) => { setCard((c) => ({ ...c, [k]: v })); setDone((d) => ({ ...d, payment: false })); setMsg(''); };
  const pinp = (k, value, onChange, extra) => ({
    id: 'p-' + k, value: value, onChange: onChange,
    'aria-invalid': !!pErr[k], 'aria-describedby': pErr[k] ? 'p-' + k + '-err' : undefined,
    className: inputCls(pErr[k]), ...extra
  });

  const saveShipping = () => {
    const errs = validateAddress(addr);
    setAErr(errs);
    if (Object.keys(errs).length) { firstBad(errs, ['email', 'phone', 'name', 'line1', 'city', 'state', 'pin'], 'f-'); return; }
    setDone((d) => ({ ...d, shipping: true }));
    setOpen('method');
    focusSoon('m-' + method);
  };
  const saveMethod = () => {
    setDone((d) => ({ ...d, method: true }));
    setOpen('payment');
    focusSoon('pay-' + pay);
  };
  const savePayment = () => {
    const errs = validatePayment(pay, card, upi);
    setPErr(errs);
    if (Object.keys(errs).length) { firstBad(errs, ['number', 'name', 'exp', 'cvv', 'upi'], 'p-'); return; }
    setDone((d) => ({ ...d, payment: true }));
    setOpen(null);
  };

  const fillSample = () => {
    setAddr({ email: 'name@example.com', phone: '98765 43210', name: 'Sample Customer', line1: '12 Sample Street, Andheri West', line2: '', city: 'Mumbai', state: 'Maharashtra', pin: '400053' });
    setAErr({}); setDone((d) => ({ ...d, shipping: false }));
  };
  const fillCard = () => {
    setCard({ number: '4242 4242 4242 4242', name: 'Sample Customer', exp: '12/34', cvv: '123' });
    setPErr({}); setDone((d) => ({ ...d, payment: false }));
  };

  const toggle = (id, enabled) => () => { if (enabled) setOpen((o) => (o === id ? null : id)); };

  const placeOrder = () => {
    if (!cart.length) return;
    const next = !done.shipping ? 'shipping' : !done.method ? 'method' : !done.payment ? 'payment' : null;
    if (next) {
      setOpen(next);
      setMsg(next === 'shipping' ? 'Add your shipping address to place the order.' : next === 'method' ? 'Confirm a shipping method to continue.' : 'Add your payment details to place the order.');
      const el = document.getElementById('acc-' + next);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const last4 = digitsOnly(card.number).slice(-4);
    setOrder({
      number: 'BLNK-' + String(Math.floor(100000 + Math.random() * 900000)),
      firstName: addr.name.trim().split(' ')[0],
      items: count + (count === 1 ? ' hoodie' : ' hoodies'),
      arrives: estimate(method),
      payLabel: pay === 'card' ? (detectBrand(digitsOnly(card.number)) ? BRAND_LABEL[detectBrand(digitsOnly(card.number))] + ' ending ' : 'Card ending ') + last4 : pay === 'upi' ? 'UPI, ' + upi.trim() : 'Cash on delivery',
      total: total
    });
  };

  const brand = detectBrand(digitsOnly(card.number));
  const payTabs = [
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'cod', label: 'Cash on delivery', icon: Banknote }
  ];

  return (
    <div className="font-body">
      <header className="border-b border-line bg-bg">
        <div className="gutter mx-auto flex h-[60px] max-w-[1200px] items-center justify-between">
          <button type="button" onClick={() => onBack(false)} aria-label={BRAND + ' home'} className="text-2xl font-extrabold tracking-tight" style={{ fontStretch: '110%' }}>{BRAND}</button>
          <p className="caps flex items-center gap-2 text-xs font-bold text-muted"><Lock size={14} aria-hidden="true" /> Checkout</p>
        </div>
      </header>

      <main className="gutter mx-auto max-w-[1200px] py-8 lg:py-12">
        <button type="button" onClick={() => onBack(true)} className="caps -ml-1 mb-4 inline-flex min-h-[44px] items-center gap-1 text-xs font-bold text-muted transition-colors duration-200 hover:text-fg">
          <ChevronLeft size={16} aria-hidden="true" /> Back to your cart
        </button>
        <h1 className="mb-8 font-extrabold uppercase leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(2rem, 4.2vw, 3.2rem)', fontStretch: '85%' }}>Checkout</h1>

        {cart.length === 0 ? (
          <div className="border border-line bg-panel p-8">
            <p className="text-2xl font-extrabold uppercase" style={{ fontStretch: '85%' }}>Your cart is empty</p>
            <p className="mt-2 text-muted">Pick a hoodie first, then come back to check out.</p>
            <button type="button" onClick={() => onBack(false)} className="caps mt-5 min-h-[48px] bg-fg px-6 text-xs font-bold text-bg">Browse hoodies</button>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:gap-12">

            {/* LEFT: accordion */}
            <div className="flex min-w-0 flex-col gap-3">

              <Section
                id="shipping" n="1" title="Shipping address" open={open === 'shipping'} done={done.shipping} enabled
                summary={addr.name + ', ' + addr.line1 + ', ' + addr.city + ' ' + addr.pin}
                onToggle={toggle('shipping', true)}
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-muted">We use this to deliver your order and send updates.</p>
                  <button type="button" onClick={fillSample} className="min-h-[44px] text-sm font-bold underline underline-offset-4 hover:opacity-70">Fill sample details</button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field id="f-email" label="Email" error={aErr.email}>
                      <input {...inp('email', { type: 'email', autoComplete: 'email', inputMode: 'email', placeholder: 'name@example.com' })} />
                    </Field>
                  </div>
                  <Field id="f-name" label="Full name" error={aErr.name}>
                    <input {...inp('name', { type: 'text', autoComplete: 'name' })} />
                  </Field>
                  <Field id="f-phone" label="Mobile number" error={aErr.phone}>
                    <div className="flex">
                      <span className="grid h-12 place-items-center border-2 border-r-0 border-line bg-panel2 px-3 text-sm font-bold">+91</span>
                      <input {...inp('phone', { type: 'tel', autoComplete: 'tel-national', inputMode: 'numeric', placeholder: '98765 43210', onChange: (e) => updAddr('phone', formatPhone(e.target.value)) })} />
                    </div>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="f-line1" label="Address" error={aErr.line1}>
                      <input {...inp('line1', { type: 'text', autoComplete: 'address-line1', placeholder: 'House number, street' })} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field id="f-line2" label="Apartment, landmark (optional)">
                      <input {...inp('line2', { type: 'text', autoComplete: 'address-line2' })} />
                    </Field>
                  </div>
                  <Field id="f-city" label="City" error={aErr.city}>
                    <input {...inp('city', { type: 'text', autoComplete: 'address-level2' })} />
                  </Field>
                  <Field id="f-pin" label="PIN code" error={aErr.pin}>
                    <input {...inp('pin', { type: 'text', autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 6, placeholder: '400001', onChange: (e) => updAddr('pin', digitsOnly(e.target.value).slice(0, 6)) })} />
                  </Field>
                  <Field id="f-state" label="State" error={aErr.state}>
                    <select {...inp('state', { autoComplete: 'address-level1' })}>
                      <option value="">Choose a state</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field id="f-country" label="Country">
                    <input id="f-country" type="text" value="India" readOnly className="h-12 w-full border-2 border-line bg-panel2 px-4 text-base text-muted" />
                  </Field>
                </div>
                <button type="button" onClick={saveShipping} className="caps mt-6 flex min-h-[52px] w-full items-center justify-center gap-3 bg-fg px-8 text-sm font-bold text-bg transition-opacity duration-200 hover:opacity-90 sm:w-auto">
                  Continue to shipping method <ArrowRight size={18} aria-hidden="true" />
                </button>
              </Section>

              <Section
                id="method" n="2" title="Shipping method" open={open === 'method'} done={done.method} enabled={done.shipping}
                summary={sm.label + ', arrives ' + estimate(method)}
                onToggle={toggle('method', done.shipping)}
              >
                <div role="radiogroup" aria-label="Shipping method" className="grid gap-3">
                  {Object.values(SHIP).map((s) => {
                    const free = s.id === 'standard' && s.freeOver && subtotal >= s.freeOver;
                    const on = method === s.id;
                    return (
                      <label key={s.id} className={'flex cursor-pointer items-start gap-4 border-2 p-4 transition-colors duration-200 focus-within:ring-2 focus-within:ring-[color:var(--focus)] ' + (on ? 'border-fg bg-bg' : 'border-line hover:border-muted')}>
                        <input
                          id={'m-' + s.id} type="radio" name="ship-method" className="sr-only" checked={on}
                          onChange={() => { setMethod(s.id); setDone((d) => ({ ...d, method: false })); }}
                        />
                        <span aria-hidden="true" className={'mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ' + (on ? 'border-fg' : 'border-line')}>
                          {on && <span className="h-2.5 w-2.5 rounded-full bg-fg" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="font-bold">{s.label}</span>
                            <span className="tnum font-bold">{free ? 'Free' : money(s.price)}</span>
                          </span>
                          <span className="mt-0.5 block text-sm text-muted">{s.note}</span>
                          <span className="mt-1 block text-sm font-bold">Arrives {estimate(s.id)}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-3 text-sm text-muted">Dates include {PRODUCTION_DAYS} working days to make and pack your order. [CONFIRM YOUR DISPATCH TIME]</p>
                <button type="button" onClick={saveMethod} className="caps mt-6 flex min-h-[52px] w-full items-center justify-center gap-3 bg-fg px-8 text-sm font-bold text-bg transition-opacity duration-200 hover:opacity-90 sm:w-auto">
                  Continue to payment <ArrowRight size={18} aria-hidden="true" />
                </button>
              </Section>

              <Section
                id="payment" n="3" title="Payment details" open={open === 'payment'} done={done.payment} enabled={done.method}
                summary={pay === 'card' ? (brand ? BRAND_LABEL[brand] + ' ' : 'Card ') + 'ending ' + digitsOnly(card.number).slice(-4) : pay === 'upi' ? 'UPI, ' + upi : 'Cash on delivery'}
                onToggle={toggle('payment', done.method)}
              >
                <div className="mb-5 flex gap-3 border border-line bg-bg p-4 text-sm">
                  <Lock size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
                  <p><span className="font-bold">Demo checkout.</span> No payment is taken and nothing is stored. Please don't enter a real card number.</p>
                </div>

                <div role="radiogroup" aria-label="Payment method" className="grid gap-2 sm:grid-cols-3">
                  {payTabs.map((t) => {
                    const Icon = t.icon;
                    const on = pay === t.id;
                    return (
                      <label key={t.id} className={'flex min-h-[56px] cursor-pointer items-center gap-3 border-2 px-4 text-sm font-bold transition-colors duration-200 focus-within:ring-2 focus-within:ring-[color:var(--focus)] ' + (on ? 'border-fg bg-bg' : 'border-line text-muted hover:border-muted hover:text-fg')}>
                        <input id={'pay-' + t.id} type="radio" name="pay-method" className="sr-only" checked={on} onChange={() => { setPay(t.id); setPErr({}); setDone((d) => ({ ...d, payment: false })); }} />
                        <Icon size={20} aria-hidden="true" /> {t.label}
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6">
                  {pay === 'card' && (
                    <div className="rise">
                      <CardPreview number={card.number} name={card.name} exp={card.exp} cvv={card.cvv} brand={brand} flipped={flip} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Field id="p-number" label="Card number" error={pErr.number} right={brand ? <span className="text-xs font-extrabold tracking-[0.14em] text-muted">{BRAND_LABEL[brand]}</span> : null}>
                            <input {...pinp('number', card.number, (e) => updCard('number', formatCardNumber(e.target.value)), { type: 'text', inputMode: 'numeric', autoComplete: 'cc-number', placeholder: '1234 5678 9012 3456' })} />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field id="p-name" label="Name on card" error={pErr.name}>
                            <input {...pinp('name', card.name, (e) => updCard('name', e.target.value.replace(/[^a-zA-Z .'-]/g, '').slice(0, 26)), { type: 'text', autoComplete: 'cc-name' })} />
                          </Field>
                        </div>
                        <Field id="p-exp" label="Expiry" error={pErr.exp}>
                          <input {...pinp('exp', card.exp, (e) => updCard('exp', formatExpiry(e.target.value)), { type: 'text', inputMode: 'numeric', autoComplete: 'cc-exp', placeholder: 'MM/YY', maxLength: 5 })} />
                        </Field>
                        <Field id="p-cvv" label={brand === 'amex' ? 'Security code (4 digits)' : 'CVV'} error={pErr.cvv}>
                          <input {...pinp('cvv', card.cvv, (e) => updCard('cvv', digitsOnly(e.target.value).slice(0, brand === 'amex' ? 4 : 3)), { type: 'password', inputMode: 'numeric', autoComplete: 'cc-csc', placeholder: brand === 'amex' ? '1234' : '123', onFocus: () => setFlip(true), onBlur: () => setFlip(false) })} />
                        </Field>
                      </div>
                      <button type="button" onClick={fillCard} className="mt-3 min-h-[44px] text-sm font-bold underline underline-offset-4 hover:opacity-70">Fill a test card</button>
                    </div>
                  )}
                  {pay === 'upi' && (
                    <div className="rise">
                      <Field id="p-upi" label="UPI ID" error={pErr.upi} hint="You would approve the payment in your UPI app.">
                        <input {...pinp('upi', upi, (e) => { setUpi(e.target.value); setDone((d) => ({ ...d, payment: false })); }, { type: 'text', autoComplete: 'off', placeholder: 'name@bank' })} />
                      </Field>
                    </div>
                  )}
                  {pay === 'cod' && (
                    <div className="rise border border-line bg-bg p-4 text-sm">
                      <p className="font-bold">Pay when it arrives</p>
                      <p className="mt-1 text-muted">Pay by cash or UPI to the delivery partner. A {money(COD_FEE)} handling fee is added to your total. [CONFIRM YOUR COD POLICY]</p>
                    </div>
                  )}
                </div>

                <button type="button" onClick={savePayment} className="caps mt-6 flex min-h-[52px] w-full items-center justify-center gap-3 bg-fg px-8 text-sm font-bold text-bg transition-opacity duration-200 hover:opacity-90 sm:w-auto">
                  Save payment details <Check size={18} aria-hidden="true" />
                </button>
              </Section>
            </div>

            {/* RIGHT: summary */}
            <aside aria-label="Order summary" className="min-w-0 border border-line bg-panel p-5 sm:p-6 lg:sticky lg:top-6">
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <h2 className="caps text-sm font-extrabold">Order summary <span className="tnum text-muted">({count})</span></h2>
                <button type="button" onClick={() => onBack(true)} className="min-h-[44px] text-sm font-bold underline underline-offset-4 hover:opacity-70">Edit cart</button>
              </div>
              <ul>{cart.map((it) => <SummaryItem key={it.id} it={it} />)}</ul>

              <dl className="tnum mt-5 grid gap-2.5 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted">Subtotal</dt><dd className="font-bold">{money(subtotal)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Shipping, {sm.label.toLowerCase()}</dt><dd className="font-bold">{shipFree ? 'Free' : money(shipPrice)}</dd></div>
                {codFee > 0 && <div className="flex justify-between gap-4"><dt className="text-muted">Cash on delivery fee</dt><dd className="font-bold">{money(codFee)}</dd></div>}
                <div className="flex justify-between gap-4"><dt className="text-muted">Estimated GST ({Math.round(TAX_RATE * 100)}%)</dt><dd className="font-bold">{money(tax)}</dd></div>
              </dl>
              {toFree > 0 && <p className="mt-3 bg-bg p-3 text-sm">Add {money(toFree)} more to get free standard shipping.</p>}

              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-5">
                <span className="caps text-xs font-bold text-muted">Total</span>
                <span className="tnum text-3xl font-extrabold">{money(total)}</span>
              </div>

              <button
                type="button" onClick={placeOrder}
                className="caps group mt-5 flex min-h-[58px] w-full items-center justify-between bg-fg px-6 text-sm font-bold text-bg transition-opacity duration-200 hover:opacity-90"
              >
                <span>Place order</span>
                <ArrowRight size={20} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              {msg && <p role="alert" className="rise mt-3 text-sm font-bold text-danger">{msg}</p>}
              <p className="mt-3 text-xs text-muted">By placing your order you agree to the [ADD YOUR TERMS AND PRIVACY LINKS]. GST rate is an estimate. [CONFIRM]</p>
            </aside>
          </div>
        )}
      </main>

      {order && <SuccessModal order={order} onDone={onComplete} />}
    </div>
  );
}
// </checkout>

export default Checkout;
