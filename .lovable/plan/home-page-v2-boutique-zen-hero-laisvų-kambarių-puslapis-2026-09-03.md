# Home Page V2 — "Boutique zen hero" + laisvų kambarių puslapis

Tikslas: kuo trumpesnė kelionė iki rezervacijos. Paieška — iš karto hero'e, be scrollinimo; užpildžius — atskiras rezultatų puslapis su nuotraukomis ir kainomis.

Svarbu: dabartinis pradžios puslapis lieka nepaliestas. V2 gyvena atskirame kelyje, o meniu atsiranda „Pagrindinis“ išskleidžiamas meniu su „Home 1“ ir „Home 2“.

## 0. Meniu: Home dropdown

- `src/data/nav.ts` gauna naują pirmą įrašą — grupę `Pagrindinis` su punktais:
  - „Home 1“ → `/` (dabartinė versija, nekeičiama)
  - „Home 2“ → `/home-v2` (EN: `/en/home-v2`)
- Etiketės iš `common.nav` (LT/EN), be hardcodintų eilučių. Header'io dropdown mechanika jau egzistuoja (`isGroup`), naujo kodo nereikia.

## 1. Naujas hero su paieška (Home V2)

- Centruotas turinys: enso ženklas, eyebrow, didelė Cormorant antraštė.
- Po antrašte — šviesi paieškos kortelė per visą plotį (max-w-5xl), su šešėliu, persidengianti su hero apačia.
- Laukai: **Datos** (vienas laukas, vienas kalendorius), **Svečiai**, **Ieškoti**.

### Vienas kalendorius datoms
- Vienas `range` režimo kalendorius popover'e, 2 mėnesiai desktop / 1 mobile; pirmas spustelėjimas = atvykimas, antras = išvykimas — išvykimo anksčiau pasirinkti neįmanoma.
- Praeities dienos išjungtos; rodomas naktų skaičius; „Išvalyti“.
- Lauke: „16 rugs — 20 rugs · 4 naktys“ (EN — `enGB`).

### Svečiai
Popover su +/− skaitikliais: Suaugę (min 1), Vaikai (2–12 m.), Kūdikiai (iki 2 m.). Suvestinė lauke. Į variklį paieškos etape siunčiama suaugę + vaikai (kūdikiai neskaičiuojami į vietas); vaikai/kūdikiai keliauja URL parametrais.

## 2. Rezultatų puslapis `/laisvi-kambariai` (EN: `/en/laisvi-kambariai`)

Paspaudus „Ieškoti“ — navigacija su `?nuo=&iki=&suauge=&vaikai=&kudikiai=`.

- Viršuje — kompaktiška ta pati paieškos juosta (datas/svečius galima keisti vietoje).
- **Plokščias kambarių sąrašas be tipo pasirinkimo tarpinio žingsnio**.
- Kortelė: didelė nuotrauka (lightbox galerija), pavadinimas, trumpas aprašas, 3–4 patogumai, kaina visam laikotarpiui + „nuo X € / naktis“, **Rezervuoti** → tiesiai į rezervacijos langą su užpildytomis datomis ir svečiais.
- Būsenos: skeleton, tuščia („Šiomis dienomis laisvų numerių nėra“), klaida su „Bandyti dar kartą“.

## 3. Home V2 puslapio struktūra

Hero su paieška → trumpas intro → kambarių/tipų kortelės → vieta → papildomos paslaugos → įvertinimai → CTA juosta. Be `AvailabilityBand` (jos funkciją perima hero) — lieka viena paieška.

## Techninės detalės

- Nauji komponentai: `src/components/search/SearchBar.tsx` (`variant="hero" | "compact"`), `DateRangeField.tsx`, `GuestsField.tsx`.
- Naujas `src/components/home/HeroV2.tsx` ir `src/pages/home-v2.tsx`; maršrutai `src/routes/home-v2.tsx`, `src/routes/en/home-v2.tsx`. Esamas `Hero.tsx` / `src/pages/home.tsx` nekeičiami.
- Naujas `src/pages/laisvi-kambariai.tsx` + maršrutai LT/EN, `validateSearch` datoms/svečiams, `head()` su unikaliu title/description ir `noindex` (rezultatų puslapis). `home-v2` head — unikalus title/description, `noindex`, kad nekonkuruotų su `/`.
- Duomenys — esamas `availabilityQuery` / `getAvailability`; grupes išskleidžiu į vienetų sąrašą. Jokių backend'o pakeitimų.
- Tekstai — `src/content/lt` ir `src/content/en` (`search`, `results`, nav įrašai).
- Spalvos/šriftai — esami dizaino tokenai, be naujų hex reikšmių.
- Mobile-first: hero paieška virsta vertikaliu bloku, kalendorius — 1 mėnuo.

## Ko šiame etape nedarau

- Nekeičiu dabartinio pradžios puslapio, rezervacijos lango logikos ir mokėjimų.
- Nekuriu naujų nuotraukų — naudoju esamas objektų nuotraukas iš variklio.
