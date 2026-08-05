# Category grouping on the home page + category filter on /apartamentai

Goal: the home page shows one card per accommodation type instead of one per room, and clicking a type opens the listing filtered to it. Built so it works today (categories not yet assigned) and switches to grouping automatically once the backend fills them in.

## 1. Category model (new file `src/lib/property-category.ts`)

- `groupByCategory(properties)` -> array of groups, each: `{ code, label, properties, priceFrom, image, imageAlt, count }`.
  - Normalize: `(p.category ?? "").trim().toLowerCase()`; empty/null = uncategorized.
  - Group order: known codes first in the order `standard -> terrace -> cottage`, then any unknown codes alphabetically.
  - **Lowest price**: `priceFrom` = min of non-null `price_per_night` in the group; `null` if none, in which case the card shows "Kaina pagal užklausą".
  - **Representative image**: cover image of the cheapest property in the group; if that one has no image, the first property in the group that does.
  - `count` = number of rooms in the group.
- `isGrouped(properties)` -> true only when there are **2+ distinct non-empty categories**. This is the switch between grouped and fallback rendering.
- Label mapping lives in LT content (see section 5), resolved through `categoryLabel(code)`.

## 2. Home page (`StaysSection`)

Same section shell — eyebrow, heading, lead, Reveal stagger, grid — unchanged.

- If `isGrouped(properties)`: render one **category card** per group (typically 3); no `HOME_STAYS_LIMIT` slicing since categories are few.
- Else (today's state): unchanged — up to `HOME_STAYS_LIMIT` individual `PropertyCard`s plus the "Visi apartamentai" link.

**Category card treatment** (new `src/components/stay/CategoryCard.tsx`, visually identical to `PropertyCard`):
- Same wrapper: rounded-2xl, warm-white, soft shadow, 4:3 photo with `photo-zoom` hover, same padding and type scale.
- Top label: `Nuo X €` (or "Kaina pagal užklausą").
- Title: LT category label ("Standartiniai apartamentai").
- Meta line: option count, e.g. `3 apgyvendinimo variantai` (Lithuanian plural forms handled in a helper). No description paragraph — categories carry no API text.
- Footer row: **no "Rezervuoti" button**. One primary link "Žiūrėti variantus" -> `/apartamentai` with `search: { category: code }`, with the arrow-nudge icon. Booking stays on individual room pages.
- The whole card is not a nested link; the link sits in the footer row like today's "Plačiau".

## 3. `/apartamentai` category filter

- `src/routes/apartamentai.index.tsx` gains `validateSearch` with `category` as an optional plain string (no enum, no bounds); unknown values are accepted and normalized in the component.
- SSR-friendly: the loader already primes the shared `["properties"]` query; the component reads `Route.useSearch()` and filters that cached list. No extra fetch, no new query key, and the filtered view renders server-side because the search param arrives with the server request.
- Unknown or unmatched code -> falls back to showing all properties, never an empty dead end.
- When a filter is active: the page hero shows the category label as the title with "Apgyvendinimas" as eyebrow, plus a subtle "Visi apartamentai" link (to `/apartamentai` with no search) to clear it. Breadcrumbs gain the category as the last crumb.
- `head()` gets a category-specific title and description when filtered; canonical points at the filtered path.

## 4. Fallback behavior today

With every property uncategorized (or all sharing one category), `isGrouped` is false: the home page renders exactly as it does now, and `/apartamentai` with no param lists everything. The moment the backend assigns `standard` / `terrace` / `cottage`, grouping and filtering activate with no further frontend change.

## 5. LT strings

New block in `src/content/lt/common.ts`:
- `categories: { standard, terrace, cottage }` labels.
- `categoryCard: { viewOptions: "Žiūrėti variantus", optionsOne / optionsFew / optionsMany }` for the count line.
- `apartamentai.ts` gains the clear-filter link text and a filtered-page description template.
- Unknown code fallback: title-cased code with `_` and `-` turned into spaces (same helper style as `amenityLabel`).

## Unchanged

Design system, palette, fonts, ensō, motion; the dynamic property page, calendar, booking dialog, pricing, all server functions and key handling; the shared `["properties"]` query (reused, no extra fetch). Individual rooms keep their own cards, pages, and booking flow everywhere.

## Files

- Add: `src/lib/property-category.ts`, `src/components/stay/CategoryCard.tsx`
- Edit: `src/components/home/StaysSection.tsx`, `src/routes/apartamentai.index.tsx`, `src/content/lt/common.ts`, `src/content/lt/apartamentai.ts`