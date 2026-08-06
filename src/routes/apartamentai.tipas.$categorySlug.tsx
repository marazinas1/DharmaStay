import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { Suspense } from "react";

import { PropertyError, PropertyGrid, PropertyGridSkeleton } from "@/components/stay/PropertyGrid";
import { StaysShell } from "@/components/stay/StaysShell";
import { apartamentai } from "@/content/lt/apartamentai";
import {
  categoryLabel,
  codeForSlug,
  filterByCategory,
} from "@/lib/property-category";
import { propertiesQuery } from "@/lib/property-queries";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apartamentai/tipas/$categorySlug")({
  loader: async ({ context, params }) => {
    const properties = await context.queryClient.ensureQueryData(propertiesQuery);
    const code = codeForSlug(properties, params.categorySlug);
    if (!code) throw notFound();
    return { code, label: categoryLabel(code) };
  },
  head: ({ params, loaderData }) => {
    const label = loaderData?.label ?? apartamentai.title;
    const path = `/apartamentai/tipas/${params.categorySlug}`;
    return {
      ...pageHead({
        path,
        title: apartamentai.filteredSeoTitle(label),
        description: apartamentai.filteredSeoDescription(label),
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "Pagrindinis", path: "/" },
              { name: apartamentai.title, path: "/apartamentai" },
              { name: label, path },
            ]),
          ),
        },
      ],
    };
  },
  component: CategoryPage,
  errorComponent: CategoryPageError,
  notFoundComponent: CategoryPageError,
});

function CategoryPage() {
  const { code, label } = Route.useLoaderData();
  return (
    <StaysShell categoryLabelText={label}>
      <Suspense fallback={<PropertyGridSkeleton />}>
        <CategoryList code={code} />
      </Suspense>
    </StaysShell>
  );
}

function CategoryList({ code }: { code: string }) {
  const { data } = useSuspenseQuery(propertiesQuery);
  return <PropertyGrid properties={filterByCategory(data, code)} />;
}

function CategoryPageError() {
  const router = useRouter();
  return (
    <StaysShell>
      <PropertyError onRetry={() => void router.invalidate()} />
    </StaysShell>
  );
}