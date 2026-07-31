import cottageImage from "@/assets/stay-cottage.jpg";
import standardImage from "@/assets/stay-standard.jpg";
import terraceImage from "@/assets/stay-terrace.jpg";

export type Stay = {
  id: string;
  name: string;
  description: string;
  meta: string;
  priceFrom: number;
  image: string;
  href: string;
};

/** Placeholder data. Replaced by the booking engine (core) API in a later phase. */
export const stays: Stay[] = [
  {
    id: "standard",
    name: "Standartiniai apartamentai",
    description: "Ramūs dviviečiai ir keturviečiai butai senamiesčio širdyje.",
    meta: "18–35 m² · Birutės g. 1",
    priceFrom: 40,
    image: standardImage,
    href: "/apartamentai/standartiniai",
  },
  {
    id: "terrace",
    name: "Apartamentai su terasa",
    description: "Rytinė kava terasoje su vaizdu į miesto aikštę.",
    meta: "Terasa · vaizdas į senamiestį",
    priceFrom: 40,
    image: terraceImage,
    href: "/apartamentai/su-terasa",
  },
  {
    id: "cottage",
    name: "Namelis su pirtimi ir kubilu",
    description: "Atskiras namelis sodo tyloje – vakarui, kuris neskuba.",
    meta: "65 m² · iki 6 svečių · Gražinos g. 1",
    priceFrom: 40,
    image: cottageImage,
    href: "/namelis",
  },
];

export const contact = {
  address: "Birutės g. 1, Telšiai 87130",
  phones: ["+370 659 11 929", "+370 604 98 915"],
  email: "info@dharmastay.lt",
  mapUrl: "https://maps.google.com/?q=Birut%C4%97s+g.+1,+Tel%C5%A1iai",
};