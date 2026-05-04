## 1. Store Optimization

- [x] 1.1 Refactor `usePerformanceStore.ts` to extract a synchronous `initTierFromOverrides` method.
- [x] 1.2 Update `checkPerformance` to call `initTierFromOverrides` first and skip the benchmark if a tier is already set.
- [x] 1.3 Ensure `isReady` is handled correctly for both sync and async flows to prevent unnecessary waiting.

## 2. Component Refactoring

- [x] 2.1 Modify `App.vue` to remove the `v-if="performance.isReady"` wrapper around the main content stage.
- [x] 2.2 In `App.vue`, wrap `<WebGLBackground />` with `v-if="performance.isWebGLSupported"`.
- [x] 2.3 Call `initTierFromOverrides` (or the refactored logic) early in `App.vue` setup to ensure reactive flags are set before the first render.

## 3. Verification & Cleanup

- [x] 3.1 Verify Tier 1 behavior by visiting `/?forceTier=1` and checking that Three.js is NOT loaded in the Network tab.
- [x] 3.2 Verify Tier 3 behavior by visiting `/?forceTier=3` and ensuring WebGL works as expected.
- [x] 3.3 Run `npm run lint` and `npm run test:unit` to ensure no regressions.
- [x] 3.4 Run Lighthouse audit locally or in CI to confirm the performance score improvement.
