import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS, COLLECTIONS, SIZES } from '../data/store.js';
import { shopLink } from '../router.js';
import { useStore } from '../context.js';

const chip = (on) =>
  'caps inline-flex min-h-[44px] shrink-0 items-center border px-4 text-xs font-bold transition-colors duration-200 ' +
  (on ? 'border-fg bg-fg text-bg' : 'border-line hover:border-fg');

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'Newest' },
  { id: 'low', label: 'Price: low to high' },
  { id: 'high', label: 'Price: high to low' }
];

export default function Shop({ route }) {
  const { wish } = useStore();
  const coll = COLLECTIONS.some((c) => c.id === route.params.c) ? route.params.c : '';
  const savedOnly = route.params.saved === '1';

  const [colour, setColour] = useState('');
  const [size, setSize] = useState('');
  const [sort, setSort] = useState('featured');
  const [hideSold, setHideSold] = useState(false);
  const [panel, setPanel] = useState(false);

  const colours = useMemo(() => {
    const seen = {};
    PRODUCTS.forEach((p) => { seen[p.colour.name] = p.colour.hex; });
    return Object.keys(seen).map((n) => ({ name: n, hex: seen[n] }));
  }, []);

  const list = useMemo(() => {
    let r = PRODUCTS.filter((p) =>
      (!coll || p.collection === coll) &&
      (!colour || p.colour.name === colour) &&
      (!size || p.sizes.includes(size)) &&
      (!hideSold || !p.soldOut) &&
      (!savedOnly || wish.includes(p.slug))
    );
    if (sort === 'low') r = r.slice().sort((a, b) => a.price - b.price);
    else if (sort === 'high') r = r.slice().sort((a, b) => b.price - a.price);
    else if (sort === 'new') r = r.slice().sort((a, b) => (b.tag === 'New') - (a.tag === 'New'));
    else r = r.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return r;
  }, [coll, colour, size, hideSold, savedOnly, sort, wish]);

  const active = (colour ? 1 : 0) + (size ? 1 : 0) + (hideSold ? 1 : 0);
  const clear = () => { setColour(''); setSize(''); setHideSold(false); };
  const title = savedOnly ? 'Saved hoodies' : coll ? coll : 'All hoodies';
  const blurb = coll ? COLLECTIONS.find((c) => c.id === coll).blurb : 'Everything we have made and kept for sale right now.';

  return (
    <div className="gutter mx-auto max-w-[1440px] py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <a href="#/" className="hover:text-fg hover:underline underline-offset-4">Home</a> / <span className="text-fg">Shop</span>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <h1 className="font-black uppercase leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontStretch: '75%' }}>{title}</h1>
        <p className="max-w-[40ch] text-muted">{blurb}</p>
      </div>

      {/* Collection tabs */}
      <div className="-mx-4 mt-8 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Collections">
        <div className="flex gap-2 pb-1">
          <a href={shopLink()} aria-current={!coll && !savedOnly ? 'true' : undefined} className={chip(!coll && !savedOnly)}>All ({PRODUCTS.length})</a>
          {COLLECTIONS.map((c) => (
            <a key={c.id} href={shopLink(c.id)} aria-current={coll === c.id ? 'true' : undefined} className={chip(coll === c.id)}>
              {c.id} ({PRODUCTS.filter((p) => p.collection === c.id).length})
            </a>
          ))}
          <a href="#/shop?saved=1" aria-current={savedOnly ? 'true' : undefined} className={chip(savedOnly)}>Saved ({wish.length})</a>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
        <button type="button" onClick={() => setPanel((o) => !o)} aria-expanded={panel} aria-controls="filters"
          className="caps inline-flex min-h-[44px] items-center gap-2 text-xs font-bold hover:opacity-70">
          <SlidersHorizontal size={18} aria-hidden="true" /> Filters{active > 0 ? ' (' + active + ')' : ''}
        </button>
        <p className="tnum text-sm text-muted" role="status">{list.length} {list.length === 1 ? 'hoodie' : 'hoodies'}</p>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="min-h-[44px] border border-line bg-panel px-3 font-bold">
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
      </div>

      {panel && (
        <div id="filters" className="rise grid gap-8 border-b border-line py-6 md:grid-cols-3">
          <fieldset>
            <legend className="caps mb-3 text-xs font-black">Colour</legend>
            <div className="flex flex-wrap gap-2">
              {colours.map((c) => (
                <button key={c.name} type="button" aria-pressed={colour === c.name} aria-label={c.name} title={c.name}
                  onClick={() => setColour(colour === c.name ? '' : c.name)}
                  className={'grid h-11 w-11 place-items-center border-2 transition-colors duration-200 ' + (colour === c.name ? 'border-fg' : 'border-transparent hover:border-line')}>
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-line" style={{ background: c.hex }}>
                    {colour === c.name && <Check size={14} aria-hidden="true" style={{ color: '#fff', mixBlendMode: 'difference' }} />}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="caps mb-3 text-xs font-black">Size</legend>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(size === s ? '' : s)}
                  className={'min-h-[44px] min-w-[48px] border px-3 text-sm font-bold transition-colors duration-200 ' + (size === s ? 'border-fg bg-fg text-bg' : 'border-line hover:border-fg')}>{s}</button>
              ))}
            </div>
          </fieldset>
          <div>
            <p className="caps mb-3 text-xs font-black">Availability</p>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3">
              <input type="checkbox" checked={hideSold} onChange={(e) => setHideSold(e.target.checked)} className="h-5 w-5" />
              <span>Hide sold out</span>
            </label>
            {active > 0 && <button type="button" onClick={clear} className="mt-2 min-h-[44px] text-sm font-bold underline underline-offset-4 hover:opacity-70">Clear filters</button>}
          </div>
        </div>
      )}

      {/* Grid */}
      {list.length === 0 ? (
        <div className="mt-10 border border-line bg-panel p-8">
          <p className="text-2xl font-black uppercase" style={{ fontStretch: '75%' }}>{savedOnly ? 'No saved hoodies yet' : 'No hoodies match'}</p>
          <p className="mt-2 max-w-[44ch] text-muted">{savedOnly ? 'Tap the heart on any hoodie to keep it here.' : 'Try removing a filter.'}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {active > 0 && <button type="button" onClick={clear} className="caps min-h-[48px] bg-fg px-6 text-xs font-bold text-bg">Clear filters</button>}
            <a href={shopLink()} className="caps inline-flex min-h-[48px] items-center border-2 border-fg px-6 text-xs font-bold">See all hoodies</a>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
          {list.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </div>
  );
}
