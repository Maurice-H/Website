## Why

The current mobile performance score (Tier 1) in Lighthouse is stuck below 95 due to two primary bottlenecks:
1. **LCP Render Blocking**: The entire application content is hidden behind a `v-if="performance.isReady"` check in `App.vue`. This flag only becomes true after the GPU benchmark completes. On mobile devices with throttled CPUs, this benchmark takes up to 3 seconds, leading to a massive "Render Delay" for the Largest Contentful Paint.
2. **Payload Bloat**: The `three-vendor` bundle (Three.js and TresJS) is downloaded even on Tier 1 devices where WebGL is disabled. This is because the `WebGLBackground` component is imported and placed in the template in a way that triggers an immediate fetch.
3. **Unused Code**: ~171 KiB of the Three.js bundle is unused, impacting mobile load times.

## What Changes

We will refactor the rendering flow and resource loading strategy to:
- **Prioritize LCP**: Allow the main UI and "Technical DNA" text to render immediately while the GPU benchmark runs in the background.
- **Lazy-Load WebGL**: Conditionally render the `WebGLBackground` component only if the device supports WebGL (Tier 2+), preventing the Three.js payload on Tier 1 devices.
- **Short-circuit Overrides**: Optimize the performance store to handle `forceTier` and `ciMode` synchronously at the start, ensuring correct tier detection before the first render.

## Capabilities

### New Capabilities
- `performance-resilience`: Explicit requirements for non-blocking performance benchmarking and tier-based resource allocation.

### Modified Capabilities
- `fused-rendering-engine`: Update rendering strategy to allow non-blocking UI paint during system initialization.
- `quality-assurance`: Update performance targets to ensure >95 score on Mobile Tier 1.

## Impact

- **App.vue**: Refactor template logic to remove blocking `v-if`.
- **usePerformanceStore.ts**: Refactor `checkPerformance` for early exits and synchronous override handling.
- **Bundle Size**: Significant reduction in initial payload for Tier 1 users (no Three.js).
- **LCP**: Expected reduction from ~3s to <1s.
