# The Buggy Landlords 🏠🐛

![The Buggy Landlords Logo](./frontend/assets/img/theBuggyLandlords.png)

> **"De redding voor de 'huisjesmelker' die alles nog in Excel doet."**

## 📖 Het Project
Veel verhuurders van studentenkamers (kotbazen) werken nog met rommelige Excel-lijsten en WhatsApp. Contracten raken kwijt en eindafrekeningen zijn een rekenkundige nachtmerrie.

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