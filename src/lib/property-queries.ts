import { queryOptions } from "@tanstack/react-query";

import { listProperties } from "@/lib/rentivo.functions";

/** Shared across the home page and /apartamentai — one cache entry, one fetch. */
export const propertiesQuery = queryOptions({
  queryKey: ["properties"],
  queryFn: () => listProperties(),
  staleTime: 60_000,
});

/** Max cards shown on the landing page before we link out to /apartamentai. */
export const HOME_STAYS_LIMIT = 3;
