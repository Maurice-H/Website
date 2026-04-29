## Why

Currently, theming is applied inconsistently and sometimes resets unexpectedly (e.g., when pressing Escape). Responsiveness on mobile devices is incomplete, and ultra-wide/4K displays have hardcoded boundaries that break the lighting and layout. We also want to introduce tactile micro-interactions (bento card hover effects, UI sounds) to elevate the premium feel. We need to solidify the CSS variable foundation before building out more features to prevent cascading visual bugs and technical debt.

## What Changes

- **Global Theming Engine**: Refactor CSS to strictly use native CSS variables for all color/theme switching instead of hardcoded Tailwind classes.
- **Theme Consistency**: Ensure the theme (Blue/Green / Finished/Blueprint) is persistently applied and doesn't reset on unintended keystrokes or navigations.
- **State Management Strategy**: The global theme toggle will be managed exclusively via a dedicated Pinia store (`useThemeStore`), ensuring synchronized state across all components without local prop-drilling or isolated event listeners.
- **Component Hierarchy & Reusability**: Ensure hover effects and layout behaviors are encapsulated inside generic wrapper components (e.g., `BentoCard.vue`), keeping the bento grid DRY.
- **Responsive Layouts**: Implement flexible layouts for mobile devices (stacking bento cards) and fix fixed pixel values for ultra-wide monitors (e.g., ensuring light rays extend infinitely).
- **Micro-Interactions**: Add a subtle 3D tilt/glare effect on Bento cards on hover and quiet UI sound effects for toggling the theme.

## Capabilities

### New Capabilities
- `micro-interactions`: Requirements for tactile feedback, including 3D tilt/glare on bento cards and subtle UI sound effects for theming.

### Modified Capabilities
- `theme-engine`: Requires strict enforcement of CSS variables over Tailwind colors and persistent Pinia state management that survives navigation and keypresses.
- `bento-layout`: Requires responsive behavior adjustments for mobile (stacking) and ultra-wide screens (fluid scaling/boundaries), plus integration of hover wrappers.

## Impact

- **Affected Code**: `src/assets/index.css`, `src/stores/useThemeStore.ts`, all Vue components using hardcoded Tailwind colors, `BentoCard.vue`, `LandingPage.vue`.
- **Dependencies**: May require adding a lightweight library for 3D tilt effects (e.g., `vanilla-tilt.js` or custom Vue implementation) or audio playing (e.g., `howler.js` or native HTML5 audio).

## Non-goals

- Refactoring the entire navigation system or content data.
- Introducing a third theme (e.g., Red or Purple).
- Changing the overall font family or core typography spacing.

## Testing Strategy

- **Unit Testing (Vitest)**: Test the `useThemeStore` to ensure theme state toggles correctly and persists. Verify `BentoCard.vue` props and generic slot rendering.
- **E2E Testing (Playwright)**: Write E2E tests to verify that clicking the theme toggle visually changes the CSS variables on the `:root` element. Verify layout stacking on mobile viewports. Verify theme does not reset when pressing the `Escape` key.
