## Why

The current Performance Guard implementation (Tier 1) disables WebGL but lacks a visual backup. This results in a "broken" appearance (missing lights, invisible cursor in some states) on devices without hardware acceleration. We need a robust CSS/HTML fallback strategy (Graceful Degradation) to maintain the "Technical DNA" look even without GPU power.

## What Changes

1.  **CSS Ambient Lighting**: Implement a lightweight CSS-based background lighting system that activates on Tier 1.
2.  **Cursor Visibility Guard**: Ensure the system cursor is visible if the WebGL custom scanner is inactive.
3.  **BentoCard Performance Guard**: Add a "Low-End" mode for Bento cards to disable expensive CSS effects like `backdrop-filter` and complex masks.
4.  **Tier 1 Spotlight**: Implement a simple CSS radial-gradient spotlight that follows the mouse using existing viewport variables.

## Capabilities

### New Capabilities
- `resilience-layer`: A CSS-based fallback system for lighting and effects that activates on Tier 1 devices.

### Modified Capabilities
- `webgl-lighting-engine`: Update to support external visibility flags and hand-off to the resilience layer.

## Impact

- `App.vue`: Root layout updates for fallback lighting and cursor logic.
- `BentoCard.vue`: CSS optimization for low-performance tiers.
- `usePerformanceStore.ts`: Already handles tier detection; will now trigger the resilience layer.
