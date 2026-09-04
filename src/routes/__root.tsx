import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BookingProvider } from "@/components/site/BookingDialog";
import { Enso } from "@/components/site/Enso";
import { LocaleLink } from "@/components/site/LocaleLink";
import { useRememberedLocaleRedirect } from "@/components/site/LanguageSwitcher";
import { useContent, useLocale } from "@/content";
import { htmlLang } from "@/lib/locale";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

function NotFoundComponent() {
  const { home } = useContent();
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-linen px-6 py-32">
      <div className="max-w-md text-center">
        <Enso className="mx-auto h-12 w-12 text-sage/70" />
        <p className="label-caps mt-8 text-stone">404</p>
        <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,2.75rem)] font-medium text-ink">
          {home.notFound.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-stone">{home.notFound.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LocaleLink
            to="/"
            className="rounded-md bg-sage px-6 py-3 text-sm font-medium text-warm-white transition-colors hover:bg-sage-deep"
          >
            {home.notFound.home}
          </LocaleLink>
          <LocaleLink
            to="/apartamentai"
            className="rounded-md border border-sage px-6 py-3 text-sm font-medium text-sage transition-colors hover:bg-sage hover:text-warm-white"
          >
            {home.notFound.stays}
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dharma Stay" },
      { name: "description", content: "Boutique apgyvendinimas Telšių senamiestyje." },
      { name: "author", content: "Dharma Stay" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dharma Stay" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const locale = useLocale();
  return (
    <html lang={htmlLang[locale]}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useRememberedLocaleRedirect();

  return (
    <QueryClientProvider client={queryClient}>
      <BookingProvider>
        <SiteHeader />
        <main>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </BookingProvider>
    </QueryClientProvider>
  );
}
