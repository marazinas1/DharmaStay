import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";

import { plural } from "@/components/search/plural";
import { SearchBar, type SearchValues } from "@/components/search/SearchBar";
import { useBooking } from "@/components/site/booking-context";
import { Enso } from "@/components/site/Enso";
import { getContent, useContent, useLocale } from "@/content";
import { availabilityQuery } from "@/lib/availability-queries";
import type { Locale } from "@/lib/locale";
import { propertiesQueryFor } from "@/lib/property-queries";
import { formatPrice, toPropertyView } from "@/lib/property-view";
import type { Property } from "@/lib/rentivo-schemas";
import { pageHead } from "@/lib/seo";

type ResultsSearch = SearchValues;

function numberParam(value: unknown, min: number): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min ? Math.floor(parsed) : undefined;
}

function pick(key: string, value: number | undefined): Record<string, number> {
  return value === undefined ? {} : { [key]: value };
}

export function availabilityResultsRoute(locale: Locale) {
  const c = getContent(locale);

  return {
    validateSearch: (search: Record<string, unknown>): ResultsSearch => ({
      ...(typeof search["nuo"] === "string" ? { nuo: search["nuo"] } : {}),
      ...(typeof search["iki"] === "string" ? { iki: search["iki"] } : {}),
      ...pick("suauge", numberParam(search["suauge"], 1)),
      ...pick("vaikai", numberParam(search["vaikai"], 0)),
      ...pick("kudikiai", numberParam(search["kudikiai"], 0)),
    }),
    head: () => {
      const head = pageHead({
        path: "/laisvi-kambariai",
        title: c.common.results.seoTitle,
        description: c.common.results.seoDescription,
        locale,
      });
      return { ...head, meta: [...head.meta, { name: "robots", content: "noindex" }] };
    },
    component: () => <ResultsPage locale={locale} />,
  };
}

function ResultsPage({ locale }: { locale: Locale }) {
  const { common } = useContent();
  const search = useSearch({ strict: false }) as ResultsSearch;
  const adults = search.suauge ?? 2;
  const children = search.vaikai ?? 0;
  const seats = adults + children;

  const availability = useQuery(availabilityQuery(search.nuo, search.iki, seats));
  const properties = useQuery(propertiesQueryFor(locale));

  const hasDates = Boolean(search.nuo && search.iki);
  const loading = hasDates && (availability.isPending || availability.isFetching || properties.isPending);
  const failed = availability.isError || properties.isError;

  const freeIds = availability.data?.free_ids ?? [];
  const totals = new Map(
    (availability.data?.free_units ?? []).map((unit) => [unit.id, unit.total] as const),
  );
  const rooms = (properties.data ?? []).filter((property) => freeIds.includes(property.id));
  const nights = availability.data?.nights ?? 0;

  return (
    <>
      <section className="bg-linen px-6 pt-32 pb-8 lg:px-12 lg:pt-36">
        <div className="mx-auto max-w-6xl text-center">
          <Enso className="mx-auto h-9 w-9 text-sage/70" />
          <p className="label-caps mt-6 text-sage">{common.results.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.12] font-medium text-ink">
            {common.results.title}
          </h1>
        </div>
      </section>

      <section className="bg-linen px-6 pb-24 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            {/* keeps the calendar card top aligned with the first room card */}
            {hasDates && !failed && !loading && rooms.length > 0 ? (
              <p className="hidden pb-4 text-sm text-transparent lg:block" aria-hidden>
                .
              </p>
            ) : null}
            <SearchBar variant="compact" initial={search} />
          </aside>


          <div>
            {!hasDates ? (
              <p className="py-10 text-center text-sm text-stone">{common.results.missingDates}</p>
            ) : failed ? (
              <div className="py-10 text-center text-sm text-stone">
                <p>{common.results.error}</p>
                <button
                  type="button"
                  onClick={() => {
                    void availability.refetch();
                    void properties.refetch();
                  }}
                  className="mt-5 rounded-md bg-sage px-6 py-2.5 text-xs font-medium text-warm-white transition-colors hover:bg-sage-deep"
                >
                  {common.results.retry}
                </button>
              </div>
            ) : loading ? (
              <div className="grid gap-6">
                {[0, 1, 2].map((key) => (
                  <div
                    key={key}
                    className="h-56 animate-pulse rounded-md bg-warm-white/70 shadow-soft"
                  />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-display text-2xl text-ink">{common.results.empty}</p>
                <p className="mt-3 text-sm text-stone">{common.results.emptyHint}</p>
              </div>
            ) : (
              <>
                <p className="pb-4 text-sm text-stone">
                  {rooms.length}{" "}
                  {plural(
                    rooms.length,
                    common.results.foundOne,
                    common.results.foundFew,
                    common.results.foundMany,
                  )}
                </p>

                <div className="grid gap-6">
                  {rooms.map((property) => (
                    <RoomResultCard
                      key={property.id}
                      property={property}
                      locale={locale}
                      nights={nights}
                      total={totals.get(property.id) ?? null}
                      checkin={search.nuo as string}
                      checkout={search.iki as string}
                      adults={seats}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}


function RoomResultCard({
  property,
  locale,
  nights,
  total,
  checkin,
  checkout,
  adults,
}: {
  property: Property;
  locale: Locale;
  nights: number;
  total: number | null;
  checkin: string;
  checkout: string;
  adults: number;
}) {
  const { common } = useContent();
  const { open } = useBooking();
  const [gallery, setGallery] = useState(false);
  const view = toPropertyView(property, locale);
  const images = [view.image, ...property.image_urls].filter(
    (src, index, all): src is string => Boolean(src) && all.indexOf(src) === index,
  );
  const perNight = total !== null && nights > 0 ? total / nights : view.priceFrom;

  return (
    <article className="grid overflow-hidden rounded-md bg-warm-white shadow-soft transition-shadow hover:shadow-lift md:grid-cols-[minmax(0,18rem)_1fr]">
      <button
        type="button"
        onClick={() => setGallery(true)}
        aria-label={common.results.openGallery}
        className="group relative aspect-[4/3] w-full overflow-hidden bg-linen md:aspect-auto md:h-full"
      >
        {images[0] ? (
          <img
            src={images[0]}
            alt={view.imageAlt}
            loading="lazy"
            decoding="async"
            className="photo-zoom h-full w-full object-cover"
          />
        ) : null}
        {images.length > 1 ? (
          <span className="absolute bottom-3 left-3 rounded-md bg-ink/70 px-3 py-1 text-xs text-warm-white">
            {common.results.openGallery} · {images.length}
          </span>
        ) : null}
      </button>

      <div className="flex flex-col p-6 sm:p-7">
        <h2 className="font-display text-[1.375rem] leading-snug font-semibold text-ink">
          {view.name}
        </h2>
        {view.meta ? <p className="mt-2 text-xs tracking-wide text-stone/80">{view.meta}</p> : null}
        {view.description ? (
          <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-stone">
            {view.description}
          </p>
        ) : null}
        {view.amenities.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {view.amenities.slice(0, 4).map((amenity) => (
              <li
                key={amenity}
                className="rounded-md border border-border px-3 py-1 text-xs text-stone"
              >
                {amenity}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
          <div>
            <p className="font-display text-2xl font-semibold text-ink">
              {total !== null
                ? `${formatPrice(total)} €`
                : view.priceFrom !== null
                  ? `${common.labels.priceFrom} ${formatPrice(view.priceFrom)} €`
                  : common.stays.priceOnRequest}
            </p>
            <p className="mt-1 text-xs text-stone">
              {total !== null ? common.results.forStay : ""}
              {perNight !== null && perNight !== undefined
                ? `${total !== null ? " · " : ""}${common.labels.priceFrom} ${formatPrice(Math.round(perNight))} € / ${common.results.perNight}`
                : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              open(property.id, { checkin, checkout, adults }, { name: property.name })
            }
            className="inline-flex items-center gap-2 rounded-md bg-sage px-6 py-3 text-sm font-medium text-warm-white transition-colors hover:bg-sage-deep"
          >
            {common.cta.book}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {gallery ? (
        <Lightbox images={images} alt={view.imageAlt} onClose={() => setGallery(false)} />
      ) : null}
    </article>
  );
}

function Lightbox({
  images,
  alt,
  onClose,
}: {
  images: string[];
  alt: string;
  onClose: () => void;
}) {
  const { common } = useContent();
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink/90 p-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={common.results.closeGallery}
        className="absolute right-6 top-6 text-warm-white/80 transition-colors hover:text-warm-white"
      >
        <X className="h-7 w-7" aria-hidden />
      </button>
      {current ? (
        <img
          src={current}
          alt={alt}
          onClick={(event) => event.stopPropagation()}
          className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
        />
      ) : null}
      {images.length > 1 ? (
        <div
          className="mt-6 flex items-center gap-4"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setIndex((value) => (value - 1 + images.length) % images.length)}
            className="rounded-md border border-warm-white/50 px-5 py-2 text-sm text-warm-white transition-colors hover:bg-warm-white hover:text-ink"
          >
            {common.results.prev}
          </button>
          <span className="text-sm text-warm-white/80">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={() => setIndex((value) => (value + 1) % images.length)}
            className="rounded-md border border-warm-white/50 px-5 py-2 text-sm text-warm-white transition-colors hover:bg-warm-white hover:text-ink"
          >
            {common.results.next}
          </button>
        </div>
      ) : null}
    </div>
  );
}
