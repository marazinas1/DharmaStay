import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { EnsoDivider } from "@/components/site/Enso";
import { PageHero } from "@/components/site/PageHero";
import { PageSection, Prose } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { apie } from "@/content/lt/apie";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apie/")({
  head: () => ({
    ...pageHead({ path: "/apie", title: apie.seoTitle, description: apie.seoDescription }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "Pagrindinis", path: "/" },
            { name: apie.title, path: "/apie" },
          ]),
        ),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero eyebrow={apie.eyebrow} title={apie.title} lead={apie.lead} />

      <PageSection>
        <div className="mx-auto max-w-3xl space-y-14 text-center">
          {apie.sections.map((section, index) => (
            <Reveal key={section.title} delay={index * 80}>
              <h2 className="font-display text-[clamp(1.6rem,3.2vw,2rem)] font-medium text-ink">
                {section.title}
              </h2>
              <Prose className="mt-5">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Prose>
            </Reveal>
          ))}
        </div>

        <EnsoDivider className="my-16" />

        <Reveal>
          <Link
            to="/apie/taisykles"
            className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-linen p-8 transition-shadow hover:shadow-soft"
          >
            <span>
              <span className="block font-display text-xl font-semibold text-ink">
                {apie.rulesLinkTitle}
              </span>
              <span className="mt-2 block text-sm text-stone">{apie.rulesLinkText}</span>
            </span>
            <ArrowRight className="arrow-nudge h-5 w-5 text-sage" aria-hidden />
          </Link>
        </Reveal>
      </PageSection>
    </>
  );
}