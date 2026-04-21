## Context

Wir bauen ein Premium-Portfolio für einen Junior Software Developer mittels Vue.js 3, TypeScript, Vite und Tailwind CSS. Die wichtigste Neuerung ist ein "Two-Phase Lighting System". Die UI transformiert sich von einem starren vertikalen Lichtkegel (Navigation) in ein freies Maus-Spotlight (Inhalte im Bento-Grid). Das Licht fungiert als visuelle Linse, die das "fertige" Produkt (Premium Dark Mode) aufdeckt, während im Schattenbereich ein struktureller Blueprint (Graph Paper, Outlines) zu sehen ist.

## Goals / Non-Goals

**Goals:**
- Implementierung der Zwei-Phasen-Lichtlogik mit sauber getrennten Zuständen (`Phase 1: Conveyor Belt`, `Phase 2: Maus-Spotlight`).
- Einsatz von CSS Masking (`mask-image: radial-gradient`) und JavaScript Event-Listenern (bzw. `requestAnimationFrame`), um die Lichtposition hochperformant performant zu steuern.
- Überblendung des "Premium Finished" Styles über den schwachen "Blueprint/Wireframe" Hintergrund.
- Sauberer Umgang mit Mobile/Touch: Zentrierter fixierter Lichtkegel und Nutzung von Scrollauswertung oder IntersectionObserver für die Beleuchtung.
- Strenge Typisierung über Vue 3 Composition API (`<script setup>`).

**Non-Goals:**
- Dynamisches Backend/CMS (Statischer Content ist ausreichend).
- Komplexe Routing-Stammdatenverwaltung (eine einzelne, smarte SPA-Ansicht genügt).

## Decisions

- **Eventgetriebenes Masking:**
  Die Maus- bzw. Touch-Koordinaten werden global abgegriffen und per CSS-Variablen `--mouse-x` und `--mouse-y` am `root` hinterlegt. Das Rendering im Spotlight basiert auf einer CSS-Maske (z.B. bei einem Overlay-Container), welche nur den Bereich rund um den Cursor freigibt (`requestAnimationFrame` für Performance-Sicherheit).
- **Dual Layer Architecture (Blueprint vs Finished):**
  Es existieren logisch zwei Layout-Zustände übereinander (oder ein cleveres Stacking). Der "Schatten" ist ein Grid-Papier mit kaum sichtbaren Umrissen (Blueprint-Linien, gestrichelt). Das Spotlight enthüllt den Layer mit Neon-Schatten, kräftigen Typografien und vollem Kontrast.
- **Der Flash-Übergang:**
  Um zwischen Navigation (streng vertikaler Strahl) und Grid (weicher Kreis/Spotlight) zu wechseln, wird zur Laufzeit eine kurzfristige Transition auf `mask-size` oder die Gradienten-Falloffs getriggert, um ein "Verstreuen" des Lichts zu simulieren, bevor es sich an die Maus anheftet.
- **Mobile Ansatz:**
  Auf Geräten ohne Hover (`@media (hover: none)`) bleiben `--mouse-x` und `--mouse-y` starr auf dem Viewport-Zentrum.

## Risks / Trade-offs

- **Risk:** Performance-Bottleneck beim Rendern massiver CSS Masking-Operationen in Kombination mit Box-Shadows über den gesamten Screen.
  - **Mitigation:** Reduktion der Reflows. Das `--mouse-x/y` Update triggert nur Compositing (GPU-beschleunigt) über Transforms oder `mask-position` anstelle von Layout-Repaints.
- **Risk:** Doppelung des DOMs (falls wir 2 separate Layouts übereinanderlegen).
  - **Mitigation:** Wir versuchen den Effekt durch geschicktes Zusammenwirken von `background-image` Layers und Pseudoelementen (`::before` / `::after`) anstelle einer kompletten DOM-Verdoppelung zu erreichen.
