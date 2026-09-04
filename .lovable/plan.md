# Home V2 becomes the only home page

Home V2 (search-first hero) takes over `/` and `/en/`. The old Home V1 is removed, the Home dropdown becomes a single link, and the logo points at the new home.

## What changes

1. **`/` and `/en/` render Home V2** — search-first hero, intro, stays, location, extras, ratings + testimonials, booking band. Full SEO metadata (title, description, og tags, LodgingBusiness JSON-LD) moves onto the new home; the `noindex` tag used by the preview page is dropped.
2. **Old home deleted** — the V1 page module and the components only it used (classic hero with parallax, standalone availability band, standalone ratings block) are removed.
3. **`/home-v2` retired** — the LT and EN `/home-v2` routes are removed and permanently redirect to `/` and `/en/` so any shared preview link still lands somewhere sensible.
4. **Menu** — the "Home" dropdown is replaced by a single "Home" link to `/`; the "Home 1" / "Home 2" labels are deleted from LT and EN content.
5. **Logo** — already links to `/`, which is now Home V2; the click-to-scroll-to-top behaviour stays.
6. **Header "Check dates" CTA** — Home V1 had an availability band that this button scrolled to. On the new home the equivalent target is the hero search, so the CTA scrolls to the hero search bar instead (from other pages: navigate home, then scroll).

## Technical notes

- `src/pages/home-v2.tsx` becomes the home page module (kept as `src/pages/home.tsx`), wired from `src/routes/index.tsx` and `src/routes/en/index.tsx`; the loader that prefetches properties for the stays section is kept.
- Delete: `src/components/home/Hero.tsx`, `src/components/home/AvailabilityBand.tsx`, `src/components/home/Ratings.tsx` (superseded by `RatingsAndTestimonials`), old `src/pages/home-v2.tsx` route files.
- `src/data/nav.ts`: `mainNav` returns a flat `{ label: nav.home, to: "/" }` entry; remove `home1`/`home2` keys from both `common.ts` files.
- `SiteHeader`: `isHeroPage` reduces to `pathname === homePath`; availability scroll target switches to the hero search anchor.
- Verify with a browser pass on `/` and `/en/` (desktop + 390 px) that the transparent-then-solid header still works and no dead links to `/home-v2` remain.
