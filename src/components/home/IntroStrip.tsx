import { EnsoDivider } from "@/components/site/Enso";
import { Reveal } from "@/components/site/Reveal";

export function IntroStrip() {
  return (
    <section className="bg-linen px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <EnsoDivider />
        <Reveal>
          <p className="mt-12 font-display text-[clamp(1.5rem,3.2vw,2rem)] leading-[1.45] font-medium text-ink">
            Iš namų į namus.
          </p>
          <p className="mt-6 text-base leading-[1.75] text-stone sm:text-lg">
            Dharma Stay apartamentai įsikūrę pačioje Telšių širdyje, Birutės gatvėje, šalia
            pagrindinės aikštės. Juos kūrėme taip, kad atvykę svečiai pasijustų lyg namuose —
            ramiai, jaukiai ir be rūpesčių.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
