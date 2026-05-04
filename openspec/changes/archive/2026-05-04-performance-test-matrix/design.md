## Architecture Overview

The performance testing matrix is implemented by introducing a "manual override" layer into the `usePerformanceStore` and a "fast-track" mode for transitions. This allows Lighthouse CI to reliably audit every rendering engine (Resilience, Optimized, High-End) without being blocked by CI hardware limitations or long-running intros.

## Design Decisions

### 1. Store Override Logic
The `checkPerformance` method in `usePerformanceStore.ts` will be updated to check `URLSearchParams` before initiating the `getGPUTier` benchmark.
- **Approach**: Synchronous check of `window.location.search`.
- **Logic**: If `forceTier` is found, set state and `isReady = true` immediately.

### 2. CI-Mode Transition Control
We will use a combination of environment variables and URL parameters to signal "CI Mode".
- **Implementation**: A global utility or computed property that checks `VITE_CI_MODE || ciModeParam`.
- **Usage**: Components will use this to toggle transition durations (e.g., `:duration="isCiMode ? 0 : 500"`).

### 3. Lighthouse CI Configuration
The `.lighthouserc.json` will be refactored to use the `collect.url` array and `assert.assertions` with `matchingUrlPattern`.

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:4173/?forceTier=1&ciMode=true",
        "http://localhost:4173/?forceTier=2&ciMode=true",
        "http://localhost:4173/?forceTier=3&ciMode=true"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": [
          "error", 
          { "minScore": 0.95, "matchingUrlPattern": ".*forceTier=1" }
        ],
        "categories:performance": [
          "warn", 
          { "minScore": 0.85, "matchingUrlPattern": ".*forceTier=[23]" }
        ]
      }
    }
  }
}
```

## Data Flow

1.  **URL Parse**: App loads -> `usePerformanceStore` parses URL.
2.  **State Init**: `gpuTier` is set (Forced vs. Benchmarked).
3.  **UI Adapt**: Components read `isCiMode` and `gpuTier`.
4.  **Audit**: LHCI captures snapshots at specific tiers.

## Alternatives Considered

- **Forcing via Cookie/LocalStorage**: Rejected because URL parameters are more stateless and easier to configure in CI matrices.
- **Mocking detect-gpu**: Possible, but forcing at the store level is more robust as it covers cases where the benchmark might not even start.
