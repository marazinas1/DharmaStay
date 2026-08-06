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
import { Link } from "@tanstack/react-router";
import { CategoryGrid } from "@/components/stay/CategoryCard";
import {
  categoryLabel,
  filterByCategory,
  groupByCategory,
  isGrouped,
  normalizeCategory,
  uncategorized,
} from "@/lib/property-category";
import { propertiesQuery } from "@/lib/property-queries";
import { breadcrumbLd, pageHead } from "@/lib/seo";

type StaysSearch = { category?: string };

export const Route = createFileRoute("/apartamentai/")({
  validateSearch: (search: Record<string, unknown>): StaysSearch => {
    const value = search["category"];
    const raw = typeof value === "string" ? normalizeCategory(value) : "";
    return raw ? { category: raw } : {};
  },
  head: ({ match }) => {
    const code = match.search.category;
    const label = code ? categoryLabel(code) : null;
    const path = code ? `/apartamentai?category=${code}` : "/apartamentai";
    return {
      ...pageHead({
        path,
        title: label ? apartamentai.filteredSeoTitle(label) : apartamentai.seoTitle,
        description: label
          ? apartamentai.filteredSeoDescription(label)
          : apartamentai.seoDescription,
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "Pagrindinis", path: "/" },
              { name: apartamentai.title, path: "/apartamentai" },
              ...(label ? [{ name: label, path }] : []),
            ]),
          ),
        },
      ],
    };
  },
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(propertiesQuery);
  },
  component: StaysIndexPage,
  errorComponent: StaysIndexError,
});

function StaysShell({
  children,
  categoryLabelText,
}: {
  children: React.ReactNode;
  categoryLabelText?: string | null;
}) {
  const filtered = Boolean(categoryLabelText);
  return (
    <>
      <PageHero
        eyebrow={filtered ? apartamentai.title : apartamentai.eyebrow}
        title={filtered ? (categoryLabelText as string) : apartamentai.title}
        lead={filtered ? apartamentai.filteredLead(categoryLabelText as string) : apartamentai.lead}
        crumbs={
          filtered
            ? [
                { label: "Pagrindinis", to: "/" },
                { label: apartamentai.title, to: "/apartamentai" },
                { label: categoryLabelText as string },
              ]
            : [{ label: "Pagrindinis", to: "/" }, { label: apartamentai.title }]
        }
      />
      <section id="apartamentai" className="-mt-8 scroll-mt-24 bg-linen px-6 pb-24 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          {filtered ? (
            <div className="mb-8">
              <Link
                to="/apartamentai"
                search={{}}
                className="text-sm font-medium text-sage hover:text-sage-deep"
              >
                ← {apartamentai.clearFilter}
              </Link>
            </div>
          ) : null}
          {children}
        </div>
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
  const { category } = Route.useSearch();
  return (
    <StaysShell categoryLabelText={category ? categoryLabel(category) : null}>
      <Suspense fallback={<PropertyGridSkeleton />}>
        <PropertyList category={category} />
      </Suspense>
    </StaysShell>
  );
}

function PropertyList({ category }: { category: string | undefined }) {
  const { data } = useSuspenseQuery(propertiesQuery);

  // Filtered view: individual rooms of that type.
  if (category) return <PropertyGrid properties={filterByCategory(data, category)} />;

  // Unfiltered view mirrors the home page: one card per accommodation type.
  if (isGrouped(data)) {
    const rest = uncategorized(data);
    return (
      <>
        <CategoryGrid groups={groupByCategory(data)} />
        {rest.length > 0 ? (
          <div className="mt-8">
            <PropertyGrid properties={rest} />
          </div>
        ) : null}
      </>
    );
  }

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
