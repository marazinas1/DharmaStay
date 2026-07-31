# Dharma Stay Boutique

## Prompt 1 - Home page (PLAN MODE)

**Please respond with a plan first. Do not build yet - I'll review and approve the plan before you generate anything.**

You have two documents in the project knowledge: `dharma-stay-lovable-context.md` (full project context and the "why") and `dharma-stay-design-brief.md` (the design system - palette, typography, layout, signature element). Read both and follow the design brief exactly. Everything below builds on them.

### Task
Build the **home / landing page only** for Dharma Stay - a boutique accommodation business in Telšiai, Lithuania. This is the flagship pilot, so the design has to feel top-level boutique: modern, light, calm, intentional. Apartments/accommodation is the primary focus of the page.

This phase is **design and structure only**. The booking engine (our "core") gets connected via API in a later phase. Wherever the booking flow appears, build the UI shell with placeholder/mock data - do not implement real reservation logic yet. But structure every booking entry point so it clearly leads toward an on-site booking flow, never an external redirect to Booking.com.

### Design system (from the brief - apply exactly)
- **Palette:** Linen background `#F7F4EF`, warm white cards `#FCFAF6`, ink text `#2B2A26`, stone secondary `#6B665D`, sage accent `#5A6B5D`, sage deep `#3E4A40`, clay `#C9A88A` (used very sparingly). Sage is the primary accent for CTAs and active states.
- **Type:** Fraunces (display / headings, used sparingly, light weight) + Inter (body, buttons, nav). Both from Google Fonts.
- **Signature element:** a thin circle line (ensō hint) reused as section divider, accent, and icon frame. Subtle, never religious. This is the one memorable brand detail - spend the boldness here, keep everything else quiet.
- Soft rounded corners on cards (12-16px), gentle shadows, generous whitespace and wide margins. Calm and disciplined, not busy.

### Home page structure (top to bottom)
1. **Header / nav** - light, transparent over hero. Logo left, nav center/right (Apartamentai, Namelis, Vieta, Kontaktai), and a primary CTA button "Tikrinti laisvas datas" (Check availability). Nav becomes solid on scroll.
2. **Hero** - large, full-width image (use a terrace/old-town-view or building photo as placeholder - see the context doc for existing image paths). Short calm headline (Fraunces), one supporting sentence, and the primary CTA leading into the booking flow (booking UI shell for now). Keep it airy - lots of breathing room.
3. **Intro strip** - a short 2-3 sentence intro carrying the "iš namų į namus" (from home to home) idea. Use the circle/ensō motif as the section divider here.
4. **Apartments section (MAIN focus)** - three cards: Standard apartments (nuo €40), Apartments with terrace / old-town view (nuo €40), Cottage with sauna & hot tub (nuo €40, up to 6 guests). Each card: photo, name, one-line description, price-from label, and a link toward its own page + a booking entry point. Consistent image crop across cards.
5. **Location / Telšiai** - a section telling the location story (old town heart, Lake Mastis a few steps away, Žemaitija calm). Include space for a map (placeholder is fine for now).
6. **Extras (secondary)** - smaller, quieter presentation of restobar, sauna, hot tub, gift vouchers. Clearly secondary to accommodation.
7. **Social proof** - Booking.com ratings (standard apartments 9.0, terrace 9.3). Keep it tasteful, not loud.
8. **Booking CTA band** - a clear closing call-to-action to check dates / book directly (UI shell).
9. **Footer** - contacts (Birutės g. 1, Telšiai 87130; +370 659 11 929; +370 604 98 915; info@dharmastay.lt), nav, map area, quiet brand mark.

### Copy
Write fresh, short, human copy in **Lithuanian** for the visible page text. Do NOT reuse the old site's copy-paste room descriptions. Keep it calm and confident, matching the boutique tone.

### Technical requirements
- **SSR from day one** so OG/social meta tags render correctly per page. Set up proper page metadata now.
- Responsive, **mobile-first** - most boutique guests browse on phones. Verify the mobile layout is as polished as desktop.
- Accessibility floor: visible keyboard focus states, sensible semantic structure, respect reduced-motion.
- Use existing photos as placeholders (image paths are listed in the context doc). Consistent warm/airy tone.
- Keep animation deliberate and minimal - a subtle hero load and gentle scroll reveals at most. Over-animation reads as generic; restraint reads as boutique.

### What I want in your plan response
1. The page section breakdown as you intend to build it (confirm you'll follow the structure above).
2. Your typography scale and how you'll use Fraunces vs Inter.
3. How you'll implement the circle/ensō signature element concretely (where it appears, how).
4. The component/file structure.
5. How you'll set up SSR + per-page metadata.
6. Any assumptions you're making or decisions you want me to confirm before you build.

Remember: **plan only, no build yet.**





1. # Dharma Stay - Project Context & Brief (Lovable)

**Read this first.** This document sets the full context for the project: who the client is, why we're building this, the architecture, and the design direction. Everything we build should serve the vision described here.

---

## 1. What this project is

We are rebuilding the website for **Dharma Stay** (current site: dharmastay.lt), a boutique accommodation business in Telšiai, Lithuania. They offer serviced apartments, a private cottage with sauna and hot tub, a restobar, and event space in the historic old town near Lake Mastis.

This is **not just a redesign**. It is a full replacement of their current site on two levels:

1. **Design / UX** - the current site (WordPress + Elementor, 2021) is dated and generic. We're building a modern, light, boutique experience worthy of the "boutique hotel" positioning.
2. **Booking engine (the core)** - the current site has no real booking system. Every "Reserve" button redirects the guest to Booking.com. We're replacing that with our own direct-booking engine so guests complete the entire reservation on the Dharma Stay site itself.

Dharma Stay is our **first confirmed client and our flagship pilot**. It is the working showcase we will use to win larger clients. So it must demonstrate the complete solution end to end: top-level design *and* a fully functioning direct-booking flow.

---

## 2. Why we're building this - the core idea

The single most important concept in this project:

> **Guests should be able to book directly on the Dharma Stay website - all the way to a completed reservation - without ever being redirected to Booking.com.**

Today, like most small hotels, Dharma Stay pays to attract a guest (their brand, their site, their marketing), the guest lands on their website... and then the "Book" button throws that guest over to Booking.com. Two problems with that:

- **Commissions.** Booking.com takes ~15-18% of every reservation. That's money leaving the owner's pocket on every single booking.
- **Leakage to competitors.** On Booking.com, the guest sees 20 other hotels in the same city right next to Dharma Stay. The hotel paid to bring that guest in, and then hands them to a marketplace where they can wander off to a competitor.

Our platform closes that gap. **Guest arrives → guest books on-site → the money and the guest both stay with Dharma Stay.** No commission, no leakage.

This is the whole reason the project exists. Every design and product decision should protect and highlight the direct-booking path.

---

## 3. The architecture (how the platform works)

We separate the system into two layers. Internally we call the backend the **"core"** - it's the engine that makes everything run.

**Layer 1 - The Core (booking engine / backend)**
- This is the reservation engine: availability calendar, pricing, the booking flow, payments, and automatic SMS + email notifications to guest and owner.
- It is based on a **rentivo backend** that we've adapted. It's a shared engine designed to eventually serve multiple clients (multi-tenant), each with their own data and their own frontend.
- **Current status:** the core currently lives in Kęstutis's Lovable account. It will be connected to this project (via API) once the frontend design and user experience are built out in this account first.
- Correct technical terms if needed: this is the *booking engine* / *backend API layer*. "Core" is our internal word for it.

**Layer 2 - The Frontend (this project)**
- This is what we're building here: the design, the pages, and the entire guest-facing user experience.
- Responsibilities: home/landing page, apartment/room pages, the cottage page, the booking UI, content pages, and a polished, boutique look and feel.
- The frontend calls the core over an API to check availability, show prices, and complete bookings.

**Build sequence:**
1. **First:** build the frontend design + UX in this project (home page first, then room pages, then the booking UI shell). This is the current focus.
2. **Then:** connect the core (rentivo booking engine) via API so the booking flow becomes fully live.

So for now, where the booking flow needs live data, we build the UI and structure it cleanly, using placeholder/mock data where needed. The real reservation logic gets wired in once the core is connected.

---

## 4. Design direction

Full details are in the separate design system document (`dharma-stay-design-brief.md`) - follow it exactly. Summary:

- **Style:** modern, light, cozy **boutique hotel**. Not spiritual/religious, not generic.
- **Name stays:** Dharma Stay.
- **Concept:** "dharma" as *balance, calm, being in your place* - expressed through space, light, and typography, never through Buddhist clichés (no Buddha statues, mandalas, gold ornaments).
- **Palette:** warm light background (linen), deep sage-green accent (eucalyptus / Žemaitija forest) - deliberately NOT the overused cream + terracotta look.
- **Type:** Fraunces (display, used sparingly) + Inter (body).
- **Signature element:** a thin circle line (ensō hint) reused as divider / accent / icon frame. Subtle, never religious. This is the one memorable brand detail; everything else stays quiet and disciplined.
- **Home page priority:** apartments / accommodation is the main focus. Hero CTA leads into the booking calendar - NOT to Booking.com.

---

## 5. Content (from the current site)

**Business:** Dharma Stay, Telšiai. Positioning line they already use: *"iš namų į namus"* ("from home to home").

**Location:** Birutės g. 1, Telšiai 87130. In the heart of the old town, next to the main square, a few steps from Lake Mastis. Strong story: Žemaitija region, lake, historic old town, calm.

**Contacts:** +370 659 11 929, +370 604 98 915, info@dharmastay.lt.

**Accommodation types:**
1. **Standard apartments** - double (18-22 m²) and quad (30-35 m²) units. Birutės g. 1. From €40.
2. **Apartments with terrace** - view over the old town / main square. From €40.
3. **Cottage with sauna & hot tub** - 65 m², up to 6 guests. Gražinos g. 1. Cottage from €40, sauna €40, hot tub €50.

**Additional:** Restobar, event/banquet hall, sauna (marked "coming soon" on old site), gift vouchers.

**Social proof:** Booking.com ratings - standard apartments 9.0, terrace apartments 9.3.

**Copy note:** the old site has copy-paste room descriptions (all rooms nearly identical text) and some broken/confusing nav items. Write fresh, short, human copy - do not carry over the old text.

**Existing photos (usable as placeholders for now):**
The current site's images live under `dharmastay.lt/wp-content/uploads/`. Notable ones:
- Hero / building: `2024/12/dharmastay-viesbutis-telsiuose.jpg`, `2022/05/bg.jpeg`
- Terrace apartments: `2021/11/IMG_2537-1024x768.jpg`, `2023/06/1-1-10-1024x683.jpg`
- Cottage: `2022/02/namelio-pirties-kubilo-nuoma-telšiuose.jpeg` (+ `sodyba` image series)
- Standard apartments: `2021/11/2-12-1024x768.jpg`, room slideshow series (2-2, 2-3, 1-1, etc.)
- Town view: `2021/12/telse-1024x682.webp`

We'll start with these existing photos (lightly enhanced for a consistent warm/airy tone), and commission a new photoshoot later only if needed. For the pilot demo, existing photos are enough to evaluate the design.

---

## 6. Technical notes

- Stack: Next.js / TanStack Start + Tailwind + shadcn/ui (matches our other projects; frontend code can be partially reused from our existing Lovable projects).
- **SSR from day one** - required so OG tags render correctly per page (each apartment page needs its own social preview). Learned this the hard way on a previous project where no prerendering meant every page showed the generic homepage preview.
- Responsive from mobile first - most boutique guests browse on phones.
- Google Fonts: Fraunces + Inter.
- Booking logic: connect to the rentivo-based core via API (Layer 1 above) in a later phase.

---

## 7. Current focus

**Home / landing page design.** Get the look, feel, and structure right first - this is the foundation the rest of the site (and the pitch to future clients) is built on. The booking engine gets connected after the frontend/UX is in place.

2. # Dharma Stay - Dizaino sistema (Design Brief)

Šis dokumentas - "source of truth" naujai svetainei. Įkelk jį į Lovable projekto pradžioje ir remkis juo kiekviename puslapyje, kad viskas būtų nuoseklu.

Kryptis: **moderni, šviesi, jauki boutique** apgyvendinimo svetainė. Pagrindinis verslas - apartamentai/nakvynė Telšiuose. Pavadinimas lieka **Dharma Stay**.

---

## 1. Koncepcija ir nuotaika

Dharma - ne apie religinius simbolius, o apie **pusiausvyrą, ramybę ir buvimą savo vietoje**. Svetainė turi kelti tą patį jausmą, kurį jie patys jau įvardija: *"iš namų į namus"*.

Praktiškai tai reiškia:
- Daug oro ir tuščios erdvės (white space kaip ramybė, ne kaip tuštuma)
- Rami, natūrali paletė - ne balta ligoninė, o šilta šviesa
- Nuotraukos - didelės, kokybiškos, kalba pačios
- Jokių budizmo klišių (Budos statulų, mandalų, aukso ornamentų)
- Vienas subtilus brand motyvas: **plona apskritimo linija** (ensō/rato užuomina) - naudojama kaip skyriklis, akcentas, ikonų rėmelis. Niekada religiškai.

**Ko vengiam (svarbu):** to per daug matyto AI-dizaino derinio - kreminis fonas + didelis serif + terakota akcentas. Tai tapo standartu ir atrodo generiškai. Einam link ramesnės, gilesnės paletės.

---

## 2. Spalvų paletė

Šilta, gamtiška, rami. Pagrindas - minkšta šviesa, akcentas - gilus žalsvai pilkas (eukaliptas / žemaitiškas miškas), ne terakota.

| Vardas | HEX | Naudojimas |
|--------|-----|-----------|
| Linen (fonas) | `#F7F4EF` | Pagrindinis šviesus fonas |
| Warm White | `#FCFAF6` | Kortelės, sekcijų blokai |
| Ink (tekstas) | `#2B2A26` | Pagrindinis tekstas, antraštės |
| Stone (antrinis) | `#6B665D` | Antrinis tekstas, aprašymai |
| Sage (akcentas) | `#5A6B5D` | Mygtukai, nuorodos, akcentai |
| Sage Deep | `#3E4A40` | Hover, footer fonas |
| Clay (šiltas akcentas) | `#C9A88A` | Labai retai - detalės, linijos |

Taisyklė: **Sage** yra pagrindinis akcentas (CTA mygtukai, aktyvūs elementai). **Clay** naudojam labai taupiai - tik plonoms linijoms ar mažoms detalėms. Neperkraunam.

---

## 3. Tipografija

Boutique nuotaika reikalauja elegantiškos, bet ne pretenzingos tipografijos. Poravimas:

**Display / antraštės:** `Fraunces` (Google Fonts)
- Modernus serif su charakteriu, minkštas, jaukus. Naudoti su saiku - tik antraštėms.
- Weights: 400 (light antraštėms), 500 (akcentams)
- Optiškai: didelės antraštės, pl0nas svoris, negausiai

**Body / tekstas:** `Inter` (Google Fonts)
- Švarus, neutralus, puikiai skaitomas. Body tekstui, mygtukams, navigacijai.
- Weights: 400 (body), 500 (mygtukai, akcentai)

**Utility / smulkmenos** (kainos, labels, captions): `Inter` su letter-spacing (tracking), UPPERCASE mažoms etiketėms (pvz. "NUO 40 €", "TERASA").

Type scale (desktop):
- H1 (hero): 56-64px, Fraunces 400
- H2 (sekcijos): 36-42px, Fraunces 400
- H3 (kortelės): 22-24px, Fraunces 500
- Body: 16-18px, Inter 400, line-height 1.7
- Small/caption: 13-14px, Inter 500, tracking +0.05em, uppercase

---

## 4. Išdėstymas (Layout)

Home page struktūra (apartamentai = pagrindinis akcentas):

```
┌─────────────────────────────────────┐
│  [logo]      nav              [CTA]  │  ← lengva, permatoma navigacija
├─────────────────────────────────────┤
│                                     │
│         HERO                        │
│    Didelė nuotrauka (terasa/        │
│    apartamentai + vaizdas į miestą) │
│    Antraštė: ramus, trumpas žodis   │
│    Sub: 1 sakinys                   │
│    [Tikrinti laisvas datas] CTA     │  ← veda į rezervacijos widget
│                                     │
├─────────────────────────────────────┤
│  ○  Trumpas intro (2-3 sakiniai)    │  ← apskritimo motyvas kaip skyriklis
│     "iš namų į namus" idėja         │
├─────────────────────────────────────┤
│         APARTAMENTAI                 │  ← PAGRINDINĖ sekcija
│   ┌──────┐  ┌──────┐  ┌──────┐      │
│   │ foto │  │ foto │  │ foto │      │
│   │Stand.│  │Terasa│  │Namel.│      │
│   │nuo € │  │nuo € │  │nuo € │      │
│   └──────┘  └──────┘  └──────┘      │
├─────────────────────────────────────┤
│    VIETA / TELŠIAI                   │  ← pasakojimas + žemėlapis
│    Masčio ežeras, senamiestis        │
├─────────────────────────────────────┤
│    PAPILDOMA (pirtis/kubilas/        │
│    restobaras) - antraeiliai         │
├─────────────────────────────────────┤
│    Atsiliepimai (Booking 9.0 / 9.3) │  ← social proof, jie jau turi
├─────────────────────────────────────┤
│         REZERVACIJA (widget)         │
├─────────────────────────────────────┤
│  Footer (kontaktai, žemėlapis)       │
└─────────────────────────────────────┘
```

Principai:
- **Plati, rami tinklelio sistema** - daug paraščių, negrūsti
- Kortelės - minkšti kampai (border-radius 12-16px), švelnus šešėlis, ne agresyvus
- Nuotraukos visada aukštos kokybės, vienodo apdorojimo (žr. skyrių 6)
- Sekcijos skiriamos erdve ir subtiliu apskritimo motyvu, ne storomis linijomis

---

## 5. Signature elementas

**Plona apskritimo linija (ensō užuomina).** Vienas atpažįstamas motyvas per visą svetainę:
- Sekcijų skyriklis (mažas apskritimas centre vietoj linijos)
- Aplink numerius ar mažas ikonas
- Hover efektas ant mygtukų (apskritimas "užsipildo")
- Loading/scroll indikatorius

Tai duoda brand vientisumą ir subtiliai atliepia "dharma", bet neatrodo religiškai. Tai - vienintelė "drąsi" detalė, viskas kita rami ir disciplinuota.

---

## 6. Nuotraukos

Pradžiai naudojam **esamas** jų nuotraukas (jos padorios, tik reikia sutvarkyti pateikimą), vėliau - jei reikės, nauja fotosesija.

Apdorojimas (kad atrodytų vientisai):
- Vientisas šiltas/natūralus tonas (light, airy grading)
- Vienodas kropas kortelėse (pvz. 4:3 arba 3:2)
- Hero - plati panorama, geriausia terasos su vaizdu į miestą
- Vengti perkrautų, tamsių, geltonų (WordPress default) nuotraukų

Pastaba: pradiniam pavyzdžiui (savininkui parodyti) galim naudoti placeholder'ius arba jų esamas nuotraukas - dizainui įvertinti to pakaks.

---

## 7. Funkcionalumas (platformos pliusas)

Svarbiausia parduodama vertė savininkui: **tiesioginė rezervacija be Booking.com komisinių.**

Home page turi vesti į rezervacijos srautą:
- Hero CTA: "Tikrinti laisvas datas" → kalendorius
- Kalendorius, kainos, mokėjimai, automatiniai SMS/email (rentivo bazė)
- Kiekviena apartamentų kortelė → savas puslapis su "Rezervuoti" (ne nuoroda į Booking!)

Dabartinė svetainė visas rezervacijas siunčia į Booking.com - tai tiesioginis argumentas, kiek pinigų platforma sutaupys.

---

## 8. Turinys iš senos svetainės (perkeliam)

Apgyvendinimas:
- **Standartiniai apartamentai** - dviviečiai (18-22 m²) ir keturviečiai (30-35 m²). Birutės g. 1. Nuo 40 €.
- **Apartamentai su terasa** - vaizdas į miesto centrą, senamiestį. Nuo 40 €.
- **Namelis su pirtimi ir kubilu** - 65 m², iki 6 asm. Gražinos g. 1. Nuo 40 €. Pirtis 40 €, kubilas 50 €.

Papildoma: Restobaras, Banketinė salė, Sauna (kuriama), Dovanų kuponai.

Adresas: Birutės g. 1, Telšiai 87130. Tel. +370 659 11 929, +370 604 98 915. info@dharmastay.lt.

Social proof: Booking įvertinimai - standartiniai 9.0, su terasa 9.3.

Copy pastaba: sena svetainė turi copy-paste aprašymus (visi kambariai beveik vienodi) ir keistų navigacijos punktų ("GARBIES SĖINA"). Naują copy rašom švarų, trumpą, žmogišką.

---

## 9. Techninė pastaba (Lovable)

- Next.js / TanStack Start + Tailwind + shadcn/ui
- **SSR nuo pirmos dienos** - kad OG tagai veiktų teisingai kiekvienam apartamentui (social preview)
- Responsive nuo mobile (dauguma boutique svečių ieško telefone)
- Google Fonts: Fraunces + Inter
- Rezervacijos logika - rentivo bazė (kalendorius, mokėjimai, pranešimai)

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ed6ed528-d771-4bd2-9f55-2bae4cb6afb0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
