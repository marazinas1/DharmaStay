import { ArrowRight } from "lucide-react";

import { useBooking } from "@/components/site/BookingDialog";
import { Reveal } from "@/components/site/Reveal";
import { stays, type Stay } from "@/data/stays";

function StayCard({ stay, index }: { stay: Stay; index: number }) {
  const { open } = useBooking();

  return (
    <Reveal delay={index * 110}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-warm-white shadow-soft transition-shadow duration-500 hover:shadow-lift">
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

        <div className="flex flex-1 flex-col p-7">
          <p className="label-caps text-stone">Nuo {stay.priceFrom} €</p>
          <h3 className="mt-3 font-display text-[1.375rem] leading-snug font-semibold text-ink">
            {stay.name}
          </h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-stone">{stay.description}</p>
          <p className="mt-4 text-xs tracking-wide text-stone/80">{stay.meta}</p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
            <button
              type="button"
              onClick={() => open(stay.id)}
              className="rounded-full bg-sage px-5 py-2.5 text-sm font-medium text-warm-white transition-colors hover:bg-sage-deep"
            >
              Rezervuoti
            </button>
            <a
              href={stay.href}
              className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-sage hover:text-sage-deep"
            >
              Plačiau
              <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function StaysSection() {
  return (
    <section id="apartamentai" className="scroll-mt-24 bg-linen px-6 pb-24 lg:px-12 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="label-caps text-sage">Apgyvendinimas</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,2.625rem)] leading-tight font-medium text-ink">
            Trys būdai pabūti Telšiuose
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
            Kiekviena erdvė paruošta tam pačiam – kad atvykę nieko nereikėtų spręsti.
          </p>
        </div>

        <div id="namelis" className="mt-14 grid scroll-mt-24 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stays.map((stay, index) => (
            <StayCard key={stay.id} stay={stay} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
