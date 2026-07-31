import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/apartamentai")({
  component: () => <Outlet />,
});