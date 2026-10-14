import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, X, Minus, Plus, Trash2, ArrowRight, Heart } from 'lucide-react';
import ImageSlot from './ImageSlot.jsx';
import { BRAND, COLLECTIONS, FREE_SHIP_OVER, DISPATCH_DAYS, money, bySlug } from '../data/store.js';
import { shopLink, productLink } from '../router.js';
import { useStore } from '../context.js';

export function Announcement() {
  return (
    <div className="bg-deep text-ondeep">
      <p className="gutter caps mx-auto max-w-[1280px] py-2.5 text-center text-[11px] font-bold">
        Free shipping over {money(FREE_SHIP_OVER)} · Ships in {DISPATCH_DAYS} working days [CONFIRM]
      </p>
    </div>
  );
}

export function Nav({ route }) {
  const { count, setCartOpen, cartBtnRef, goSection, wish } = useStore();
  const [menu, setMenu] = useState(false);
  const close = () => setMenu(false);
  const link = 'caps py-2 text-xs font-bold transition-colors duration-200 hover:text-fg ';
  const items = [
    { label: 'Shop all', href: shopLink(), active: route.name === 'shop' },
    { label: 'Our story', onClick: () => goSection('story') },
    { label: 'Collections', onClick: () => goSection('collections') },
    { label: 'How it works', onClick: () => goSection('how') }
  ];
  return (
    <header className="sticky z-40 border-b border-line bg-bg" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="gutter mx-auto flex h-[60px] max-w-[1280px] items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu((m) => !m)}
            className="-ml-2 grid h-11 w-11 place-items-center transition-opacity duration-200 hover:opacity-70 md:hidden"
          >{menu ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
          <a href="#/" aria-label={BRAND + ' home'} className="text-2xl font-extrabold tracking-tight" style={{ fontStretch: '110%' }}>{BRAND}</a>
        </div>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {items.map((l) => l.href ? (
            <a key={l.label} href={l.href} aria-current={l.active ? 'page' : undefined} className={link + (l.active ? 'text-fg underline underline-offset-8 decoration-2' : 'text-muted')}>{l.label}</a>
          ) : (
            <button key={l.label} type="button" onClick={l.onClick} className={link + 'text-muted'}>{l.label}</button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <a href="#/shop?saved=1" aria-label={'Saved hoodies (' + wish.length + ')'} className="relative grid h-11 w-11 place-items-center transition-opacity duration-200 hover:opacity-70">
            <Heart size={22} aria-hidden="true" />
            {wish.length > 0 && <span className="tnum absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center bg-fg px-1 text-[10px] font-extrabold text-bg">{wish.length}</span>}
          </a>
          <button
            ref={cartBtnRef} type="button" aria-label={'Open cart, ' + count + (count === 1 ? ' item' : ' items')} onClick={() => setCartOpen(true)}
            className="relative -mr-2 grid h-11 w-11 place-items-center transition-opacity duration-200 hover:opacity-70"
          >
            <ShoppingBag size={22} aria-hidden="true" />
            {count > 0 && <span key={count} className="pop tnum absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center bg-accent px-1 text-[10px] font-extrabold text-onaccent">{count}</span>}
          </button>
        </div>
      </div>

      {menu && (
        <nav aria-label="Mobile" className="rise border-t border-line bg-bg md:hidden">
          <ul className="gutter mx-auto max-w-[1280px] py-2">
            {items.map((l) => (
              <li key={l.label} className="border-b border-line last:border-b-0">
                {l.href ? (
                  <a href={l.href} onClick={close} className="caps flex min-h-[52px] items-center text-sm font-bold">{l.label}</a>
                ) : (
                  <button type="button" onClick={() => { close(); l.onClick(); }} className="caps flex min-h-[52px] w-full items-center text-left text-sm font-bold">{l.label}</button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { goSection } = useStore();
  const col = 'caps min-h-[44px] text-left text-xs font-bold text-muted transition-colors duration-200 hover:text-fg';
  return (
    <footer className="border-t border-line bg-panel2">
      <div className="gutter mx-auto grid max-w-[1280px] gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="min-w-0">
          <p className="max-w-[36ch] text-sm text-muted">Hoodies we design and make ourselves. [ADD ONE LINE ABOUT YOUR BRAND]</p>
        </div>
        <nav aria-label="Footer shop" className="flex flex-col items-start">
          <p className="caps mb-2 text-xs font-extrabold">Shop</p>
          <a href={shopLink()} className={col + ' inline-flex items-center'}>All hoodies</a>
          {COLLECTIONS.map((c) => <a key={c.id} href={shopLink(c.id)} className={col + ' inline-flex items-center'}>{c.id}</a>)}
        </nav>
        <nav aria-label="Footer info" className="flex flex-col items-start">
          <p className="caps mb-2 text-xs font-extrabold">About</p>
          <button type="button" onClick={() => goSection('story')} className={col}>Our story</button>
          <button type="button" onClick={() => goSection('how')} className={col}>How it works</button>
          <p className="mt-2 text-sm text-muted">[ADD CONTACT EMAIL]<br />[ADD INSTAGRAM HANDLE]</p>
        </nav>
      </div>
      <p className="gutter mx-auto max-w-[1280px] border-t border-line py-5 text-sm text-muted">&copy; {BRAND}. All rights reserved.</p>
    </footer>
  );
}

function CartRow({ it }) {
  const { setQty, removeItem, setCartOpen } = useStore();
  const product = bySlug(it.slug);
  return (
    <li className="flex gap-4 border-b border-line py-5">
      <a href={productLink(it.slug)} onClick={() => setCartOpen(false)} className="block w-24 shrink-0" aria-label={'View ' + it.name}>
        {product ? <ImageSlot product={product} small ratio="4 / 5" /> : <div className="h-28 bg-panel2" />}
      </a>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-extrabold uppercase leading-tight" style={{ fontStretch: '85%' }}>{it.name}</p>
            <p className="mt-1 text-sm text-muted">Size {it.size} · {it.colour.name}</p>
            <p className="tnum text-sm text-muted">{money(it.unit)} each</p>
          </div>
          <p className="tnum shrink-0 font-bold">{money(it.unit * it.qty)}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center border border-line" role="group" aria-label={'Quantity for ' + it.name}>
            <button type="button" aria-label="Decrease quantity" disabled={it.qty <= 1} onClick={() => setQty(it.id, it.qty - 1)}
              className="grid h-11 w-11 place-items-center transition-colors duration-200 hover:bg-panel2 disabled:cursor-not-allowed disabled:opacity-35"><Minus size={16} aria-hidden="true" /></button>
            <span className="tnum min-w-[36px] text-center font-bold" aria-live="polite">{it.qty}</span>
            <button type="button" aria-label="Increase quantity" disabled={it.qty >= 10} onClick={() => setQty(it.id, it.qty + 1)}
              className="grid h-11 w-11 place-items-center transition-colors duration-200 hover:bg-panel2 disabled:cursor-not-allowed disabled:opacity-35"><Plus size={16} aria-hidden="true" /></button>
          </div>
          <button type="button" onClick={() => removeItem(it.id)}
            className="inline-flex min-h-[44px] items-center gap-1.5 px-1 text-sm font-bold text-muted underline-offset-4 transition-colors duration-200 hover:text-fg hover:underline">
            <Trash2 size={16} aria-hidden="true" /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const { cart, count, subtotal, cartOpen: open, setCartOpen, cartBtnRef, goCheckout } = useStore();
  const closeRef = useRef(null);
  const drawerRef = useRef(null);
  const wasOpen = useRef(false);
  const onClose = () => setCartOpen(false);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current && cartBtnRef.current) cartBtnRef.current.focus();
      wasOpen.current = false;
      return undefined;
    }
    wasOpen.current = true;
    const t = setTimeout(() => { if (closeRef.current) closeRef.current.focus(); }, 60);
    const onKey = (e) => {
      if (e.key === 'Escape') { setCartOpen(false); return; }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const f = drawerRef.current.querySelectorAll('button:not([disabled]), a[href], input');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  const toFree = Math.max(0, FREE_SHIP_OVER - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIP_OVER) * 100));

  return (
    <div className="fixed inset-0 z-50" style={{ visibility: open ? 'visible' : 'hidden', transition: 'visibility 0s linear ' + (open ? '0s' : '0.3s') }}>
      <button type="button" aria-label="Close cart" tabIndex={-1} onClick={onClose}
        className={'absolute inset-0 h-full w-full cursor-default bg-black transition-opacity duration-300 ' + (open ? 'opacity-50' : 'opacity-0')} />
      <aside
        ref={drawerRef} role="dialog" aria-modal="true" aria-label="Shopping cart"
        className={'absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-panel text-fg shadow-2xl transition-transform duration-300 ease-out ' + (open ? 'translate-x-0' : 'translate-x-full')}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}
      >
        <div className="flex items-center justify-between border-b border-line px-5">
          <h2 className="caps py-5 text-sm font-extrabold">Your cart <span className="tnum text-muted">({count})</span></h2>
          <button ref={closeRef} type="button" aria-label="Close cart" onClick={onClose} className="-mr-2 grid h-11 w-11 place-items-center transition-opacity duration-200 hover:opacity-70">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {cart.length > 0 && (
          <div className="border-b border-line px-5 py-3">
            <p className="text-sm">{toFree > 0 ? <>Add <b className="tnum">{money(toFree)}</b> more for free shipping.</> : <b>You have free shipping.</b>}</p>
            <div className="mt-2 h-1.5 bg-panel2" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
              <div className="h-full bg-accent transition-all duration-500" style={{ width: pct + '%' }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-start justify-center gap-4 py-10">
              <ShoppingBag size={36} strokeWidth={1.25} aria-hidden="true" className="text-muted" />
              <p className="text-2xl font-extrabold uppercase leading-tight" style={{ fontStretch: '85%' }}>Your cart is empty</p>
              <p className="max-w-[32ch] text-muted">Pick a hoodie and it will show up here.</p>
              <a href={shopLink()} onClick={onClose} className="caps inline-flex min-h-[48px] items-center border-2 border-fg px-6 text-xs font-bold transition-colors duration-200 hover:bg-fg hover:text-bg">Browse hoodies</a>
            </div>
          ) : (
            <ul>{cart.map((it) => <CartRow key={it.id} it={it} />)}</ul>
          )}
        </div>

        <div className="border-t border-line px-5 py-5">
          <div className="flex items-baseline justify-between">
            <span className="caps text-xs font-bold text-muted">Subtotal</span>
            <span className="tnum text-2xl font-extrabold">{money(subtotal)}</span>
          </div>
          <p className="mt-1 text-sm text-muted">Shipping and taxes are added at checkout. [CONFIRM GST AND SHIPPING]</p>
          <button type="button" onClick={goCheckout} disabled={cart.length === 0}
            className="caps group mt-4 flex min-h-[56px] w-full items-center justify-between bg-fg px-6 text-sm font-bold text-bg transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
            <span>Proceed to checkout</span>
            <ArrowRight size={20} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button type="button" onClick={onClose} className="mt-2 min-h-[44px] w-full text-sm font-bold text-muted underline-offset-4 transition-colors duration-200 hover:text-fg hover:underline">Keep shopping</button>
        </div>
      </aside>
    </div>
  );
}
