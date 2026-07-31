# Multipage conversion — real routes, shared layout, per-page SEO

Design system, palette, Cormorant + Inter, ensō, logo, motion, booking dialog and map all stay exactly as they are. This adds routes, navigation and metadata.

## 1. Route list

```text
/                        Pagrindinis (existing home, unchanged sections)
/apie                    Apie — story, building, location context
/apie/taisykles          Apgyvendinimo taisyklės (own page)
/apartamentai            Overview: three stay cards
/apartamentai/standartiniai
/apartamentai/su-terasa
/namelis                 Namelis su pirtimi ir kubilu
/restobaras
/banketine-sale
/sauna                   "Netrukus" treatment
/dovanu-kuponai
/kontaktai               Contacts + full-width MapLibre map
```

Nav structure (desktop):

```text
Apie ▾ | Apartamentai ▾ | Restobaras | Banketinė salė | Daugiau ▾ | Kontaktai   [Tikrinti laisvas datas]
  Apie        Standartiniai apartamentai                    Sauna
  Taisyklės   Apartamentai su terasa                        Dovanų kuponai
              Namelis su pirtimi ir kubilu
              Visi apartamentai
```

The logo keeps linking to `/`, so no separate "Pagrindinis" item is needed. Dropdowns are hover + keyboard accessible (button with `aria-expanded`, Escape closes, focus-visible rings). Mobile keeps the existing slide-down panel, with groups rendered as expandable sections. Footer nav is updated to the same real routes.

## 2. Inner-page header pattern

One reusable `PageHero` component so every inner page reads as the home hero's calmer sibling:

- Linen band, ~44vh desktop / ~34vh mobile, top padding clearing the fixed header.
- Centered ensō mark, small uppercase Inter eyebrow (e.g. "APARTAMENTAI"), Cormorant H1, one supporting line, breadcrumb on nested pages.
- Optional `image` prop: when a page has a real photo (stay pages, restobaras), the band becomes a shorter cropped banner with the same warm gradient overlay as the home hero, so tone matches. No Ken Burns — that stays unique to the home hero.
- Reveal animation on entry; `prefers-reduced-motion` respected.

Stay pages then follow: PageHero (that stay's photo) → description → key facts grid (dydis, svečiai, adresas, patogumai) → price-from + "Rezervuoti" opening the existing dialog → quiet cross-links to the other two stays.

## 3. Per-page metadata

Every route file defines its own `head()`:

- unique Lithuanian `title` and `description`
- `og:title`, `og:description`, `og:type` (`website`, `article` for taisyklės)
- `og:url` and a self-referencing `<link rel="canonical">` on the leaf, both absolute `https://dharma-stay-boutique.lovable.app/...`
- `og:image` / `twitter:image` omitted: our photos are hashed bundle assets with no stable absolute URL, and a wrong or relative URL previews worse than none — hosting supplies the preview.
- JSON-LD: `LodgingBusiness` on `/` and `/kontaktai`; each stay page gets `Accommodation` (name, description, floorSize, occupancy, address, priceRange) plus `BreadcrumbList`; `/apie/taisykles` gets `WebPage`; `/restobaras` gets `Restaurant`.

`__root.tsx` keeps only sitewide defaults (charset, viewport, og:site_name, twitter:card) — no canonical, no og:image.

## 4. File restructure

```text
src/routes/__root.tsx              SiteHeader + SiteFooter + BookingProvider around <Outlet />
src/routes/index.tsx               home, chrome removed (now in root)
src/routes/apie.tsx                layout: <Outlet />
src/routes/apie.index.tsx          /apie
src/routes/apie.taisykles.tsx
src/routes/apartamentai.tsx        layout: <Outlet />
src/routes/apartamentai.index.tsx
src/routes/apartamentai.standartiniai.tsx
src/routes/apartamentai.su-terasa.tsx
src/routes/namelis.tsx
src/routes/restobaras.tsx
src/routes/banketine-sale.tsx
src/routes/sauna.tsx
src/routes/dovanu-kuponai.tsx
src/routes/kontaktai.tsx

src/components/site/PageHero.tsx   shared inner-page header
src/components/site/Prose.tsx      shared text-block wrapper
src/components/stay/StayFacts.tsx  key-facts grid
src/components/stay/StayCrossLinks.tsx
src/data/nav.ts                    nav tree (labels + routes), used by header and footer
src/data/stays.ts                  extended: facts (size, guests, address, amenities), long copy keys
```

`SiteHeader`/`SiteFooter` switch from `#anchor` anchors to `<Link to=...>` with `activeProps`. Home stay cards' "Plačiau" becomes `<Link to={stay.href}>`. `LocationMap` is reused as-is on `/kontaktai`.

## 5. Recommendations

- **Taisyklės as its own page (`/apie/taisykles`)** — rules are long, dry and linked directly from booking confirmations; they deserve their own indexable URL rather than diluting the Apie story.
- **Individual stay pages** — agreed with your lean. Each has different photos, size, capacity, address and price, and each is a distinct search/social target with its own `Accommodation` schema. `/apartamentai` stays the listing hub.

## 6. i18n readiness

No i18n library yet, but the swap later becomes mechanical:

- All page copy lives in per-page content objects under `src/content/lt/<page>.ts`, exported as plain nested string objects — no JSX in strings, no concatenation, only simple `{placeholder}` tokens.
- Components read `content.hero.title` etc. instead of inlining literals, so `src/content/lt/` serializes straight to `lt.json`, mirrored later as `en.json` / `ru.json`.
- Shared strings (nav labels, CTAs, contact labels) live in `src/content/lt/common.ts`; nav items reference keys, not literals.
- Stay copy moves out of `stays.ts` into content, leaving `stays.ts` with language-neutral data (id, price, images, route, facts numbers).
- Routes stay Lithuanian-slugged; a future locale prefix (`/en/...`) can be added as a layout segment without touching page components.

## 7. Unchanged

Palette and tokens, fonts and the diacritic-clean heading CSS, ensō, logo currentColor behavior, Reveal / Ken Burns / hover motion, booking dialog (still the only booking entry point, no external redirects), MapLibre map, mock `stays.ts` as the data source. The root `notFoundComponent` is restyled to the boutique palette and renders inside the shared layout so a 404 still shows header and footer.