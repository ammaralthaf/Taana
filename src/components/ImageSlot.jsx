import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { photoSrc } from '../data/store.js';

/* A framed picture slot. It shows the real photo when the file exists in public/images,
   and a clearly marked, tinted frame when it does not. */

function HoodieGlyph({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d="M22 9 L9 20 L13 33 L19 30 L19 56 L45 56 L45 30 L51 33 L55 20 L42 9 Q32 22 22 9 Z" />
      <path d="M26 41 H38 V49 H26 Z" />
      <path d="M28 20 V28 M36 20 V28" />
    </svg>
  );
}

/* Props:
   product + index  -> uses /images/<slug>-<index+1>.jpg and the product colour
   src, tint, label -> for slots that are not a product (lookbook, collection tiles)
   ratio            -> CSS aspect-ratio, default 4 / 5
   small            -> hides the long hint text (for thumbnails)
   zoom             -> slow zoom on hover when a photo is showing */
export default function ImageSlot({ product, index = 0, src, tint, label, ratio = '4 / 5', small = false, zoom = false, className = '', eager = false }) {
  const url = src || (product ? photoSrc(product.slug, index + 1) : '');
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setFailed(false); setLoaded(false); }, [url]);

  const colour = tint || (product ? product.colour.hex : '#9a9a94');
  const alt = label || (product ? product.name + ' hoodie, photo ' + (index + 1) : 'Photo');
  const file = url.replace(/^\//, 'public/');

  return (
    <div className={className}>
      <div className="relative w-full overflow-hidden bg-panel2" style={{ aspectRatio: ratio }}>
        {!loaded && (
          <div
            role="img" aria-label={alt + ' (placeholder, photo not added yet)'}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-muted"
            style={{ background: 'linear-gradient(160deg, color-mix(in srgb, ' + colour + ' 30%, var(--panel2)), color-mix(in srgb, ' + colour + ' 10%, var(--panel2)))' }}
          >
            <span className="text-fg" style={{ opacity: 0.55 }}><HoodieGlyph size={small ? 26 : 56} /></span>
            {!small && (
              <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-left text-[11px] text-muted">
                <span className="inline-flex items-center gap-1.5"><ImageIcon size={12} aria-hidden="true" /> Photo goes here</span>
                <span className="truncate">{file.replace('public/images/', '')}</span>
              </span>
            )}
          </div>
        )}
        {!failed && url && (
          <img
            src={url} alt={loaded ? alt : ''} loading={eager ? 'eager' : 'lazy'} decoding="async"
            onLoad={() => setLoaded(true)} onError={() => setFailed(true)}
            className={'absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ' + (loaded ? 'opacity-100' : 'opacity-0') + (zoom ? ' transition-transform duration-700 group-hover:scale-105' : '')}
          />
        )}
      </div>
    </div>
  );
}
