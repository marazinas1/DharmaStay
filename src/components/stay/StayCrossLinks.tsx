import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { common } from "@/content/lt/common";
import { stays, type StayId } from "@/data/stays";

export function StayCrossLinks({ currentId }: { currentId: StayId }) {
  const others = stays.filter((stay) => stay.id !== currentId);

  return (
    <div>
      <h2 className="label-caps text-stone">{common.labels.otherStays}</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {others.map((stay, index) => (
          <Reveal key={stay.id} delay={index * 90}>
            <Link
              to={stay.href}
              className="group block overflow-hidden rounded-2xl bg-warm-white shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <div className="aspect-[4/3] overflow-hidden">
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
              <div className="p-7">
                <h3 className="font-display text-xl font-semibold text-ink">{stay.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone">{stay.description}</p>
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