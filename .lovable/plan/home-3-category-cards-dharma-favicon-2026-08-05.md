# Home: 3 category cards + Dharma favicon

## Current state (verified)
The API returns 6 rooms (Dvivietis 2-2 … 3-4, Keturvietis 1-1) and every one of them has an empty `category`. The grouping code added earlier only switches on when 2+ distinct categories exist, so the home page still renders 6 room cards plus "Visi apartamentai" — exactly what you see. Nothing is broken; the data simply isn't categorised yet, and per your answer we wait for the backend rather than faking a mapping.

## 1. Category labels
Update the LT label for `terrace` to "Apartamentai su terasa ir vaizdu į miesto centrą" (standard and cottage labels already match dharmastay.lt).

## 2. Home page behaviour
- Keep the grouped view as the target state: as soon as any property carries `standard` / `terrace` / `cottage`, the home page shows one card per category (lowest price, representative photo, room count, "Žiūrėti variantus" → `/apartamentai?category=…`).
- Lower the switch threshold from "2+ distinct categories" to "1+", so the moment Kęstutis fills in even one category the grouped view activates for the categorised rooms; any still-uncategorised rooms are listed after the category cards so nothing disappears.
- Meanwhile (all rooms uncategorised) the fallback stops at **3 cards** instead of 6, with the "Visi apartamentai" link below — so the home page reads as three options today instead of a wall of near-identical rooms.

## 3. Favicon
- Crop the lotus/enso mark out of `src/assets/logo-dharma.png`, render it in sage on a linen square, downscale to a 64×64 `public/favicon.png`.
- Point `src/routes/__root.tsx` `head().links` at the new PNG and delete `public/favicon.ico`.

## Unchanged
Palette, fonts, motion, room pages, calendar, booking flow, pricing, all server functions, the `/apartamentai` category filter (already built), and the shared `["properties"]` query.

## Files
- Edit: `src/content/lt/common.ts`, `src/lib/property-category.ts`, `src/components/home/StaysSection.tsx`, `src/lib/property-queries.ts`, `src/routes/__root.tsx`
- Add: `public/favicon.png` · Remove: `public/favicon.ico`
