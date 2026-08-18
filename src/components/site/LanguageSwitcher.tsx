import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import type { LinkProps } from "@tanstack/react-router";


import { useLocale } from "@/content";
import {
  LOCALES,
  LOCALE_COOKIE,
  isLocale,
  localizePath,
  stripLocale,
  type Locale,
} from "@/lib/locale";
import { cn } from "@/lib/utils";

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

function readLocaleCookie(): Locale | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  const value = match?.[1];
  return isLocale(value) ? value : null;
}

/**
 * Returning visitors who explicitly picked English land on /en.
 * Runs on the client only, so crawlers and first-time visitors always get LT.
 */
export function useRememberedLocaleRedirect() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    if (pathname !== "/") return;
    if (readLocaleCookie() !== "en") return;
    window.location.replace("/en");
  }, [pathname]);
}

export function LanguageSwitcher({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const current = useLocale();
  const location = useRouterState({ select: (state) => state.location });
  const basePath = stripLocale(location.pathname);

  return (
    <div className={cn("flex items-center gap-1 text-xs font-medium", className)} aria-label="Language">
      {LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 ? <span className="opacity-40">/</span> : null}
          <Link
            {...({
              to: localizePath(basePath, locale),
              search: location.search,
              hrefLang: locale,
              "aria-current": locale === current ? "true" : undefined,
              onClick: () => rememberLocale(locale),
              className: cn(
                "uppercase tracking-wide transition-opacity",
                locale === current
                  ? tone === "light"
                    ? "text-warm-white"
                    : "text-sage"
                  : "opacity-60 hover:opacity-100",
              ),
              children: locale,
            } as unknown as LinkProps)}
          />
        </span>
      ))}
    </div>
  );
}
