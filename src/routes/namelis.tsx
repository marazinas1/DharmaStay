import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy static stay URL — properties are dynamic now. 301 to the listing. */
export const Route = createFileRoute("/namelis")({
  beforeLoad: () => {
    throw redirect({ to: "/apartamentai", statusCode: 301 });
  },
});
