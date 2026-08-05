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
    // Fetch on the server and hand the rows to the component, so SSR and the
    // first client render agree. An API hiccup must not take the landing page
    // down — the section renders its own error state.
    try {
      return { properties: await context.queryClient.ensureQueryData(propertiesQuery) };
    } catch {
      return { properties: null };
    }
  },
  component: Index,
});

function Index() {
  const { properties } = Route.useLoaderData();

  return (
    <>
      <Hero />
      <IntroStrip />
      <StaysSection {...(properties ? { initialProperties: properties } : {})} />
      <LocationSection />
      <ExtrasSection />
      <Ratings />
      <BookingBand />
    </>
  );
}
