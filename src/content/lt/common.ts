/**
 * Shared Lithuanian strings. Plain nested strings only — this whole folder can be
 * serialized to `lt.json` and mirrored as `en.json` / `ru.json` later.
 */
export const common = {
  brand: "Dharma Stay",
  tagline: "Iš namų į namus.",
  cta: {
    book: "Rezervuoti",
    checkDates: "Tikrinti laisvas datas",
    more: "Plačiau",
    openMap: "Atidaryti žemėlapyje",
    contactUs: "Susisiekti",
    allStays: "Visi apartamentai",
  },
  nav: {
    home: "Pagrindinis",
    about: "Apie",
    rules: "Apgyvendinimo taisyklės",
    stays: "Apartamentai",
    standard: "Standartiniai apartamentai",
    terrace: "Apartamentai su terasa",
    cottage: "Namelis su pirtimi ir kubilu",
    restobar: "Restobaras",
    banquet: "Banketinė salė",
    sauna: "Sauna",
    vouchers: "Dovanų kuponai",
    contacts: "Kontaktai",
    more: "Daugiau",
    site: "Svetainė",
  },
  labels: {
    priceFrom: "Nuo",
    size: "Dydis",
    guests: "Svečiai",
    upTo: "iki",
    guestsLower: "svečių",
    bedsLower: "lovos",
    perNight: "nakčiai",
    address: "Adresas",
    amenities: "Patogumai",
    contacts: "Kontaktai",
    otherStays: "Kiti apgyvendinimo variantai",
  },
  stays: {
    loading: "Kraunama…",
    errorTitle: "Nepavyko įkelti apartamentų",
    errorText:
      "Šiuo metu nepavyksta pasiekti rezervacijų sistemos. Pabandykite dar kartą arba susisiekite tiesiogiai.",
    retry: "Bandyti dar kartą",
    emptyTitle: "Šiuo metu laisvų objektų nėra",
    emptyText:
      "Sąrašas netrukus bus atnaujintas. Dėl datų ir galimybių susisiekite su mumis tiesiogiai.",
    priceOnRequest: "Kaina pagal užklausą",
  },
  footer: {
    intro: "Apgyvendinimas Telšių senamiestyje. Iš namų į namus.",
    rights: "Rezervacijos tiesiogiai, be tarpininkų.",
  },
} as const;