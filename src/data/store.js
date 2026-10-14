/* Everything you are likely to edit lives here.
   The hoodies below are SAMPLES: replace names, prices, colours and sizes with your real range.
   Add photos to public/images/ named <slug>-1.jpg, <slug>-2.jpg, <slug>-3.jpg. */

export const BRAND = 'BLNK'; // working name
export const CART_KEY = 'blnk-cart-v2';
export const WISH_KEY = 'blnk-wishlist-v1';

export const FREE_SHIP_OVER = 3000; // example
export const DISPATCH_DAYS = 3;     // working days to make and pack an order [CONFIRM]
export const PHOTO_COUNT = 3;       // photos per hoodie

export const money = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const COLLECTIONS = [
  { id: 'Street', blurb: 'Loud graphics, boxy fit.' },
  { id: 'Minimal', blurb: 'Quiet colours, small details.' },
  { id: 'Retro', blurb: 'Old-school prints, washed tones.' },
  { id: 'Outdoors', blurb: 'Earth tones for the weekend.' }
];

/* Shown on every product page. Replace the bracketed parts with your real facts. */
export const DETAILS = [
  'Fabric: [ADD FABRIC AND GSM]',
  'Fit: [ADD FIT, e.g. relaxed or oversized]',
  'Design: [ADD PRINT OR EMBROIDERY METHOD]',
  'Made by us in [ADD CITY]'
];
export const CARE = 'Care: [ADD WASH INSTRUCTIONS]';
export const RETURNS = 'Returns: [ADD YOUR RETURN POLICY]';

/* Sample size chart. Replace with your real measurements. */
export const SIZE_CHART = [
  { size: 'S', chest: 108, length: 66 },
  { size: 'M', chest: 112, length: 68 },
  { size: 'L', chest: 116, length: 70 },
  { size: 'XL', chest: 120, length: 72 },
  { size: 'XXL', chest: 124, length: 74 }
];

export const PRODUCTS = [
  { slug: 'night-market', name: 'Night Market', collection: 'Street', price: 2499, colour: { name: 'Black', hex: '#16171A' }, tag: 'New', featured: true, sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    blurb: 'Neon signs, steam and late-night chai stalls, printed across the back.' },
  { slug: 'monsoon', name: 'Monsoon', collection: 'Minimal', price: 2299, colour: { name: 'Slate blue', hex: '#3B4A63' }, tag: 'Bestseller', featured: true, sizes: ['S', 'M', 'L', 'XL'],
    blurb: 'Rain-grey blue with a small chest mark. Easy to wear with anything.' },
  { slug: 'marigold', name: 'Marigold', collection: 'Street', price: 2399, compareAt: 2899, colour: { name: 'Turmeric', hex: '#E8A93A' }, tag: 'Sale', featured: true, sizes: ['M', 'L', 'XL'],
    blurb: 'Festival-season yellow with a bold floral front print.' },
  { slug: 'chai-stain', name: 'Chai Stain', collection: 'Retro', price: 2199, colour: { name: 'Brown', hex: '#6B4A3A' }, sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    blurb: 'Washed brown with a vintage cup graphic. Warm, soft, slightly faded.' },
  { slug: 'paper-boat', name: 'Paper Boat', collection: 'Minimal', price: 2199, colour: { name: 'Off-white', hex: '#E9E5D9' }, tag: 'New', featured: true, sizes: ['S', 'M', 'L', 'XL'],
    blurb: 'A single folded boat on the chest. Clean and calm.' },
  { slug: 'local-train', name: 'Local Train', collection: 'Retro', price: 2599, colour: { name: 'Maroon', hex: '#6E1F2B' }, soldOut: true, sizes: [],
    blurb: 'Window-seat stripes and a station-board back print.' },
  { slug: 'pine-hours', name: 'Pine Hours', collection: 'Outdoors', price: 2699, colour: { name: 'Forest green', hex: '#2F4A3A' }, sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    blurb: 'Deep green with a quiet mountain line across the chest.' },
  { slug: 'dune', name: 'Dune', collection: 'Outdoors', price: 2499, colour: { name: 'Sand', hex: '#CDB894' }, tag: 'New', sizes: ['S', 'M', 'L'],
    blurb: 'Desert-sand tone with tonal embroidery. Looks good in any light.' }
];

export const bySlug = (slug) => PRODUCTS.find((p) => p.slug === slug);
export const photoSrc = (slug, n) => '/images/' + slug + '-' + n + '.jpg';
