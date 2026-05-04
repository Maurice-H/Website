# Quality Assurance

## Purpose
This capability defines the automated testing and code quality standards for the portfolio project, ensuring visual stability, logical correctness, and consistent formatting across the codebase.

## Requirements

### Requirement: Static Code Quality Analysis
The system SHALL employ Biome to format and lint all source files, enforcing alphabetical import sorting and zero-unused-import policies.

#### Scenario: Alphabetical Import Check
- **WHEN** the `biome check` command is executed
- **THEN** it SHALL flag any imports or exports that are not alphabetically ordered within their respective groups.

#### Scenario: Zero Unused Imports
- **WHEN** an import statement is not referenced in the component logic or template
- **THEN** Biome SHALL report an error and, if run with `--write`, automatically remove the statement.

### Requirement: Granular Component Testing
Test files SHALL remain isolated and SHALL NOT export variables or functions to the rest of the application.

#### Scenario: Test File Export Check
- **WHEN** a `.spec.ts` or `.test.ts` file contains a named or default export
- **THEN** the linting check SHALL fail, requiring the export to be removed or moved to a shared utility.

#### Scenario: Vitest execution against a Vue Component
- **WHEN** the `npm run test:unit` script is executed
- **THEN** Vitest imports the Vite configuration and parses `.vue` SFCs accurately, returning pass/fail metrics within milliseconds.

### Requirement: Full-Stack E2E Interrogation
The system SHALL run browser-level automated interaction sequences using Playwright to ensure the final bundle is functionally stable in a real browser.

#### Scenario: Visual Regression Toggle Check
- **WHEN** the automated Playwright script targets the theme toggle button and clicks it
- **THEN** the test script SHALL verify that the document's HTML or body tag correctly sets the data attribute `data-theme="blueprint"`.

### Requirement: Playwright Browser Caching
The CI pipeline must cache Playwright browsers to avoid redundant downloads in every run.

#### Scenario: Subsequent CI Runs
- **WHEN** a CI run starts and a cache for the current Playwright version exists
- **THEN** the pipeline should restore the browsers from cache instead of downloading them

### Requirement: Shared Build Artifact
The application must be built once and the resulting `dist` directory must be shared between all pipeline jobs.

#### Scenario: Production Deployment
- **WHEN** the deployment job starts
- **THEN** it must use the `dist` artifact generated and verified in the previous jobs

### Requirement: Environment Parity Testing
E2E tests must be executed against the actual production build.

#### Scenario: E2E Verification
- **WHEN** Playwright tests are executed in CI
- **THEN** they should run against the contents of the `dist` folder using `npm run preview`

### Requirement: Continuous Pre-Merge Integration
The GitHub repository SHALL feature a workflow (`.github/workflows/ci.yml`) that acts as a gatekeeper for incoming Pull Requests or direct pushes to `main`.

#### Scenario: Pushing a Pull Request
- **WHEN** new commits are pushed to a remote branch
- **THEN** the CI runner checks out the repository, installs dependencies, and runs `biome ci` and `vitest run`, passing the PR only if all exit nodes are cleanly resolved.

### Requirement: Centralized Coordinate Verification
The system SHALL support unit tests that verify the `useViewportStore` correctly calculates and broadcasts coordinate updates to registered components.

#### Scenario: Mocking Viewport Events
- **WHEN** a mock scroll event is dispatched to the centralized viewport service
- **THEN** all registered sub-components SHALL receive updated offset vectors via reactive subscriptions.

### Requirement: Fused Reveal Regression Testing
The system SHALL maintain E2E test coverage for the `<FusedReveal>` component to ensure that content parity between layers is preserved during visual transitions.

#### Scenario: Content Parity Check
- **WHEN** the Playwright suite inspects a Fused component
- **THEN** it SHALL verify that the text content of the Blueprint layer matches the text content of the Finished layer exactly.

### Requirement: Type Strictness
The system SHALL NOT use the `any` type for variable declarations, function parameters, or return types.

#### Scenario: specific typing enforcement
- **WHEN** a developer uses `any` in a TypeScript file
- **THEN** the compiler or linter SHALL flag it, requiring a specific type or interface to be defined.

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
