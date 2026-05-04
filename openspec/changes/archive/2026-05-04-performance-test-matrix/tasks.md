## 1. Testability Hooks (Store)

- [x] 1.1 Update `usePerformanceStore.ts` to parse `URLSearchParams` for `forceTier`.
- [x] 1.2 Implement the override logic: if `forceTier` exists, set `gpuTier` and `isWebGLSupported` (Tier 1 = false, Tier 2/3 = true) and mark `isReady = true`.
- [x] 1.3 Add a `isCiMode` computed property to the store that checks for `VITE_CI_MODE` or `?ciMode=true`.

## 2. CI Optimization (UI)

- [x] 2.1 Update `App.vue` (and any other components with long intro transitions) to use `isCiMode` to set transition durations to 0.
- [x] 2.2 Verify that the loading screen disappears instantly when `ciMode=true` is active.

## 3. Lighthouse CI Configuration

- [x] 3.1 Update `.lighthouserc.json` to include the URL matrix (Tier 1, 2, 3 with `ciMode=true`).
- [x] 3.2 Configure assertions in `.lighthouserc.json` to differentiate between "error" (Tier 1) and "warn" (Tier 2/3).
- [x] 3.3 Update GitHub Actions workflow (`.github/workflows/ci.yml`) to set `VITE_CI_MODE=true` during the Lighthouse build step.

## 4. Verification

- [x] 4.1 Manually verify `/?forceTier=1` disables WebGL.
- [x] 4.2 Manually verify `/?ciMode=true` skips the intro.
- [x] 4.3 Run local Lighthouse CI simulation to ensure the matrix is picked up correctly.
- [x] 4.4 Run Biome check and unit tests.
