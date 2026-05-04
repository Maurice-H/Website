## Context

The application currently halts all rendering until a GPU benchmark (via `detect-gpu`) completes. This is particularly detrimental on mobile devices where the benchmark is slow, causing a blank screen for ~3 seconds. Additionally, Three.js is loaded regardless of the performance tier, wasting bandwidth on Tier 1 devices.

## Goals / Non-Goals

**Goals:**
- Eliminate the initial blank screen by removing the global `v-if="performance.isReady"`.
- Prevent the download of `three-vendor` on Tier 1 devices.
- Ensure LCP elements (e.g., "Technical DNA" text) paint within <1s on Mobile Tier 1.
- Maintain immediate loading of WebGL for Tier 2/3 users where possible.

**Non-Goals:**
- Refactoring the entire WebGL engine.
- Implementing manual tree-shaking for Three.js (we rely on conditional loading instead).

## Decisions

### 1. Non-Blocking Main Content
We will remove the `v-if="performance.isReady"` wrapper from the `content-stage` in `App.vue`.
- **Rationale:** The static content (text, layout) does not depend on the GPU tier. Showing it immediately improves LCP and user perceived performance.
- **Implementation:** The background components (`WebGLBackground`, `ResilienceLayer`) already have internal logic to handle `isReady`. They will simply stay hidden/transparent until the benchmark finishes.

### 2. Synchronous Override Check
We will split the performance check into a synchronous "Initial Check" and an asynchronous "Benchmark".
- **Rationale:** If a `forceTier` or `ciMode` is detected via URL params or Env vars, we know the tier instantly. Setting `isWebGLSupported` synchronously in `setup` allows Vue to skip rendering (and thus loading) the `WebGLBackground` component during the first render cycle.
- **Implementation:** Update `usePerformanceStore` to perform the override check immediately.

### 3. Conditional Component Rendering
Wrap the `<WebGLBackground />` in `App.vue` with `v-if="performance.isWebGLSupported"`.
- **Rationale:** This ensures that if the tier is determined to be 1 (either via sync override or async benchmark), the heavy WebGL component and its Three.js dependencies are not pulled into the browser.
- **Note:** Since `isWebGLSupported` defaults to `true`, Tier 2/3 users will still start downloading the assets immediately, which is desired for performance.

## Risks / Trade-offs

- **Background Flash:** For Tier 1 users where no override is provided, the browser *might* start downloading `three-vendor` before the async benchmark finishes and sets `isWebGLSupported` to `false`. 
- **Mitigation:** The sync check for `ciMode` and `forceTier` completely solves this for Lighthouse/CI environments. For real Tier 1 users, the download might start but will be aborted or unused once the benchmark finishes (which is still better than the current "always load" behavior).
