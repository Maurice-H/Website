## 1. Architectural Foundation (Compliance Update)

- [x] 1.1 Initialize **Pinia** in the project and update `main.ts`.
- [x] 1.2 Refactor `useViewportStore` and `useLightingEngine` into **Pinia stores** (Store pattern).
- [x] 1.3 Migrate the global `mousemove`, `scroll`, and `resize` listeners into the `useViewportStore` actions to ensure no local component listeners are used.
- [x] 1.4 Define the "Cosmic Void" color palette and effects as **CSS Variables** in `index.css`, including `var(--theme-transition-duration)`.

## 2. Dynamic Lighting & Volumetric Beam

- [x] 2.1 Implement angular tracking logic in `useLightingEngine` store for the flashlight rotation.
- [x] 2.2 Create `FlashlightSource.vue` component that reacts to the store's rotation and coordinates.
- [x] 2.3 Implement `VolumetricBeam.vue` using CSS gradients, synchronized with the flashlight's orientation.
- [x] 2.4 Update `SpotlightMask.vue` to support the new transformable mask logic (Flashlight mode).

## 3. High-Fidelity Bento Components

- [x] 3.1 Create `StackedCard.vue` as a wrapper that inherits the `BentoCard` pattern and adds the "layered glass" effect.
- [x] 3.2 Implement `PerspectiveGrid.vue` background, driven by store variables for the hotspot effect.
- [x] 3.3 Create a terminal-style "System Boot" component and externalize its animation strings to `src/data/boot-sequence.json`.
- [x] 3.4 Apply glassmorphism standards (blur + 15% opacity borders) to all existing bento cards.

## 4. Polishing & Definition of Done

- [x] 4.1 Fine-tune animation timings using the unified `var(--theme-transition-duration)`.
- [x] 4.2 Verify all static data is moved to `src/data/`.
- [x] 4.3 Run Biome linting and formatting.
- [x] 4.4 Execute existing unit and E2E tests (Vitest/Playwright).
