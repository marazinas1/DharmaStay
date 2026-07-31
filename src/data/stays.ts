import cottageImage from "@/assets/stay-cottage.jpg";
import cottageImageWebp from "@/assets/stay-cottage.webp";
import standardImage from "@/assets/stay-standard.jpg";
import standardImageWebp from "@/assets/stay-standard.webp";
import terraceImage from "@/assets/stay-terrace.jpg";
import terraceImageWebp from "@/assets/stay-terrace.webp";

export type Stay = {
  id: string;
  name: string;
  description: string;
  meta: string;
  priceFrom: number;
  image: string;
  imageWebp: string;
  imageAlt: string;
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
    imageWebp: standardImageWebp,
    imageAlt:
      "Standartinių apartamentų miegamasis su šviesia kapitonuota lovos galvūte ir naktine lempa",
    href: "/apartamentai/standartiniai",
  },
  {
    id: "terrace",
    name: "Apartamentai su terasa",
    description: "Rytinė kava terasoje su vaizdu į miesto aikštę.",
    meta: "Terasa · vaizdas į senamiestį",
    priceFrom: 40,
    image: terraceImage,
    imageWebp: terraceImageWebp,
    imageAlt:
      "Apartamentai su terasa – erdvus miegamasis su palmių lapų tapetais, veidrodine spinta ir pusryčių stalu",
    href: "/apartamentai/su-terasa",
  },
  {
    id: "cottage",
    name: "Namelis su pirtimi ir kubilu",
    description: "Atskiras namelis sodo tyloje – vakarui, kuris neskuba.",
    meta: "65 m² · iki 6 svečių · Gražinos g. 1",
    priceFrom: 40,
    image: cottageImage,
    imageWebp: cottageImageWebp,
    imageAlt:
      "Namelio su pirtimi ir kubilu svetainė su virtuve, valgomojo stalu ir sofomis",
    href: "/namelis",
  },
];

export const contact = {
  address: "Birutės g. 1, Telšiai 87130",
  phones: ["+370 659 11 929", "+370 604 98 915"],
  email: "info@dharmastay.lt",
  mapUrl: "https://maps.google.com/?q=Birut%C4%97s+g.+1,+Tel%C5%A1iai",
};