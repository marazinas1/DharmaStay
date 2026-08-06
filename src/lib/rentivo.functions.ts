import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { availabilityInputSchema } from "@/lib/availability-schemas";
import { bookingInputSchema, quoteInputSchema } from "@/lib/rentivo-schemas";

/**
 * Thin server-function wrappers around the Core (Rentivo) API.
 *
 * Module scope holds only imports and `createServerFn` declarations — the
 * server-only client is dynamically imported inside each handler so the API
 * key path is never reachable from the client bundle.
 */

const idInput = z.object({ id: z.string().uuid() });

export const listProperties = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchProperties } = await import("@/lib/rentivo-api.server");
  return fetchProperties();
});

export const getProperty = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => idInput.parse(data))
  .handler(async ({ data }) => {
    const { fetchProperty } = await import("@/lib/rentivo-api.server");
    return fetchProperty(data.id);
  });

export const getQuote = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => quoteInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { fetchQuote } = await import("@/lib/rentivo-api.server");
    return fetchQuote(data);
  });

export const createBookingFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { createBooking } = await import("@/lib/rentivo-api.server");
    return createBooking(data);
  });

export const getPaymentDetails = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchPaymentDetails } = await import("@/lib/rentivo-api.server");
  return fetchPaymentDetails();
});

export const getAvailability = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => availabilityInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { computeAvailability } = await import("@/lib/availability.server");
    return computeAvailability(data);
  });