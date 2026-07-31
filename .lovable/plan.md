# Dharma Stay — Home page (design & structure phase)

Building the landing page only, in Lithuanian, following the design brief exactly. No real booking logic — every booking entry point opens an on-site UI shell, never Booking.com.

## 1. Section breakdown

Exactly the structure you specified, top to bottom:

1. **Header** — transparent over hero, logo left, nav right (Apartamentai, Namelis, Vieta, Kontaktai) + sage CTA "Tikrinti laisvas datas". Solid linen background + subtle border once scrolled past hero. Mobile: slide-down full-width menu panel.
2. **Hero** — full-bleed image (terrace / old town view), soft warm overlay, short Fraunces headline, one supporting line, primary CTA opening the availability shell. Generous vertical breathing room.
3. **Intro strip** — ensō divider above, 2–3 calm sentences carrying "iš namų į namus".
4. **Apartamentai (main focus)** — 3 cards, identical 4:3 crop: Standartiniai apartamentai, Apartamentai su terasa, Namelis su pirtimi ir kubilu. Each: photo, name, one-line description, "NUO 40 €" uppercase label, text link to its future page + "Rezervuoti" entry point.
5. **Vieta / Telšiai** — split layout: story text (senamiestis, Masčio ežeras, Žemaitijos ramybė) + map placeholder block with address.
6. **Papildoma** — quieter 4-item row (restobaras, pirtis, kubilas, dovanų kuponai), small ensō-framed icons, no photos, clearly secondary.
7. **Atsiliepimai** — restrained: two scores (9.0 standartiniai / 9.3 su terasa) as ensō-circled numbers + one short line each. Tasteful, no star spam.
8. **Rezervacijos juosta** — sage-deep band, closing CTA, opens the same availability shell.
9. **Footer** — contacts (Birutės g. 1, Telšiai 87130; +370 659 11 929; +370 604 98 915; info@dharmastay.lt), nav, small map area, quiet wordmark.

Copy: freshly written short Lithuanian, calm boutique tone. Nothing carried over from the old site.

## 2. Typography

- **Fraunces** — headings only: H1 hero clamp 40→60px weight 400 (soft optical axis, tight tracking), H2 sections clamp 30→40px/400, H3 card titles 22–24px/500. Never used for body, buttons, or nav.
- **Inter** — everything else: body 16–18px, line-height 1.7, weight 400; buttons and nav 500; captions/prices 13px, weight 500, uppercase, tracking +0.05em ("NUO 40 €", "TERASA", "IKI 6 SVEČIŲ").

## 3. Ensō signature element

One `<Enso>` SVG component (thin 1px sage stroke, slightly open circle, single reused primitive) appearing in four places and nowhere else:

- **Section divider** — small centered circle instead of a rule, between intro / apartments / location.
- **Icon frame** — thin circle around the small extras icons and around the Booking rating numbers.
- **Button hover** — the sage outline CTA fills from a circular sweep on hover; the primary button gets a soft ring on focus.
- **Scroll/loading cue** — a subtle ensō ring on the hero scroll indicator, animated once on load (`prefers-reduced-motion` disables it).

## 4. File structure

```text
src/styles.css                        tokens: linen/warm-white/ink/stone/sage/
                                      sage-deep/clay, radii 12-16px, soft shadows, fonts
src/routes/__root.tsx                 Google Fonts <link>, sitewide meta
src/routes/index.tsx                  home route + head() metadata
src/components/site/Enso.tsx          signature circle primitive
src/components/site/SiteHeader.tsx
src/components/site/SiteFooter.tsx
src/components/site/BookingDialog.tsx availability UI shell (mock)
src/components/home/Hero.tsx
src/components/home/IntroStrip.tsx
src/components/home/StaysSection.tsx  + StayCard.tsx
src/components/home/LocationSection.tsx
src/components/home/ExtrasSection.tsx
src/components/home/Ratings.tsx
src/components/home/BookingBand.tsx
src/data/stays.ts                     mock stay data, prices, image refs
```

Booking shell = a dialog with date range inputs, guest count, stay selector and a disabled "Tęsti" step, wired to mock data with a clear seam for the core API later.

## 5. SSR + metadata

TanStack Start already renders on the server. Concretely: fonts loaded via `<link>` in `__root.tsx` head (never a CSS `@import`), `index.tsx` gets its own `head()` with Lithuanian title, description, `og:title`, `og:description`, `og:type: website`, `og:url` and a self-referencing canonical, plus JSON-LD `LodgingBusiness` (address, phone, geo-ish locality) for local SEO. Root keeps only sitewide defaults so future apartment pages can override cleanly.

## 6. Assumptions to confirm

1. **Images** — I plan to reference the existing dharmastay.lt photo URLs from the context doc directly as placeholders. If any fail to load or look too dark/yellow for the airy tone, I'll substitute a generated warm boutique placeholder in the same crop. Say the word if you'd rather I generate all placeholders from the start.
2. **Map** — a styled placeholder block with address and an "Atidaryti žemėlapyje" link (no Google Maps embed / API key yet).
3. **Nav links** — Apartamentai, Namelis, Vieta, Kontaktai will scroll to home sections for now, since those pages don't exist yet; they become real routes in the next phase.
4. **Language** — Lithuanian only, no language switcher this phase.
5. **Light theme only** — no dark mode; the palette is a single light boutique theme.
