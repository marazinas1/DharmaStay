import { BookingBand } from "@/components/home/BookingBand";
import { ExtrasSection } from "@/components/home/ExtrasSection";
import { HeroV2 } from "@/components/home/HeroV2";
import { IntroStrip } from "@/components/home/IntroStrip";
import { LocationSection } from "@/components/home/LocationSection";
import { Ratings } from "@/components/home/Ratings";
import { StaysSection } from "@/components/home/StaysSection";
import { getContent } from "@/content";
import type { Locale } from "@/lib/locale";
import { pageHead } from "@/lib/seo";

/** Home V2 concept: search-first hero, no second availability band. */
export function homeV2Route(locale: Locale) {
  const c = getContent(locale);
  const title = `${c.common.nav.home2} — ${c.home.seoTitle}`;

  return {
    head: () => {
      const head = pageHead({
        path: "/home-v2",
        title,
        description: c.home.seoDescription,
        locale,
      });
      return {
        ...head,
        meta: [...head.meta, { name: "robots", content: "noindex" }],
      };
    },
    component: HomeV2,
  };
}

function HomeV2() {
  return (
    <>
      <HeroV2 />
      <IntroStrip />
      <StaysSection />
      <LocationSection />
      <ExtrasSection />
      <Ratings />
      <BookingBand />
    </>
  );
}
