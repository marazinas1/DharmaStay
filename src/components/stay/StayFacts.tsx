import { Reveal } from "@/components/site/Reveal";
import { common } from "@/content/lt/common";
import type { Stay } from "@/data/stays";

export function StayFacts({ stay }: { stay: Stay }) {
  const facts = [
    { label: common.labels.size, value: stay.facts.size },
    { label: common.labels.guests, value: stay.facts.guests },
    { label: common.labels.address, value: stay.facts.address },
    { label: common.labels.priceFrom, value: `${stay.priceFrom} €` },
  ];

  return (
    <Reveal>
      <dl className="grid gap-8 rounded-2xl bg-linen p-8 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="label-caps text-stone/80">{fact.label}</dt>
            <dd className="mt-2 font-display text-xl font-medium text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <h2 className="label-caps text-sage">{common.labels.amenities}</h2>
        <ul className="mt-5 grid gap-3 text-sm leading-relaxed text-stone sm:grid-cols-2">
          {stay.amenities.map((amenity) => (
            <li key={amenity} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
              {amenity}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}