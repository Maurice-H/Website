## Why

The current global lighting system, which uses CSS variables injected into DOM elements for radial-gradient light falloff and backdrop filters, causes severe layout thrashing under heavy load (e.g., hovering over complex components). This drops the frame rate to around 10-15 FPS on average systems. To achieve a stable 60-144 FPS performance, we need to bypass the browser's main-thread layout and compositor limitations and pivot to a WebGL-based architecture.

## What Changes

- Migrate the background lighting engine from CSS/DOM elements to a WebGL canvas layer using TresJS.
- Implement a custom Fragment Shader (GLSL) to handle spotlight physics, light attenuation, and beam effects.
- Remove redundant DOM-based lighting components (`SpotlightMask.vue`, `PerspectiveGrid.vue`, and `VolumetricBeam.vue`).
- Map existing `useViewportStore` stateless mouse variables (`--mouse-x`, `--mouse-y`) to WebGL uniforms.

## Capabilities

### New Capabilities
- `webgl-lighting`: Core integration of TresJS and Three.js to render a full-screen WebGL canvas and custom fragment shaders for performance-driven background effects.
- `performance-guard`: Intelligent tiered rendering strategy using `detect-gpu` to scale visual complexity (or disable WebGL entirely) based on the user's hardware capabilities.

### Modified Capabilities
- `micro-interactions`: Adjusts the underlying implementation of hover and background interactions to use WebGL shaders instead of CSS variables for the global background lighting.

## Impact

- **Dependencies**: Adds `tresjs`, `three`, and `detect-gpu` as core dependencies.
- **Component Architecture**: Introduces `WebGLBackground.vue` and `usePerformanceStore.ts`. Removes legacy DOM lighting layers.
- **Performance**: Dramatically reduces fill-rate pressure and GPU layer thrashing. Scales complexity dynamically to ensure 60 FPS on mid-range devices and battery preservation on low-end hardware.

## Non-goals

- Refactoring the content layer (Bento grid, UI text, icons). These remain standard DOM elements.
- Building complex 3D geometry; the shader runs on a flat 2D plane/quad.

## Testing Strategy

- **Visual Regression**: Playwright E2E tests to ensure the new WebGL shader accurately mimics the previous lighting look.
- **Performance Profiling**: Lighthouse audits and Chrome DevTools FPS metrics to verify 60+ FPS stability during continuous mouse movement over the Bento grid.
