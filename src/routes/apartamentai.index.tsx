import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Suspense } from "react";

import {
  PropertyError,
  PropertyGrid,
  PropertyGridSkeleton,
} from "@/components/stay/PropertyGrid";
import { StaysShell } from "@/components/stay/StaysShell";
import { apartamentai } from "@/content/lt/apartamentai";
import { CategoryGrid } from "@/components/stay/CategoryCard";
import {
  categorySlug,
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
  // Legacy ?category= links keep working — 301 to the clean category path.
  beforeLoad: ({ search }) => {
    if (search.category) {
      throw redirect({
        to: "/apartamentai/tipas/$categorySlug",
        params: { categorySlug: categorySlug(search.category) },
        statusCode: 301,
      });
    }
  },
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
