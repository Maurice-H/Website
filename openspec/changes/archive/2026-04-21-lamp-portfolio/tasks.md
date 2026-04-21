## 1. Core Framework & Engine Setup

- [x] 1.1 Clean Vue 3 + Vite project, configure TypeScript strictly, and install Tailwind CSS.
- [x] 1.2 Define global TypeScript interfaces (`LightingState`, `MousePosition`, `BentoGridItem`) in a centralized types file.
- [x] 1.3 Implement a global Vue composable (`useLightingEngine.ts`) to track mouse position (`x/y`) using `requestAnimationFrame`, and set CSS variables `--mouse-x`, `--mouse-y` on the document root for desktop.
- [x] 1.4 Implement Mobile Fallback im Engine: Fix variables to viewport center logic for devices matching `@media (hover: none)`.

## 2. Das Two-Phase Lighting System

- [x] 2.1 Set up `index.css` Base Themes: Definiere "Blueprint" (Graph Paper, dotted borders, dark base) und "Finished" (Dark Mode, high contrast, neon glows) als CSS Features.
- [x] 2.2 Create `SpotlightMask.vue` (oder App-level Maske): Implementiere das `mask-image: radial-gradient(...)`, das an die CSS Variablen gekoppelt ist.
- [x] 2.3 Implementiere Phase 1 (Das Fließband / Conveyor Belt): Ein horizontal scrollbarer Container, maskiert durch einen streng vertikalen Lichtkegel in der Bildschirmmitte.
- [x] 2.4 Implementiere Transition Logic (The Flash): Animiere den Übergangssockel von "vertical beam" (Phase 1) zu "mouse spotlight" (Phase 2) inklusive Fade-Out der Nav und Einblenden des Grids.

## 3. Bento Grid & Dual Layer Layout

- [x] 3.1 Create `BentoLayout.vue` wrapper für die CSS Grid Positionierung der restlichen Inhalte.
- [x] 3.2 Create `BentoCard.vue`: Eine smarte Komponente, die das CSS des Blueprints mit den "Finished" Details kombiniert. (Forschung: Reicht CSS für Maskierung der Glows, oder brauchen wir Pseudo-Element-Layerings?).

## 4. Portfolio Content (Das Innenleben)

- [x] 4.1 Mock project data & `ProjectsGrid.vue` zur Darstellung der Referenzen innerhalb des Spotlights.
- [x] 4.2 Create `Hero/IntroSection.vue` - ggf. an das "Fließband" von Phase 1 gekoppelt.
- [x] 4.3 Create `SkillsAbout.vue` layout.
- [x] 4.4 Create `ContactForm.vue` - zugängliches Formular innerhalb einer Bento Card.

## 5. Polish & Performance

- [x] 5.1 Teste und entkäfere die Mobile User Experience, stelle sicher, dass mittig liegende Cards erhellt werden.
- [x] 5.2 Tune die Flash Animation: Easing, Blur-Werte, und Opacity Timing für den WOW-Effekt.
- [x] 5.3 Profiling der CSS Mask-Renderperformance (Sicherstellen von konstanten 60fps).
