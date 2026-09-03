# Rezervacijos lange – toks pat užimtumo kalendorius

Dabar paspaudus „Rezervuoti" ant kortelės atsidaro langas su dviem paprastais `dd/mm/yyyy` laukais, kuriuose galima įvesti bet kokias datas – net užimtas. Objekto puslapyje („Plačiau") rodomas normalus kalendorius su perbrauktomis užimtomis dienomis. Rezervacijos langas gaus tokį patį kalendorių.

## Ką matys svečias

- Rezervacijos lange vietoje dviejų datų laukų – tas pats mėnesio kalendorius kaip objekto puslapyje.
- Užimtos dienos pilkos/perbrauktos ir nepaspaudžiamos; praeities dienos taip pat išjungtos.
- Pasirenkamas intervalas (atvykimas → išvykimas); po kalendoriumi lieka „Atvykimas / Išvykimas" datų santrauka, naktų skaičius ir mygtukas datoms išvalyti.
- Kol kraunamas objekto užimtumas – trumpas „Tikriname laisvas datas" pranešimas; jei nepavyksta gauti – kalendorius vis tiek veikia (be užimtų žymų), rezervacijos negalima sugadinti.
- Jei svečias atėjo su jau pasirinktomis datomis (iš pagrindinio puslapio juostos), jos iškart pažymėtos kalendoriuje.
- Kai objektas dar nepasirinktas (langas atidarytas iš viršutinio mygtuko), kalendorius rodomas be užimtumo, o pasirinkus objektą užimtos dienos iškart atsinaujina.

## Techninės detalės

- `src/components/site/BookingDialog.tsx`: `checkin`/`checkout` string būsena pakeičiama į `DateRange` (arba lieka stringai, o kalendorius juos konvertuoja per esamas `parseApiDate` / `toApiDate` iš `@/components/stay/AvailabilityCalendar`). Quote/booking užklausos ir toliau siunčia `date_from`/`date_to` YYYY-MM-DD formatu – logika nekeičiama.
- Naujas plonas komponentas (pvz. `src/components/site/BookingDateRange.tsx`) arba `AvailabilityCalendar` panaudojimas kompaktiškesniu variantu: `mode="range"`, `excludeDisabled`, `min={2}`, `disabled={[{ before: today }, ...occupied]}`, `modifiersClassNames={{ occupied: "day-occupied" }}` – tie patys nustatymai kaip objekto puslapyje, kad elgsena sutaptų.
- Užimtumas imamas nauja TanStack Query užklausa `getProperty({ data: { id: stayId, language: locale } })`, įjungiama tik kai langas atidarytas ir `stayId` yra UUID; `staleTime: 60_000`, tas pats cache kaip objekto puslapyje.
- Naujas LT/EN tekstas `src/content/lt|en/common.ts` (`booking.datesLoading`) – kiti užrašai imami iš esamų `common.stays.*`.
- Vizualiai kalendorius įstatomas į esamą lango tinklelį, mobiliame – vienas mėnuo per visą plotį.
