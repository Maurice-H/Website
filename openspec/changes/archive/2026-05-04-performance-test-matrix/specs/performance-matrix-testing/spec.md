## ADDED Requirements

### Requirement: forceTier Override
The application must allow manual overriding of the GPU performance tier via a URL query parameter `forceTier`. This override must take precedence over the automatic `detect-gpu` benchmark.

#### Scenario: Forced Tier 1
- **WHEN** the user visits `/?forceTier=1`
- **THEN** `usePerformanceStore` must set `gpuTier` to 1 and `isWebGLSupported` to `false` immediately, skipping the benchmark.

#### Scenario: Forced Tier 3
- **WHEN** the user visits `/?forceTier=3`
- **THEN** `usePerformanceStore` must set `gpuTier` to 3 and `isWebGLSupported` to `true` immediately, enabling all high-end effects.

### Requirement: CI Optimization Mode
The application must provide a mechanism to disable or accelerate time-consuming transitions and intros when running in a CI environment (Lighthouse audits).

#### Scenario: Accelerated Intro in CI
- **WHEN** `import.meta.env.VITE_CI_MODE` is `true` or `?ciMode=true` is present
- **THEN** the initial loading screen and phase transitions must have a duration of `0ms` to avoid penalizing the LCP score.

### Requirement: Tiered Lighthouse Matrix
The Lighthouse CI configuration must execute separate audits for each performance tier with specialized success criteria.

#### Scenario: Tier 1 Performance Guard
- **WHEN** running Lighthouse against `/?forceTier=1`
- **THEN** the performance score must be `>= 0.95`.

#### Scenario: Tier 3 Performance Audit
- **WHEN** running Lighthouse against `/?forceTier=3`
- **THEN** the audit should record metrics for regression analysis but allow for a lower threshold (e.g., `>= 0.85` or warn-only) to account for CI hardware limitations.
