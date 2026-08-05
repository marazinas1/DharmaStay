import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { common } from "@/content/lt/common";
import { propertiesQuery } from "@/lib/property-queries";
import { toPropertyView } from "@/lib/property-view";

/** Other real properties from the shared ["properties"] cache — no extra fetch. */
export function StayCrossLinks({ currentId }: { currentId: string }) {
  const { data } = useQuery(propertiesQuery);
  const others = (data ?? [])
    .filter((property) => property.id !== currentId)
    .slice(0, 2)
    .map(toPropertyView);

  if (others.length === 0) return null;

  return (
    <div>
      <h2 className="label-caps text-stone">{common.labels.otherStays}</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {others.map((stay, index) => (
          <Reveal key={stay.id} delay={index * 90}>
            <Link
              to="/apartamentai/$propertyId"
              params={{ propertyId: stay.id }}
              className="group block overflow-hidden rounded-2xl bg-warm-white shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <div className="aspect-[4/3] overflow-hidden bg-linen">
                {stay.image ? (
                  <img
                    src={stay.image}
                    alt={stay.imageAlt}
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={900}
                    className="photo-zoom h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="p-7">
                <h3 className="font-display text-xl font-semibold text-ink">{stay.name}</h3>
                {stay.description ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone">
                    {stay.description}
                  </p>
                ) : null}
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sage">
                  {common.cta.more}
                  <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}