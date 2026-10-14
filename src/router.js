import { useState, useEffect } from 'react';

/* Tiny hash router so the back button and shared links work: #/  #/shop?c=Street  #/product/monsoon  #/checkout */
export function parseHash(hash) {
  const raw = (hash || '').replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  const params = {};
  query.split('&').forEach((kv) => {
    if (!kv) return;
    const [k, v = ''] = kv.split('=');
    params[decodeURIComponent(k)] = decodeURIComponent(v);
  });
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'shop') return { name: 'shop', params };
  if (parts[0] === 'product' && parts[1]) return { name: 'product', slug: decodeURIComponent(parts[1]), params };
  if (parts[0] === 'checkout') return { name: 'checkout', params };
  return { name: 'home', params };
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const navigate = (path) => { window.location.hash = '#' + path; };
export const shopLink = (collection) => '#/shop' + (collection ? '?c=' + encodeURIComponent(collection) : '');
export const productLink = (slug) => '#/product/' + encodeURIComponent(slug);

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
