import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { PageHero } from "@/components/site/PageHero";
import { PageSection } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { useBooking } from "@/components/site/BookingDialog";
import { AvailabilityCalendar, toApiDate } from "@/components/stay/AvailabilityCalendar";
import { PropertyError } from "@/components/stay/PropertyGrid";
import { PropertyIntro, propertyLd } from "@/components/stay/PropertySections";
import { StayCrossLinks } from "@/components/stay/StayCrossLinks";
import { apartamentai } from "@/content/lt/apartamentai";
import { common } from "@/content/lt/common";
import { SITE_URL } from "@/data/nav";
import { propertiesQuery } from "@/lib/property-queries";
import { formatPrice, toPropertyView } from "@/lib/property-view";
import { getProperty } from "@/lib/rentivo.functions";
import { idForSlug, isUuid, slugForId } from "@/lib/property-slug";
import { breadcrumbLd, pageHead } from "@/lib/seo";

const propertyQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    queryFn: () => getProperty({ data: { id } }),
    staleTime: 60_000,
  });

export const Route = createFileRoute("/apartamentai/$propertyId")({
  loader: async ({ context, params }) => {
    const properties = await context.queryClient.ensureQueryData(propertiesQuery);
    // Legacy UUID URLs permanently redirect to their slug.
    if (isUuid(params.propertyId)) {
      const slug = slugForId(properties, params.propertyId);
      if (slug !== params.propertyId) {
        throw redirect({
          to: "/apartamentai/$propertyId",
          params: { propertyId: slug },
          statusCode: 301,
        });
      }
    }
    const id = idForSlug(properties, params.propertyId);
    if (!id) throw notFound();
    const property = await context.queryClient.ensureQueryData(propertyQuery(id));
    const view = toPropertyView(property);
    return {
      id,
      name: property.name,
      description: (property.description ?? "").slice(0, 155),
      image: view.image,
      ld: JSON.stringify(
        propertyLd(property, view.amenities, `${SITE_URL}/apartamentai/${params.propertyId}`, view.image),
      ),
      crumbLd: JSON.stringify(
        breadcrumbLd([
          { name: common.nav.home, path: "/" },
          { name: apartamentai.title, path: "/apartamentai" },
          { name: property.name, path: `/apartamentai/${params.propertyId}` },
        ]),
      ),
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
    return {
      ...head,
      meta: loaderData?.image
        ? [
            ...head.meta,
            { property: "og:image", content: loaderData.image },
            { name: "twitter:image", content: loaderData.image },
          ]
        : head.meta,
      ...(loaderData
        ? {
            scripts: [
              { type: "application/ld+json", children: loaderData.ld },
              { type: "application/ld+json", children: loaderData.crumbLd },
            ],
          }
        : {}),
    };
  },
  component: PropertyPage,
  errorComponent: PropertyPageError,
});

function PropertyPage() {
  const { id } = Route.useLoaderData();
  const { data } = useSuspenseQuery(propertyQuery(id));
  const view = toPropertyView(data);
  const { open } = useBooking();
  const gallery = data.image_urls.filter((url) => url !== view.image);
  const sideImage = gallery[0] ?? view.image;
  const grid = (gallery[0] ? gallery.slice(1) : gallery).slice(0, 6);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const paragraphs = (data.description ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const facts = [
    ...(data.area_m2 ? [{ label: common.labels.size, value: `${data.area_m2} m²` }] : []),
    ...(data.max_guests
      ? [
          {
            label: common.labels.guests,
            value: `${common.labels.upTo} ${data.max_guests} ${common.labels.guestsLower}`,
          },
        ]
      : []),
    ...(data.address || data.city
      ? [{ label: common.labels.address, value: data.address ?? data.city ?? "" }]
      : []),
    ...(view.priceFrom !== null
      ? [
          {
            label: common.labels.priceFrom,
            value: `${formatPrice(view.priceFrom)} € / ${common.labels.perNight}`,
          },
        ]
      : []),
  ];

  const openBooking = () =>
    open(
      data.id,
      {
        ...(range?.from ? { checkin: toApiDate(range.from) } : {}),
        ...(range?.to ? { checkout: toApiDate(range.to) } : {}),
      },
      { name: data.name, extras: data.extra_services, maxGuests: data.max_guests ?? null },
    );

  return (
    <>
      <PageHero
        eyebrow={apartamentai.eyebrow}
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

      <PropertyIntro
        {...(view.meta ? { meta: view.meta } : {})}
        paragraphs={paragraphs}
        image={sideImage}
        imageAlt={view.imageAlt}
        facts={facts}
        amenities={view.amenities}
      >
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
      </PropertyIntro>

      {grid.length ? (
        <PageSection tone="linen">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((url, index) => (
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

      <PageSection tone="linen">
        <StayCrossLinks currentId={data.id} />
      </PageSection>
    </>
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
