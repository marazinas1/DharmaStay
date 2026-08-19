# English booking emails end-to-end

## Where things stand (verified in this repo)

The website already sends the visitor's language to the booking engine:

- `src/lib/rentivo-schemas.ts` — the quote/booking schema has `language: "lt" | "en"` (default `lt`), and the booking schema inherits it.
- `src/components/site/BookingDialog.tsx` — both the `/quote` request and the `/bookings` request send `language: locale`, where `locale` is the active site language (`/en/...` → `en`).
- Property lists, property pages and legal documents also request `?language=en`.

So a guest browsing in English already creates a booking record carrying `language: "en"`.

If confirmation and reminder emails still arrive in Lithuanian, the remaining gap is on the engine side (the `dharmastay` backend), not on the website.

## What to do

### 1. Confirm the value really reaches the engine (frontend, quick check)

Create one test booking under `/en/...` against a test property and capture the outgoing `/bookings` request body, confirming it contains `"language":"en"`. Also compare the `/quote` totals and extra-service names for the same dates in LT and EN — if the extras differ, name-based extra matching is language-sensitive and needs reporting to the backend.

Result of this check decides whether anything on the website needs changing at all. Expectation based on the code: nothing does.

### 2. Backend work (separate repo — `kestpuplauskas-web/dharmastay`)

This part cannot be done from this project. Hand over these requirements:

- `POST /quote` and `POST /bookings` must accept a `language` field (`lt` | `en`) and persist it on the booking record (e.g. `bookings.language`), instead of ignoring it and defaulting to Lithuanian.
- Every guest-facing email triggered by that booking must be rendered in the stored language: booking received / awaiting payment, payment confirmation, reminders, cancellation, and any pre-arrival message.
- Email templates need an English version for each of those types. Where an English template is missing, fall back to Lithuanian rather than failing (the same fallback the legal documents already use).
- Extra-service names and any other engine-side strings included in the email body should also be resolved in the booking's language.
- If reminders are sent by a scheduled job, that job must read `language` from the booking row, not from a global setting.

### 3. After the backend ships

Re-test the full English flow: book under `/en/...`, confirm the received email is English, and confirm the reminder email is English too. Then repeat the Lithuanian flow to make sure nothing regressed.

## Technical note

`language` is validated by Zod on the server function boundary, so an unexpected value can never reach the engine; the default is `lt`. Adding more languages later means extending the enum in `src/lib/rentivo-schemas.ts` and `src/lib/locale.ts` plus a content bundle under `src/content/`.

## Scope

No website code changes are planned unless step 1 shows the payload is wrong. The real fix lives in the booking engine.
