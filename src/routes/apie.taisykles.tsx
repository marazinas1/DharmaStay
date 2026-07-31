import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { PageSection } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { apie } from "@/content/lt/apie";
import { taisykles } from "@/content/lt/taisykles";
import { SITE_URL } from "@/data/nav";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apie/taisykles")({
  head: () => ({
    ...pageHead({
      path: "/apie/taisykles",
      title: taisykles.seoTitle,
      description: taisykles.seoDescription,
      type: "article",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: taisykles.title,
          description: taisykles.seoDescription,
          url: `${SITE_URL}/apie/taisykles`,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "Pagrindinis", path: "/" },
            { name: apie.title, path: "/apie" },
            { name: taisykles.title, path: "/apie/taisykles" },
          ]),
        ),
      },
    ],
  }),
  component: RulesPage,
});

function RulesPage() {
  return (
    <>
      <PageHero
        eyebrow={taisykles.eyebrow}
        title={taisykles.title}
        lead={taisykles.lead}
        crumbs={[
          { label: "Pagrindinis", to: "/" },
          { label: apie.title, to: "/apie" },
          { label: taisykles.title },
        ]}
      />

      <PageSection>
        <div className="mx-auto grid max-w-4xl gap-12 sm:grid-cols-2">
          {taisykles.groups.map((group, index) => (
            <Reveal key={group.title} delay={index * 80}>
              <h2 className="font-display text-xl font-semibold text-ink">{group.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </PageSection>
    </>
  );
}