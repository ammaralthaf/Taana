import React, { useState, useEffect, useRef } from 'react';
import { Heart, Truck, RotateCcw, Package, ChevronDown, Minus, Plus } from 'lucide-react';
import ImageSlot from '../components/ImageSlot.jsx';
import ProductCard, { Badge, Price } from '../components/ProductCard.jsx';
import { PRODUCTS, SIZES, SIZE_CHART, DETAILS, CARE, RETURNS, PHOTO_COUNT, FREE_SHIP_OVER, DISPATCH_DAYS, money, bySlug } from '../data/store.js';
import { shopLink } from '../router.js';
import { useStore } from '../context.js';

function Accordion({ title, children, startOpen = false }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <div className="border-b border-line">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="caps flex min-h-[56px] w-full items-center justify-between text-left text-xs font-black">
        {title}
        <ChevronDown size={18} aria-hidden="true" className={'transition-transform duration-200 ' + (open ? 'rotate-180' : '')} />
      </button>
      {open && <div className="rise pb-5 text-muted">{children}</div>}
    </div>
  );
}

export default function Product({ slug }) {
  const product = bySlug(slug);
  const { addItem, wish, toggleWish } = useStore();
  const [photo, setPhoto] = useState(0);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState('');
  const [guide, setGuide] = useState(false);
  const sizeRef = useRef(null);

  useEffect(() => { setPhoto(0); setSize(''); setQty(1); setErr(''); setGuide(false); }, [slug]);

  if (!product) {
    return (
      <div className="gutter mx-auto max-w-[1440px] py-20">
        <h1 className="text-5xl font-black uppercase" style={{ fontStretch: '75%' }}>Hoodie not found</h1>
        <p className="mt-3 text-muted">It may have been removed or the link is wrong.</p>
        <a href={shopLink()} className="caps mt-6 inline-flex min-h-[48px] items-center bg-fg px-6 text-xs font-bold text-bg">Browse all hoodies</a>
      </div>
    );
  }

  const liked = wish.includes(product.slug);
  const more = PRODUCTS.filter((p) => p.slug !== product.slug)
    .sort((a, b) => (b.collection === product.collection) - (a.collection === product.collection)).slice(0, 4);

  const add = () => {
    if (!size) { setErr('Choose a size first.'); if (sizeRef.current) sizeRef.current.focus(); return; }
    setErr('');
    addItem(product, size, qty);
  };

  return (
    <div className="gutter mx-auto max-w-[1440px] py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <a href="#/" className="hover:text-fg hover:underline underline-offset-4">Home</a> /{' '}
        <a href={shopLink()} className="hover:text-fg hover:underline underline-offset-4">Shop</a> /{' '}
        <a href={shopLink(product.collection)} className="hover:text-fg hover:underline underline-offset-4">{product.collection}</a> /{' '}
        <span className="text-fg">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
        {/* Gallery */}
        <div className="grid min-w-0 items-start gap-3 sm:grid-cols-[88px_1fr]">
          <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
            {Array.from({ length: PHOTO_COUNT }).map((_, n) => (
              <button key={n} type="button" aria-pressed={photo === n} aria-label={'Show photo ' + (n + 1)} onClick={() => setPhoto(n)}
                className={'w-20 border-2 transition-colors duration-200 sm:w-full ' + (photo === n ? 'border-fg' : 'border-transparent opacity-70 hover:opacity-100')}>
                <ImageSlot product={product} index={n} small ratio="4 / 5" className="!p-0.5" />
              </button>
            ))}
          </div>
          <div className="relative order-1 sm:order-2">
            <ImageSlot key={photo} product={product} index={photo} eager className="rise" />
            <Badge product={product} />
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <p className="caps text-xs font-bold text-muted">{product.collection} collection</p>
          <h1 className="mt-1 font-black uppercase leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontStretch: '75%' }}>{product.name}</h1>
          <div className="mt-3"><Price product={product} big /></div>
          <p className="tnum mt-1 text-sm text-muted">Inclusive of taxes. [CONFIRM]</p>
          <p className="mt-5 max-w-[46ch] text-lg">{product.blurb}</p>

          <p className="mt-6 flex items-center gap-2 font-bold">
            <span className="h-5 w-5 rounded-full border border-line" style={{ background: product.colour.hex }} aria-hidden="true" />
            {product.colour.name}
          </p>

          {product.soldOut ? (
            <div className="mt-8 border border-line bg-panel p-5">
              <p className="font-black uppercase" style={{ fontStretch: '85%' }}>Sold out</p>
              <p className="mt-1 text-muted">This one is gone for now. See what else is in the shop.</p>
              <a href={shopLink(product.collection)} className="caps mt-4 inline-flex min-h-[48px] items-center bg-fg px-6 text-xs font-bold text-bg">More from {product.collection}</a>
            </div>
          ) : (
            <>
              <fieldset className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <legend className="caps text-xs font-black">Size</legend>
                  <button type="button" aria-expanded={guide} onClick={() => setGuide((g) => !g)} className="min-h-[44px] text-sm font-bold underline underline-offset-4 hover:opacity-70">Size guide</button>
                </div>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
                  {SIZES.map((s, n) => {
                    const ok = product.sizes.includes(s);
                    return (
                      <button
                        key={s} type="button" role="radio" aria-checked={size === s} disabled={!ok}
                        ref={n === 0 ? sizeRef : undefined}
                        aria-label={ok ? 'Size ' + s : 'Size ' + s + ', unavailable'}
                        onClick={() => { setSize(s); setErr(''); }}
                        className={'min-h-[48px] min-w-[56px] border px-3 text-sm font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:text-muted disabled:line-through disabled:opacity-50 ' + (size === s ? 'border-fg bg-fg text-bg' : 'border-line hover:border-fg')}
                      >{s}</button>
                    );
                  })}
                </div>
                {err && <p role="alert" className="rise mt-3 font-bold text-danger">{err}</p>}
              </fieldset>

              {guide && (
                <div className="rise mt-4 overflow-x-auto border border-line bg-panel">
                  <table className="w-full text-left text-sm">
                    <caption className="px-3 pt-3 text-left text-muted">In cm, laid flat. [SAMPLE MEASUREMENTS: REPLACE WITH YOURS]</caption>
                    <thead><tr className="border-b border-line"><th className="p-3">Size</th><th className="p-3">Chest</th><th className="p-3">Length</th></tr></thead>
                    <tbody>
                      {SIZE_CHART.map((r) => (
                        <tr key={r.size} className={'border-b border-line last:border-b-0 ' + (r.size === size ? 'bg-panel2 font-bold' : '')}>
                          <td className="p-3">{r.size}</td><td className="tnum p-3">{r.chest}</td><td className="tnum p-3">{r.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-stretch gap-3">
                <div className="inline-flex items-center border border-line" role="group" aria-label="Quantity">
                  <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty(qty - 1)} className="grid h-14 w-12 place-items-center hover:bg-panel2 disabled:opacity-35"><Minus size={16} aria-hidden="true" /></button>
                  <span className="tnum min-w-[36px] text-center font-bold" aria-live="polite">{qty}</span>
                  <button type="button" aria-label="Increase quantity" disabled={qty >= 10} onClick={() => setQty(qty + 1)} className="grid h-14 w-12 place-items-center hover:bg-panel2 disabled:opacity-35"><Plus size={16} aria-hidden="true" /></button>
                </div>
                <button type="button" onClick={add} className="caps min-h-[56px] flex-1 bg-fg px-6 text-sm font-bold text-bg transition-opacity duration-200 hover:opacity-90">
                  Add to cart · {money(product.price * qty)}
                </button>
                <button type="button" aria-pressed={liked} aria-label={liked ? 'Remove from saved' : 'Save for later'} onClick={() => toggleWish(product.slug)}
                  className="grid h-14 w-14 place-items-center border border-line transition-colors duration-200 hover:border-fg">
                  <Heart size={22} aria-hidden="true" fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-danger' : ''} />
                </button>
              </div>
            </>
          )}

          <ul className="mt-8 grid gap-3 text-sm">
            <li className="flex items-center gap-3"><Truck size={20} aria-hidden="true" /> Free shipping over {money(FREE_SHIP_OVER)}</li>
            <li className="flex items-center gap-3"><Package size={20} aria-hidden="true" /> Dispatched in {DISPATCH_DAYS} working days [CONFIRM]</li>
            <li className="flex items-center gap-3"><RotateCcw size={20} aria-hidden="true" /> Easy returns [CONFIRM RETURN POLICY]</li>
          </ul>

          <div className="mt-8 border-t border-line">
            <Accordion title="Details" startOpen><ul className="grid gap-1">{DETAILS.map((d) => <li key={d}>{d}</li>)}</ul></Accordion>
            <Accordion title="Care"><p>{CARE}</p></Accordion>
            <Accordion title="Shipping and returns"><p>Free standard shipping over {money(FREE_SHIP_OVER)}. {RETURNS}</p></Accordion>
          </div>
        </div>
      </div>

      <section aria-labelledby="more-h" className="mt-20">
        <h2 id="more-h" className="mb-8 font-black uppercase leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontStretch: '75%' }}>You may also like</h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
          {more.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>
    </div>
  );
}
