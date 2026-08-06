# Fully clickable room cards + clean URLs

## 1. Room cards clickable everywhere

Today only "Plačiau" opens a room. Change `PropertyCard` so the whole card is a link to the room page — on the home page, on `/apartamentai`, and inside every category view.

- The card becomes one link wrapping the photo and text; hover/focus states stay as they are.
- "Rezervuoti" stays a real button inside the card and keeps opening the booking dialog (its click no longer triggers the card link).
- "Plačiau" stays visible as a visual affordance, but as plain text inside the card link (no nested link).
- Keyboard: one focus stop for the card, one for the Rezervuoti button; visible focus ring.

## 2. Cleaner URLs

**Category listing** — instead of `/apartamentai?category=standard`:

```text
/apartamentai/tipas/standartiniai-apartamentai
/apartamentai/tipas/apartamentai-su-terasa
/apartamentai/tipas/namelis-su-pirtimi-ir-kubilu
```

Slugs come from the Lithuanian category labels (diacritics stripped). Old `?category=` links keep working: they permanently redirect to the new path.

**Room page** — instead of the raw id `/apartamentai/6f3c…-uuid`:

```text
/apartamentai/dharma-apartamentai-nr-3
```

The slug comes from the room name. If two rooms slugify the same, the second gets a short id suffix. Old UUID URLs keep working and permanently redirect to the slug URL, so existing links and search results stay valid.

## 3. Metadata

- Category pages keep their own title/description, with canonical and breadcrumbs on the clean path.
- Room pages use the slug URL for canonical, breadcrumbs and schema.

## Technical notes

- New `slugify()` + category slug map in `src/lib/property-category.ts`; room slug helper in `src/lib/property-view.ts`, resolved against the shared `["properties"]` query (no extra fetch).
- New route `src/routes/apartamentai.tipas.$categorySlug.tsx` rendering the existing filtered listing; `apartamentai.index.tsx` keeps `?category=` only as a redirect.
- `apartamentai.$propertyId.tsx` accepts a UUID (redirect to slug) or a slug (resolve id from the properties list, `notFound()` if unmatched).
- Room cards link with `<Link to="/apartamentai/$propertyId" params={{ propertyId: slug }}>`; category cards link to the new `tipas` route.

## Unchanged

Design, palette, motion, booking dialog, calendar, pricing, all server functions and API handling.