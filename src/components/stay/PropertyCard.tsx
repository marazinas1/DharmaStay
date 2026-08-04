import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { useBooking } from "@/components/site/BookingDialog";
import { Reveal } from "@/components/site/Reveal";
import { common } from "@/content/lt/common";
import { formatPrice, type PropertyView } from "@/lib/property-view";

export function PropertyCard({ property, index }: { property: PropertyView; index: number }) {
  const { open } = useBooking();

  return (
    <Reveal delay={index * 110}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-warm-white shadow-soft transition-shadow duration-500 hover:shadow-lift">
        <div className="aspect-[4/3] overflow-hidden bg-linen">
          {property.image ? (
            <img
              src={property.image}
              alt={property.imageAlt}
              loading="lazy"
              decoding="async"
              className="photo-zoom h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-7">
          <p className="label-caps text-stone">
            {property.priceFrom === null
              ? common.stays.priceOnRequest
              : `${common.labels.priceFrom} ${formatPrice(property.priceFrom)} €`}
          </p>
          <h3 className="mt-3 font-display text-[1.375rem] leading-snug font-semibold text-ink">
            {property.name}
          </h3>
          {property.description ? (
            <p className="mt-3 line-clamp-4 text-[0.95rem] leading-relaxed text-stone">
              {property.description}
            </p>
          ) : null}
          {property.meta ? (
            <p className="mt-4 text-xs tracking-wide text-stone/80">{property.meta}</p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
            <button
              type="button"
              onClick={() => open(property.id, undefined, { name: property.name })}
              className="rounded-full bg-sage px-5 py-2.5 text-sm font-medium text-warm-white transition-colors hover:bg-sage-deep"
            >
              {common.cta.book}
            </button>
            <Link
              to="/apartamentai/$propertyId"
              params={{ propertyId: property.id }}
              className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-sage hover:text-sage-deep"
            >
              {common.cta.more}
              <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
