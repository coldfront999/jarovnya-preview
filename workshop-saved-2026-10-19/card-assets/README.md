# Food cutouts for the selected card direction

Created 18 October 2026 with the built-in imagegen tool. Extended from four samples to all 53 catalog items, using 46 distinct transparent assets. Shared source photographs, catalog names/prices/IDs and the frozen public interfaces were not replaced. Workshop menu.html and card-directions.html use card-images.js to select these assets in memory.

The selected first direction uses thin separators between columns and rows, without enclosing card frames. The two other comparison directions remain available.

Mors 0.5 litre follows the owner's bottle photograph. The current 1 litre version (mors-1l-classic.webp) follows a real manufacturer's round one-litre PET bottle: https://www.zavodpet.ru/products/boottle/butylka_1_l_moloko/ (height 240 mm, body diameter 78 mm, neck 38 mm). It is filled with red mors and has the matching white screw cap. References and the exact built-in imagegen prompt are recorded in mors-1l-classic.json and PROMPTS.json. The previous thin mors-slim.webp remains only as a historical asset and is not selected by the current catalog map.

The app consumes lossless WebP files, 1254×1254 RGBA with real transparency. Encoding was verified to preserve the alpha channel and every visible RGB pixel of the generated PNGs. No resizing or compositing was performed. All 46 assets were inspected on light and dark surfaces. Full prompts and generated filenames are recorded in PROMPTS.json. New source PNGs are archived under outputs/card-cutouts/png in the local workspace; the original four PNG samples below remain here for earlier comparisons.

- pork.png — generated output exec-00584ecb-7e94-4c0a-aa53-f5d12a34afdd.png
- shawarma-chicken.png — exec-bba68804-4fe3-482a-a639-673a3f6b304a.png
- adjara.png — exec-cdd50230-7c8b-4e88-b049-2f4584759802.png
- potatoes.png — exec-7c0f1b83-d23d-4097-aca4-a0fcc59846c0.png

Generated cutouts can differ slightly from original photo pixels; they are not a claim about exact portion or ingredients. All commercial names/prices come from the actual catalog.

Prompt used separately for each source:

> Edit target: the single supplied restaurant food photograph. Create a clean transparent-background product cutout for an app menu. Remove ONLY the grey tabletop/background outside the black plate. Preserve the entire black plate and every piece of the existing food, their exact arrangement, size, lighting, colors, ingredients, angle and photographic appearance as closely as possible. Do not reimagine the food. Keep a small transparent margin around the whole plate and any protruding food. Preserve a very subtle natural contact shadow immediately under the plate only. No added food, no garnish, no text, no frame, no decorative graphics, no solid background. Output one isolated plate as a PNG with real alpha transparency. This asset will be used at 170–200 pixels wide over both light kraft and dark charcoal backgrounds.

Typography, separators, layout and small Phosphor graphics are real HTML/CSS/SVG. Interface screenshots are captured from working HTML. The final food assets are shipped with the app, so the shown interface is reproducible from the same files and viewport.
