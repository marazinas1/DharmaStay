import cottageImage from "@/assets/stay-cottage.jpg";
import cottageImageWebp from "@/assets/stay-cottage.webp";
import standardImage from "@/assets/stay-standard.jpg";
import standardImageWebp from "@/assets/stay-standard.webp";
import terraceImage from "@/assets/stay-terrace.jpg";
import terraceImageWebp from "@/assets/stay-terrace.webp";
import { stayCopy, type StayCopy } from "@/content/lt/stays";

export type StayId = "standard" | "terrace" | "cottage";
export type StayHref = "/apartamentai/standartiniai" | "/apartamentai/su-terasa" | "/namelis";

/**
 * Language-neutral stay data (ids, prices, images, routes) merged with the
 * Lithuanian copy from `src/content/lt/stays.ts`. Swap the copy module for a
 * locale-aware lookup when translations land.
 */
export type Stay = StayCopy & {
  id: StayId;
  priceFrom: number;
  image: string;
  imageWebp: string;
  href: StayHref;
};

const stayData: Array<{
  id: StayId;
  priceFrom: number;
  image: string;
  imageWebp: string;
  href: StayHref;
}> = [
  {
    id: "standard",
    priceFrom: 40,
    image: standardImage,
    imageWebp: standardImageWebp,
    href: "/apartamentai/standartiniai",
  },
  {
    id: "terrace",
    priceFrom: 40,
    image: terraceImage,
    imageWebp: terraceImageWebp,
    href: "/apartamentai/su-terasa",
  },
  {
    id: "cottage",
    priceFrom: 40,
    image: cottageImage,
    imageWebp: cottageImageWebp,
    href: "/namelis",
  },
];

/** Placeholder data. Replaced by the booking engine (core) API in a later phase. */
export const stays: Stay[] = stayData.map((stay) => ({ ...stay, ...stayCopy[stay.id] }));

export function getStay(id: StayId): Stay {
  const stay = stays.find((item) => item.id === id);
  if (!stay) throw new Error(`Unknown stay: ${id}`);
  return stay;
}

export const contact = {
  address: "Birutės g. 1, Telšiai 87130",
  phones: ["+370 659 11 929", "+370 604 98 915"],
  email: "info@dharmastay.lt",
  mapUrl: "https://maps.google.com/?q=Birut%C4%97s+g.+1,+Tel%C5%A1iai",
};