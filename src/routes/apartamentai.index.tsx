import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Suspense } from "react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import {
  PropertyError,
  PropertyGrid,
  PropertyGridSkeleton,
} from "@/components/stay/PropertyGrid";
import { apartamentai } from "@/content/lt/apartamentai";
import { propertiesQuery } from "@/lib/property-queries";
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
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(propertiesQuery);
  },
  component: StaysIndexPage,
  errorComponent: StaysIndexError,
});

function StaysShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHero
        eyebrow={apartamentai.eyebrow}
        title={apartamentai.title}
        lead={apartamentai.lead}
        crumbs={[{ label: "Pagrindinis", to: "/" }, { label: apartamentai.title }]}
      />
      <section id="apartamentai" className="-mt-8 scroll-mt-24 bg-linen px-6 pb-24 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-7xl">{children}</div>
      </section>
      <div className="bg-linen px-6 pb-24 lg:px-12 lg:pb-32">
        <Reveal className="mx-auto max-w-7xl">
          <p className="text-sm text-stone">{apartamentai.note}</p>
        </Reveal>
      </div>
    </>
  );
}

function StaysIndexPage() {
  return (
    <StaysShell>
      <Suspense fallback={<PropertyGridSkeleton />}>
        <PropertyList />
      </Suspense>
    </StaysShell>
  );
}

function PropertyList() {
  const { data } = useSuspenseQuery(propertiesQuery);
  return <PropertyGrid properties={data} />;
}

function StaysIndexError() {
  const router = useRouter();
  return (
    <StaysShell>
      <PropertyError onRetry={() => void router.invalidate()} />
    </StaysShell>
  );
}
