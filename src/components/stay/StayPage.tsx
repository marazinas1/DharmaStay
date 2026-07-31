import { PageHero } from "@/components/site/PageHero";
import { PageSection, Prose } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { useBooking } from "@/components/site/BookingDialog";
import { StayCrossLinks } from "@/components/stay/StayCrossLinks";
import { StayFacts } from "@/components/stay/StayFacts";
import { common } from "@/content/lt/common";
import type { Crumb } from "@/components/site/PageHero";
import type { Stay } from "@/data/stays";

export function StayPage({ stay, crumbs }: { stay: Stay; crumbs: Crumb[] }) {
  const { open } = useBooking();

  return (
    <>
      <PageHero
        eyebrow={stay.eyebrow}
        title={stay.name}
        lead={stay.heroLead}
        image={stay.image}
        imageWebp={stay.imageWebp}
        imageAlt={stay.imageAlt}
        crumbs={crumbs}
      >
        <button
          type="button"
          onClick={() => open(stay.id)}
          className="rounded-full bg-sage px-7 py-3.5 text-sm font-medium text-warm-white transition-colors hover:bg-sage-deep"
        >
          {common.cta.book} · {common.labels.priceFrom.toLowerCase()} {stay.priceFrom} €
        </button>
      </PageHero>

      <PageSection>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Reveal direction="left">
            <p className="label-caps text-sage">{stay.meta}</p>
            <Prose className="mt-6">
              {stay.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>
          </Reveal>
          <Reveal direction="right" delay={100}>
            <div className="overflow-hidden rounded-2xl shadow-soft">
              <picture>
                <source srcSet={stay.imageWebp} type="image/webp" />
                <img
                  src={stay.image}
                  alt={stay.imageAlt}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={900}
                  className="photo-zoom h-full w-full object-cover"
                />
              </picture>
            </div>
          </Reveal>
        </div>

        <div className="mt-16">
          <StayFacts stay={stay} />
        </div>
      </PageSection>

      <PageSection tone="linen">
        <StayCrossLinks currentId={stay.id} />
      </PageSection>
    </>
  );
}

export function stayLd(stay: Stay, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: stay.name,
    description: stay.seoDescription,
    url,
    floorSize: stay.facts.size,
    occupancy: stay.facts.guests,
    amenityFeature: stay.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: stay.facts.address,
      addressLocality: "Telšiai",
      addressCountry: "LT",
    },
    priceRange: `nuo ${stay.priceFrom} €`,
  };
}