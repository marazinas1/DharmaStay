# Category cards on /apartamentai, nav order, matching banquet photo, logo scroll-to-top

## 1. /apartamentai shows the 3 types (same as home)

Today `/apartamentai` lists every room. Change it to mirror the home page:

- Unfiltered `/apartamentai`: render the same `CategoryGrid` of type cards (Standartiniai apartamentai, Apartamentai su terasa, Namelis su pirtimi ir kubilu) using the existing `groupByCategory` / `isGrouped` helpers. Each card keeps "Žiūrėti variantus", now linking to `/apartamentai?category=<code>`.
- Filtered `/apartamentai?category=terrace`: unchanged behaviour — individual `PropertyCard`s for that type, plus the existing "← Visi apartamentai" link and the category-specific hero, breadcrumbs and SEO.
- Fallback: if fewer than 2 distinct `property_type` values come back (backend not filled in), keep today's flat list of all rooms so the page is never empty.
- Any uncategorized rooms are listed below the type cards, same as home.
- Stays SSR: the loader already primes the shared `["properties"]` query; no new fetch.
- Lead copy on the unfiltered page stays as-is; the grid just swaps to type cards.

## 2. Menu order — "Apie" moves near the end

New main-nav order: Apartamentai, Restobaras, Banketinė salė, Daugiau (Sauna, Dovanų kuponai), Apie (Apie mus, Taisyklės), Kontaktai. Applies to desktop and mobile menus; footer link list left as is.

## 3. Banquet hero photo matched to restobar

`banketine-sale.jpg/.webp` is currently a tighter crop of the same room. Re-export it from the same source with the identical crop/framing and tone pass used for `restobaras-space.jpg`, so both banners look the same. Same file names, same `<picture>` wiring — nothing else on either page changes.

## 4. Logo click scrolls to top on the home page

Clicking the header logo while already on `/` currently does nothing visible. Add a click handler on the logo `Link` that, when the current path is `/`, smooth-scrolls the window to the top (respecting reduced-motion). On other pages it navigates home as it does now.

## Unchanged

Design system, palette, fonts, booking flow, calendar, pricing, server functions, property detail pages.

## Files

- Edit: `src/routes/apartamentai.index.tsx`, `src/data/nav.ts`, `src/components/site/SiteHeader.tsx`, `src/routes/banketine-sale.tsx` assets (`src/assets/banketine-sale.jpg/.webp` re-exported)
