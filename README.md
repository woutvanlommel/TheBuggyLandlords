# The Buggy Landlords 🏠🐛

![The Buggy Landlords Logo](./frontend/assets/img/theBuggyLandlords.png)

> **"De redding voor de 'huisjesmelker' die alles nog in Excel doet."**

## 📖 Het Project: KotCompass
Veel verhuurders van studentenkamers (kotbazen) werken nog met rommelige Excel-lijsten en WhatsApp. Contracten raken kwijt en eindafrekeningen zijn een rekenkundige nachtmerrie.

> **Scrummaster**: Wout Vanlommel

**De Oplossing:**
Een centraal portaal voor verhuurder én student.
* **Student:** Ziet huurstatus, meldt problemen (bv. lekkage) met foto's.
* **Kotbaas:** Beheert meldingen en ziet via een interactieve plattegrond (Livewire) direct wie er huurt en of er betaald is.

---

## 🛠️ Tech Stack

Wij bouwen deze applicatie met de volgende technologieën:

| Categorie | Technologie | Details |
| :--- | :--- | :--- |
| **Backend** | ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white) | Framework voor API & Logica |
| **Frontend** | ![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white) | Framework voor de Client-side |
| **Taal** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) | Strict typing |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Plain CSS / Tailwind |
| **Versiebeheer** | ![Git](https://img.shields.io/badge/GIT-E44C30?style=flat-square&logo=git&logoColor=white) | Source Control |

---

## 📏 Naming Conventions & Regels

Om de code netjes te houden, volgt iedereen de volgende strikte regels:

### 1. Hoe we classes en functions benoemen
Wij gebruiken **camelCase** voor alle logica.
* **Regel:** `classes en functions -> getUsersFromApi`
* ✅ Goed: `calculateRent()`, `userProfile`
* ❌ Fout: `calculate_rent()`, `User_Profile`

### 2. Bestanden in de structuur
Bestandsnamen schrijven we ook in **camelCase**.
* **Voorbeeld:** `productsDetail.html`
* ✅ Goed: `loginScreen.component.ts`, `homePage.html`
* ❌ Fout: `products-detail.html`, `LoginScreen.html`

### 3. Git Branches (Aanwijzingen)
Werk nooit direct op de main branch. Gebruik de volgende prefixen:

* `feat-` (Nieuwe functionaliteit)
* `bugfix-` (Fouten oplossen)
* `update-` (Bijwerken bestaande code/docs)

**Voorbeeld branchnaam:**
`feat-micro-excercise-readme`

---

# MoScoW
* Grootste doel is het realiseren van de **"Autoscout"** variant maar dan voor studentenkoten. 
    -> Voorbeelden: iKot, Rentola, Kotzoeker, ...
* Daarnaast is onze grootste USP dat we er een **managementtool** aan vastkoppelen. 

## Kot zoek platform
**Must Haves**
* **Filter functies**
    - Locatie/regio
    - Prijs (inclusief verbruik/verzekering, ...)
    - Start huurperiode
    - Contractduur
    - Buitenzone (Tuin, balkon, parking, fietsenstalling, ...)
    - Voorzieningen
    - Soort woningen
* **Contact maken met de verhuurder/firma**
* **Grote zoekbalk/functie bovenaan**
* **Responsiveness**
* **Login/Registratie**
    - Beveiliging
    - GDPR
* **Persoonlijk profiel (Van huurder, zichtbaar voor verhuurder)**
    - Naam + Achternaam
    - Studiebewijs opladen (Verplicht vanaf de start van het academie jaar)
    - Contactgevens (telefoon, mailadres, van de ouders?, ...)
    - Bankgegevens (Voor overschrijvingen)
    - Geboortedatum
* **Persoonlijk profiel (Van verhuurder)**
    - Naam + Achternaam
    - Betaalgegevens van de verhuurder -> Automatisch linken in de 'facturen'
    - Contactgegevens
    - (Should have: Andere koten van deze verhuurder)
* **Overzichtpagina** van de koten, op basis van de locatie
* **Favorieten** zetten
* Pagina met info links over de **wetgeving in verband met verhuren**
    - Verwerken in een algemene info sectie
    - FAQ hieronder (Voor huurder/verhuurder)
* **Nodige info per kot**
    - Duidelijke foto's
    - Adres
    - Voorzieningen
        - Douche, toilet, badkamer
        - Bemeubeld vs niet bemeubeld
        - ...
    - Eigenschappen
        - Aantal slaapkamers
        - Oppervlakte
        - Prijs van het kot
        - Wat is inbegrepen in de prijs zoals (internet, extra kosten)
    - Beschrijving van het kot zelf
    - Plaatsing van het zoekertje
    - Beschikbaar vanaf


**Should Haves**
* **Dichtsbijzijnde locaties**
    * Scholen
    * Winkels
    * Station (vervoer)
* Verspreiding op andere zoekplatformen (indirect naar ons platform leiden, door onder andere op IMMO sites)
* Betaling -> Bevestiging betaling, soort van facturen via ons, betaalherinneringen, ..........
* Spotlight voor verhuurders -> Boosten van hun kot voor x aantal tijd
* Aanmelden op e-mail melding lijst. Bv: hou me op de hoogte voor dit kot (Als het vrijkomt)
* ItsMe verificatie


**Could Haves**
* **Kotmatcher**
    - Op basis van wat voor huis genoot je zoekt
    - Interesses
    - Public profile
    - ...
* **Kotswiper** (tinder voor koten)
* Soort van **reactiepunten** systeem om niet serieuze huurders 'af te schrikken'
* **Nieuwsbrief** naar alle gebruikers die op zoek zijn naar een kot in een bepaalde regio (Spotlight koten?)


**Wont Haves**
* **Eigen betaalintegratie** (Niet verzeild geraken in juridische betaaloorlogen)



## Kot management dashboard
### Algemeen
**Must Haves Algemeen:**
* **Staat van het kot**
    * Discussies vermijden als er schade toegericht wordt
    * Schade opmeten voor dat er iemand een kot betreedt (samen met de huurder) -> Denk aan autoverhuur op vakantie
    * Foto de afbeeldingen in de app laten maken zodat er een timestamp aan vastgekoppeld wordt
* **Communicatietool** (Whatsapp binnen de kotapplicatie zelf)
* **Mededelingen bord** voor iedereen van het kot (Enkel verhuurder kan hierin posten)
* **Contracten opstellen**
    - Onderling tussen huurder en verhuurder (plaatsbeschrijving)
    - Voorwaarden
    - Duurcontracten
    - Pdf generatie -> Doorsturen naar huurder en verhuurder (of in het dashboard zetten van de betrokkenen)
* **Ticket Systeem (Onderhoud & Schade):**
    * Huurder maakt ticket aan: Categorie (Lekkage, Internet, Elektriciteit) + Foto upload.
    * Status flow: *Open -> In behandeling -> Opgelost*.
    * Timestamp logging bij elke statuswijziging.

**Should Haves Algemeen**


**Could Haves Algemeen**
* **Documentenkluis (The Vault):** Centrale opslagplek per gebouw voor EPC-attesten, handleiding CV-ketel, brandveiligheidsattesten.

**Wont Haves Algemeen**
* Plattegrond van de koten


### Verhuurders
**Must Haves Verhuurders**
* **Portfolio Overzicht:**
    * Dashboard met: Aantal panden, bezettingsgraad (%), openstaande tickets.
    * Gebouwbeheer: Hierarchie `Gebouw -> Verdieping -> Kamer/Unit`.
* **Huurdersbeheer:**
    * Koppelen van geregistreerde studenten aan een specifieke unit.
    * Overzicht looptijd contracten (Melding "Contract loopt af binnen 3 maanden").
* **Kot toevoegen** (Met de nodige informatie) -> Openzetten voor bezichtigingen, updaten, verwijderen, ...

**Should Haves Verhuurders:**
* **Sleutelbeheer:** Register van wie welke sleutel heeft (inclusief reservesleutels).

**Could Haves Verhuurders**
* **Kalender integratie**
    * Bezoek van potentiële huurders
    * Feestjes van huurders


**Wont Haves Verhuurders**

### Huurders
**Must Haves Huurders**
* **Betalingsdeadlines**
* **Betalingsherinneringen**
* **Mijn Kot:** Overzicht van hun contract, maandelijkse kosten en betaalstatus.
* **Plaatsbeschrijving (Intrede):**
    * Digitale flow bij intrede: Verhuurder uploadt foto's -> Huurder moet in app "Akkoord" klikken of opmerking toevoegen binnen 14 dage

**Should Haves Huurders**
* **Onderverhuur (Erasmus) Flow:** Aanvraagformulier om kot tijdelijk door te geven, met goedkeuringsknop voor eigenaar.
* **Schoonmaakrooster:** Simpele tool om taken te verdelen onder huisgenoten.
* **Exit lijst:** Wat moet er allemaal inorde zijn vooraleer ik uit mijn kot ga?

**Could Haves Huurders**
* Review section -> Gelinkt aan de verhuurpagina

**Wont Haves Huurders**
