import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
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
import { availabilityQuery } from "@/lib/availability-queries";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apartamentai/tipas/$categorySlug")({
  validateSearch: (search: Record<string, unknown>) => ({
    ...(typeof search['nuo'] === "string" ? { nuo: search['nuo'] } : {}),
    ...(typeof search['iki'] === "string" ? { iki: search['iki'] } : {}),
    ...(Number.isFinite(Number(search['sveciai'])) && Number(search['sveciai']) >= 1
      ? { sveciai: Number(search['sveciai']) }
      : {}),
  }),
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
  const { nuo, iki, sveciai } = Route.useSearch();
  return (
    <StaysShell categoryLabelText={label}>
      <Suspense fallback={<PropertyGridSkeleton />}>
        <CategoryList
          code={code}
          {...(nuo ? { nuo } : {})}
          {...(iki ? { iki } : {})}
          {...(sveciai ? { sveciai } : {})}
        />
      </Suspense>
    </StaysShell>
  );
}

function CategoryList({
  code,
  nuo,
  iki,
  sveciai = 2,
}: {
  code: string;
  nuo?: string;
  iki?: string;
  sveciai?: number;
}) {
  const { data } = useSuspenseQuery(propertiesQuery);
  const { data: availability } = useQuery(availabilityQuery(nuo, iki, sveciai));
  const inCategory = filterByCategory(data, code);
  const properties =
    nuo && iki && availability
      ? inCategory.filter((property) => availability.free_ids.includes(property.id))
      : inCategory;
  return (
    <PropertyGrid
      properties={properties}
      {...(nuo ? { nuo } : {})}
      {...(iki ? { iki } : {})}
      sveciai={sveciai}
    />
  );
}

function CategoryPageError() {
  const router = useRouter();
  return (
    <StaysShell>
      <PropertyError onRetry={() => void router.invalidate()} />
    </StaysShell>
  );
}