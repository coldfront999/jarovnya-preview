# Bento experiment — 2026-11-01

Mode: Operate. A client chooses real food, a fulfillment method and desired weight where relevant. The original reference-one route and saved kraft/charcoal routes remain unchanged.

## User-selected visual world

Bento grid with one tall grill tile and two shorter category tiles; horizontal compact category choices; two-column food catalog. All tiles navigate to real menu categories. No invented offers, ratings, ingredients or claims. Product names, prices, photos, logo, cart and staff actions are preserved.

Golos Text is the existing locally hosted interface typeface. Strong left alignment, clear price actions, 20–22 px tile corners, transparent food cutouts. Decorative colors belong to navigation tiles; small action text uses dark/light surfaces for contrast.

Palette choices transcribed from the three owner screenshots:
- Сочная: #FAFCFC, #0D0D0D, #FE5B3A, #F7D041, #976EFE, #5BCD90.
- Природная: #FFFFFF, #0E0F0B, #FE813C, #BC656A, #727E6E.
- Смелая: #FFFFFF, #323230, #7477FF, #F3685A, #F9CD61, #C5D4CA.

Light/dark appearance is independent of palette. The selection survives reload and a palette-specific link can be shared. IndexedDB and appearance storage are isolated from the existing previews.

## Image delivery

`scripts/prepare-bento-images.py` creates independent WebP assets, preserving alpha and the original aspect ratio, without editing source photos. Menu/cart: at most 384 px, quality 76. Product detail: at most 960 px, quality 83, fetched only when opened. The cached small photo remains visible while the larger file loads; a failed large request leaves the small photo in place. A small local logo replaces the 593 KB source only in this experiment.

46 unique photos: originals total 66,130,192 bytes; thumbnails 1,382,642 bytes (97.9% smaller); detail files 7,599,564 bytes (88.5% smaller). These are totals for all variants, not first-page transfer. Exact file sizes and dimensions are in images/manifest.json. No claim of identical pixels or complete offline support is made. Browser HTTP caching remains in use.


## Verification

- Business regression suite: 23/23 passed; npm build passed. Every bento JavaScript file parses.
- All 92 food derivatives decoded, retained RGBA transparency and met their 384/960 px limits.
- Browser: palettes switched in-place; light/dark worked; no horizontal page overflow at 305, 375 and 1265 CSS px. No broken menu images or console errors observed.
- Fixed shawarma quick-add and weighted pork with a 500 g request both appeared in the cart. Product detail loaded images/detail/pork.webp only after opening.
- Photo payload for the initial five unique menu/tile photos plus logo: 163,762 bytes, excluding scripts, CSS and fonts. No throttled-network timing or native-device performance claim is made.
- This remains a local demonstration; backend orders, production authentication and live availability were not added.
