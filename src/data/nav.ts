import type { LinkProps } from "@tanstack/react-router";

import { common } from "@/content/lt/common";

export type RoutePath = LinkProps["to"];
export type NavLink = { label: string; to: RoutePath };
export type NavEntry = NavLink | { label: string; items: NavLink[] };

export const SITE_URL = "https://dharma-stay-boutique.lovable.app";

export const mainNav: NavEntry[] = [
  {
    label: common.nav.about,
    items: [
      { label: common.nav.about, to: "/apie" },
      { label: common.nav.rules, to: "/apie/taisykles" },
    ],
  },
  {
    label: common.nav.stays,
    items: [
      { label: common.nav.standard, to: "/apartamentai/standartiniai" },
      { label: common.nav.terrace, to: "/apartamentai/su-terasa" },
      { label: common.nav.cottage, to: "/namelis" },
      { label: common.cta.allStays, to: "/apartamentai" },
    ],
  },
  { label: common.nav.restobar, to: "/restobaras" },
  { label: common.nav.banquet, to: "/banketine-sale" },
  {
    label: common.nav.more,
    items: [
      { label: common.nav.sauna, to: "/sauna" },
      { label: common.nav.vouchers, to: "/dovanu-kuponai" },
    ],
  },
  { label: common.nav.contacts, to: "/kontaktai" },
];

export const footerNav: NavLink[] = [
  { label: common.nav.about, to: "/apie" },
  { label: common.nav.stays, to: "/apartamentai" },
  { label: common.nav.cottage, to: "/namelis" },
  { label: common.nav.restobar, to: "/restobaras" },
  { label: common.nav.banquet, to: "/banketine-sale" },
  { label: common.nav.vouchers, to: "/dovanu-kuponai" },
  { label: common.nav.rules, to: "/apie/taisykles" },
  { label: common.nav.contacts, to: "/kontaktai" },
];