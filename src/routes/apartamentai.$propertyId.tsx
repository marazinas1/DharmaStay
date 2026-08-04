import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { PageHero } from "@/components/site/PageHero";
import { PageSection, Prose } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { useBooking } from "@/components/site/BookingDialog";
import { AvailabilityCalendar, toApiDate } from "@/components/stay/AvailabilityCalendar";
import { PropertyError } from "@/components/stay/PropertyGrid";
import { apartamentai } from "@/content/lt/apartamentai";
import { common } from "@/content/lt/common";
import { formatPrice, propertyMeta, toPropertyView } from "@/lib/property-view";
import { getProperty } from "@/lib/rentivo.functions";
import { pageHead } from "@/lib/seo";

const propertyQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    queryFn: () => getProperty({ data: { id } }),
    staleTime: 60_000,
  });

export const Route = createFileRoute("/apartamentai/$propertyId")({
  loader: async ({ context, params }) => {
    if (!/^[0-9a-f-]{36}$/i.test(params.propertyId)) throw notFound();
    const property = await context.queryClient.ensureQueryData(propertyQuery(params.propertyId));
    const view = toPropertyView(property);
    return {
      name: property.name,
      description: (property.description ?? "").slice(0, 155),
      image: view.image,
    };
  },
  head: ({ params, loaderData }) => {
    const name = loaderData?.name ?? apartamentai.title;
    const description = loaderData?.description || apartamentai.seoDescription;
    const head = pageHead({
      path: `/apartamentai/${params.propertyId}`,
      title: `${name} — ${common.brand}`,
      description,
    });
    if (!loaderData?.image) return head;
    return {
      ...head,
      meta: [
        ...head.meta,
        { property: "og:image", content: loaderData.image },
        { name: "twitter:image", content: loaderData.image },
      ],
    };
  },
  component: PropertyPage,
  errorComponent: PropertyPageError,
});

function PropertyPage() {
  const { propertyId } = Route.useParams();
  const { data } = useSuspenseQuery(propertyQuery(propertyId));
  const view = toPropertyView(data);
  const { open } = useBooking();
  const gallery = data.image_urls.filter((url) => url !== view.image).slice(0, 6);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const openBooking = () =>
    open(data.id, {
      ...(range?.from ? { checkin: toApiDate(range.from) } : {}),
      ...(range?.to ? { checkout: toApiDate(range.to) } : {}),
    });

  return (
    <>
      <PageHero
        eyebrow={data.property_type ?? apartamentai.eyebrow}
        title={data.name}
        {...(view.meta ? { lead: view.meta } : {})}
        {...(view.image ? { image: view.image } : {})}
        imageAlt={view.imageAlt}
        crumbs={[
          { label: common.nav.home, to: "/" },
          { label: apartamentai.title, to: "/apartamentai" },
          { label: data.name },
        ]}
      >
        <button
          type="button"
          onClick={openBooking}
          className="rounded-full bg-sage px-7 py-3.5 text-sm font-medium text-warm-white transition-colors hover:bg-sage-deep"
        >
          {common.cta.book}
          {view.priceFrom === null
            ? ""
            : ` · ${common.labels.priceFrom.toLowerCase()} ${formatPrice(view.priceFrom)} €`}
        </button>
      </PageHero>

      <PageSection>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Reveal direction="left">
            <Prose>
              {data.description ? <p>{data.description}</p> : null}
            </Prose>
          </Reveal>
          <Reveal direction="right">
            <dl className="grid gap-8 rounded-2xl bg-linen p-8 sm:grid-cols-2">
              {data.area_m2 ? (
                <Fact label={common.labels.size} value={`${data.area_m2} m²`} />
              ) : null}
              {data.max_guests ? (
                <Fact label={common.labels.guests} value={String(data.max_guests)} />
              ) : null}
              {data.address ? <Fact label={common.labels.address} value={data.address} /> : null}
              {view.priceFrom !== null ? (
                <Fact
                  label={common.labels.priceFrom}
                  value={`${formatPrice(view.priceFrom)} € / ${common.labels.perNight}`}
                />
              ) : null}
            </dl>

            {view.amenities.length ? (
              <div className="mt-10">
                <h2 className="label-caps text-sage">{common.labels.amenities}</h2>
                <ul className="mt-5 grid gap-3 text-sm leading-relaxed text-stone sm:grid-cols-2">
                  {view.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
          <Reveal direction="left">
            <AvailabilityCalendar
              occupied={data.occupied}
              range={range}
              onRangeChange={setRange}
            />
          </Reveal>
          <Reveal direction="right" delay={100}>
            <div className="rounded-2xl bg-linen p-8">
              <p className="label-caps text-sage">{common.stays.availabilityTitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-stone">
                {data.occupied.length ? common.stays.availabilityLead : common.stays.noOccupied}
              </p>
              <button
                type="button"
                onClick={openBooking}
                className="mt-6 w-full rounded-full bg-sage px-6 py-3.5 text-sm font-medium text-warm-white transition-colors hover:bg-sage-deep"
              >
                {range?.from && range?.to ? common.cta.book : common.stays.pickDates}
              </button>
            </div>
          </Reveal>
        </div>
      </PageSection>

      {gallery.length ? (
        <PageSection tone="linen">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((url, index) => (
              <Reveal key={url} delay={index * 90}>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-warm-white shadow-soft">
                  <img
                    src={url}
                    alt={`${data.name} — ${common.brand}`}
                    loading="lazy"
                    decoding="async"
                    className="photo-zoom h-full w-full object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </PageSection>
      ) : null}
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-caps text-stone/80">{label}</dt>
      <dd className="mt-2 font-display text-xl font-medium text-ink">{value}</dd>
    </div>
  );
}

function PropertyPageError() {
  const router = useRouter();
  return (
    <>
      <PageHero
        eyebrow={apartamentai.eyebrow}
        title={apartamentai.title}
        crumbs={[
          { label: common.nav.home, to: "/" },
          { label: apartamentai.title, to: "/apartamentai" },
        ]}
      />
      <PageSection tone="linen">
        <PropertyError onRetry={() => void router.invalidate()} />
      </PageSection>
    </>
  );
}
