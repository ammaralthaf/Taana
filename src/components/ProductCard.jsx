import React, { useState } from 'react';
import { Heart, Plus, X } from 'lucide-react';
import ImageSlot from './ImageSlot.jsx';
import { money, SIZES } from '../data/store.js';
import { productLink } from '../router.js';
import { useStore } from '../context.js';

export function Badge({ product }) {
  const label = product.soldOut ? 'Sold out' : product.compareAt ? 'Sale' : product.tag;
  if (!label) return null;
  const solid = product.soldOut || label === 'Sale';
  return (
    <span className={'caps absolute left-3 top-3 z-10 px-2 py-1 text-[10px] font-extrabold ' + (solid ? 'bg-fg text-bg' : 'bg-accent text-onaccent')}>{label}</span>
  );
}

export function Price({ product, big = false }) {
  return (
    <p className={'tnum flex flex-wrap items-baseline gap-x-2 font-bold ' + (big ? 'text-2xl' : '')}>
      <span>{money(product.price)}</span>
      {product.compareAt && <s className="text-sm font-normal text-muted">{money(product.compareAt)}</s>}
    </p>
  );
}

export default function ProductCard({ product }) {
  const { addItem, wish, toggleWish } = useStore();
  const [hover, setHover] = useState(false);
  const [picking, setPicking] = useState(false);
  const liked = wish.includes(product.slug);

  return (
    <article className="group relative flex flex-col" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="relative">
        <a href={productLink(product.slug)} onFocus={() => setHover(true)} onBlur={() => setHover(false)} className="block" aria-label={product.name + ', ' + money(product.price)}>
          <ImageSlot product={product} index={hover ? 1 : 0} zoom small={false} />
        </a>
        <Badge product={product} />
        <button
          type="button" aria-pressed={liked} aria-label={(liked ? 'Remove ' : 'Save ') + product.name + (liked ? ' from' : ' to') + ' your saved list'}
          onClick={() => toggleWish(product.slug)}
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center bg-panel transition-transform duration-200 hover:scale-110"
        >
          <Heart size={20} aria-hidden="true" fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-danger' : ''} />
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-extrabold uppercase leading-tight tracking-tight" style={{ fontStretch: '85%' }}>
            <a href={productLink(product.slug)} className="hover:underline underline-offset-4">{product.name}</a>
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
            <span className="h-3 w-3 shrink-0 rounded-full border border-line" style={{ background: product.colour.hex }} aria-hidden="true" />
            {product.colour.name}
          </p>
        </div>
        <Price product={product} />
      </div>

      {product.soldOut ? (
        <p className="caps mt-3 flex min-h-[44px] items-center text-xs font-bold text-muted">Sold out</p>
      ) : picking ? (
        <div className="rise mt-3">
          <div className="flex items-center justify-between">
            <p className="caps text-[11px] font-bold">Pick a size to add</p>
            <button type="button" aria-label="Close size picker" onClick={() => setPicking(false)} className="-mr-2 grid h-9 w-9 place-items-center hover:opacity-70"><X size={16} aria-hidden="true" /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((s) => {
              const ok = product.sizes.includes(s);
              return (
                <button
                  key={s} type="button" disabled={!ok} aria-label={ok ? 'Add size ' + s : 'Size ' + s + ' unavailable'}
                  onClick={() => { addItem(product, s); setPicking(false); }}
                  className="min-h-[44px] min-w-[44px] border border-line px-2 text-sm font-bold transition-colors duration-200 hover:border-fg hover:bg-fg hover:text-bg disabled:cursor-not-allowed disabled:text-muted disabled:line-through disabled:opacity-50 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-muted"
                >{s}</button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          type="button" onClick={() => setPicking(true)}
          className="caps mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 border border-line text-xs font-bold transition-colors duration-200 hover:border-fg hover:bg-fg hover:text-bg"
        ><Plus size={16} aria-hidden="true" /> Quick add</button>
      )}
    </article>
  );
}
