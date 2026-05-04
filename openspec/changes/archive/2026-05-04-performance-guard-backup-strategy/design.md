## Context

The "Performance Guard" currently gates WebGL rendering based on hardware tiers. On Tier 1 (low-end/software rendering), WebGL is disabled to preserve performance. However, this creates a visual vacuum where the application's signature "Lighting Engine" (spotlights, beams, scanners) is missing, and the system cursor might be hidden incorrectly.

## Goals / Non-Goals

**Goals:**
- Provide a CSS-based ambient light for NAV phase on Tier 1.
- Provide a CSS-based spotlight for CONTENT phase on Tier 1.
- Ensure system cursor visibility logic is robust across all tiers.
- Optimize `BentoCard` for low-end hardware by disabling expensive filters.

**Non-Goals:**
- Replicating complex GLSL shaders (noise, grain, bloom) in CSS.
- Implementing 3D post-processing effects for Tier 1.

## Decisions

1.  **Resilience Layer in App.vue**:
    - Add a `div.resilience-layer` that renders only when `!performance.isWebGLSupported`.
    - Use `radial-gradient` backgrounds to simulate the lighting.
2.  **Cursor Visibility Handoff**:
    - Modify `isCustomCursorActive` to check `performance.isWebGLSupported`. If false, the system cursor remains visible even if lighting is enabled.
3.  **BentoCard Tier-Awareness**:
    - Use a computed property or CSS class on the `BentoCard` to detect Tier 1 and disable `backdrop-filter: blur()`.
    - Simplify the 3D stack (reduce layers or disable translation) to avoid layout thrashing on weak CPUs.
4.  **CSS Spotlight**:
    - Use the existing `--mask-x/y` variables in `viewport.ts` to position a CSS `radial-gradient` spotlight.

## Risks / Trade-offs

- **Visual Divergence**: The CSS fallback will look "cleaner" and less organic than the WebGL shaders (no grain/noise).
- **CSS Performance**: Even `radial-gradients` can be expensive on extremely old mobile browsers if they cover the whole screen. We will keep the fallback simple.
