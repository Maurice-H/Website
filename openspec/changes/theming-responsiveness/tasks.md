## 1. Pre-flight & Setup

- [ ] 1.1 PRE-FLIGHT: Read and apply all guidelines located in the `.docs/skills/` directory.
- [ ] 1.2 Define TypeScript interfaces for the theme state manager (e.g., `ThemeState`) and generic `BentoCard` props.

## 2. Global State Management (Pinia)

- [ ] 2.1 Implement `useThemeStore.ts` to manage `isBlueprintMode`, ensuring state survives navigation.
- [ ] 2.2 Update `ThemeToggle.vue` to dispatch actions to `useThemeStore` and play the audio feedback sound effect on toggle.
- [ ] 2.3 Add unit tests (Vitest) for `useThemeStore.ts` to verify state initialization and toggling behavior.

## 3. CSS Architecture Refactoring

- [ ] 3.1 Refactor global styles (`index.css`) to define all colors, glowing shadows, and layout bounds as native CSS variables on `:root` and `[data-theme="blueprint"]`.
- [ ] 3.2 Update layout components to remove hardcoded Tailwind colors in favor of CSS variables.
- [ ] 3.3 Ensure background light rays and effects scale infinitely for ultra-wide screens (4K/HDR) using fluid CSS scaling.

## 4. Generic Components & Layout

- [ ] 4.1 Implement `BentoCard.vue` wrapper component with slots to encapsulate standard borders and backgrounds.
- [ ] 4.2 Create a composable `useMouseTilt.ts` to calculate 3D transform coordinates based on cursor proximity.
- [ ] 4.3 Integrate `useMouseTilt` into `BentoCard.vue` to add subtle 3D tilt and glare effects on hover.
- [ ] 4.4 Refactor portfolio grid layouts to use `BentoCard.vue` and adjust CSS Grid rules to stack gracefully on mobile viewports (<768px).
- [ ] 4.5 Add component unit tests for `BentoCard.vue` to verify prop passing, mouse events, and slot rendering.

## 5. Verification & E2E Testing

- [ ] 5.1 Create E2E tests (Playwright) using Page Object Model to verify theme switching works and state persists across route changes without resetting on Escape.
- [ ] 5.2 Add E2E tests to verify layout responsiveness on mobile viewports.
- [ ] 5.3 POST-FLIGHT: Run Biome linter/formatter (`npx biome check .`) and autonomously fix any errors.
- [ ] 5.4 POST-FLIGHT: Run Vitest unit tests to ensure no regressions.
- [ ] 5.5 POST-FLIGHT: Run Playwright E2E tests to verify UI flows.
