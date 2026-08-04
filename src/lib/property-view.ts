import { common } from "@/content/lt/common";
import type { Property } from "@/lib/rentivo-schemas";

/**
 * Maps an API property onto the shape our cards render.
 * The API owns data; `src/content/lt` owns every word around it.
 */
export type PropertyView = {
  id: string;
  name: string;
  description: string;
  meta: string;
  priceFrom: number | null;
  image: string | null;
  imageAlt: string;
  amenities: string[];
};

const amenityLabels: Record<string, string> = {
  wifi: "Belaidis internetas",
  parking: "Nemokama automobilių stovėjimo vieta",
  kitchen: "Virtuvė",
  tv: "Televizorius",
  sauna: "Pirtis",
  hot_tub: "Kubilas",
  terrace: "Terasa",
  air_conditioning: "Oro kondicionierius",
  washing_machine: "Skalbimo mašina",
  coffee: "Kavos aparatas",
  breakfast: "Pusryčiai",
  pets: "Su augintiniais",
  balcony: "Balkonas",
  bathroom: "Vonios kambarys",
  workspace: "Darbo vieta",
};

export function amenityLabel(code: string): string {
  return amenityLabels[code] ?? code.replace(/[_-]+/g, " ");
}

export function propertyMeta(property: Property): string {
  const parts: string[] = [];
  if (property.area_m2) parts.push(`${property.area_m2} m²`);
  if (property.max_guests) parts.push(`${common.labels.upTo} ${property.max_guests} ${common.labels.guestsLower}`);
  if (property.beds) parts.push(`${property.beds} ${common.labels.bedsLower}`);
  if (property.city) parts.push(property.city);
  return parts.join(" · ");
}

export function toPropertyView(property: Property): PropertyView {
  return {
    id: property.id,
    name: property.name,
    description: property.description ?? "",
    meta: propertyMeta(property),
    priceFrom: typeof property.price_per_night === "number" ? property.price_per_night : null,
    image: property.cover_image_url ?? property.image_urls[0] ?? null,
    imageAlt: `${property.name} — ${common.brand}`,
    amenities: property.amenities.map(amenityLabel),
  };
}

export function formatPrice(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(2).replace(".", ",");
}