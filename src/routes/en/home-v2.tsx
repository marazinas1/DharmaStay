import { createFileRoute } from "@tanstack/react-router";

import { homeV2Route } from "@/pages/home-v2";

export const Route = createFileRoute("/en/home-v2")(homeV2Route("en") as never);
