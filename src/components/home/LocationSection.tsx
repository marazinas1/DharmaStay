import { MapPin } from "lucide-react";

import locationImage from "@/assets/location-telsiai.jpg";
import { EnsoDivider } from "@/components/site/Enso";
import { Reveal } from "@/components/site/Reveal";
import { contact } from "@/data/stays";

export function LocationSection() {
  return (
    <section id="vieta" className="scroll-mt-24 bg-warm-white px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <EnsoDivider className="mb-16" />

        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="label-caps text-sage">Vieta</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,2.625rem)] leading-tight font-normal text-ink">
              Telšiai, senamiesčio ritmu
            </h2>
            <div className="mt-6 space-y-4 text-base leading-[1.75] text-stone sm:text-lg">
              <p>
                Esame prie pagrindinės aikštės – kavinės, turgus ir vakarinis varpų garsas
                pasiekiami pėsčiomis.
              </p>
              <p>
                Iki Masčio ežero – keli šimtai metrų. Ryte tai vieta bėgimui, vakare – tyliam
                pasivaikščiojimui, kai vanduo atspindi visą miestą.
              </p>
              <p>Aplinkui – Žemaitija: miškai, keliukai ir lėtesnis laikas.</p>
            </div>

            <div className="mt-8 flex items-start gap-3 text-sm text-stone">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
              <span>{contact.address}</span>
            </div>
            <a
              href={contact.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full border border-sage px-6 py-3 text-sm font-medium text-sage transition-colors hover:bg-sage hover:text-warm-white"
            >
              Atidaryti žemėlapyje
            </a>
          </Reveal>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl shadow-soft">
              <img
                src={locationImage}
                alt="Telšių senamiestis prie Masčio ežero"
                loading="lazy"
                width={1408}
                height={1056}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 flex h-24 items-center justify-center rounded-2xl border border-dashed border-clay/70 text-sm text-stone">
              Žemėlapis – netrukus
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
