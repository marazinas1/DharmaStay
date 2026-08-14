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
  parking: "Automobilių stovėjimo vieta",
  kitchen: "Virtuvėlė",
  tv: "Televizorius",
  sauna: "Sauna",
  hot_tub: "Kubilas",
  terrace: "Terasa",
  air_conditioning: "Oro kondicionierius",
  washing_machine: "Skalbimo mašina",
  coffee: "Kavos aparatas",
  coffee_machine: "Kavos aparatas",
  breakfast: "Pusryčiai",
  pets: "Su augintiniais",
  pet_friendly: "Su augintiniais",
  pool: "Baseinas",
  first_aid: "Pirmosios pagalbos rinkinys",
  extra_baby_bed: "Papildoma vaikiška lovytė",
  balcony: "Balkonas",
  bathroom: "Vonios kambarys",
  workspace: "Darbo vieta",
  smoke_alarm: "Dūmų detektorius",
  "smoke alarm": "Dūmų detektorius",
  heating: "Šildymas",
  hair_dryer: "Plaukų džiovintuvas",
  shower: "Dušas",
  fridge: "Šaldytuvas",
  microwave: "Mikrobangų krosnelė",
  iron: "Lygintuvas",
  towels: "Rankšluosčiai",
  linens: "Patalynė",
  elevator: "Liftas",
  garden: "Sodas",
  bbq: "Kepsninė",
};

/** Known amenity label, or null when the engine sends a code we can't translate. */
export function amenityLabel(code: string): string | null {
  const key = code.trim().toLowerCase();
  return amenityLabels[key] ?? null;
}

/** Labels for display: unknown codes are dropped, never rendered raw. */
export function knownAmenities(codes: string[]): string[] {
  return codes.map(amenityLabel).filter((label): label is string => label !== null);
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
    amenities: knownAmenities(property.amenities),
  };
}

export function formatPrice(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(2).replace(".", ",");
}