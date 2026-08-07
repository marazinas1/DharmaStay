import { Flame, Gift, UtensilsCrossed, Waves } from "lucide-react";

import { EnsoFrame } from "@/components/site/Enso";
import { Reveal } from "@/components/site/Reveal";

const extras = [
  {
    icon: UtensilsCrossed,
    title: "Restobaras",
    text: "Pusryčiai ir vakarienė čia pat, viešnagės vietoje.",
  },
  { icon: Flame, title: "Pirtis", text: "Šiluma po ilgos dienos. 40 €." },
  { icon: Waves, title: "Kubilas", text: "Sūkurinė vonia po atviru dangumi. 50 €." },
  { icon: Gift, title: "Dovanų kuponai", text: "Nakvynė kaip dovana artimam žmogui." },
];

export function ExtrasSection() {
  return (
    <section id="papildoma" className="scroll-mt-24 bg-linen px-6 py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="label-caps text-stone">Papildoma</p>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {extras.map((extra, index) => (
            <Reveal key={extra.title} delay={index * 90}>
              <div>
                <EnsoFrame className="h-[4.5rem] w-[4.5rem]">
                  <extra.icon className="h-7 w-7 text-sage-deep" strokeWidth={1.5} aria-hidden />
                </EnsoFrame>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{extra.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{extra.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
