import { createFileRoute } from "@tanstack/react-router";

import { StayPage, stayLd } from "@/components/stay/StayPage";
import { getStay } from "@/data/stays";
import { SITE_URL } from "@/data/nav";
import { breadcrumbLd, pageHead } from "@/lib/seo";

const stay = getStay("cottage");
const path = "/namelis";

export const Route = createFileRoute("/namelis")({
  head: () => ({
    ...pageHead({ path, title: stay.seoTitle, description: stay.seoDescription }),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(stayLd(stay, `${SITE_URL}${path}`)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "Pagrindinis", path: "/" },
            { name: stay.name, path },
          ]),
        ),
      },
    ],
  }),
  component: () => (
    <StayPage
      stay={stay}
      crumbs={[{ label: "Pagrindinis", to: "/" }, { label: stay.name }]}
    />
  ),
});