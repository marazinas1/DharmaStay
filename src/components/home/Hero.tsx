import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import heroImage from "@/assets/hero-oldtown.jpg";
import heroImageWebp from "@/assets/hero-oldtown.webp";
import { Enso } from "@/components/site/Enso";
import { useBooking } from "@/components/site/BookingDialog";

export function Hero() {
  const { open } = useBooking();
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Cheap scroll-driven fade/lift: one CSS variable, rAF-throttled.
  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.75));
      node.style.setProperty("--hero-progress", progress.toFixed(3));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="top" className="relative isolate min-h-[92vh] overflow-hidden">
      <picture>
        <source srcSet={heroImageWebp} type="image/webp" />
        <img
          src={heroImage}
          alt="Senamiesčio stogai ir bažnyčios bokštas auksinėje vakaro šviesoje"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="hero-kenburns absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/25 to-ink/55" />

      <div
        ref={contentRef}
        className="hero-fade relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-6 pb-24 pt-40 lg:px-12 lg:pb-32"
      >
        <div className="max-w-2xl">
          <p className="label-caps text-warm-white/75">Telšiai · Žemaitija</p>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,6.5vw,4.25rem)] leading-[1.08] font-medium text-warm-white">
            Vieta, kurioje lėtėja kvėpavimas
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-warm-white/85 sm:text-lg">
            Apartamentai ir namelis senamiesčio širdyje, keli žingsniai nuo Masčio ežero.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => open()}
              className="rounded-full bg-sage px-7 py-3.5 text-sm font-medium text-warm-white transition-colors hover:bg-sage-deep"
            >
              Tikrinti laisvas datas
            </button>
            <Link
              to="/apartamentai"
              className="rounded-full border border-warm-white/60 px-7 py-3.5 text-sm font-medium text-warm-white transition-colors hover:bg-warm-white hover:text-ink"
            >
              Apžiūrėti apartamentus
            </Link>
          </div>
        </div>

        <div className="mt-16 hidden justify-center lg:flex">
          <Enso className="h-10 w-10 animate-[spin_18s_linear_infinite] text-warm-white/45" />
        </div>
      </div>
    </section>
  );
}
