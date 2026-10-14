import React, { useState, useEffect, useRef } from 'react';
import { StoreContext } from './context.js';
import { useRoute, navigate, scrollToId } from './router.js';
import { Announcement, Nav, Footer, CartDrawer } from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Product from './pages/Product.jsx';
import Checkout from './pages/Checkout.jsx';
import { BRAND, CART_KEY, WISH_KEY, bySlug } from './data/store.js';

function load(key, ok) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed.filter(ok) : [];
  } catch (e) { return []; }
}
const save = (key, value) => { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ } };

export default function App() {
  const route = useRoute();
  const [cart, setCart] = useState(() => load(CART_KEY, (x) => x && x.id && x.slug && x.size && x.colour && x.qty > 0 && bySlug(x.slug)));
  const [wish, setWish] = useState(() => load(WISH_KEY, (s) => typeof s === 'string' && bySlug(s)));
  const [cartOpen, setCartOpen] = useState(false);
  const cartBtnRef = useRef(null);
  const pending = useRef('');

  useEffect(() => save(CART_KEY, cart), [cart]);
  useEffect(() => save(WISH_KEY, wish), [wish]);

  // Page title and scroll position follow the route
  useEffect(() => {
    const p = route.name === 'product' ? bySlug(route.slug) : null;
    const t = { home: '', shop: 'Shop', checkout: 'Checkout', product: p ? p.name : 'Not found' }[route.name];
    document.title = t ? t + ' | ' + BRAND : BRAND + ' Hoodies';
    if (pending.current && route.name === 'home') {
      const id = pending.current;
      pending.current = '';
      setTimeout(() => scrollToId(id), 80);
    } else {
      window.scrollTo(0, 0);
    }
  }, [route.name, route.slug, route.params.c, route.params.saved]);

  const count = cart.reduce((s, x) => s + x.qty, 0);
  const subtotal = cart.reduce((s, x) => s + x.unit * x.qty, 0);

  const ctx = {
    cart, count, subtotal, wish, cartOpen, setCartOpen, cartBtnRef,
    addItem: (product, size, qty = 1) => {
      const id = product.slug + '|' + size;
      setCart((c) => {
        const i = c.findIndex((x) => x.id === id);
        if (i >= 0) return c.map((x, j) => (j === i ? { ...x, qty: Math.min(10, x.qty + qty) } : x));
        return c.concat([{ id, slug: product.slug, name: product.name, size, colour: product.colour, unit: product.price, qty }]);
      });
      setCartOpen(true);
    },
    setQty: (id, qty) => setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, Math.min(10, qty)) } : x))),
    removeItem: (id) => setCart((c) => c.filter((x) => x.id !== id)),
    toggleWish: (slug) => setWish((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : w.concat([slug]))),
    goSection: (id) => {
      if (route.name === 'home') scrollToId(id);
      else { pending.current = id; navigate('/'); }
    },
    goCheckout: () => { setCartOpen(false); navigate('/checkout'); }
  };

  if (route.name === 'checkout') {
    return (
      <StoreContext.Provider value={ctx}>
        <Checkout
          cart={cart}
          onBack={(openCart) => { navigate('/'); if (openCart) setCartOpen(true); }}
          onComplete={() => { setCart([]); navigate('/'); }}
        />
        <CartDrawer />
      </StoreContext.Provider>
    );
  }

  return (
    <StoreContext.Provider value={ctx}>
      <div className="font-body">
        <a href="#main" onClick={(e) => { e.preventDefault(); const m = document.getElementById('main'); if (m) m.focus(); }}
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-fg focus:px-4 focus:py-3 focus:text-bg">Skip to content</a>
        <Announcement />
        <Nav route={route} />
        <main id="main" tabIndex={-1} className="outline-none">
          {route.name === 'shop' && <Shop route={route} />}
          {route.name === 'product' && <Product slug={route.slug} />}
          {route.name === 'home' && <Home />}
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </StoreContext.Provider>
  );
}
