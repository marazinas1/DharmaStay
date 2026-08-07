import { createFileRoute } from "@tanstack/react-router";

import { LegalDocumentPage } from "@/components/site/LegalDocument";
import { legal } from "@/content/lt/legal";
import type { LegalDocument } from "@/lib/rentivo-schemas";
import { getLegal } from "@/lib/rentivo.functions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privatumo-politika")({
  loader: async (): Promise<{ doc: LegalDocument | null }> => {
    try {
      return { doc: await getLegal({ data: { kind: "privacy", language: "lt" } }) };
    } catch {
      return { doc: null };
    }
  },
  head: () => ({
    ...pageHead({
      path: legal.privacy.path,
      title: legal.privacy.seoTitle,
      description: legal.privacy.seoDescription,
      type: "article",
    }),
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const { doc } = Route.useLoaderData();
  return (
    <LegalDocumentPage
      eyebrow={legal.privacy.eyebrow}
      title={doc?.name?.trim() ? doc.name : legal.privacy.title}
      lead={legal.privacy.lead}
      doc={doc}
    />
  );
}