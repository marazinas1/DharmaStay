import { createFileRoute } from "@tanstack/react-router";

import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { PageSection, Prose } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { dovanuKuponai } from "@/content/lt/dovanuKuponai";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/dovanu-kuponai")({
  head: () =>
    pageHead({
      path: "/dovanu-kuponai",
      title: dovanuKuponai.seoTitle,
      description: dovanuKuponai.seoDescription,
    }),
  component: VouchersPage,
});

function VouchersPage() {
  return (
    <>
      <PageHero
        eyebrow={dovanuKuponai.eyebrow}
        title={dovanuKuponai.title}
        lead={dovanuKuponai.lead}
        crumbs={[{ label: "Pagrindinis", to: "/" }, { label: dovanuKuponai.eyebrow }]}
      />
      <PageSection>
        <Reveal className="max-w-3xl">
          <Prose>
            {dovanuKuponai.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Reveal>
        <Reveal className="mt-16" delay={80}>
          <ContactCta title={dovanuKuponai.ctaTitle} text={dovanuKuponai.ctaText} />
        </Reveal>
      </PageSection>
    </>
  );
}