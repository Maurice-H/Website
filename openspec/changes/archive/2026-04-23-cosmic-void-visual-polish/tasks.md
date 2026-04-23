## 1. Color System Migration

- [x] 1.1 Update `index.css` `:root` block: change `--finished-accent` from `#8b5cf6` to `#10b981`, update `--finished-border`, `--finished-glow`, and `--glass-bg` to use emerald/teal rgba values. Add `--accent-bright: #22d3ee` for lamp highlights.
- [x] 1.2 Update `index.css` `[data-theme="blueprint"]` block: shift blueprint accent from `#60a5fa` to a complementary blue-teal (`#38bdf8`), update all blueprint border/glow values accordingly.
- [x] 1.3 Grep and replace all hardcoded violet/purple Tailwind classes (`text-violet-*`, `bg-violet-*`, `from-blue-500`) in `.vue` files with CSS variable references or emerald equivalents.

## 2. Flashlight & Beam Refinement

- [x] 2.1 Redesign `FlashlightSource.vue`: update the flashlight body to a metallic teal-tinted cylinder with defined grip texture, accent-colored emitter lens glow, and correct positioning at bottom-right viewport edge.
- [x] 2.2 Redesign `VolumetricBeam.vue`: narrow the beam cone angle, reduce blur from 40px to ~15px, change gradient from violet to teal-to-transparent, and add a secondary soft atmospheric haze layer near the source.
- [x] 2.3 Tune `SpotlightMask.vue` overlay gradients: widen the transparent center area in CONTENT phase for softer light falloff, and adjust NAV phase gradient for the lamp's downward cone.

## 3. Perspective Grid Enhancement

- [x] 3.1 Update `PerspectiveGrid.vue`: apply a `mask-image: radial-gradient(...)` centered on `var(--mask-x)` / `var(--mask-y)` so the grid is only visible where the light hits.
- [x] 3.2 Make the grid visible in both NAV and CONTENT phases with appropriate intensity (NAV: centered below lamp, CONTENT: following flashlight).
- [x] 3.3 Reduce grid line opacity from 0.3 to ~0.06–0.08 and use `var(--finished-accent)` for grid line color.

## 4. NAV Phase — Lamp Fixture Upgrade

- [x] 4.1 Redesign the lamp fixture CSS in `NavConveyor.vue`: create a detailed industrial ceiling lamp with visible wire, housing, and a bright teal/cyan glowing bulb with multi-layer box-shadow (at least 3 glow layers).
- [x] 4.2 Update `NavConveyor.vue` terminal content in the career window to match the mockup style: `> system.boot_sequence(91)...`, `LOADING DATA...`, `2024: FRONTEND DEV - SYSTEM ARCHITECT...`.
- [x] 4.3 Update `NavConveyor.vue` drag hint text to show contextual labels matching the mockups (e.g., "TECHNICAL DNA").

## 5. Bento Card Glassmorphism Polish

- [x] 5.1 Update `BentoCard.vue` `.glass-reveal` and `.bento-card:hover` styles to use `var(--finished-accent)` for all glow/shadow values instead of hardcoded violet rgba.
- [x] 5.2 Update `ProjectsSection.vue` decorative glow gradient from `from-blue-500` to accent-colored.
- [x] 5.3 Update `BootSequence.vue`: change text color from `text-violet-400` to emerald/teal, update `text-shadow` to use accent color.

## 6. Boot Sequence Data Update

- [x] 6.1 Rewrite `src/data/boot-sequence.json` lines to match mockup terminal style: `> system.boot_sequence(91)...`, `LOADING DATA...`, `2024: FRONTEND DEV - SYSTEM ARCHITECT...`.

## 7. Verification

- [x] 7.1 Run `npm run build` to verify no compilation errors.
- [x] 7.2 Visual verification: load app in browser, check NAV phase (lamp + grid + conveyor), CONTENT phase (flashlight + beam + bento cards), and blueprint theme toggle.

## 8. High-Fidelity Refinement (Phase 2)

### Layout & Navigation
- [x] 8.1 Fix `viewport.ts`: Make `--mask-x/y` updates conditional on `lighting.phase === 'CONTENT'`.
- [x] 8.2 Fix `App.vue`: Improve phase transition reactivity and add a smooth fade transition between phases.
- [x] 8.3 Refactor `BentoLayout.vue`: Implement a 4-column CSS grid with gap and responsive rows.

### Visual Polish
- [x] 8.4 Upgrade `BentoCard.vue`: Add "Stacked Border" (double-stroke) effect using a `::before` pseudo-element.
- [x] 8.5 Enhance `VolumetricBeam.vue`: Add a "dust particle" texture layer using a repeating radial gradient.
- [x] 8.6 Polish `NavConveyor.vue`: Detail the lamp fixture with an industrial housing rim and wire connector.
- [x] 8.7 Update `HeroSection.vue`: Wrap in a `BentoCard` (spans 3 cols, 2 rows) and match bold mockup typography.
- [x] 8.8 Update `SkillsAbout.vue`: Split into two distinct `BentoCard` tiles.
- [x] 8.9 Update `ProjectsSection.vue`: Refactor to use a grid of `BentoCard` components.

