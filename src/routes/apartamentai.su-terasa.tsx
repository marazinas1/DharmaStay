import { createFileRoute } from "@tanstack/react-router";

import { StayPage, stayLd } from "@/components/stay/StayPage";
import { apartamentai } from "@/content/lt/apartamentai";
import { getStay } from "@/data/contact";
import { SITE_URL } from "@/data/nav";
import { breadcrumbLd, pageHead } from "@/lib/seo";

const stay = getStay("terrace");
const path = "/apartamentai/su-terasa";

export const Route = createFileRoute("/apartamentai/su-terasa")({
  head: () => ({
    ...pageHead({ path, title: stay.seoTitle, description: stay.seoDescription }),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(stayLd(stay, `${SITE_URL}${path}`)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "Pagrindinis", path: "/" },
            { name: apartamentai.title, path: "/apartamentai" },
            { name: stay.name, path },
          ]),
        ),
      },
    ],
  }),
  component: () => (
    <StayPage
      stay={stay}
      crumbs={[
        { label: "Pagrindinis", to: "/" },
        { label: apartamentai.title, to: "/apartamentai" },
        { label: stay.name },
      ]}
    />
  ),
});