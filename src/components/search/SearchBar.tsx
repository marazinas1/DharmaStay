import { Search } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { DateRangeField } from "@/components/search/DateRangeField";
import { DEFAULT_GUESTS, GuestsField, type Guests } from "@/components/search/GuestsField";
import { useLocaleNavigate } from "@/components/site/LocaleLink";
import { toApiDate } from "@/components/stay/AvailabilityCalendar";
import { useContent } from "@/content";
import { cn } from "@/lib/utils";

export type SearchValues = {
  nuo?: string;
  iki?: string;
  suauge?: number;
  vaikai?: number;
  kudikiai?: number;
};

function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

/**
 * Shared availability search: one range calendar + guests + CTA.
 * `hero` is the big landing card, `compact` sits on the results page.
 */
export function SearchBar({
  variant = "hero",
  initial,
  className,
}: {
  variant?: "hero" | "compact";
  initial?: SearchValues;
  className?: string;
}) {
  const { common } = useContent();
  const navigate = useLocaleNavigate();
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = toDate(initial?.nuo);
    const to = toDate(initial?.iki);
    return from ? ({ from, ...(to ? { to } : {}) } as DateRange) : undefined;
  });
  const [guests, setGuests] = useState<Guests>({
    adults: initial?.suauge ?? DEFAULT_GUESTS.adults,
    children: initial?.vaikai ?? 0,
    infants: initial?.kudikiai ?? 0,
  });

  const submit = () => {
    if (!range?.from || !range?.to) return;
    void navigate({
      to: "/laisvi-kambariai",
      search: {
        nuo: toApiDate(range.from),
        iki: toApiDate(range.to),
        suauge: guests.adults,
        vaikai: guests.children,
        kudikiai: guests.infants,
      },
    } as unknown as Parameters<typeof navigate>[0]);
  };

  const ready = Boolean(range?.from && range?.to);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cn(
        "grid gap-2 rounded-3xl bg-warm-white p-3 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center",
        variant === "hero" ? "shadow-lift" : "border border-border shadow-soft",
        className,
      )}
    >
      <DateRangeField range={range} onChange={setRange} />
      <div className="sm:border-l sm:border-border">
        <GuestsField guests={guests} onChange={setGuests} />
      </div>
      <button
        type="submit"
        disabled={!ready}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-clay px-7 py-4 text-sm font-medium text-ink transition-colors hover:bg-sage hover:text-warm-white disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-full"
      >
        <Search className="h-4 w-4" aria-hidden />
        {common.search.submit}
      </button>
    </form>
  );
}
