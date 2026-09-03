# Home Page V2 — "Boutique zen hero" + laisvų kambarių puslapis

Tikslas: kuo trumpesnė kelionė iki rezervacijos. Paieška — iš karto hero'e, be scrollinimo; užpildžius — atskiras rezultatų puslapis su nuotraukomis ir kainomis, kaip sinchronas.lt.

## 1. Naujas hero su paieška (Home V2)

Pagal pasirinktą kryptį (v1):
- Centruotas turinys: enso ženklas, eyebrow, didelė Cormorant antraštė.
- Po antrašte — šviesi (#FCFAF6) paieškos kortelė per visą plotį (max-w-5xl), su šešėliu, persidengianti su hero apačia.
- Laukai: **Datos** (vienas laukas, vienas kalendorius), **Svečiai**, **Ieškoti** mygtukas.

### Vienas kalendorius datoms
- Vienas `range` režimo kalendorius popover'e su 2 rodomais mėnesiais; pirmas spustelėjimas = atvykimas, antras = išvykimas. Techniškai neįmanoma pasirinkti išvykimo anksčiau nei atvykimas.
- Praeities dienos išjungtos; rodomas naktų skaičius; „Išvalyti“ nuoroda.
- Lauke rodoma „16 rugs — 20 rugs · 4 naktys“ (EN atveju `enGB`).

### Svečiai (išplėsta)
Popover su +/− skaitikliais:
- Suaugę (min 1)
- Vaikai (2–12 m.)
- Kūdikiai (iki 2 m.)
Lauke suvestinė: „2 suaugę · 1 vaikas“. Vaikai/kūdikiai perduodami toliau URL parametrais; užklausai į variklį paieškos etape naudojamas suaugusiųjų + vaikų skaičius (kūdikiai neskaičiuojami į vietas) — jei variklis vėliau palaikys atskirus laukus, prijungsime be UI keitimų.

## 2. Rezultatų puslapis `/laisvi-kambariai` (EN: `/en/laisvi-kambariai`)

Paspaudus „Ieškoti“ — navigacija į naują puslapį su `?nuo=&iki=&suauge=&vaikai=&kudikiai=`.

- Viršuje — kompaktiška ta pati paieškos juosta (datas/svečius galima keisti vietoje, rezultatai persikrauna).
- Rezultatai — **plokščias kambarių sąrašas be tipo pasirinkimo tarpinio žingsnio**: kiekvienas laisvas apartamentas/kambarys = viena kortelė.
- Kortelė: didelė nuotrauka (paspaudus atsidaro galerijos lightbox), pavadinimas, trumpas aprašas, 3–4 patogumai, kaina visam laikotarpiui + „nuo X € / naktis“, mygtukas **Rezervuoti** → tiesiai į rezervacijos langą su jau užpildytomis datomis ir svečiais.
- Būsenos: kraunama (skeleton kortelės), tuščia („Šiomis dienomis laisvų numerių nėra“ + siūlymas keisti datas), klaida su „Bandyti dar kartą“.

## 3. Likusi pradžios puslapio struktūra

Palieku turinį, bet supaprastinu srautą:
- Hero su paieška → trumpas intro → kambarių/tipų kortelės (kaip dabar) → vieta → papildomos paslaugos → įvertinimai → CTA juosta.
- Pašalinu dabartinę `AvailabilityBand` sekciją (jos funkciją perima hero) — vietoj dviejų paieškų lieka viena.

## Techninės detalės

- Nauji komponentai: `src/components/search/SearchBar.tsx` (datos + svečiai + CTA, `variant="hero" | "compact"`), `DateRangeField.tsx`, `GuestsField.tsx`.
- `Hero.tsx` perdaromas pagal v1 kompoziciją; Ken Burns / parallax paliekamas.
- Naujas puslapis `src/pages/laisvi-kambariai.tsx` + maršrutai `src/routes/laisvi-kambariai.tsx` ir `src/routes/en/laisvi-kambariai.tsx`, `validateSearch` datoms/svečiams, `head()` su unikaliu title/description ir `noindex` (paieškos rezultatai).
- Duomenys — esamas `availabilityQuery` / `getAvailability`; grupes išskleidžiu į vienetų sąrašą, kainos per esamą `formatPrice`. Jokių backend'o pakeitimų.
- Tekstai — į `src/content/lt` ir `src/content/en` (`search`, `results` blokai), be hardcodintų eilučių.
- Spalvos/šriftai — esami dizaino tokenai (smėlio akcentas CTA mygtukui, žalsvas — antriniams veiksmams), be naujų hex reikšmių komponentuose.
- Mobile-first: hero paieška virsta vertikaliu bloku, kalendorius — 1 mėnuo.

## Ko šiame etape nedarau

- Nekeičiu rezervacijos lango vidaus logikos ir mokėjimų.
- Nekuriu naujų nuotraukų — naudoju esamas objektų nuotraukas iš variklio.
