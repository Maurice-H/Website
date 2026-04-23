## Context

The current website uses a single `SpotlightMask` component that applies a radial gradient as a CSS `mask-image`. This mask is synchronized across components using a module-level reactive singleton. To align with **Project Bridge** standards, we must transition to **Pinia** for state management and strictly adhere to **CSS Variable** driven theming for the "Cosmic Void" aesthetic.

## Goals / Non-Goals

**Goals:**
- **Realistic Light Sources**: Implement a flashlight that rotates to follow the mouse and a hanging lamp for the navigation phase.
- **Volumetric Lighting**: Add visual beam effects (using CSS gradients or SVG) to simulate light scattering.
- **Physical Depth**: Implement "Stacked Cards" with offset borders and shadows to create a layered glass effect.
- **Synchronized Reactivity (Pinia)**: Move `useViewportStore` and `useLightingEngine` logic into Pinia stores for centralized event and state coordination.
- **Phase-Specific Lighting**: Transition smoothly between the "Hanging Lamp" (Nav) and "Flashlight" (Content) modes using `var(--theme-transition-duration)`.

**Non-Goals:**
- Replacing the entire tech stack (Vue 3/Vite remains).
- Implementing a full 3D engine (e.g., Three.js) unless strictly necessary for the beam effects (preferring CSS/SVG for performance).

## Decisions

- **Architecture Migration (Pinia)**: Initialize Pinia and refactor `useViewportStore` and `useLightingEngine` into stores. This ensures compliance with the requirement that components DO NOT add local listeners.
- **Dynamic Flashlight Rotation**: The flashlight component will calculate the angle from its origin to the cursor via the `useViewportStore` mouse coordinates. Rotation and mask transforms will be CSS-driven.
- **CSS-Based Beam Reconstruction**: The light beam will be a combination of a transformable CSS mask and a semi-transparent overlay. All colors will be defined as CSS variables in `:root` or `[data-theme="cosmic-void"]`.
- **Stacked Layer Component**: A new `StackedCard` component will extend the `BentoCard` pattern, using `::before` and `::after` with `absolute` positioning and `z-index`.
- **Perspective Grid Logic**: The background grid will be a CSS pattern with its hotspot driven by the Pinia-managed `--mask-x` and `--mask-y` variables.

## Risks / Trade-offs

- **Migration Overhead**: Refactoring the existing singleton pattern to Pinia adds initial work but ensures long-term compliance with the project's senior development standards.
- **Performance**: Heavy use of `backdrop-filter` and masks. Mitigation: Use hardware-accelerated transforms and respect the unified transition duration.
