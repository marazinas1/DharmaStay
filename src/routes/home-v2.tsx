import { createFileRoute } from "@tanstack/react-router";

import { homeV2Route } from "@/pages/home-v2";

export const Route = createFileRoute("/home-v2")(homeV2Route("lt") as never);
