# Legal pages from Core API, consent + company fields in booking, contact form

## 1. Legal content pages (text lives in Core, not in this project)

New server function `getLegal({ kind, language })` calling `GET /legal?kind=rental|privacy&language=lt`
through the existing server-only Core client, so the API key never reaches the browser.
Response `{ data: { kind, language, name, content, updated_at } }`, cached ~5 min.
The `content` HTML is sanitized before rendering.

Two new pages:
- `/taisykles` — paslaugų teikimo taisyklės (kind=rental)
- `/privatumo-politika` — privatumo politika (kind=privacy)

Each shows the title from `name`, the sanitized body, and "Atnaujinta: {updated_at}", with its own
SEO head (unique title, description, og tags, canonical, robots index,follow). If Core returns 404,
the page shows a calm "Turinys šiuo metu neprieinamas" message instead of breaking.

Footer gets links to both. The existing hand-written `/apie/taisykles` (house rules) stays separate —
tell me if you'd rather redirect it to the new legal page.

## 2. Booking dialog: consent checkbox

Required checkbox under the contact fields:
"Susipažinau ir sutinku su [Paslaugų teikimo taisyklėmis] ir [Privatumo politika]", both opening the
new pages in a new tab. Until it is checked, the submit button stays disabled and `POST /bookings`
is never called.

## 3. Booking dialog: "Užsakau kaip įmonė"

Checkbox above the contact block. When checked, extra fields appear: company name, company code,
VAT code (optional), company address — validated and required while the box is checked.

I will first probe the Core `/bookings` endpoint for the field names it accepts. If company data is
not supported yet, I'll keep the UI, tell you in chat, and hold off sending those fields until
Kęstutis exposes them — no silently dropped data.

## 4. Contact form on /kontaktai

A real form (vardas, el. paštas, telefonas optional, žinutė) with validation, character limits,
loading state and success/error messages, alongside the current contact details. Sending goes through
a server function to Kęstutis' backend — I need that endpoint. If it doesn't exist yet, the form is
built and wired to one place that can be pointed at the endpoint in a minute.

## Technical notes

- New `fetchLegal` in `rentivo-api.server.ts` + `getLegal` server function; routes
  `src/routes/taisykles.tsx` and `src/routes/privatumo-politika.tsx`; strings in `src/content/lt/`.
- HTML sanitization via `isomorphic-dompurify` before `dangerouslySetInnerHTML`.
- `bookingInputSchema` extended with consent + optional company fields (pending the API check).
- `BookingDialog.tsx` gains consent and company state; the quote/booking flow itself is untouched.