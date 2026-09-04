# Porting today's work into Demo-Revoo

## Short answer

Yes, but not from this side. From here I can only *read* Demo-Revoo (I already checked out a read-only snapshot); nothing I write here can reach it. And pushing this project's GitHub code into Demo-Revoo would overwrite its backend (`supabase/`, `src/routes/api/`, `src/routes/_authenticated/`, admin UI, auth), so that route is not safe.

The fast, safe path: open **Demo-Revoo** and start a chat there that `@`-mentions **Dharma Stay Boutique**. The agent in that project can read this codebase directly and copy the changes across. The checklist below is what to give it.

## What actually changed here vs Demo-Revoo

I diffed the two codebases. The gap is well contained:

**New files to copy verbatim**
- `src/pages/laisvi-kambariai.tsx`
- `src/routes/laisvi-kambariai.tsx`, `src/routes/en/laisvi-kambariai.tsx`
- `src/routes/home-v2.tsx`, `src/routes/en/home-v2.tsx` (301 redirects to `/`)
- `src/components/home/HeroV2.tsx`, `RatingsAndTestimonials.tsx`, `Testimonials.tsx`
- `src/components/search/SearchBar.tsx`, `DateRangeField.tsx`, `GuestsField.tsx`, `plural.ts`
- `src/components/site/BookingDateRange.tsx`

**Files to overwrite (presentation only)**
- `src/pages/home.tsx` (Home V2 becomes the only home page)
- `src/data/nav.ts`, `src/components/site/SiteHeader.tsx` (single Home link, transparent header over hero)
- `src/content/lt/common.ts`, `src/content/en/common.ts` (testimonials, results-page and card labels)
- `src/styles.css` (radius scale, 1344 px container width, Ken Burns utility)
- The remaining home/site/stay components and page files — those diffs are the radius / container-width / mobile-overflow pass (`rounded-2xl` -> `rounded-md`, `rounded-full` -> `rounded-md`, wider max-width). Safe to copy as-is.
- `src/components/site/BookingDialog.tsx` (calendar with blocked dates inside the booking dialog)

**Merge carefully — do NOT overwrite**
- `src/lib/runtime-env.server.ts` and `src/lib/rentivo.functions.ts`: Demo-Revoo's versions point Core at its own in-project `/api/public/v1` and swallow config errors. Keep Demo-Revoo's versions untouched.
- `src/lib/availability-schemas.ts` + `src/lib/availability.server.ts`: add only the new `free_units` piece (per-property `total` / `currency` for the searched range) on top of Demo-Revoo's version — `/laisvi-kambariai` needs it to show prices.
- `src/routeTree.gen.ts`: never copy; it regenerates.
- Anything under `src/routes/api/`, `src/routes/_authenticated/`, `src/components/admin/`, `supabase/`: leave alone.

## Order of work in Demo-Revoo

1. Copy the new files and the presentation overwrites listed above.
2. Port `free_units` into the availability schema and server calculation.
3. Delete the old Home V1 sections that Home V2 no longer uses, wire `/` and `/en` to Home V2, keep `/home-v2` -> `/` redirects.
4. Verify: `/`, `/en`, `/laisvi-kambariai`, `/en/laisvi-kambariai`, room-card expand, photo lightbox, hero calendar, mobile at 390 px.

## Prompt to paste in Demo-Revoo

> @Dharma Stay Boutique - perkelk į šį projektą visus šiandienos frontend pakeitimus: naują Home V2 (tapo vienintele pradžia), `/laisvi-kambariai` rezultatų puslapį su kalendoriumi ir kortelėmis, paieškos juostą, atsiliepimus, apvalinimo/pločio dizaino pataisas ir mobile fixus. Nekeisk backend dalies: `src/routes/api/`, `src/routes/_authenticated/`, `src/components/admin/`, `supabase/`, `src/lib/runtime-env.server.ts`, `src/lib/rentivo.functions.ts`. Iš `availability` schemos perkelk tik naują `free_units` lauką.

## Notes

- If Demo-Revoo has since diverged on any of the "overwrite" files, that agent should diff first and merge instead of blind-copy.
- Nothing in this plan changes the current project; it is a transfer procedure.
