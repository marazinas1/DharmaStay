# Bendras užimtumo kalendorius home page'e

Prieš „Trys būdai pabūti Telšiuose" atsiranda datų juosta: pasirenki atvykimo/išvykimo datas ir iškart matai, kiek kiekvieno tipo objektų laisva ir kiek tiksliai kainuos tas laikotarpis.

## Ką mato lankytojas

```text
┌──────────────────────────────────────────────┐
│  Pasitikrinkite laisvas datas                │
│  [ Atvykimas ]  [ Išvykimas ]  [ Svečiai ]   │
├──────────────────────────────────────────────┤
│  Standartiniai      Su terasa      Namelis   │
│  3 laisvi           1 laisvas      Nėra      │
│  nuo 180 € / 3 n.   240 € / 3 n.   —         │
└──────────────────────────────────────────────┘
```

- Be pasirinktų datų juosta rodo kalendorių ir kvietimą pasirinkti datas; žemiau esančios trys tipų kortelės lieka kaip dabar.
- Pasirinkus datas kiekviena tipo kortelė gauna: laisvų variantų skaičių, tikslią to laikotarpio kainą „nuo" ir būseną „Nėra laisvų" (pilka, neaktyvi).
- Paspaudus laisvą tipą – pereinama į to tipo puslapį (`/apartamentai/tipas/…`) su datomis URL'e, kad sąraše iškart matytųsi tik laisvi kambariai.
- Klaidos/tuščios būsenos: jei API neatsako, juosta rodo ramų pranešimą ir mygtuką „Bandyti dar kartą"; puslapis nenukenčia.

## Kaip veikia duomenys

Naujas serverio veiksmas `getAvailability({ date_from, date_to, adults })`:

1. Paima visų objektų sąrašą (`/properties`, jau kešuojamas).
2. Lygiagrečiai užklausia kiekvieno objekto `/properties/:id` ir iš `occupied` intervalų atmeta tuos, kurie kertasi su pasirinktu laikotarpiu.
3. Likusiems laisviems objektams lygiagrečiai kviečia `POST /quote` ir paima tikslią `total` kainą.
4. Grąžina suvestinę pagal `property_type`: `{ code, freeCount, totalCount, priceFrom, currency }`.

Kadangi objektų ~17, žingsniai 2–3 vykdomi partijomis (po ~6 vienu metu) su bendru laiko limitu; jei atskiro objekto quote nepavyksta, jis vis tiek laikomas laisvu, tik be kainos. Rezultatas kešuojamas TanStack Query pagal datas (60 s), tad datų perjungimas pirmyn-atgal naujų kvietimų nedaro.

## Techninės detalės

Nauji failai:
- `src/lib/availability.server.ts` – suvestinės skaičiavimas (persidengimo tikrinimas, partijos, quote agregacija).
- `src/lib/availability-schemas.ts` – zod įvestis/išvestis, tipai (client-safe).
- `src/lib/availability-queries.ts` – `availabilityQuery(dateFrom, dateTo, adults)` query options.
- `src/components/home/AvailabilityBand.tsx` – juosta: `range` kalendorius (esamas `Calendar`), svečių pasirinkimas, tipų suvestinės kortelės, loading/klaidos būsenos.

Keičiami:
- `src/lib/rentivo.functions.ts` – pridedamas `getAvailability` server fn (plonas wrapper, `await import` viduje).
- `src/routes/index.tsx` – `<AvailabilityBand />` prieš `<StaysSection />`.
- `src/content/lt/common.ts` – nauji LT tekstai (`availabilityBand`: antraštė, „laisvi/laisvų", „Nėra laisvų", „Ieškoti", klaidos).
- `src/routes/apartamentai.tipas.$categorySlug.tsx` – priima `?nuo=&iki=` paieškos parametrus ir, kai jie yra, sąraše rodo tik laisvus kambarius.

Vizualiai juosta naudoja esamą kalendoriaus stilių ir linen/sage paletę, kad susilietų su `BookingBand` ir `AvailabilityCalendar` objektų puslapiuose. Suvestinė kraunama tik pasirinkus datas, tad pirmo įkėlimo greitis nenukenčia.