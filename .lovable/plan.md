# Pre-client polish pass

Hero photo stays as-is for now. Everything below is frontend-only.

## 1. Navigation order and structure

New main menu: **Apie · Apartamentai · Restobaras · Banketinė salė · Daugiau▾ · Kontaktai**

- "Apie" becomes a plain first-position link to `/apie` (no dropdown, no self-duplication).
- One dropdown only — "Daugiau▾": Sauna, Dovanų kuponai, Apgyvendinimo taisyklės.
- Footer link list follows the same order.

## 2. Footer map link

Replace the 112px empty bordered rectangle with a normal inline text link ("Atidoryti žemėlapyje" with a small map-pin icon), styled like the other footer links, sitting under the navigation column.

## 3. Header "Tikrinti laisvas datas" button

Today it opens the booking dialog. New behaviour:
- On the home page: smooth-scroll to the availability calendar (`#laisvos-datos`).
- On any other page: navigate to `/#laisvos-datos` and scroll there after the route loads.

This matches the hero and booking-band buttons.

## 4. Extras ensō icons

The icons look empty inside the ring. Enlarge the icon (h-5 → h-7), use full-strength sage instead of the light tone, and slightly increase the ring size so the composition reads as intentional.

## 5. Ratings copy

Replace the marketing lines with plain, factual ones:
- 9,0 — Standartiniai apartamentai — "Booking.com svečių įvertinimas."
- 9,3 — Apartamentai su terasa — "Booking.com svečių įvertinimas."

with a short neutral note about cleanliness/location instead of "kurio svečiai neužmiršta" phrasing.

## 6. Category card badges (from API data)

Each category card gains a facts line built from that category's properties:
- area range: `18–35 m²` (single value if all equal, omitted if no property has `area_m2`)
- capacity: `iki 4 svečių` (max `max_guests` in the group)

Shown alongside the existing "12 variantų" line, separated by `·`. Everything degrades gracefully when the API omits fields.

## Technical notes

- `src/data/nav.ts` — reorder `mainNav`/`footerNav`, move Taisyklės into the "Daugiau" group, flatten "Apie".
- `src/components/site/SiteHeader.tsx` — CTA uses `scrollToId(AVAILABILITY_SECTION_ID)` on `/`, otherwise `navigate({ to: "/", hash: AVAILABILITY_SECTION_ID })`.
- `src/components/site/SiteFooter.tsx` — map block becomes a text link.
- `src/components/home/ExtrasSection.tsx`, `src/components/site/Enso.tsx` — icon sizing/tone.
- `src/components/home/Ratings.tsx` — copy.
- `src/lib/property-category.ts` — extend `CategoryGroup` with `areaMin/areaMax/maxGuests`; `src/components/stay/CategoryCard.tsx` renders the facts line; new strings in `src/content/lt/common.ts`.
