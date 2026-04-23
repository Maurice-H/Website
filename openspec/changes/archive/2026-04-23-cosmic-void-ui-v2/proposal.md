## Why

The current website UI is functional but lacks the immersive, high-fidelity "wow factor" desired for a top-tier developer portfolio. The current "Spotlight" implementation is a basic CSS radial mask that feels clinical. 

The goal is to evolve the design into a "Cosmic Void" theme with "Enhanced Depth," as seen in the new mockups. This transition will introduce realistic lighting (flashlight/lamp), volumetric effects, and more sophisticated component styling (glassmorphism, stacked layers), creating a truly premium and memorable user experience.

## What Changes

- **Lighting Evolution**: Replace the basic radial mask with a dynamic lighting system that includes realistic light sources (a flashlight that follows the mouse and a hanging lamp for navigation).
- **Component UI Upgrade**: 
    - Implement a "stacked card" effect for bento grid items to add physical depth.
    - Enhance the "Experience" section with a terminal-like boot sequence animation.
    - Add a perspective background grid that reacts to the light source.
- **Atmospheric Effects**: Introduce volumetric light beams, glows, and smoother transitions between navigation and content phases.
- **Asset Integration**: Use SVG/CSS-based reconstructions or generated assets for the flashlight and lamp fixtures.

## Capabilities

### New Capabilities
- `dynamic-lighting-system`: A robust lighting engine that handles multiple light sources (flashlight, lamp), their rotations, and volumetric beam effects.
- `high-fidelity-ui-components`: A suite of premium components including `StackedCard`, `PerspectiveGrid`, and `TerminalBootSequence`.

### Modified Capabilities
- `navigation-system`: Update the `NavConveyor` to match the new "Hanging Lamp" aesthetic and ensure smooth phase transitions.
- `spotlight-mask-core`: Overhaul the base masking logic to support non-radial, transformable light beams.

## Impact

- **Affected Code**: `App.vue`, `src/components/layout/*`, `src/components/shared/FusedReveal.vue`, `src/composables/useLightingEngine.ts`, and individual feature components.
- **Dependencies**: No new external dependencies are expected; logic will be implemented with vanilla Vue 3 and CSS.
- **Performance**: While adding visual effects, care will be taken to ensure sub-second page loads and smooth 60fps animations.
