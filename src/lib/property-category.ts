import { common } from "@/content/lt/common";
import type { Property } from "@/lib/rentivo-schemas";

/**
 * Category grouping for the home page and the /apartamentai filter.
 * The API exposes `category` per property; until the backend fills it in we
 * degrade to the flat, one-card-per-property listing.
 */
export type CategoryGroup = {
  code: string;
  label: string;
  properties: Property[];
  priceFrom: number | null;
  image: string | null;
  imageAlt: string;
  count: number;
};

const KNOWN_ORDER = ["standard", "terrace", "cottage"] as const;

export function normalizeCategory(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function categoryLabel(code: string): string {
  const key = normalizeCategory(code);
  const known = (common.categories as Record<string, string>)[key];
  if (known) return known;
  const words = key.replace(/[_-]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Lithuanian plural for "variantas" (option). */
export function optionsLabel(count: number): string {
  const last = count % 10;
  const lastTwo = count % 100;
  if (last === 1 && lastTwo !== 11) return `${count} ${common.categoryCard.optionsOne}`;
  if (last === 0 || (lastTwo >= 11 && lastTwo <= 19)) {
    return `${count} ${common.categoryCard.optionsMany}`;
  }
  return `${count} ${common.categoryCard.optionsFew}`;
}

function priceOf(property: Property): number | null {
  return typeof property.price_per_night === "number" ? property.price_per_night : null;
}

function imageOf(property: Property): string | null {
  return property.cover_image_url ?? property.image_urls[0] ?? null;
}

export function distinctCategories(properties: Property[]): string[] {
  const codes = new Set<string>();
  for (const property of properties) {
    const code = normalizeCategory(property.category);
    if (code) codes.add(code);
  }
  return [...codes];
}

/** Grouping activates as soon as the backend categorises at least one property. */
export function isGrouped(properties: Property[]): boolean {
  return distinctCategories(properties).length >= 1;
}

/** Properties the backend hasn't categorised yet — shown after the category cards. */
export function uncategorized(properties: Property[]): Property[] {
  return properties.filter((property) => !normalizeCategory(property.category));
}

export function groupByCategory(properties: Property[]): CategoryGroup[] {
  const buckets = new Map<string, Property[]>();
  for (const property of properties) {
    const code = normalizeCategory(property.category);
    if (!code) continue;
    const bucket = buckets.get(code);
    if (bucket) bucket.push(property);
    else buckets.set(code, [property]);
  }

  const codes = [...buckets.keys()].sort((a, b) => {
    const ai = KNOWN_ORDER.indexOf(a as (typeof KNOWN_ORDER)[number]);
    const bi = KNOWN_ORDER.indexOf(b as (typeof KNOWN_ORDER)[number]);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  return codes.map((code) => {
    const items = buckets.get(code) ?? [];
    const priced = items
      .filter((item) => priceOf(item) !== null)
      .sort((a, b) => (priceOf(a) as number) - (priceOf(b) as number));
    const cheapest = priced[0];
    const label = categoryLabel(code);
    const image =
      (cheapest ? imageOf(cheapest) : null) ??
      items.map(imageOf).find((url): url is string => Boolean(url)) ??
      null;

    return {
      code,
      label,
      properties: items,
      priceFrom: cheapest ? priceOf(cheapest) : null,
      image,
      imageAlt: `${label} — ${common.brand}`,
      count: items.length,
    };
  });
}

/** Filters a list to a category; unknown or unmatched codes return everything. */
export function filterByCategory(properties: Property[], code: string | undefined): Property[] {
  const key = normalizeCategory(code);
  if (!key) return properties;
  const matched = properties.filter((property) => normalizeCategory(property.category) === key);
  return matched.length > 0 ? matched : properties;
}

export function hasCategory(properties: Property[], code: string | undefined): boolean {
  const key = normalizeCategory(code);
  if (!key) return false;
  return properties.some((property) => normalizeCategory(property.category) === key);
}