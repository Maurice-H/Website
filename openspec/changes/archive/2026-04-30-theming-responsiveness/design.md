## Context

The current styling approach mixes Tailwind utility classes with hardcoded values, leading to an inconsistent theme application. The theme occasionally resets on navigation or Escape key presses. Layouts on mobile are not fully optimized, and ultra-wide/4K monitors break the visual boundaries of light rays. We need a robust foundational layer for CSS variables, state management, and component wrappers before adding more complex features.

## Goals / Non-Goals

**Goals:**
- Centralize all theme colors and layout variables in `:root` and `[data-theme="blueprint"]`.
- Manage the global theme state securely using a Pinia store (`useThemeStore`).
- Create generic wrapper components (e.g., `BentoCard.vue`) that encapsulate layout and hover logic.
- Ensure the bento grid stacks correctly on mobile and scales well on 4K displays.
- Introduce micro-interactions (3D hover tilt, subtle sounds).

**Non-Goals:**
- Completely rewriting the HTML structure of the landing page.
- Adding new sections or content pages.
- Building custom 3D webGL elements (hover tilt will use CSS or a lightweight composable).

## Decisions

- **State Management**: Use Pinia (`useThemeStore`) to track `isBlueprintMode`.
  - *Rationale*: Pinia provides a single source of truth that survives component remounts and route changes, preventing the "reset on Escape" bug.
- **Styling Architecture**: Native CSS variables for all theme-dependent colors, borders, and shadows. Tailwind will be restricted to spacing, typography, and flex/grid layouts.
  - *Rationale*: CSS variables allow instantaneous and synchronous theme swapping globally without needing to re-evaluate Vue bindings or Tailwind classes dynamically.
- **Component Wrapper**: Extract a reusable `<BentoCard>` component.
  - *Rationale*: Ensures DRY templates. Hover effects (3D tilt, glare) and border logic can be managed in one place.
- **Micro-Interactions**: Use CSS 3D transforms (`transform: perspective(...)`) guided by mouse position coordinates, calculated via a composable (e.g., `useMouseTilt`).
  - *Rationale*: Avoids heavy external dependencies while providing tactile feedback.

### 5. Lighting Effects Toggle

**Decision**: Add a `lightingEnabled` boolean to `useThemeStore` (persisted to localStorage), exposed as a second theme axis alongside `isBlueprintMode`. A new `LightingToggle.vue` button is placed left of the existing `ThemeToggle` in the floating controls bar. When `lightingEnabled` is false:
- `VolumetricBeam` does not render (v-if)
- `SpotlightMask`'s `.light-overlay` becomes fully transparent (no conic/radial darkness)
- `PerspectiveGrid` does not render (v-if)
- NAV-phase lamp beam/glow is hidden — lamp appears "off"
- Mouse rotation tracking in the viewport store is skipped for performance
- Audio: plays `public/Audio/switch15.ogg` on toggle

**Rationale**: This is conceptually a "theme" concern (light vs. clean) rather than a "lighting mechanics" concern. Both toggles control the visual presentation layer, so colocating them in `useThemeStore` keeps the API clean. Persisting to localStorage means the user's preference survives page reloads.

## Risks / Trade-offs

- **Risk**: Moving away from Tailwind colors to CSS variables might make it harder to read template styling.
  - *Mitigation*: Clearly document the CSS variables in `index.css` and use a consistent naming convention (e.g., `var(--color-bg-primary)`).
- **Risk**: 3D hover effects might impact performance on low-end devices.
  - *Mitigation*: Disable hover 3D transforms via CSS `@media (hover: none)` and `(prefers-reduced-motion)`.
- **Risk**: Disabling lighting effects may make the page look too plain/empty.
  - *Mitigation*: When lighting is off, the solid `--finished-bg` background plus content styling should still feel premium. The toggle is a power-user/accessibility feature, not the default.
