## Why

CI runners (like GitHub Actions) often have virtualized GPUs or software-rendering environments that produce unreliable performance scores for WebGL-intensive applications. This leads to "false alarms" (failed builds) or hidden regressions (never testing high-end code paths). 

We need a deterministic way to verify all three performance tiers (Resilience, Optimized, High-End) in a controlled environment, ensuring the "technical DNA" aesthetic scales correctly from low-end mobile devices to high-end workstations.

## What Changes

1.  **Testability Hooks**: We will introduce a `forceTier` URL parameter to bypass hardware detection and force the application into a specific performance profile.
2.  **CI Optimization**: A `VITE_CI_MODE` flag will be implemented to eliminate long-running transitions (like intros) during performance audits, ensuring stable and reliable scores.
3.  **Lighthouse Matrix**: The Lighthouse CI configuration will be expanded to run a matrix of tests:
    - **Tier 1 (Strict)**: Must pass with high scores (>95) as the resilient baseline.
    - **Tier 2/3 (Advisory)**: Will be audited for regressions but will only issue warnings if performance drops below a relative baseline, acknowledging CI hardware limitations.

## Capabilities

### New Capabilities
- `performance-matrix-testing`: Extends the performance store and Lighthouse config to support multi-tier verification and CI-specific optimizations.

### Modified Capabilities
- `gpu-tiering`: Updates the logic to prioritize URL-based overrides for debugging and testing.

## Impact

- `src/stores/usePerformanceStore.ts`: Updated to handle `forceTier` overrides.
- `src/App.vue` (and others): Transition logic will respect `VITE_CI_MODE`.
- `.lighthouserc.json`: Restructured for matrix testing.
- `.github/workflows/ci.yml`: Updated to set `VITE_CI_MODE` and handle multi-target LHCI runs.
