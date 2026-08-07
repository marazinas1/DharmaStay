import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/site/ContactForm";
import { PageHero } from "@/components/site/PageHero";
import { PageSection } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { common } from "@/content/lt/common";
import { kontaktai } from "@/content/lt/kontaktai";
import { SITE_URL } from "@/data/nav";
import { contact } from "@/data/contact";
import { pageHead } from "@/lib/seo";

const LocationMap = lazy(() => import("@/components/home/LocationMap"));

export const Route = createFileRoute("/kontaktai")({
  head: () => ({
    ...pageHead({
      path: "/kontaktai",
      title: kontaktai.seoTitle,
      description: kontaktai.seoDescription,
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          name: "Dharma Stay",
          description: kontaktai.seoDescription,
          url: `${SITE_URL}/kontaktai`,
          email: contact.email,
          telephone: contact.phones.map((phone) => phone.replace(/\s/g, "")),
          address: {
            "@type": "PostalAddress",
            streetAddress: "Birutės g. 1",
            addressLocality: "Telšiai",
            postalCode: "87130",
            addressCountry: "LT",
          },
          priceRange: "€€",
        }),
      },
    ],
  }),
  component: ContactsPage,
});

function MapSkeleton() {
  return <div className="h-full w-full animate-pulse bg-muted" />;
}

function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow={kontaktai.eyebrow}
        title={kontaktai.title}
        lead={kontaktai.lead}
        crumbs={[{ label: "Pagrindinis", to: "/" }, { label: kontaktai.eyebrow }]}
      />

      <PageSection>
        <div className="grid gap-12 sm:grid-cols-3">
          <Reveal>
            <MapPin className="h-5 w-5 text-sage" aria-hidden />
            <h2 className="label-caps mt-4 text-stone/80">{kontaktai.addressLabel}</h2>
            <address className="mt-3 text-base not-italic leading-relaxed text-ink">
              {contact.address}
            </address>
            <p className="mt-2 text-sm text-stone">{kontaktai.cottageNote}</p>
          </Reveal>

          <Reveal delay={80}>
            <Phone className="h-5 w-5 text-sage" aria-hidden />
            <h2 className="label-caps mt-4 text-stone/80">{kontaktai.phonesLabel}</h2>
            <div className="mt-3 space-y-2 text-base text-ink">
              {contact.phones.map((phone) => (
                <p key={phone}>
                  <a className="hover:text-sage" href={`tel:${phone.replace(/\s/g, "")}`}>
                    {phone}
                  </a>
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <Mail className="h-5 w-5 text-sage" aria-hidden />
            <h2 className="label-caps mt-4 text-stone/80">{kontaktai.emailLabel}</h2>
            <p className="mt-3 text-base text-ink">
              <a className="hover:text-sage" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </p>
            <a
              href={contact.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full border border-sage px-6 py-3 text-sm font-medium text-sage transition-colors hover:bg-sage hover:text-warm-white"
            >
              {common.cta.openMap}
            </a>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-16">
          <div className="mx-auto max-w-2xl">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-16">
          <div className="h-[360px] overflow-hidden rounded-2xl shadow-soft [filter:grayscale(1)_contrast(0.95)] lg:h-[500px]">
            <ClientOnly fallback={<MapSkeleton />}>
              <Suspense fallback={<MapSkeleton />}>
                <LocationMap />
              </Suspense>
            </ClientOnly>
          </div>
        </Reveal>
      </PageSection>
    </>
  );
}