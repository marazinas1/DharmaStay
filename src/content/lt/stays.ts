export type StayCopy = {
  name: string;
  description: string;
  meta: string;
  imageAlt: string;
  eyebrow: string;
  heroLead: string;
  body: string[];
  facts: { size: string; guests: string; address: string };
  amenities: string[];
  seoTitle: string;
  seoDescription: string;
};

export const stayCopy: Record<"standard" | "terrace" | "cottage", StayCopy> = {
  standard: {
    name: "Standartiniai apartamentai",
    description: "Ramūs dviviečiai ir keturviečiai butai senamiesčio širdyje.",
    meta: "18–35 m² · Birutės g. 1",
    imageAlt:
      "Standartinių apartamentų miegamasis su šviesia kapitonuota lovos galvūte ir naktine lempa",
    eyebrow: "Apartamentai",
    heroLead: "Dviviečiai ir keturviečiai butai Birutės gatvėje, žingsnis nuo aikštės.",
    body: [
      "Šviesūs, tylūs kambariai su savo virtuvėle ir vonia – viskas, ko reikia savaitgaliui ar ilgesniam darbo laikotarpiui Telšiuose.",
      "Baldai paprasti ir šilti, patalynė medvilninė, langai žiūri į senamiesčio stogus. Rytą kavą galima išsivirti pas save arba nusileisti į restobarą.",
      "Registracija be laukimo, raktai perduodami asmeniškai. Jei atvykstate vėliau – tiesiog praneškite iš anksto.",
    ],
    facts: { size: "18–35 m²", guests: "2–4 svečiai", address: "Birutės g. 1, Telšiai" },
    amenities: [
      "Virtuvėlė su indais",
      "Atskira vonia su dušu",
      "Nemokamas belaidis internetas",
      "Patalynė ir rankšluosčiai",
      "Savaitinės kainos ilgesniam viešėjimui",
    ],
    seoTitle: "Standartiniai apartamentai Telšiuose — Dharma Stay",
    seoDescription:
      "Dviviečiai ir keturviečiai apartamentai Telšių senamiestyje, 18–35 m², Birutės g. 1. Nuo 40 € parai, rezervacija tiesiogiai.",
  },
  terrace: {
    name: "Apartamentai su terasa",
    description: "Rytinė kava terasoje su vaizdu į miesto aikštę.",
    meta: "Terasa · vaizdas į senamiestį",
    imageAlt:
      "Apartamentai su terasa – erdvus miegamasis su palmių lapų tapetais, veidrodine spinta ir pusryčių stalu",
    eyebrow: "Apartamentai",
    heroLead: "Erdvesni apartamentai su privačia terasa virš senamiesčio.",
    body: [
      "Didžiausias šių apartamentų turtas – terasa. Ryte ten geriama kava, vakare stebimas lėtai gęstantis miestas ir girdimi varpai.",
      "Viduje – erdvus miegamasis, svetainės kampas ir visa reikalinga virtuvė. Interjeras šiltas, be perkrovos, su keliais ryškesniais akcentais.",
      "Tinka porai, kuri nori ilgesnio savaitgalio, arba dviem žmonėms, dirbantiems iš Telšių savaitę.",
    ],
    facts: { size: "nuo 30 m²", guests: "2–4 svečiai", address: "Birutės g. 1, Telšiai" },
    amenities: [
      "Privati terasa su baldais",
      "Vaizdas į senamiestį",
      "Pilnai įrengta virtuvė",
      "Nemokamas belaidis internetas",
      "Patalynė ir rankšluosčiai",
    ],
    seoTitle: "Apartamentai su terasa Telšiuose — Dharma Stay",
    seoDescription:
      "Apartamentai su privačia terasa ir vaizdu į Telšių senamiestį. Nuo 40 € parai, rezervacija tiesiogiai be tarpininkų.",
  },
  cottage: {
    name: "Namelis su pirtimi ir kubilu",
    description: "Atskiras namelis sodo tyloje – vakarui, kuris neskuba.",
    meta: "65 m² · iki 6 svečių · Gražinos g. 1",
    imageAlt:
      "Namelio su pirtimi ir kubilu svetainė su virtuve, valgomojo stalu ir sofomis",
    eyebrow: "Namelis",
    heroLead: "Atskiras 65 m² namelis iki šešių svečių – su pirtimi ir kubilu.",
    body: [
      "Namelis stovi atskirai, savame kieme Gražinos gatvėje. Viena erdvė svetainei, virtuvei ir valgomajam, atskiri miegamieji ir langai į sodą.",
      "Pirtis kūrenama pagal susitarimą (40 €), kubilas paruošiamas vakarui (50 €). Abu užsakomi kartu su nakvyne – pasakykite atvykimo laiką ir viskas bus paruošta.",
      "Dažniausiai čia švenčiami gimtadieniai, susitikimai su draugais ir tylūs dviejų šeimų savaitgaliai.",
    ],
    facts: { size: "65 m²", guests: "iki 6 svečių", address: "Gražinos g. 1, Telšiai" },
    amenities: [
      "Pirtis (40 €)",
      "Lauko kubilas (50 €)",
      "Pilnai įrengta virtuvė",
      "Atskiras kiemas ir terasa",
      "Nemokamas belaidis internetas",
    ],
    seoTitle: "Namelis su pirtimi ir kubilu Telšiuose — Dharma Stay",
    seoDescription:
      "Atskiras 65 m² namelis iki 6 svečių Telšiuose, Gražinos g. 1. Pirtis 40 €, kubilas 50 €, nakvynė nuo 40 €.",
  },
};