# A2 — One dynamic property template, static pages removed

## Approach

**Refactor `StayPage` into a shared presentational component, don't copy its layout.**
`StayPage` today is coupled to the mock `Stay` type. I'll turn it into `PropertySections` — a
purely presentational component taking plain props (title, lead, image, paragraphs, facts,
amenities, gallery, children slots) with no knowledge of where data comes from. The dynamic
`$propertyId` route composes it with API data plus the calendar. One component, one look, no
drift — and reusable if a second data source ever appears.

## Data mapping (API → StayPage layout)

| Layout slot | API field |
|---|---|
| PageHero image / alt | `cover_image_url` → `image_urls[0]`, alt from `toPropertyView` |
| PageHero eyebrow / title / lead | `property_type` (fallback "Apartamentai") / `name` / `propertyMeta()` |
| Hero CTA | price from `price_per_night` + `Rezervuoti` → booking dialog (unchanged) |
| Two-column left | `description` paragraphs (split on blank lines) + meta line |
| Two-column right | second image (`image_urls[1]`, else cover) in the rounded shadow frame |
| Facts (`StayFacts`) | `area_m2`, `max_guests`, `beds`, `address`/`city`, price-from |
| Amenities list | `amenities` via `amenityLabel()` |
| "Laisvos datos" | existing `AvailabilityCalendar` + booking card, in a linen section under the facts |
| Gallery | remaining `image_urls` (existing grid, kept) |
| Cross-links | other real properties |
| JSON-LD + head | already API-driven on this route — kept as is |

## StayCrossLinks becomes API-driven

Rewrite it to read the shared `propertiesQuery` (`["properties"]`, same cache entry as home and
`/apartamentai` — no extra fetch), filter out the current `id`, take the first two, and link with
`to="/apartamentai/$propertyId"` + `params`. Renders nothing if the list is empty or errors, so a
hiccup never breaks the page. The route loader prefetches it, so it server-renders.

## Files

**Delete**
- `src/routes/apartamentai.standartiniai.tsx`, `src/routes/apartamentai.su-terasa.tsx`, `src/routes/namelis.tsx` (replaced by redirect stubs — see below)
- `src/content/lt/stays.ts`
- `src/data/stays.ts` — only after moving `contact` out (see next)

**Important:** `src/data/stays.ts` also exports `contact`, imported by `SiteFooter`, `ContactCta`,
`PropertyGrid`, `LocationSection`, `kontaktai.tsx`, `restobaras.tsx`. I'll move that object
verbatim to `src/data/contact.ts` and repoint those six imports. `BookingDialog` also imports
`stays` for its fallback property `<select>` — I'll switch that select to the API property list
(shared query), so a dialog opened from a generic CTA still lists real properties.

**Edit**
- `src/components/stay/StayPage.tsx` → `PropertySections` (presentational; `stayLd` becomes
  `propertyLd(property, url)` built from API fields)
- `src/components/stay/StayFacts.tsx` → prop-driven (`facts[]`, `amenities[]`)
- `src/components/stay/StayCrossLinks.tsx` → API-driven
- `src/routes/apartamentai.$propertyId.tsx` → composes the polished layout + calendar
- `src/components/site/BookingDialog.tsx` → property select from API
- `src/data/nav.ts`, `src/routes/sauna.tsx` (its `/namelis` link)
- `src/content/lt/common.ts` — small additions (section titles that lived in per-stay copy)
- new `src/data/contact.ts`

## Redirects for the old URLs

The three old paths stay alive as redirect-only routes instead of 404s: each file becomes a
`beforeLoad` that throws `redirect({ to: "/apartamentai", statusCode: 301 })`. That is a real 301
during SSR, so search engines transfer the old URLs cleanly and bookmarks land on the listing. I
won't hardcode a mapping to specific property ids — ids are engine-owned and can change;
`/apartamentai` is the stable, always-correct destination.

## Nav / footer

Hardcoded property links can't survive a dynamic catalogue, so:
- Header "Apgyvendinimas" becomes a single link to `/apartamentai`; the three-stay dropdown is
  removed (confirmed choice).
- Footer: `Namelis` entry removed; `Apgyvendinimas → /apartamentai` stays.
- `/sauna`'s "namelis" link points to `/apartamentai`.

## Guarantees

- Design system, palette, Cormorant + Inter, ensō, motion, Reveal directions and stagger: untouched.
  The dynamic page gains the static pages' polish (hero, two-column reveal, facts card, cross-links)
  and keeps its calendar, pricing and booking — a strict upgrade, not a downgrade.
- Booking dialog logic, calendar, pricing, server functions and key handling: consumed only, unchanged.
- `/apartamentai` listing and the home page: unchanged.
- SSR throughout; per-property metadata, canonical, OG and JSON-LD (Accommodation + BreadcrumbList) preserved.
- After the change nothing imports `data/stays.ts` or `content/lt/stays.ts` — verified with a
  repo-wide search before deleting.