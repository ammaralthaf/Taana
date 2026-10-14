import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ImageSlot from '../components/ImageSlot.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS, COLLECTIONS, DISPATCH_DAYS, FREE_SHIP_OVER, money, bySlug } from '../data/store.js';
import { shopLink, productLink } from '../router.js';
import { useStore } from '../context.js';

const T = { fontStretch: '85%' };
const H2 = 'font-extrabold uppercase leading-[0.95] tracking-tight';
const H2_STYLE = { fontSize: 'clamp(2rem, 4.6vw, 3.5rem)', ...T };
const SECTION = 'gutter mx-auto max-w-[1280px] py-16 lg:py-24';
const LINK = 'caps inline-flex min-h-[44px] items-center gap-2 text-xs font-bold underline underline-offset-8 decoration-2 transition-opacity duration-200 hover:opacity-70';

/* One photo slot. Hovering a name in the list switches the hoodie shown. */
function Hero() {
  const { goSection } = useStore();
  const picks = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const [i, setI] = useState(0);
  const p = picks[i];

  return (
    <section aria-label="Featured hoodies" className="bg-hero">
      <div className="gutter mx-auto grid max-w-[1280px] items-center gap-12 py-12 lg:grid-cols-2 lg:gap-20 lg:py-20">
        <div className="min-w-0">
          <h1 className="font-extrabold uppercase leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.75rem)', ...T }}>
            Made by us.<br />Picked by you.
          </h1>
          <p className="mt-5 max-w-[42ch] text-lg text-muted">
            Every hoodie here is designed and made by us. Pick one to take a closer look.
          </p>

          <ul className="mt-8 border-t border-line">
            {picks.map((x, n) => (
              <li key={x.slug} className="border-b border-line">
                <a
                  href={productLink(x.slug)} onMouseEnter={() => setI(n)} onFocus={() => setI(n)} aria-current={n === i ? 'true' : undefined}
                  className={'flex min-h-[56px] items-center justify-between gap-4 transition-colors duration-200 ' + (n === i ? 'text-fg' : 'text-muted hover:text-fg')}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span aria-hidden="true" className={'h-2 w-2 shrink-0 rounded-full transition-colors duration-200 ' + (n === i ? 'bg-accent' : 'bg-line')} />
                    <span className="truncate text-lg font-extrabold uppercase" style={T}>{x.name}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-sm">
                    <span className="tnum">{money(x.price)}</span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={shopLink()} className="caps group inline-flex min-h-[52px] items-center gap-3 bg-fg px-7 text-sm font-bold text-bg transition-colors duration-200 hover:bg-accent hover:text-onaccent">
              Shop all hoodies <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <button type="button" onClick={() => goSection('story')} className={LINK}>Why we make them</button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[440px] lg:ml-auto lg:mr-0">
          <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-full w-full" style={{ background: 'color-mix(in srgb, var(--accent) 22%, transparent)' }} />
          <a key={p.slug} href={productLink(p.slug)} aria-label={'View ' + p.name} className="rise group relative block">
            <ImageSlot product={p} ratio="4 / 5" eager zoom />
          </a>
          <div className="relative mt-4 flex items-baseline justify-between gap-3">
            <p className="min-w-0">
              <span className="block text-lg font-extrabold uppercase leading-tight" style={T}>{p.name}</span>
              <span className="text-sm text-muted">{p.collection} · {p.colour.name}</span>
            </p>
            <span className="tnum font-bold">{money(p.price)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ['Made by us', 'Picked by you', 'Free shipping over ' + money(FREE_SHIP_OVER), 'Ships in ' + DISPATCH_DAYS + ' working days'];
  const row = (k) => (
    <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 'b' ? 'true' : undefined}>
      {items.map((t) => (
        <span key={t} className="caps flex items-center whitespace-nowrap px-5 text-xs font-bold">
          {t}<span className="ml-10 inline-block h-1.5 w-1.5 rounded-full bg-onaccent" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee overflow-hidden bg-accent py-3 text-onaccent" role="region" aria-label="Store highlights">
      <div className="marquee-track">{row('a')}{row('b')}</div>
    </div>
  );
}

function Featured() {
  const picks = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  return (
    <section aria-labelledby="featured-h" className="scroll-mt-16">
      <div className={SECTION}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="featured-h" className={H2} style={H2_STYLE}>New in</h2>
          <a href={shopLink()} className={LINK}>See all {PRODUCTS.length} <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
          {picks.map((p) => (
            <div key={p.slug} className="w-[68%] shrink-0 snap-start sm:w-[44%] lg:w-auto"><ProductCard product={p} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Why we do this, with a worked example, in words only. */
function Story() {
  const ex = bySlug('night-market');
  const steps = [
    ['We draw it', 'Every design starts as a sketch by us.'],
    ['We make it', 'A test piece is cut, printed and checked before it goes on sale.'],
    ['You wear it', 'The finished hoodie goes in the shop. You pick your size.']
  ];
  return (
    <section id="story" className="scroll-mt-16 bg-panel2">
      <div className={SECTION + ' grid gap-12 lg:grid-cols-2 lg:gap-20'}>
        <div className="min-w-0">
          <h2 className={H2} style={H2_STYLE}>Why we make our own hoodies</h2>
          <p className="mt-6 max-w-[46ch] text-lg">
            We design every hoodie ourselves, so each one has an idea behind it. You do not design anything. Choose the one you like, pick your size, and we send it.
          </p>
          <p className="mt-4 max-w-[46ch] text-muted">[SAMPLE COPY: REPLACE WITH YOUR OWN STORY. Say who you are, why you started, and what makes your designs different.]</p>
        </div>

        <div className="min-w-0">
          <p className="mb-4 font-bold">Example: how “{ex.name}” was made</p>
          <ol className="border-t border-line">
            {steps.map(([t, d], n) => (
              <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-line py-5">
                <span className="tnum text-xl font-extrabold text-accent" style={T}>{String(n + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-lg font-extrabold uppercase leading-tight" style={T}>{t}</h3>
                  <p className="mt-1 text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <a href={productLink(ex.slug)} className={LINK + ' mt-5'}>See {ex.name} <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

function Collections() {
  return (
    <section id="collections" className="scroll-mt-16">
      <div className={SECTION}>
        <h2 className={H2 + ' mb-8'} style={H2_STYLE}>Collections</h2>
        <ul className="border-t border-line">
          {COLLECTIONS.map((c) => {
            const items = PRODUCTS.filter((p) => p.collection === c.id);
            return (
              <li key={c.id} className="border-b border-line">
                <a href={shopLink(c.id)} className="group grid min-h-[84px] grid-cols-[1fr_auto] items-center gap-4 py-5 transition-[background-color,padding] duration-300 hover:bg-panel2 hover:px-4 focus-visible:bg-panel2 focus-visible:px-4 md:grid-cols-[1.2fr_1fr_auto]">
                  <span className="flex min-w-0 items-baseline gap-3">
                    <span className="text-3xl font-extrabold uppercase leading-none transition-colors duration-300 group-hover:text-accent sm:text-4xl" style={T}>{c.id}</span>
                    <span className="tnum text-sm text-muted">{items.length}</span>
                  </span>
                  <span className="hidden text-muted md:block">{c.blurb}</span>
                  <span className="flex shrink-0 items-center gap-4">
                    <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
                      {items.map((p) => <span key={p.slug} className="h-4 w-4 rounded-full border border-line" style={{ background: p.colour.hex }} />)}
                    </span>
                    <ArrowUpRight size={24} aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    ['Pick your hoodie', 'Browse the range and choose a size. No account needed.'],
    ['We make and pack it', 'Dispatched within ' + DISPATCH_DAYS + ' working days. [CONFIRM]'],
    ['It arrives', 'Tracked delivery across India. Easy returns. [CONFIRM RETURN POLICY]']
  ];
  return (
    <section id="how" className="scroll-mt-16 bg-deep text-ondeep">
      <div className={SECTION}>
        <h2 className={H2 + ' mb-10'} style={H2_STYLE}>How it works</h2>
        <ol className="grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map(([t, d], n) => (
            <li key={t} className="border-t pt-5" style={{ borderColor: 'color-mix(in srgb, var(--on-deep) 30%, transparent)' }}>
              <span className="tnum text-sm opacity-70">Step {n + 1}</span>
              <h3 className="mt-2 text-xl font-extrabold uppercase leading-tight" style={T}>{t}</h3>
              <p className="mt-2 max-w-[34ch] opacity-80">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ShopBand() {
  return (
    <section className="bg-hero">
      <div className="gutter mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center lg:py-20">
        <h2 className={H2} style={H2_STYLE}>Find your hoodie</h2>
        <a href={shopLink()} className="caps group inline-flex min-h-[56px] items-center gap-3 bg-fg px-8 text-sm font-bold text-bg transition-colors duration-200 hover:bg-accent hover:text-onaccent">
          Shop all hoodies <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Featured />
      <Story />
      <Collections />
      <How />
      <ShopBand />
    </>
  );
}
