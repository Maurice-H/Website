## Why

During an exploratory session, several minor UI glitches and performance bottlenecks were identified. The hardcoded "ESC" button ignores custom user shortcuts, the CSS fallback drone is practically invisible in the Blueprint theme on desktop, the custom cursor incorrectly shows on touch devices, and the WebGL drone model loading strategy introduces a jarring 3-second delay when transitioning between phases. Addressing these polishes the overall UX, ensures feature parity across themes, and tightens the visual performance.

## What Changes

- Hide the `.drone-scanner` (custom cursor) on mobile touch devices in `CSSBackground.vue`.
- Disable the custom system cursor hiding logic on mobile in `App.vue` to prevent "dead" interaction zones.
- Make the "Back" button text dynamically reflect the current keyboard shortcut from `useShortcutStore` in `App.vue`.
- Increase the base opacity and scale of the CSS fallback drone's light pulse, specifically targeting the Blueprint theme (`.drone-blueprint`) and amplifying it on desktop viewports (`>=768px`).
- Refactor the WebGL drone loading strategy in `WebGLScene.vue` to preload in the background immediately after the UFO loads, rather than blocking until the `CONTENT` phase transition.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `keyboard-navigation`: The global "Back" shortcut string is now bound reactively to the floating UI control.
- `dynamic-lighting-system`: Adjusted visual intensity of the CSS fallback state and refactored WebGL asset preloading timeline to eliminate transition popping.

## Impact

- `src/App.vue`: Minor template interpolation change.
- `src/components/layout/CSSBackground.vue`: Media query additions and opacity variable adjustments.
- `src/components/layout/WebGLScene.vue`: Lifecycle hook adjustments for `loadDroneModel()`.

## Non-goals

- We will not completely rewrite the WebGL loading pipeline or introduce a global loading screen.
- We will not redesign the Blueprint theme aesthetics, just tweak the existing fallback opacity variables.

## Testing Strategy

- **Unit Testing**: Minimal. We may ensure the `shortcutStore` is correctly mocked if tests for `App.vue` fail.
- **Manual/E2E Verification**:
  - Verify that the cursor disappears on mobile viewport emulation.
  - Rebind the 'back' action and verify the text changes in `App.vue`.
  - Toggle to Blueprint mode and verify the CSS fallback glow is visible.
  - Verify the WebGL transition from NAV to CONTENT has zero delay for the Drone asset to appear.
