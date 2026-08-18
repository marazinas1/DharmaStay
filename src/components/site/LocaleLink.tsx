import { Link, useNavigate, type LinkProps } from "@tanstack/react-router";
import { type ComponentPropsWithoutRef } from "react";

import { useLocale } from "@/content";
import { localizePath, type Locale } from "@/lib/locale";

type AnchorProps = Omit<ComponentPropsWithoutRef<"a">, "href">;

export type LocaleLinkProps = AnchorProps &
  Omit<LinkProps, "to"> & {
    /** Canonical Lithuanian path, e.g. "/apartamentai/tipas/$categorySlug". */
    to: string;
    locale?: Locale;
  };

/** <Link> that keeps the visitor inside the current locale segment. */
export function LocaleLink({ to, locale, ...rest }: LocaleLinkProps) {
  const current = useLocale();
  const target = localizePath(to, locale ?? current);
  return <Link {...(rest as LinkProps)} to={target as LinkProps["to"]} />;
}

/** Programmatic navigation that stays inside the current locale. */
export function useLocaleNavigate() {
  const navigate = useNavigate();
  const locale = useLocale();
  return (options: Omit<Parameters<typeof navigate>[0], "to"> & { to: string }) =>
    navigate({
      ...options,
      to: localizePath(options.to, locale),
    } as Parameters<typeof navigate>[0]);
}
