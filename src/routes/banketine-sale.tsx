import { createFileRoute } from "@tanstack/react-router";

import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { PageSection, Prose } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { banketineSale } from "@/content/lt/banketineSale";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/banketine-sale")({
  head: () =>
    pageHead({
      path: "/banketine-sale",
      title: banketineSale.seoTitle,
      description: banketineSale.seoDescription,
    }),
  component: BanquetPage,
});

function BanquetPage() {
  return (
    <>
      <PageHero
        eyebrow={banketineSale.eyebrow}
        title={banketineSale.title}
        lead={banketineSale.lead}
        crumbs={[{ label: "Pagrindinis", to: "/" }, { label: banketineSale.title }]}
      />
      <PageSection>
        <Reveal className="mx-auto max-w-3xl">
          <Prose>
            {banketineSale.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Reveal>
        <Reveal className="mx-auto mt-16 max-w-3xl" delay={80}>
          <ContactCta title="Teiraukitės dėl datos" text={banketineSale.lead} />
        </Reveal>
      </PageSection>
    </>
  );
}