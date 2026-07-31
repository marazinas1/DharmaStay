# Room photos, new hero, full-width map, unified tone

Design system untouched: sage/linen/ink, Fraunces + Inter, ensō motif. Only the four items below change.

## A. Three real room photos on the cards

Mapped by filename, as you confirmed:

- Standartiniai apartamentai → `Standartiniai_apartamentai.jpg`
- Apartamentai su terasa → `Apartamentai_su_terasa.jpg`
- Namelis su pirtimi ir kubilu → `namelis_su_pirtimi_ir_kubilu.jpg`

Each goes through the image pipeline (section D), center-cropped to 4:3, and lands on `src/assets/stay-standard.jpg`, `stay-terrace.jpg`, `stay-cottage.jpg` — the filenames `stays.ts` already imports, so cards, hero references and the booking dialog pick them up automatically. Existing 4:3 crop, hover zoom and card layout unchanged. Alt text updated to describe each real room.

## B. New hero image

You didn't upload a Telšiai old-town photo in this message, so unless one arrives before I build, I generate one: wide 16:9, warm golden-hour Lithuanian old town — tiled rooftops, a church spire, soft low sun, light haze, no people, no literal landmark copy. High resolution (1920x1080), tuned to sit under the existing dark gradient with white type on top. If you do upload a real photo, I use yours instead and skip generation.

Replaces `src/assets/hero-terrace.jpg`. Hero copy, gradient overlay, CTAs, ensō and Ken Burns all unchanged; only the `src` and `alt` change (plus width/height attributes to match the new landscape ratio).

## C. Location section restructured around a full-width map

`LocationSection.tsx` becomes two stacked parts inside the same section:

```text
[ text: story, address, "Atidaryti žemėlapyje" ]  [ Telšiai image ]
[ ------------- full-width monochrome map band ------------- ]
```

- **Top:** the current two-column split stays exactly as-is, minus the small map block that currently sits under the image. Directional reveals (left/right) unchanged.
- **Bottom:** a map band spanning the full `max-w-7xl` content width, inset (not full-bleed) so it lines up with every other section edge, `rounded-2xl overflow-hidden shadow-soft`, grayscale filter as today. Heights: `h-[360px]` mobile, `h-[500px]` from `lg` up. Wrapped in a `<Reveal>` so it fades in like the rest.

`LocationMap.tsx` is not rewritten — same MapLibre + Carto tiles, same coords `55.983649, 22.248996`, sage ensō marker, scroll-zoom disabled, `<ClientOnly>` + `React.lazy` + IntersectionObserver init. Performance is unaffected: the maplibre chunk still only downloads after hydration and the map only initializes when the band scrolls into view (200px rootMargin), so a bigger box costs nothing extra on first paint. The skeleton fallback takes the same heights to avoid layout shift.

## D. Image pipeline — optimization + unified tone (build-time)

One reusable script, `scripts/optimize-images.py`, that I run whenever photos are added. Every image passes through the same pass, so new uploads are automatically optimized and tonally matched — no manual per-photo fiddling.

What it does per image:

1. **Resize** to the slot's target size (hero 1920x1080 16:9, cards 1200x900 4:3, location 1200x900), center-cropped to the right ratio. Never upscales beyond the source's usable resolution.
2. **Tone unification:** mid-tone exposure normalization toward a shared target, per-channel white balance pull to warm-neutral (kills the yellow cast in the room shots, the blue in outdoor shots), contrast ~1.03, saturation ~0.94. Gentle — no crushed blacks, no filtered look.
3. **Sharpen** with a light unsharp mask after resize, so detail survives the downscale.
4. **Compress:** progressive JPEG, quality ~85, `optimize=True`, metadata stripped. Plus a **WebP** variant at the same size (quality ~82), typically 25–35% smaller.
5. Markup uses `<picture>` with the WebP source and the JPEG fallback, `loading="lazy"` + `decoding="async"` on everything below the fold, and explicit `width`/`height` so nothing shifts. The hero stays eager and gets `fetchpriority="high"` plus a `preload` link in the route head so it remains a fast LCP.

Why build-time rather than a CSS filter: zero runtime cost, no filter stacking with the map's grayscale, no artificial wash, and each photo can be nudged individually toward the shared target instead of all getting one blunt filter.

Result: sharp on retina, small on the wire, and all five photos read as one warm, airy, lightly desaturated boutique set.

## Nothing else changes

No palette, typography, spacing, copy, component structure, routes or motion changes beyond the four items above.

## Technical notes

Files touched: new `scripts/optimize-images.py`, `src/assets/*` (JPEG + WebP for 5 photos), `src/data/stays.ts`, `src/components/home/Hero.tsx`, `StaysSection.tsx`, `LocationSection.tsx`, `src/routes/index.tsx` (hero preload). No new runtime dependencies (Pillow is build-time only).
