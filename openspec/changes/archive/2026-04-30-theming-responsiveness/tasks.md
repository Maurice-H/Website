## 1. Pre-flight & Setup

- [x] 1.1 PRE-FLIGHT: Read and apply all guidelines located in the `.docs/skills/` directory.
- [x] 1.2 Define TypeScript interfaces for the theme state manager (e.g., `ThemeState`) and generic `BentoCard` props.

## 2. Global State Management (Pinia)

- [x] 2.1 Implement `useThemeStore.ts` to manage `isBlueprintMode`, ensuring state survives navigation.
- [x] 2.2 Update `ThemeToggle.vue` to dispatch actions to `useThemeStore` and play the audio feedback sound effect on toggle.
- [x] 2.3 Add unit tests (Vitest) for `useThemeStore.ts` to verify state initialization and toggling behavior.

## 3. CSS Architecture Refactoring

- [x] 3.1 Refactor global styles (`index.css`) to define all colors, glowing shadows, and layout bounds as native CSS variables on `:root` and `[data-theme="blueprint"]`.
- [x] 3.2 Update layout components to remove hardcoded Tailwind colors in favor of CSS variables.
- [x] 3.3 Ensure background light rays and effects scale infinitely for ultra-wide screens (4K/HDR) using fluid CSS scaling.

## 4. Generic Components & Layout

- [x] 4.1 Implement `BentoCard.vue` wrapper component with slots to encapsulate standard borders and backgrounds.
- [x] 4.2 Create a composable `useMouseTilt.ts` to calculate 3D transform coordinates based on cursor proximity.
- [x] 4.3 Integrate `useMouseTilt` into `BentoCard.vue` to add subtle 3D tilt and glare effects on hover.
- [x] 4.4 Refactor portfolio grid layouts to use `BentoCard.vue` and adjust CSS Grid rules to stack gracefully on mobile viewports (<768px).
- [x] 4.5 Add component unit tests for `BentoCard.vue` to verify prop passing, mouse events, and slot rendering.

## 5. Verification & E2E Testing

- [x] 5.1 Create E2E tests (Playwright) using Page Object Model to verify theme switching works and state persists across route changes without resetting on Escape.
- [x] 5.2 Add E2E tests to verify layout responsiveness on mobile viewports.
- [x] 5.3 POST-FLIGHT: Run Biome linter/formatter (`npx biome check .`) and autonomously fix any errors.
- [x] 5.4 POST-FLIGHT: Run Vitest unit tests to ensure no regressions.
- [x] 5.5 POST-FLIGHT: Run Playwright E2E tests to verify UI flows.

## 6. Extra Polish Items

- [x] 6.1 Fix `AudioContext` typing and replace synthetic oscillator with `public/Audio/switch1.ogg` in `ThemeToggle.vue`.
- [x] 6.2 Fix `mixBlendMode` type cast to properly import from `csstype` in `useMouseTilt.ts`.
- [x] 6.3 Replace hardcoded accent colors in `NavConveyor.vue` with dynamic CSS `color-mix()` linked to `var(--finished-accent)` for blueprint toggle.
- [x] 6.4 Update `SpotlightMask.vue` conic gradient overlays to use `color-mix()` against `var(--finished-bg)` to prevent a greenish tint in blueprint mode.

## 7. Lighting Effects Toggle

- [x] 7.1 Add `lightingEnabled` ref (default: `true`) and `toggleLighting()` action to `useThemeStore.ts`, with `localStorage` persistence and a watcher that syncs state on load.
- [x] 7.2 Create `src/components/navigation/LightingToggle.vue` — a toggle button with a lamp/light icon that plays `public/Audio/switch15.ogg` on click, reflecting the current `lightingEnabled` state visually.
- [x] 7.3 Integrate `LightingToggle` into `App.vue` — place it left of the existing `ThemeToggle` in the floating controls bar. Also show it during NAV phase.
- [x] 7.4 Update `VolumetricBeam.vue` — add `lightingEnabled` guard so it does not render when lighting is disabled.
- [x] 7.5 Update `SpotlightMask.vue` — conditionally hide the `.light-overlay` div when lighting is disabled (transparent/no background).
- [x] 7.6 Update `PerspectiveGrid.vue` — add `lightingEnabled` guard so it does not render when lighting is disabled.
- [x] 7.7 Skip mouse rotation tracking in the viewport store when `lightingEnabled` is false (performance optimisation).
- [x] 7.8 Verify: toggle on/off produces the expected visual change in both NAV and CONTENT phases, sound plays, state persists across page reload.
