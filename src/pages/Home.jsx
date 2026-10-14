import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ImageSlot from '../components/ImageSlot.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS, COLLECTIONS, DISPATCH_DAYS, FREE_SHIP_OVER, money, bySlug } from '../data/store.js';
import { shopLink, productLink } from '../router.js';

const BIG = { fontStretch: '75%' };
const H2 = 'font-black uppercase leading-[0.88] tracking-tight';
const H2_STYLE = { fontSize: 'clamp(2.6rem, 8vw, 6.5rem)', fontStretch: '75%' };

/* One big photo slot. The list on the left switches which hoodie it shows. */
function Hero() {
  const picks = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const [i, setI] = useState(0);
  const p = picks[i];

  return (
    <section aria-label="Featured hoodies" className="bg-fg text-bg">
      <div className="gutter mx-auto grid max-w-[1440px] gap-10 py-10 lg:min-h-[min(86vh,820px)] lg:grid-cols-12 lg:items-stretch lg:gap-14 lg:py-14">
        <div className="flex min-w-0 flex-col justify-between gap-10 lg:col-span-7">
          <h1 className="font-black uppercase leading-[0.82] tracking-tight" style={{ fontSize: 'clamp(3.4rem, 11.5vw, 10.5rem)', ...BIG }}>
            Made by us.<br />Picked by you.
          </h1>

          <div>
            <p className="mb-3 max-w-[40ch] opacity-70">Every hoodie here is designed and made by us. Pick one to take a closer look.</p>
            <ul className="border-t border-bg/30" style={{ borderColor: 'color-mix(in srgb, var(--bg) 30%, transparent)' }}>
              {picks.map((x, n) => (
                <li key={x.slug} style={{ borderBottom: '1px solid color-mix(in srgb, var(--bg) 30%, transparent)' }}>
                  <a
                    href={productLink(x.slug)} onMouseEnter={() => setI(n)} onFocus={() => setI(n)}
                    aria-current={n === i ? 'true' : undefined}
                    className={'group flex min-h-[56px] items-center justify-between gap-4 py-2 transition-[padding,opacity] duration-300 ' + (n === i ? 'pl-3 opacity-100' : 'opacity-60 hover:opacity-100')}
                  >
                    <span className="flex min-w-0 items-baseline gap-3">
                      <span className="tnum w-6 shrink-0 text-sm opacity-70">{String(n + 1).padStart(2, '0')}</span>
                      <span className="truncate text-2xl font-black uppercase sm:text-3xl" style={BIG}>{x.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="tnum hidden text-sm sm:inline">{money(x.price)}</span>
                      <ArrowUpRight size={20} aria-hidden="true" className={'transition-transform duration-300 ' + (n === i ? 'translate-x-0' : '-translate-x-2')} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={shopLink()} className="caps group inline-flex min-h-[52px] items-center gap-3 bg-bg px-7 text-sm font-bold text-fg transition-colors duration-200 hover:bg-accent hover:text-onaccent">
                Shop all hoodies <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        <a key={p.slug} href={productLink(p.slug)} aria-label={'View ' + p.name} className="rise group relative mx-auto block w-full max-w-[520px] self-end lg:col-span-5 lg:max-w-none">
          <ImageSlot product={p} ratio="4 / 5" eager zoom />
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
            <span>
              <span className="block text-xl font-black uppercase leading-none" style={BIG}>{p.name}</span>
              <span className="text-sm opacity-85">{p.collection} · {p.colour.name}</span>
            </span>
            <span className="tnum font-bold">{money(p.price)}</span>
          </span>
        </a>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ['Made by us', 'Picked by you', 'Free shipping over ' + money(FREE_SHIP_OVER), 'Ships in ' + DISPATCH_DAYS + ' working days'];
  const row = (k) => (
    <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 'b' ? 'true' : undefined}>
      {items.map((t) => (
        <span key={t} className="flex items-center whitespace-nowrap px-6 text-lg font-black uppercase sm:text-2xl" style={BIG}>
          {t}<span className="ml-12 inline-block h-2 w-2 bg-onaccent" aria-hidden="true" />
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
      <div className="gutter mx-auto max-w-[1440px] py-16 lg:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="featured-h" className={H2} style={H2_STYLE}>New in</h2>
          <a href={shopLink()} className="caps inline-flex min-h-[44px] items-center gap-2 text-xs font-bold underline underline-offset-8 decoration-2 hover:opacity-70">
            See all {PRODUCTS.length} <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible">
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
      <div className="gutter mx-auto grid max-w-[1440px] gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="min-w-0 lg:col-span-7">
          <h2 className={H2} style={{ fontSize: 'clamp(2.6rem, 8vw, 7rem)', ...BIG }}>Why we make our own hoodies</h2>
          <p className="mt-8 max-w-[46ch] text-xl">
            We design every hoodie ourselves, so each one has an idea behind it. You do not design anything. Choose the one you like, pick your size, and we send it.
          </p>
          <p className="mt-4 max-w-[46ch] text-muted">[SAMPLE COPY: REPLACE WITH YOUR OWN STORY. Say who you are, why you started, and what makes your designs different.]</p>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <p className="mb-4 font-bold">Example: how “{ex.name}” was made</p>
          <ol className="border-t border-fg">
            {steps.map(([t, d], n) => (
              <li key={t} className="grid grid-cols-[3rem_1fr] gap-x-3 border-b border-line py-5">
                <span className="tnum text-3xl font-black leading-none" style={BIG}>{String(n + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-2xl font-black uppercase leading-none" style={BIG}>{t}</h3>
                  <p className="mt-2 text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <a href={productLink(ex.slug)} className="caps mt-6 inline-flex min-h-[44px] items-center gap-2 text-xs font-bold underline underline-offset-8 decoration-2 hover:opacity-70">
            See {ex.name} <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Collections() {
  return (
    <section id="collections" className="scroll-mt-16">
      <div className="gutter mx-auto max-w-[1440px] py-16 lg:py-24">
        <h2 className={H2 + ' mb-10'} style={H2_STYLE}>Collections</h2>
        <ul className="border-t border-fg">
          {COLLECTIONS.map((c) => {
            const items = PRODUCTS.filter((p) => p.collection === c.id);
            return (
              <li key={c.id} className="border-b border-fg">
                <a href={shopLink(c.id)} className="group flex min-h-[88px] items-center justify-between gap-4 py-5 transition-[background-color,color,padding] duration-300 hover:bg-fg hover:px-5 hover:text-bg focus-visible:bg-fg focus-visible:px-5 focus-visible:text-bg">
                  <span className="flex min-w-0 items-baseline gap-3">
                    <span className="font-black uppercase leading-none" style={{ fontSize: 'clamp(2.4rem, 7vw, 5.5rem)', ...BIG }}>{c.id}</span>
                    <sup className="tnum text-sm font-bold">{items.length}</sup>
                  </span>
                  <span className="hidden max-w-[28ch] text-muted transition-colors duration-300 group-hover:text-bg md:block" style={{ color: 'inherit', opacity: 0.7 }}>{c.blurb}</span>
                  <span className="flex shrink-0 items-center gap-4">
                    <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
                      {items.map((p) => <span key={p.slug} className="h-5 w-5 rounded-full border border-line" style={{ background: p.colour.hex }} />)}
                    </span>
                    <ArrowUpRight size={30} aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-45" />
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
    <section id="how" className="scroll-mt-16 bg-fg text-bg">
      <div className="gutter mx-auto max-w-[1440px] py-16 lg:py-24">
        <h2 className={H2 + ' mb-12'} style={H2_STYLE}>How it works</h2>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map(([t, d], n) => (
            <li key={t} className="border-t pt-5" style={{ borderColor: 'color-mix(in srgb, var(--bg) 40%, transparent)' }}>
              <span className="tnum text-sm opacity-70">Step {n + 1}</span>
              <h3 className="mt-3 text-3xl font-black uppercase leading-none" style={BIG}>{t}</h3>
              <p className="mt-3 max-w-[34ch] opacity-75">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ShopBand() {
  return (
    <a href={shopLink()} className="group block border-y border-fg transition-colors duration-300 hover:bg-accent hover:text-onaccent">
      <div className="gutter mx-auto flex max-w-[1440px] items-center justify-between gap-6 py-8 lg:py-12">
        <span className="font-black uppercase leading-[0.85]" style={{ fontSize: 'clamp(3rem, 12vw, 11rem)', ...BIG }}>Shop all</span>
        <ArrowRight aria-hidden="true" className="h-[clamp(2.5rem,9vw,8rem)] w-[clamp(2.5rem,9vw,8rem)] shrink-0 transition-transform duration-300 group-hover:translate-x-3" strokeWidth={1.5} />
      </div>
    </a>
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
