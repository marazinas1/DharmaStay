import { format } from "date-fns";
import { enGB, lt as ltLocale } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import { plural } from "@/components/search/plural";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useContent, useLocale } from "@/content";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function nightsBetween(range: DateRange | undefined): number {
  if (!range?.from || !range?.to) return 0;
  return Math.max(0, Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000));
}

/**
 * One range calendar for both dates: first click is check-in, second is
 * check-out, so an earlier departure can never be selected.
 */
export function DateRangeField({
  range,
  onChange,
  className,
}: {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}) {
  const { common } = useContent();
  const locale = useLocale();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const today = useMemo(startOfToday, []);
  const dateLocale = locale === "en" ? enGB : ltLocale;
  const nights = nightsBetween(range);

  const label = range?.from
    ? `${format(range.from, "d MMM", { locale: dateLocale })} — ${
        range.to ? format(range.to, "d MMM", { locale: dateLocale }) : "…"
      }${
        nights > 0
          ? ` · ${nights} ${plural(nights, common.search.nightOne, common.search.nightFew, common.search.nightMany)}`
          : ""
      }`
    : common.search.datesPlaceholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-left transition-colors hover:bg-linen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage",
            className,
          )}
        >
          <CalendarDays className="h-5 w-5 shrink-0 text-sage" aria-hidden />
          <span className="min-w-0">
            <span className="label-caps block text-stone/80">{common.search.datesLabel}</span>
            <span
              className={cn(
                "mt-1 block truncate text-sm font-medium",
                range?.from ? "text-ink" : "text-stone/70",
              )}
            >
              {label}
            </span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-2xl border-border bg-warm-white p-4">
        <Calendar
          mode="range"
          locale={dateLocale}
          weekStartsOn={1}
          numberOfMonths={isMobile ? 1 : 2}
          selected={range}
          onSelect={(value) => {
            onChange(value);
            if (value?.from && value?.to) setOpen(false);
          }}
          min={1}
          disabled={{ before: today }}
          startMonth={today}
          className="pointer-events-auto [--cell-size:2.4rem] sm:[--cell-size:2.6rem]"
          classNames={{
            month: "flex w-full flex-col gap-4",
            caption_label: "font-display text-lg font-medium capitalize text-ink",
            weekday: "flex-1 select-none text-[0.7rem] uppercase tracking-[0.12em] text-stone/70",
          }}
        />
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-stone">
            {nights > 0
              ? `${nights} ${plural(nights, common.search.nightOne, common.search.nightFew, common.search.nightMany)}`
              : common.search.needDates}
          </span>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="rounded-full border border-border px-4 py-1.5 text-xs text-stone transition-colors hover:text-ink"
          >
            {common.search.clear}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
