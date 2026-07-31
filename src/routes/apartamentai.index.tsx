import { createFileRoute } from "@tanstack/react-router";

import { StaysSection } from "@/components/home/StaysSection";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { apartamentai } from "@/content/lt/apartamentai";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apartamentai/")({
  head: () => ({
    ...pageHead({
      path: "/apartamentai",
      title: apartamentai.seoTitle,
      description: apartamentai.seoDescription,
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "Pagrindinis", path: "/" },
            { name: apartamentai.title, path: "/apartamentai" },
          ]),
        ),
      },
    ],
  }),
  component: StaysIndexPage,
});

function StaysIndexPage() {
  return (
    <>
      <PageHero
        eyebrow={apartamentai.eyebrow}
        title={apartamentai.title}
        lead={apartamentai.lead}
        crumbs={[{ label: "Pagrindinis", to: "/" }, { label: apartamentai.title }]}
      />
      <div className="bg-linen pt-20 lg:pt-24">
        <StaysSection headless />
      </div>
      <div className="bg-linen px-6 pb-24 lg:px-12 lg:pb-32">
        <Reveal className="mx-auto max-w-7xl">
          <p className="text-sm text-stone">{apartamentai.note}</p>
        </Reveal>
      </div>
    </>
  );
}