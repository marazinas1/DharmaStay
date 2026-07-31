import { createFileRoute } from "@tanstack/react-router";

import { BookingBand } from "@/components/home/BookingBand";
import { ExtrasSection } from "@/components/home/ExtrasSection";
import { Hero } from "@/components/home/Hero";
import { IntroStrip } from "@/components/home/IntroStrip";
import { LocationSection } from "@/components/home/LocationSection";
import { Ratings } from "@/components/home/Ratings";
import { StaysSection } from "@/components/home/StaysSection";
import { BookingProvider } from "@/components/site/BookingDialog";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

const title = "Dharma Stay — apartamentai ir namelis Telšiuose";
const description =
  "Boutique apgyvendinimas Telšių senamiestyje: apartamentai, apartamentai su terasa ir namelis su pirtimi bei kubilu. Rezervuokite tiesiogiai.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          name: "Dharma Stay",
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
  component: Index,
});

function Index() {
  return (
    <BookingProvider>
      <SiteHeader />
      <main>
        <Hero />
        <IntroStrip />
        <StaysSection />
        <LocationSection />
        <ExtrasSection />
        <Ratings />
        <BookingBand />
      </main>
      <SiteFooter />
    </BookingProvider>
  );
}
