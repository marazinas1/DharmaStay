import { createFileRoute } from "@tanstack/react-router";

import { BookingBand } from "@/components/home/BookingBand";
import { ExtrasSection } from "@/components/home/ExtrasSection";
import { Hero } from "@/components/home/Hero";
import { IntroStrip } from "@/components/home/IntroStrip";
import { LocationSection } from "@/components/home/LocationSection";
import { Ratings } from "@/components/home/Ratings";
import { StaysSection } from "@/components/home/StaysSection";
import { pageHead } from "@/lib/seo";
import { SITE_URL } from "@/data/nav";
import { propertiesQuery } from "@/lib/property-queries";

const title = "Dharma Stay — apartamentai ir namelis Telšiuose";
const description =
  "Boutique apgyvendinimas Telšių senamiestyje: apartamentai, apartamentai su terasa ir namelis su pirtimi bei kubilu. Rezervuokite tiesiogiai.";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({ path: "/", title, description }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          name: "Dharma Stay",
          url: SITE_URL,
          description,
          email: "info@dharmastay.lt",
          telephone: "+37065911929",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Birutės g. 1",
            addressLocality: "Telšiai",
            postalCode: "87130",
            addressCountry: "LT",
          },
          priceRange: "€€",
        }),
      },
    ],
  }),
  loader: async ({ context }) => {
    // Prefetch so the stays grid is server-rendered; an API hiccup must not
    // take the landing page down — the section renders its own error state.
    await context.queryClient.prefetchQuery(propertiesQuery);
  },
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <IntroStrip />
      <StaysSection />
      <LocationSection />
      <ExtrasSection />
      <Ratings />
      <BookingBand />
    </>
  );
}
