import { Link, createFileRoute } from "@tanstack/react-router";

import { EnsoDivider } from "@/components/site/Enso";
import { PageHero } from "@/components/site/PageHero";
import { PageSection, Prose } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { sauna } from "@/content/lt/sauna";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/sauna")({
  head: () =>
    pageHead({ path: "/sauna", title: sauna.seoTitle, description: sauna.seoDescription }),
  component: SaunaPage,
});

function SaunaPage() {
  return (
    <>
      <PageHero
        eyebrow={sauna.eyebrow}
        title={sauna.title}
        lead={sauna.lead}
        crumbs={[{ label: "Pagrindinis", to: "/" }, { label: sauna.eyebrow }]}
      />
      <PageSection>
        <Reveal className="mx-auto max-w-2xl text-center">
          <Prose>
            {sauna.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
          <EnsoDivider className="my-12" />
          <Link
            to="/namelis"
            className="inline-flex rounded-full border border-sage px-6 py-3 text-sm font-medium text-sage transition-colors hover:bg-sage hover:text-warm-white"
          >
            Namelis su pirtimi ir kubilu
          </Link>
        </Reveal>
      </PageSection>
    </>
  );
}