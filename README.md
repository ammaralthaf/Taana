# BLNK Hoodie Store

A catalogue store for hoodies you design and make yourself: home page, shop with filters, product pages, cart drawer and a three-step checkout. React, Vite, Tailwind CSS, lucide-react.

**BLNK is a working name.** Change `BRAND` in `src/data/store.js`.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Pages

| Route | What it is |
| --- | --- |
| `#/` | Home: spotlight hoodie, "why we make our own hoodies" story with a worked example, featured hoodies, collections, how it works, photo strip |
| `#/shop` | All hoodies. Filter by collection, colour, size, availability; sort; saved list (`#/shop?c=Street`, `#/shop?saved=1`) |
| `#/product/<slug>` | Photo gallery, size picker and guide, quantity, add to cart, details |
| `#/checkout` | Shipping address, shipping method, payment, order summary, success modal |

## Add or change a hoodie

Edit the `PRODUCTS` list in `src/data/store.js`. The hoodies in there are **samples**; replace them with your real range.

```js
{ slug: 'night-market', name: 'Night Market', collection: 'Street',
  price: 2499, colour: { name: 'Black', hex: '#16171A' }, tag: 'New',
  featured: true, sizes: ['S', 'M', 'L', 'XL', 'XXL'], blurb: 'Short description.' }
```

- `featured: true` puts it on the home page (the first four are used).
- `compareAt` shows a crossed-out price and a Sale label. `soldOut: true` marks it sold out.
- `sizes` lists the sizes in stock.

## Add photos

Put images in `public/images/`. They appear automatically; until then each spot shows a framed placeholder that names the file it expects. See `public/images/README.txt`.

- `<slug>-1.jpg`, `<slug>-2.jpg`, `<slug>-3.jpg`: product photos (the second shows on hover)
- `story-1.jpg` to `story-3.jpg`, `collection-<name>.jpg`, `lookbook-1.jpg` to `lookbook-4.jpg`: home page

Recommended: 1200 x 1500 px (4:5), JPG.

## Other things to edit

| Where | What |
| --- | --- |
| `src/data/store.js` | `FREE_SHIP_OVER`, `DISPATCH_DAYS`, collections, size chart, details text |
| `src/pages/Checkout.jsx` | `SHIP` (shipping prices), `TAX_RATE`, `COD_FEE` |
| `src/pages/Home.jsx` | Home page copy, including the story section |

All prices, tax and fees are **examples**. Anything written like `[THIS]` in the site is a placeholder for a detail you still need to fill in (return policy, fabric, contact, and so on).

## Before you go live

This is front-end only. **No payments are processed and no orders are saved.** "Place order" shows the success screen only. To take real orders you need:

1. A payment provider (for example Razorpay or Cashfree) and a small backend to create and verify payments.
2. An order store and confirmation emails.
3. Card details must never touch your own server; use the provider's hosted fields.

Cash on delivery has high return-to-origin rates in India (roughly 25-30% against 2-3% for prepaid), so consider nudging customers to prepay.
