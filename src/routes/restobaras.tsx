import { createFileRoute } from "@tanstack/react-router";

import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { PageSection, Prose } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { restobaras } from "@/content/lt/restobaras";
import { SITE_URL } from "@/data/nav";
import { contact } from "@/data/stays";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/restobaras")({
  head: () => ({
    ...pageHead({
      path: "/restobaras",
      title: restobaras.seoTitle,
      description: restobaras.seoDescription,
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Dharma Stay restobaras",
          description: restobaras.seoDescription,
          url: `${SITE_URL}/restobaras`,
          telephone: contact.phones[0].replace(/\s/g, ""),
          address: {
            "@type": "PostalAddress",
            streetAddress: "Birutės g. 1",
            addressLocality: "Telšiai",
            postalCode: "87130",
            addressCountry: "LT",
          },
          servesCuisine: "Lietuviška",
          priceRange: "€€",
        }),
      },
    ],
  }),
  component: RestobarPage,
});

function RestobarPage() {
  return (
    <>
      <PageHero
        eyebrow={restobaras.eyebrow}
        title={restobaras.title}
        lead={restobaras.lead}
        crumbs={[{ label: "Pagrindinis", to: "/" }, { label: restobaras.title }]}
      />
      <PageSection>
        <Reveal className="mx-auto max-w-3xl">
          <Prose>
            {restobaras.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Reveal>
        <Reveal className="mx-auto mt-16 max-w-3xl" delay={80}>
          <ContactCta title="Rezervuoti staliuką" text={restobaras.lead} />
        </Reveal>
      </PageSection>
    </>
  );
}