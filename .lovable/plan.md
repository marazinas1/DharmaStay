# Room photos, new hero, full-width map, unified tone

Design system untouched: sage/linen/ink, Fraunces + Inter, ensō motif. Only the four items below change.

## A. Three real room photos on the cards

One note before I wire them: in your table the filenames and the parenthetical descriptions don't line up with what's actually in the files.

| File | What the image actually shows |
| --- | --- |
| `Apartamentai_su_terasa.jpg` | bedroom with palm-leaf wallpaper, mirrored wardrobe, dining table |
| `Standartiniai_apartamentai.jpg` | bed with tufted/capitone headboard, gold side table |
| `namelis_su_pirtimi_ir_kubilu.jpg` | open-plan living room with kitchen and sofas |

So the descriptions in your table are swapped between the two apartment files. I'll follow the **filenames** (they match the card names exactly):

- Standartiniai apartamentai → `Standartiniai_apartamentai.jpg` (capitone headboard)
- Apartamentai su terasa → `Apartamentai_su_terasa.jpg` (palm-leaf wallpaper)
- Namelis su pirtimi ir kubilu → `namelis_su_pirtimi_ir_kubilu.jpg`

Say the word if you meant the descriptions instead and I'll swap the two apartment images.

Each photo is center-cropped to 4:3, resized to 1200x900, tone-corrected (section D) and written to `src/assets/stay-standard.jpg`, `stay-terrace.jpg`, `stay-cottage.jpg` — the same filenames `stays.ts` already imports, so cards, hero references and the booking dialog all pick them up with no extra wiring. Existing 4:3 crop, `photo-zoom` hover and card layout stay as they are. Alt text updated to describe each real room.

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

## D. Tone: build-time Pillow pass (preferred)

I'll use the **build-time** approach. It bakes the correction into the files, so there's zero runtime cost, no filter stacking with the map's grayscale, no risk of the artificial "everything under a wash" look, and each photo can be nudged individually toward the same target rather than all getting one blunt CSS filter.

One shared Python/Pillow function applied to all five photos (3 rooms, hero, location):

- measure each image's mid-tone average and normalize exposure toward a common target (bounded, so nothing gets blown out)
- per-channel white balance pull toward warm-neutral — kills the yellow cast in the room shots and any blue in the outdoor ones, while keeping a touch of warmth
- restrained contrast (~1.03) and saturation (~0.94) for the airy, lightly desaturated boutique read
- light unsharp mask after resize, quality 88 progressive JPEG

Correction is deliberately gentle — no crushed blacks, no heavy filter look. I'll screenshot the finished page so you can judge the set as a whole.

## Nothing else changes

No palette, typography, spacing, copy, component structure, routes or motion changes beyond the four items above.

## Technical notes

Files touched: `src/assets/*` (4 images), `src/data/stays.ts` (alt/tone only if needed), `src/components/home/Hero.tsx`, `src/components/home/LocationSection.tsx`. No new dependencies.
