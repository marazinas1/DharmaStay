# Home V2: calendar UX + results page like the Sinchronas reference

## 1. Hero calendar behaves predictably

Today the range calendar closes the moment the second date is clicked, and re-picking dates is awkward: a new click continues the old range instead of starting a fresh check-in.

New behaviour:
- Picking check-in then check-out keeps the popover open. The user sees the chosen range highlighted with the nights count.
- The popover closes only when the user acts elsewhere: presses Search, opens the Guests popover, or clicks outside / presses Esc.
- Clicking any date once a complete range exists starts a brand-new range from that day (classic booking-engine behaviour), so changing dates never requires clearing first.
- Clicking the current check-in day again resets the selection.
- The footer keeps Clear plus a Done button that closes the calendar.

## 2. /laisvi-kambariai left column shows a real calendar

Instead of the collapsed date button, the left column shows, top to bottom:
- Check-in / check-out / nights summary row (mirrors the reference layout).
- One inline month calendar, always visible, past days disabled, same fresh-range click rules as the hero.
- Guests block (adults / children / infants) with the same counters.
- Search button.

The top edge of this card aligns with the top edge of the first room card (same grid row start, no extra offset above the list heading).

## 3. Room cards

- Clearer card separation: stronger surface + border and a visible hover lift, more internal breathing room.
- Photo becomes a 4:3 block on all breakpoints (fixed ratio column on desktop rather than a full-height stretch).
- Price / booking block stays on the right of the card body.

## 4. Photo lightbox with arrows and keyboard

- Left / right chevron buttons overlaid on the sides of the image.
- Keyboard: ArrowLeft / ArrowRight change photo, Esc closes; focus is moved into the dialog on open.
- Counter stays; thumbnails row under the image when a room has more than one photo.

## Technical notes

- `DateRangeField.tsx`: add an explicit range-selection reducer (`onDayClick` instead of relying on react-day-picker's default range append), drop the auto-close on complete range, add a Done action, and support an inline (non-popover) render mode via a prop so the same component serves hero and results page.
- `SearchBar.tsx`: close the dates popover on submit and when the guests popover opens (lift `guestsOpen` state into SearchBar); add a `layout="stacked"` variant used by the results sidebar that renders the inline calendar.
- `src/pages/laisvi-kambariai.tsx`: sidebar uses the stacked SearchBar; card markup updated for 4:3 image and stronger elevation; `Lightbox` gains arrow buttons, keyboard handlers and thumbnails.
- No changes to availability/booking logic, pricing, API calls, or Home 1.

Verification: typecheck plus a Playwright pass on `/laisvi-kambariai` and `/home-v2` (date re-pick, arrow-key gallery, alignment screenshot).
