## MODIFIED Requirements

### Requirement: forceTier Override
*(Modified to enforce synchronous execution)*

#### Scenario: Forced Tier 1
- **WHEN** the user visits `/?forceTier=1`
- **THEN** `usePerformanceStore` must set `gpuTier` to 1 and `isWebGLSupported` to `false` **synchronously** during the store initialization or before the first component mount.
- **AND** the automatic `detect-gpu` benchmark MUST NOT be executed.

### Requirement: CI Optimization Mode
*(Modified to focus on LCP)*

#### Scenario: Accelerated Intro in CI
- **WHEN** `import.meta.env.VITE_CI_MODE` is `true` or `?ciMode=true` is present
- **THEN** the content stage SHALL NOT be hidden by any initialization state.
- **AND** the LCP element SHALL be visible as soon as the main CSS is loaded.
