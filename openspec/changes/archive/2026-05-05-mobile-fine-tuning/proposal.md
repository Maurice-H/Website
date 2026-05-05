## Why

The current implementation of the portfolio has several UX and visual issues on mobile devices. Specifically, the "Fused" aesthetic—where WebGL and DOM elements interact—suffers from layout misalignments in the Bento Grid, and the interactive HUD-scanner (custom cursor) does not correctly track touch input. Improving the mobile experience is critical for a modern portfolio.

## What Changes

- **Mobile Layout Fixes:** Adjusting container paddings, z-index hierarchies, and Tailwind breakpoints in the Bento Grid to ensure content fits perfectly on small screens.
- **Touch Cursor Tracking:** Extending the `WebGLBackground` and `lightingStore` logic to capture and project touch events into the 3D scene, ensuring the HUD-scanner follows the user's finger.
- **Responsive Immersion:** Refining CSS masks and radial gradients used for the "Reveal" effect to be more performant and visually balanced on mobile viewports.

## Capabilities

### New Capabilities
- `mobile-touch-tracking`: Capturing touch events and translating them into normalized coordinates for WebGL shader uniforms.

### Modified Capabilities
- `bento-grid`: Adjusting responsive layout rules for the content phase.
- `webgl-background`: Updating the input handling layer to support both mouse and touch.

## Impact

- **UI/UX:** Seamless interaction on mobile devices with functional HUD tracking.
- **Components:** Updates to `App.vue`, `NavConveyor.vue`, and `WebGLBackground.vue`.
- **Stores:** Potential updates to `useViewportStore` to handle touch-specific state if needed.
