# BLNK Hoodie Store

A made-to-order custom hoodie store for India: storefront, live hoodie customizer, cart drawer and a three-step checkout. Built with React, Vite and Tailwind CSS. Icons from lucide-react.

**BLNK is a working name.** Change it in one place: `BRAND` at the top of `src/App.jsx`.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## What's inside

- **Storefront**: sticky nav with cart badge, hero, product details, how-it-works.
- **Customizer**: front/back view, fabric and colours, text and graphics, size and fit, live price.
- **Cart drawer**: quantity, remove, subtotal, saved in the browser (localStorage).
- **Checkout**: shipping address, shipping method, payment (card with auto-format and Luhn check, UPI, cash on delivery), sticky summary, success modal.

## Edit these constants (in `src/App.jsx`)

| Constant | What it controls |
| --- | --- |
| `BRAND` | Store name |
| `PRICING` | Base price and add-ons for the customizer |
| `SHIP` | Shipping options, prices and free-shipping threshold |
| `PRODUCTION_DAYS` | Made-to-order lead time shown at checkout |
| `TAX_RATE` | Tax applied at checkout |
| `COD_FEE` | Cash-on-delivery fee |

All prices, tax and fee values are **examples**. Set your real numbers before launch.

## Before you go live

Anything marked `[LIKE THIS]` in the UI is a placeholder for a business detail not yet decided (company name, address, support contact, policies).

This is a front-end only. **No payments are processed and no orders are saved.** The "Place order" button shows the success screen only. To take real orders you need:

1. A payment provider (for example Razorpay or Cashfree) and a small backend to create and verify payments.
2. An order store and confirmation emails.
3. Real card data must never touch your own server; use the provider's hosted fields.

Cash on delivery has high return-to-origin rates in India (roughly 25-30% against 2-3% for prepaid), so consider nudging customers to prepay.
