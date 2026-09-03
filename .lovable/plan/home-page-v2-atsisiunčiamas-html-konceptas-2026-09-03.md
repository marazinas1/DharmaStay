# Home Page V2 — atsisiunčiamas HTML konceptas

Šiame žingsnyje **projekto kodo nekeičiu**. Vienintelis rezultatas — vienas savarankiškas HTML failas, kurį galėsite atsisiųsti ir atsidaryti naršyklėje.

## Ką gausite

`dharma-home-v2.html` — vienas failas (be jokių papildomų priedų), pagal pasirinktą kryptį v1 „Boutique zen hero“:

1. **Hero su paieška iš karto** — enso ženklas, didelė Cormorant antraštė, po ja šviesi paieškos juosta (persidengia su hero apačia), Ken Burns nuotraukos efektas.
2. **Vienas kalendorius datoms** — vienas `range` kalendorius (2 mėnesiai darbalaukyje, 1 mobiliajame): pirmas paspaudimas = atvykimas, antras = išvykimas. Išvykimo anksčiau nei atvykimo pasirinkti neįmanoma. Praeities ir užimtos dienos perbrauktos ir neaktyvios, rodomas naktų skaičius, yra „Išvalyti“.
3. **Svečiai** — popover su +/− skaitikliais: Suaugę (min. 1), Vaikai (2–12 m.), Kūdikiai (iki 2 m.); suvestinė lauke.
4. **Rezultatai tame pačiame faile** — paspaudus „Ieškoti“ atsidaro laisvų numerių sąrašas (imituoja atskirą `/laisvi-kambariai` puslapį): plokščias sąrašas be tipo pasirinkimo žingsnio, kortelė su didele nuotrauka (paspaudus — lightbox), pavadinimu, aprašu, patogumais, kaina visam laikotarpiui + kaina už naktį ir „Rezervuoti“ mygtuku.
5. **Likusios sekcijos** — trumpas „Kur apsistoti“ blokas, papildomos paslaugos, CTA juosta, footer.

Spalvos ir šriftai — Dharma paletė (#F7F4EF, #FCFAF6, #2B2A26, #6B665D, #5A6B5D, #3E4A40, #C9A88A), Cormorant Garamond + Inter. Tekstai lietuviški.

## Techninės detalės

- Vienas `.html` failas: Tailwind per CDN, Google Fonts, grynas JS (be karkasų) — veikia dukart spustelėjus failą.
- Nuotraukos ir kainos konceptui — demo (placeholder) duomenys; užimtos dienos taip pat demo.
- Failas atsiranda dokumentuose ir yra atsisiunčiamas iš pokalbio.

## Ko šiame etape nedarau

- Nekeičiu nė vieno projekto failo (`src/**` lieka kaip yra).
- Nejungiu prie rezervacijų variklio ir nekuriu naujų maršrutų — tai atskiras kitas žingsnis, kai koncepcija patiks.
