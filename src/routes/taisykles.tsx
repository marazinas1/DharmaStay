import { createFileRoute } from "@tanstack/react-router";

import { LegalDocumentPage } from "@/components/site/LegalDocument";
import { legal } from "@/content/lt/legal";
import type { LegalDocument } from "@/lib/rentivo-schemas";
import { getLegal } from "@/lib/rentivo.functions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/taisykles")({
  loader: async (): Promise<{ doc: LegalDocument | null }> => {
    try {
      return { doc: await getLegal({ data: { kind: "rental", language: "lt" } }) };
    } catch {
      return { doc: null };
    }
  },
  head: () => ({
    ...pageHead({
      path: legal.rental.path,
      title: legal.rental.seoTitle,
      description: legal.rental.seoDescription,
      type: "article",
    }),
  }),
  component: RentalTermsPage,
});

function RentalTermsPage() {
  const { doc } = Route.useLoaderData();
  return (
    <LegalDocumentPage
      eyebrow={legal.rental.eyebrow}
      title={doc?.name?.trim() ? doc.name : legal.rental.title}
      lead={legal.rental.lead}
      doc={doc}
    />
  );
}