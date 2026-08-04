# Phase 1 — Core (Rentivo) API: server-side wrapper + real properties list

## 1. How the secrets are read (Cloudflare-safe)

Rule for this stack: **never read env at module scope**. On the deployed Worker the environment is injected per-request, so a top-level `const API_KEY = process.env...` evaluates to `undefined` at bundle-init time. Every read happens **inside** the server function handler / wrapper call.

Two layers, so it works in dev (Node), preview and the deployed Worker:

1. `src/server.ts` already receives the Worker `env` binding in its `fetch(request, env, ctx)`. We stash it once per request via `setWorkerEnv(env)`, exported from a new `src/lib/runtime-env.server.ts`.
2. `readEnv(name)` resolves in order: stashed Worker `env` -> `process.env[name]` (Node dev + nodejs_compat) -> throw a clear `missing_env:<NAME>` error.

PROD vs DEV selection: production = the published deployment. Detected from `import.meta.env.PROD` combined with the request host (a `*-dev.lovable.app`, preview or `localhost` host resolves to DEV). Practically: DEV keys everywhere except the published site, exactly as the integration doc requires, so previews never create real bookings.

**Where you set them:** Lovable project secrets (the secrets/env UI — I can open the secure form for you). Four entries, no `VITE_` prefix: `RENTIVO_API_URL_PROD`, `RENTIVO_API_URL_DEV`, `RENTIVO_API_KEY_PROD`, `RENTIVO_API_KEY_DEV`.

Note: in your prompt the two key values came through as `@secret:STRIPE_RESTRICTED_API_KEY` placeholders — that's a Stripe secret, not Rentivo. You'll need to paste the actual `rk_live_...` keys. After changing a secret, the published app needs a re-publish to pick it up; preview is immediate.

## 2. Server-only wrapper — and how we guarantee no client leak

New files:

- `src/lib/runtime-env.server.ts` — `setWorkerEnv`, `readEnv`, `resolveRentivoConfig()`.
- `src/lib/rentivo-api.server.ts` — `rentivoFetch(path, init)` plus typed functions.
- `src/lib/rentivo-schemas.ts` — zod schemas + inferred types (client-safe, no secrets).
- `src/lib/rentivo.functions.ts` — thin `createServerFn` wrappers; this is what the UI imports.

`rentivoFetch` builds `${baseUrl}${path}` with `Authorization: Bearer <key>` and `Content-Type: application/json`, `cache: "no-store"`, a 10s `AbortSignal.timeout`. On non-2xx it throws `RentivoError(json.error.code ?? "unknown_error", status)`; on network/timeout it throws `network_error`. It returns `json.data`.

Guarantees:
- `*.server.ts` files are blocked from client bundles by the build's import protection.
- `rentivo.functions.ts` contains **only** imports + `createServerFn(...)` declarations (thin-wrapper rule) and `await import()`s the `.server` module inside each handler, so the secret path is never reachable from module scope.
- Verification you can run: build, then `rg -n "RENTIVO_API_KEY|rk_live_" .output/public dist` — must return nothing. I'll run this and paste the result.

Exported this phase: `listProperties()` (wired to UI). Stubbed as ready wrappers, not wired: `getProperty(id)`, `getQuote(body)`, `createBooking(body)`, `getPaymentDetails()`, `getBookingStatus(number, email)`.

## 3. Zod schema for `/properties` and failure behaviour

```text
PropertySchema = {
  id: string().uuid(),
  name: string(),
  property_type / description / city / country / address: string().nullish(),
  area_m2 / max_guests / beds: number().nullish(),
  rooms: unknown().nullish(),
  amenities: array(string()).default([]),
  price_per_night: number().nullish(),
  price_tiers: array(unknown()).default([]),
  extra_services: array({ name, calc, pricePerDay }.passthrough()).default([]),
  cover_image_url: string().nullish(),
  image_urls: array(string()).default([]),
  category: string().nullish(),
}
PropertiesResponse = { data: array(PropertySchema) }
```

Deliberately lenient on optional fields (`.nullish()`, `.passthrough()`) so an additive Core change doesn't take the page down, but strict on `id`/`name` and on the envelope shape. A parse failure throws `invalid_response` server-side, is logged with the zod issues, and the listing shows the error state — never a white screen.

## 4. Routing for property pages (Phase 2 target)

Card "Plačiau" links point to **`/apartamentai/$propertyId`** — a new dynamic route (`src/routes/apartamentai.$propertyId.tsx`), created in Phase 1 as a minimal SSR page so no link is dead: it calls `getProperty(id)`, renders name / description / facts / images in the existing `StayPage` visual language, and 404s via `notFound()`. Gallery, availability calendar and booking come in Phase 2.

The existing hand-written routes (`/apartamentai/standartiniai`, `/apartamentai/su-terasa`, `/namelis`) stay exactly as they are — static segments win over the dynamic one, so there's no collision.

## 5. Reconciling API data with the curated LT copy

Rule: **the API owns data, `src/content/lt/` owns language.**

- Facts and anything the hotel edits (name, price, images, city, guests, beds, m², amenities, description) come from the API and render as-is.
- Labels, units and framing ("Nuo … €", "svečiai", "Rezervuoti", "Plačiau", headings, the note under the grid) stay in `content/lt/common.ts`, so the template translates without touching components.
- A small `src/lib/property-view.ts` maps an API `Property` onto the exact prop shape the existing card already takes (`name`, `priceFrom`, `image`, `imageAlt`, `meta`, `description`, `href`), composing the meta line (`45 m² · iki 4 svečių · Telšiai`) from LT label strings. Amenity codes like `wifi`/`parking` get an LT label dictionary with graceful fallback to the raw code.
- `stays.ts` and `content/lt/stays.ts` are **not** removed; they keep powering the home page and the three static stay pages this phase.
- No alt field in the API, so alt text is composed as `"<name> — Dharma Stay"` from an LT template until Core exposes it.

This is the same shape site-settings will land in later: content from the API, wording from the LT dictionary, design entirely in this repo.

## 6. `/apartamentai` listing states

SSR via a route loader: `loader: ({ context }) => context.queryClient.ensureQueryData(propertiesQuery)` plus `useSuspenseQuery` in the component, so the grid is server-rendered for SEO and social previews.

- **Loading** (client navigations / suspense): three skeleton cards matching the real card geometry — 4:3 shimmer block, title bar, two text lines, in linen/stone tones.
- **Error**: route `errorComponent` renders a calm centered block inside the linen section — LT heading, one explanatory line, a "Bandyti dar kartą" button calling `router.invalidate()`, plus phone/email from `contact` as a fallback path.
- **Empty**: `data.length === 0` renders a quiet LT message ("Šiuo metu laisvų objektų nėra…") plus contact details — same section chrome, no empty grid.

Cards keep their current markup, spacing, hover zoom, `Reveal` stagger and the Rezervuoti/Plačiau row. Remote images get `loading="lazy"`, `decoding="async"` and a fixed aspect ratio (no `<picture>`/webp, since Core serves single URLs).

## 7. Scope confirmation

Phase 1 does **not**: wire the booking dialog to `/quote` or `/bookings`, touch Apie / Restobaras / Kontaktai / Sauna / Banketinė salė / Dovanų kuponai, alter the home page stays grid, or delete `stays.ts` or any LT copy. Only `/apartamentai` (and the new `$propertyId` stub) read from the API.

## Files

New: `src/lib/runtime-env.server.ts`, `src/lib/rentivo-api.server.ts`, `src/lib/rentivo-schemas.ts`, `src/lib/rentivo.functions.ts`, `src/lib/property-view.ts`, `src/components/stay/PropertyCard.tsx`, `src/components/stay/PropertyGrid.tsx` (grid + skeleton + empty), `src/routes/apartamentai.$propertyId.tsx`.

Edited: `src/routes/apartamentai.index.tsx` (loader, query, error component), `src/server.ts` (one line: stash the Worker `env`), `src/content/lt/common.ts` (new labels).