# English translation (LT / EN)

Add English as a second language with an `/en/` path prefix, a header LT / EN switcher, mirrored content bundles, and correct per-locale SEO. Lithuanian stays at the root and no existing route is renamed.

## 1. Routing: `/en/` as a layout segment

TanStack file routing needs a real file per URL, so English gets its own route folder — but page code is not duplicated.

- Extract each current route's body into a shared page component under `src/pages/` (e.g. `src/pages/Kontaktai.tsx`) that takes `locale` from context and exports the component plus a `meta(locale)` helper for `head()`.
- `src/routes/kontaktai.tsx` (LT) and `src/routes/en/kontaktai.tsx` (EN) both become ~10-line wrappers: `createFileRoute(...)` with `head: () => meta("lt" | "en")` and `component: KontaktaiPage`.
- `src/routes/en/route.tsx` is the layout segment: it renders `<Outlet />` and provides `LocaleContext value="en"`. `__root` provides the default `"lt"`. Page components call `useLocale()` — no per-page locale branching.
- URL slugs stay Lithuanian under `/en/` (`/en/apartamentai`, `/en/banketine-sale`). Recommended: translated slugs would double the route files, break existing inbound links, and add a slug-mapping table to the switcher and to every `<Link>`; guests do not read slugs. Cost of changing later: one redirect table.
- Dynamic routes (`apartamentai.$propertyId`, `apartamentai.tipas.$categorySlug`) mirror the same way; property slugs stay as they are.

## 2. Content

- `src/content/en/` mirrors `src/content/lt/` file-for-file with identical keys; a `Bundle` type derived from the LT bundle (`typeof lt`) makes any missing/renamed key a typecheck error.
- `src/content/index.ts` exports `getContent(locale)` returning the whole bundle, plus a `useContent()` hook reading `LocaleContext`. Components read `content.restobaras.title` and never import `@/content/lt/...` directly.
- No i18n library. The bundles are already the dictionary; adding one would only buy interpolation and plural rules we can cover in ~20 lines, at the cost of a runtime dependency and SSR wiring.
- `src/data/nav.ts` becomes `buildNav(locale)` so labels come from the active bundle and every `to` is prefixed with `/en` for English.

## 3. English copy

Written fresh in the same calm, concrete register — not literal translation. Proper nouns kept: Telšiai, Žemaitija, Birutės g., Lake Mastis, Turgaus Square. "Iš namų į namus" → "From home to home". Functional strings use conventional wording: Check-in, Check-out, Guests, Adults, Children, Infants, Book now, Available dates, Occupied, Clear dates. Legal and house-rules text translated plainly, adding no obligations not present in Lithuanian.

## 4. Plurals

`common.ts` keeps the same keys in both bundles, but the helper in `src/lib/property-category.ts` (and the nights counter) becomes locale-aware: Lithuanian keeps the one/few/many logic; English uses a simple `n === 1 ? one : many` path, with `few` set equal to `many` in the EN bundle so the shape stays identical.

## 5. Language switcher

- Small uppercase letter-spaced `LT / EN` in the header (desktop nav + mobile menu) and in the footer, matching existing nav styling.
- It reads the current match from `useRouterState` and rebuilds the same route in the other locale — same path, same path params, same search params, so `nuo` / `iki` / `sveciai` survive the switch. Implemented as a `localizePath(pathname, target)` helper (add or strip the `/en` prefix), navigating with the existing `search` object.
- The chosen locale is written to a `locale` cookie (SSR-readable, 1 year). The URL always wins; the cookie is only used on a first visit to `/` to offer/redirect, and the switcher always writes it.

## 6. SEO

- `pageHead()` in `src/lib/seo.ts` gains `locale`: it emits the locale-specific title/description/og pair, a self-referencing canonical (`${SITE_URL}${path}` or `${SITE_URL}/en${path}`), and `hreflang` alternates for `lt`, `en`, and `x-default` → the Lithuanian URL, on every page in both languages.
- `og:locale` becomes `lt_LT` / `en_US` per page.
- `<html lang>` in `__root`'s shell is set from the request path during SSR so crawlers get the right attribute without hydration mismatch.
- JSON-LD on the home page uses the active bundle's name/description.

## 7. API content (known limitation)

- Every engine call in `src/lib/rentivo-api.server.ts` gains an optional `language` param, defaulted from the caller; the server functions in `src/lib/rentivo.functions.ts` accept `locale` in their input and pass it through as `?language=lt|en`. Ignored endpoints are harmless today; when the engine honours it, room content becomes English with no further frontend change.
- `/legal` already supports `?language=` — the legal pages pass the active locale immediately.
- Room names/descriptions/prices stay Lithuanian under `/en` until the engine supports it. No client-side auto-translation.
- The amenity dictionary in `src/lib/property-view.ts` becomes `{ lt, en }` per code; unknown codes stay filtered out in both languages.

## Out of scope

No changes to the design system, layout, palette, fonts, imagery, booking flow, calendar, pricing, or security setup. No Lithuanian route renamed.
