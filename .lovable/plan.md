# Home page polish — map, motion, real photos

Design system stays exactly as is: sage/linen/ink palette, Fraunces + Inter, ensō motif. Nothing outside the three items below changes.

## A. Real monochrome map (Location section)

Replaces only the "Žemėlapis – netrukus" dashed block.

- **Library:** `maplibre-gl` (only new dependency). No Google, no Mapbox token, no framer-motion.
- **Tiles:** free Carto raster tiles (`light_all`) declared as a raster source in an inline style object — no API key, DSGVO-friendly.
- **Monochrome:** wrapper carries `filter: grayscale(1) contrast(0.95)` so the canvas reads as an elegant B&W map over the light Carto base.
- **Position:** center `[22.248996, 55.983649]`, zoom 15.5. Scroll-zoom disabled by default so page scrolling isn't hijacked; drag and zoom controls available.
- **Marker:** custom DOM marker — a small sage dot with a thin ensō ring around it, matching the existing `<Enso>` stroke weight. No default MapLibre pin.
- **Frame:** `rounded-2xl overflow-hidden shadow-soft`, height matched to the location image beside it.
- **SSR:** the map lives in its own component loaded via `React.lazy` behind `<ClientOnly>`, so `maplibre-gl` never enters the SSR import graph. A skeleton fallback keeps layout stable.
- **Lazy init:** the existing `useReveal` IntersectionObserver gates initialization — the map instance is created only once the block scrolls into view.
- **Reduced motion:** no fly-to easing; the map is created already at final center and zoom.
- Address line and "Atidaryti žemėlapyje" button stay untouched.

## B. Motion — richer but still calm

All CSS-based, extending the current `reveal` utility. No animation library.

- **Reveal directions:** `<Reveal>` gains `direction?: "up" | "left" | "right"` (default `up`), implemented as a `data-direction` attribute plus three start states in `styles.css` (28px offset, same 900ms `cubic-bezier(0.22,1,0.36,1)`). Location section: text from the left, image/map from the right.
- **Staggered stay cards:** existing `delay` prop tuned to 0 / 110 / 220ms.
- **Hero Ken Burns:** pure CSS keyframes on the hero image, scale 1 → 1.08 with a few px of pan, 20s ease-in-out, alternating infinitely.
- **Hero scroll-fade:** a small rAF-throttled passive `scroll` listener writing one CSS custom property (`--hero-progress`) that drives opacity and a slight translateY on the hero content only. No per-frame React state, no library.
- **Image hover zoom:** stay-card photos and the location image scale to 1.05 over ~900ms ease-out inside their existing `overflow-hidden` frames, gated to `@media (hover: hover)`.
- **Arrow nudge:** "Plačiau →" and similar text links translate their arrow 4px right over 300ms on hover/focus.
- **Reduced motion:** the existing `prefers-reduced-motion` block is extended to kill Ken Burns, hover zoom, direction offsets and the scroll-fade.

Nothing else gets motion added.

## C. Real photos from dharmastay.lt

I checked the URLs directly — **5 of 6 return a real image; the cottage one 404s.**

| Slot | Source | Status |
| --- | --- | --- |
| Hero (building/terrace) | `dharmastay-viesbutis-telsiuose.jpg` | OK |
| Location (town/lake) | `telse-1024x682.webp` | OK |
| Terrace apartment card | `IMG_2537-1024x768.jpg` | OK |
| Standard apartment card | `2-12-1024x768.jpg` | OK |
| Extras / more rooms | `1-1-10-1024x683.jpg` | OK |
| Cottage with sauna & hot tub | `namelio-pirties-kubilo-nuoma-telšiuose.jpeg` | **404** |

Handling:

- Download the five working files, then apply one consistent correction pass in Python/Pillow: modest exposure lift, gentle pull of the warm-yellow cast toward neutral, restrained contrast and saturation — so all five read as one airy boutique set.
- Crop per slot: wide 16:9 for the hero, 4:3 for the cards, 4:3 for the location image. Re-encode as optimized JPEG into `src/assets/`, replacing the generated placeholders in hero, stay cards and location section.
- **Cottage:** I'll try to locate the correct file elsewhere on the live site (cottage/sauna page gallery). If nothing usable turns up, the current generated cottage placeholder stays and I'll flag it in the summary for you to upload — the build won't break either way.
- The extras photo is only wired in if it fits the current icon-based extras row without restyling it; otherwise it's left out rather than forcing a layout change.

## Technical notes

- New dependency: `maplibre-gl` only.
- Files touched: `src/styles.css`, `src/components/site/Reveal.tsx`, `src/hooks/use-reveal.ts`, `src/components/home/Hero.tsx`, `StaysSection.tsx`, `LocationSection.tsx`, a new `src/components/home/LocationMap.tsx`, and the image assets.
- No palette, typography, spacing, copy or layout changes beyond the map block replacing the placeholder.