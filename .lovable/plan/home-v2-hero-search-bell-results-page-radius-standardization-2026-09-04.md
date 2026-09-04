# Home V2 — hero search bell, results page, radius standardization

Home 1 (`/`) stays untouched. Everything happens on the parallel V2 route.

## 0. Current state (verified)

Part of this is already built from the previous step and only needs to be finished to match the uploaded mockup:

- `src/components/search/` already has `SearchBar.tsx` (hero + compact), `DateRangeField.tsx` (single two-month range calendar, past dates disabled, nights count with LT plural, "Clear"), `GuestsField.tsx` (adults/children/infants counters), `plural.ts`.
- `src/pages/home-v2.tsx` + routes `/home-v2`, `/en/home-v2` exist; `HeroV2.tsx` holds the search bar.
- `/laisvi-kambariai` and `/en/laisvi-kambariai` exist with `validateSearch`, flat room list, gallery lightbox, skeleton/empty/error states, direct booking handoff.
- Header already has the "Pagrindinis" dropdown with Home 1 / Home 2.
- `Ratings.tsx` shows the two Booking.com scores (9.0 / 9.3) — kept.

So this step is: align V2 with the mockup, add the testimonials carousel, and do the global radius change.

## 1. Route strategy and the future switch

Keep the page body in `src/pages/home-v2.tsx` (a route factory used by both `src/routes/home-v2.tsx` and `src/routes/en/home-v2.tsx`), exactly as the current live home lives in `src/pages/home.tsx`. Route files stay 3-line shells.

Future promotion is then a small change: point `src/routes/index.tsx` and `src/routes/en/index.tsx` at `homeV2Route`, delete `src/pages/home.tsx` + `Hero.tsx` + `AvailabilityBand.tsx`, drop the nav dropdown back to a single "Pagrindinis" link, remove the `noindex` from the V2 head. No component rewrite.

Nothing in `src/pages/home.tsx`, `Hero.tsx`, `AvailabilityBand.tsx`, `index.tsx` changes now.

## 2. Hero search bell — finish to match the mockup

- Reuse the existing `SearchBar` / `DateRangeField` / `GuestsField` — no duplicated calendar logic. The dates popover, two-month desktop / one-month mobile, first click = arrival, second = departure, nights counter and "Išvalyti" are already in `DateRangeField`.
- Add: if "Ieškoti" is pressed with no dates, open the dates popover instead of navigating (currently the button is just disabled).
- Visual pass on `HeroV2` to match the mockup: hero height, scrim gradient, eyebrow/heading scale, Ken Burns on the background image (add the missing keyframes utility to `styles.css`), search card sitting inside the hero.
- `AvailabilityBand` is not rendered on V2 (already the case in the plan; I will confirm it is removed from `home-v2.tsx`).

### One open point: struck-out occupied days in the hero calendar
"Occupied" is per property. In the hero no property is chosen yet, so the only correct global rule would be "every unit is booked that night", which needs an extra availability call per visible month. My recommendation: hero disables past dates only (as now); struck-out occupied days stay where they are meaningful — the per-room booking dialog (`BookingDateRange`) and the room page calendar. Say the word if you want the heavier global occupancy fetch in the hero instead.

## 3. `/laisvi-kambariai` — build fully now

It already exists and works, so finishing it fully is the cheap option; a "lighter first stage" would cost more than it saves. Remaining work:

- Two-column layout as in the mockup: left sticky column with the range calendar + guests (editable in place, updates the URL and re-runs the search), right column with the flat unit list. Today the page uses one compact bar on top.
- Keep: skeleton cards, empty state ("Šiomis dienomis laisvų numerių nėra" + change-dates hint), error state with retry, `noindex` head, lightbox reuse.
- No API/server changes; `availabilityQuery` / `getAvailability` and the existing property data as-is.

## 4. Testimonials carousel

New `src/components/home/Testimonials.tsx`, rendered on V2 only, directly below the existing `Ratings` block (scores stay as the credibility anchor, quotes below them).

Behaviour copied from the mockup: native CSS `scroll-snap`, prev/next buttons scrolling exactly one card width, dot indicators driven by scroll position via `requestAnimationFrame`, no autoplay, `prefers-reduced-motion` respected.

Content shape, one array per locale in `src/content/lt/common.ts` and `src/content/en/common.ts`:

```ts
testimonials: { name: string; country: string; quote: string; source: string }[]
```

LT array = the three Lithuanian reviews (Solveiga, Giedrė, Erika) verbatim. EN array = the six English reviews (Balys, Anilkumar, Dominika, Craig, Vesta, Marija) verbatim, untranslated. Nothing invented, no filler entries. Static now; swapping the array for an API list later is a local change inside the component.

## 5. Radius standardization (project-wide)

Tokens in `src/styles.css`: `--radius: 6px` (buttons, cards, fields, containers), `--radius-sm: 4px` (badges/tags), `--radius-lg: 8px` (modals/lightbox). Today `--radius` is `0.875rem` and the derived scale is built from it, so shadcn primitives inherit the new value automatically.

Then replace `rounded-full` on rectangular CTAs and swap oversized `rounded-2xl/3xl` on cards/fields. Files touched:

- Home/site: `home/Hero.tsx`, `home/AvailabilityBand.tsx`, `home/BookingBand.tsx`, `home/LocationSection.tsx`, `home/HeroV2.tsx`
- Site chrome: `site/SiteHeader.tsx`, `site/ContactCta.tsx`, `site/ContactForm.tsx`, `site/BookingDialog.tsx`, `site/BookingDateRange.tsx`, `site/LegalDocument.tsx`, `routes/__root.tsx`
- Stay: `stay/PropertyGrid.tsx`, `stay/PropertyCard.tsx`, `stay/CategoryCard.tsx`, `stay/StayFacts.tsx`, `stay/StayCrossLinks.tsx`, `stay/PropertySections.tsx`, `stay/AvailabilityCalendar.tsx`
- Search: `search/SearchBar.tsx`, `search/DateRangeField.tsx`, `search/GuestsField.tsx`
- Pages: `laisvi-kambariai.tsx`, `apartamentai-property.tsx`, `rezervacija-patvirtinta.tsx`, `kontaktai.tsx`, `about.tsx`, `sauna.tsx`, `rules.tsx`

Genuinely circular controls stay circular: calendar prev/next arrows, +/− counters, Enso frames, avatar/score circles, dots. I will list the exact final diff per file when reporting.

Note: this changes the look of the live Home 1 too (shared buttons/cards) — that is inherent to a project-wide token, and is the only way the live page is affected in this step.

## 6. Typography

No font changes. Cormorant Garamond + Inter stay exactly as-is.

## Not touched

Booking dialog internals, pricing, API/server functions, security. `StaysSection`, `LocationSection`, `ExtrasSection` reused unchanged. Nothing deleted from the current live home page.
