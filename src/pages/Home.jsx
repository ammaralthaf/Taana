import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Shirt, Package, Truck, Pencil, Scissors, Sparkles } from 'lucide-react';
import ImageSlot from '../components/ImageSlot.jsx';
import ProductCard, { Badge, Price } from '../components/ProductCard.jsx';
import { PRODUCTS, COLLECTIONS, DISPATCH_DAYS, bySlug } from '../data/store.js';
import { shopLink, productLink } from '../router.js';

const H2 = 'font-black uppercase leading-[0.9] tracking-tight';
const H2_STYLE = { fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontStretch: '75%' };

function Hero() {
  const picks = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const [i, setI] = useState(0);
  const p = picks[i];
  const step = (d) => setI((x) => (x + d + picks.length) % picks.length);

  return (
    <section aria-label="Featured hoodie" className="border-b border-line bg-hero">
      <div className="gutter mx-auto grid max-w-[1440px] items-center gap-10 py-10 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <div className="min-w-0 lg:col-span-5">
          <h1 className="font-black uppercase leading-[0.88] tracking-tight" style={{ fontSize: 'clamp(2.8rem, 7.2vw, 5.6rem)', fontStretch: '75%' }}>
            Made by us.<br />Picked by you.
          </h1>
          <p className="mt-6 max-w-[42ch] text-lg text-muted">
            Every hoodie here is designed and made by us. Browse the range, choose your size, and it is on its way.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={shopLink()} className="caps group inline-flex min-h-[52px] items-center gap-3 bg-fg px-7 text-sm font-bold text-bg transition-opacity duration-200 hover:opacity-90">
              Shop all hoodies <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a href="#/shop?c=Street" className="caps inline-flex min-h-[52px] items-center border-2 border-fg px-7 text-sm font-bold transition-colors duration-200 hover:bg-fg hover:text-bg">
              Start with Street
            </a>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div className="mx-auto grid max-w-[640px] gap-4 sm:grid-cols-[1fr_auto]">
            <div className="relative min-w-0">
              <a key={p.slug} href={productLink(p.slug)} className="rise group block" aria-label={'View ' + p.name}>
                <ImageSlot product={p} index={0} zoom eager />
              </a>
              <Badge product={p} />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 bg-panel p-3 sm:inset-x-6 sm:bottom-6" aria-live="polite">
                <div className="min-w-0">
                  <p className="font-black uppercase leading-tight" style={{ fontStretch: '85%' }}>{p.name}</p>
                  <p className="text-sm text-muted">{p.collection} · {p.colour.name}</p>
                </div>
                <Price product={p} />
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:flex-col sm:items-stretch sm:justify-between">
              <div className="flex gap-2 sm:flex-col">
                {picks.map((x, n) => (
                  <button
                    key={x.slug} type="button" onClick={() => setI(n)} aria-pressed={n === i} aria-label={'Show ' + x.name}
                    className={'w-16 border-2 p-0 transition-colors duration-200 sm:w-20 ' + (n === i ? 'border-fg' : 'border-transparent opacity-70 hover:opacity-100')}
                  ><ImageSlot product={x} small ratio="4 / 5" className="!p-0.5" /></button>
                ))}
              </div>
              <div className="ml-auto flex gap-1 sm:ml-0 sm:justify-between">
                <button type="button" aria-label="Previous hoodie" onClick={() => step(-1)} className="grid h-11 w-11 place-items-center border border-line transition-colors duration-200 hover:bg-fg hover:text-bg"><ChevronLeft size={20} aria-hidden="true" /></button>
                <button type="button" aria-label="Next hoodie" onClick={() => step(1)} className="grid h-11 w-11 place-items-center border border-line transition-colors duration-200 hover:bg-fg hover:text-bg"><ChevronRight size={20} aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Featured() {
  const picks = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  return (
    <section aria-labelledby="featured-h" className="scroll-mt-16">
      <div className="gutter mx-auto max-w-[1440px] py-14 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="featured-h" className={H2} style={H2_STYLE}>New and popular</h2>
          <a href={shopLink()} className="caps inline-flex min-h-[44px] items-center gap-2 text-xs font-bold underline underline-offset-8 decoration-2 hover:opacity-70">
            See all {PRODUCTS.length} hoodies <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
          {picks.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </div>
    </section>
  );
}

/* Why we do this, plus a worked example of one hoodie from idea to finished product. */
function Story() {
  const ex = bySlug('night-market');
  const steps = [
    { icon: Pencil, title: 'We draw it', text: 'Every design starts as a sketch by us.', src: '/images/story-1.jpg' },
    { icon: Scissors, title: 'We make it', text: 'A test piece is cut, printed and checked before we sell it.', src: '/images/story-2.jpg' },
    { icon: Sparkles, title: 'You wear it', text: 'The finished hoodie goes in the shop for you to pick.', src: '/images/story-3.jpg' }
  ];
  return (
    <section id="story" className="scroll-mt-16 border-y border-line bg-panel2">
      <div className="gutter mx-auto max-w-[1440px] py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="min-w-0">
            <h2 className={H2} style={H2_STYLE}>Why we make our own hoodies</h2>
            <p className="mt-6 max-w-[48ch] text-lg">
              We design every hoodie ourselves, so each one has an idea behind it. You do not need to design anything. Choose the one you like, pick your size, and we send it.
            </p>
            <p className="mt-4 max-w-[48ch] text-muted">
              [SAMPLE COPY: REPLACE WITH YOUR OWN STORY. Say who you are, why you started, and what makes your designs different.]
            </p>
            <a href={shopLink()} className="caps mt-8 inline-flex min-h-[48px] items-center gap-2 border-2 border-fg px-6 text-xs font-bold transition-colors duration-200 hover:bg-fg hover:text-bg">
              Browse the range <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="min-w-0">
            <p className="caps mb-4 text-xs font-bold text-muted">Example: how “{ex.name}” was made</p>
            <ol className="grid gap-4 sm:grid-cols-3">
              {steps.map((s) => (
                <li key={s.title} className="min-w-0">
                  <ImageSlot src={s.src} tint={ex.colour.hex} label={ex.name + ': ' + s.title} ratio="4 / 5" />
                  <div className="mt-3 flex items-center gap-2">
                    <s.icon size={18} aria-hidden="true" />
                    <h3 className="font-black uppercase" style={{ fontStretch: '85%' }}>{s.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
            <a href={productLink(ex.slug)} className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold underline underline-offset-4 hover:opacity-70">
              See {ex.name} in the shop <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Collections() {
  return (
    <section id="collections" className="scroll-mt-16">
      <div className="gutter mx-auto max-w-[1440px] py-14 lg:py-20">
        <h2 className={H2 + ' mb-8'} style={H2_STYLE}>Shop by collection</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {COLLECTIONS.map((c) => {
            const items = PRODUCTS.filter((p) => p.collection === c.id);
            return (
              <a key={c.id} href={shopLink(c.id)} className="group relative block" aria-label={c.id + ' collection, ' + items.length + ' hoodies'}>
                <ImageSlot src={'/images/collection-' + c.id.toLowerCase() + '.jpg'} tint={items[0].colour.hex} label={c.id + ' collection'} ratio="16 / 10" zoom />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 bg-panel p-4 sm:inset-x-5 sm:bottom-5">
                  <div className="min-w-0">
                    <p className="text-xl font-black uppercase leading-none" style={{ fontStretch: '85%' }}>{c.id}</p>
                    <p className="mt-1 text-sm text-muted">{c.blurb} {items.length} {items.length === 1 ? 'hoodie' : 'hoodies'}.</p>
                  </div>
                  <ArrowRight size={22} aria-hidden="true" className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    { icon: Shirt, title: 'Pick your hoodie', text: 'Browse the range and choose a size. No account needed.' },
    { icon: Package, title: 'We make and pack it', text: 'Your order is dispatched within ' + DISPATCH_DAYS + ' working days. [CONFIRM]' },
    { icon: Truck, title: 'It arrives at your door', text: 'Tracked delivery across India. Easy returns. [CONFIRM RETURN POLICY]' }
  ];
  return (
    <section id="how" className="scroll-mt-16 border-t border-line bg-panel2">
      <div className="gutter mx-auto max-w-[1440px] py-14 lg:py-20">
        <h2 className={H2 + ' mb-10'} style={H2_STYLE}>How it works</h2>
        <ol className="grid gap-px border border-line bg-line md:grid-cols-3">
          {steps.map((s, n) => (
            <li key={s.title} className="bg-bg p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <s.icon size={28} strokeWidth={1.5} aria-hidden="true" />
                <span className="tnum text-sm font-bold text-muted">Step {n + 1}</span>
              </div>
              <h3 className="mt-6 text-2xl font-black uppercase leading-none" style={{ fontStretch: '80%' }}>{s.title}</h3>
              <p className="mt-3 max-w-[34ch] text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Lookbook() {
  const tints = ['#16171A', '#3B4A63', '#E8A93A', '#2F4A3A'];
  return (
    <section aria-labelledby="look-h" className="scroll-mt-16">
      <div className="gutter mx-auto max-w-[1440px] py-14 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="look-h" className={H2} style={H2_STYLE}>Worn in the wild</h2>
          <p className="text-muted">[ADD INSTAGRAM HANDLE]</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {tints.map((t, n) => (
            <ImageSlot key={n} src={'/images/lookbook-' + (n + 1) + '.jpg'} tint={t} label={'Customer photo ' + (n + 1)} ratio="4 / 5" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <Featured />
      <Collections />
      <How />
      <Lookbook />
    </>
  );
}
