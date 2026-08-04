import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHero } from "@/components/site/PageHero";
import { PageSection } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { common } from "@/content/lt/common";
import { rezervacija } from "@/content/lt/rezervacija";
import { readStoredBooking, type StoredBooking } from "@/lib/booking-storage";
import { formatPrice } from "@/lib/property-view";
import { getPaymentDetails } from "@/lib/rentivo.functions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/rezervacija/patvirtinta")({
  head: () =>
    pageHead({
      path: "/rezervacija/patvirtinta",
      title: rezervacija.seoTitle,
      description: rezervacija.seoDescription,
    }),
  validateSearch: (search: Record<string, unknown>) => ({
    nr: typeof search["nr"] === "string" ? search["nr"] : undefined,
  }),
  component: ConfirmationPage,
});

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("lt-LT", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border/70 py-3 last:border-0">
      <dt className="label-caps text-stone">{label}</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}

function ConfirmationPage() {
  const { nr } = Route.useSearch();
  const [booking, setBooking] = useState<StoredBooking | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (!nr) return;
    setBooking(readStoredBooking(nr));
  }, [nr]);

  const payment = useQuery({
    queryKey: ["payment-details"],
    queryFn: () => getPaymentDetails(),
    staleTime: 10 * 60_000,
    retry: false,
  });

  const currency = booking?.currency === "EUR" ? "€" : (booking?.currency ?? "");

  return (
    <>
      <PageHero
        eyebrow={rezervacija.eyebrow}
        title={rezervacija.title}
        lead={rezervacija.lead}
        crumbs={[{ label: "Pagrindinis", to: "/" }, { label: rezervacija.eyebrow }]}
      />
      <PageSection>
        <Reveal className="mx-auto max-w-2xl space-y-8">
          {nr ? (
            <div className="rounded-2xl border border-border bg-warm-white p-6 text-center sm:p-8">
              <p className="label-caps text-sage">{rezervacija.numberLabel}</p>
              <p className="mt-3 font-display text-3xl font-medium tracking-wide text-ink">{nr}</p>
            </div>
          ) : null}

          {booking ? (
            <div className="rounded-2xl border border-border bg-linen p-6 sm:p-8">
              <h2 className="font-display text-2xl font-medium text-ink">
                {rezervacija.summaryTitle}
              </h2>
              <dl className="mt-4">
                <Row
                  label={rezervacija.dates}
                  value={`${booking.date_from} – ${booking.date_to}`}
                />
                <Row label={rezervacija.nights} value={String(booking.nights)} />
                {booking.guests ? (
                  <Row
                    label={rezervacija.guests}
                    value={`${common.booking.adults}: ${booking.guests.adults} · ${common.booking.children}: ${booking.guests.children} · ${common.booking.infants}: ${booking.guests.infants}`}
                  />
                ) : null}
                {booking.extras?.length ? (
                  <Row
                    label={rezervacija.extras}
                    value={booking.extras.map((extra) => extra.name).join(", ")}
                  />
                ) : null}
                <Row
                  label={rezervacija.total}
                  value={`${formatPrice(booking.total_amount)} ${currency}`}
                />
              </dl>
            </div>
          ) : hydrated && !booking ? (
            <div className="rounded-2xl border border-border bg-linen p-6 sm:p-8">
              <h2 className="font-display text-2xl font-medium text-ink">
                {rezervacija.missingTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone">{rezervacija.missingText}</p>
            </div>
          ) : null}

          <div className="rounded-2xl border border-border bg-warm-white p-6 sm:p-8">
            <h2 className="font-display text-2xl font-medium text-ink">
              {rezervacija.statusTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              {booking?.expires_at
                ? `${rezervacija.statusText} ${formatDateTime(booking.expires_at)}`
                : rezervacija.statusFallback}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-linen p-6 sm:p-8">
            <h2 className="font-display text-2xl font-medium text-ink">
              {rezervacija.paymentTitle}
            </h2>
            {payment.isPending ? (
              <p className="mt-3 text-sm text-stone">{rezervacija.paymentLoading}</p>
            ) : payment.isError || !payment.data ? (
              <p className="mt-3 text-sm text-stone">{rezervacija.paymentError}</p>
            ) : (
              <dl className="mt-4">
                {payment.data.beneficiary_name ? (
                  <Row label={rezervacija.beneficiary} value={payment.data.beneficiary_name} />
                ) : null}
                {payment.data.iban ? <Row label={rezervacija.iban} value={payment.data.iban} /> : null}
                {payment.data.bank_name ? (
                  <Row label={rezervacija.bank} value={payment.data.bank_name} />
                ) : null}
                {payment.data.currency ? (
                  <Row label={rezervacija.currency} value={payment.data.currency} />
                ) : null}
                {nr ? <Row label={rezervacija.reference} value={nr} /> : null}
              </dl>
            )}
          </div>

          <p className="text-sm leading-relaxed text-stone">{rezervacija.emailNote}</p>
          <p className="text-sm leading-relaxed text-stone">{rezervacija.contactNote}</p>

          <Link
            to="/"
            className="inline-flex rounded-full bg-sage px-6 py-3 text-sm font-medium text-warm-white"
          >
            {rezervacija.back}
          </Link>
        </Reveal>
      </PageSection>
    </>
  );
}
