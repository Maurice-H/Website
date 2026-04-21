# Quality Assurance

## Purpose
This capability defines the automated testing and code quality standards for the portfolio project, ensuring visual stability, logical correctness, and consistent formatting across the codebase.

## Requirements

### Requirement: Static Code Quality Analysis
The system SHALL employ Biome to format all source files and lint against modern JavaScript and Vue best practices to prevent runtime bugs and formatting discrepancies.

#### Scenario: Pre-commit or pipeline failure
- **WHEN** a developer attempts to commit code with messy formatting, unused variables, or bad typing assignments
- **THEN** Biome SHALL flag these errors via the CLI execution, and if run in CI, fail the build pipeline.

### Requirement: Granular Component Testing
The system SHALL utilize Vitest to execute component-level isolated tests, particularly for complex logic like global state systems (e.g., Theme/Lighting Config).

#### Scenario: Vitest execution against a Vue Component
- **WHEN** the `npm run test:unit` script is executed
- **THEN** Vitest imports the Vite configuration and parses `.vue` SFCs accurately, returning pass/fail metrics within milliseconds.

### Requirement: Full-Stack E2E Interrogation
The system SHALL run browser-level automated interaction sequences using Playwright to ensure the final bundle is functionally stable in a real browser.

#### Scenario: Visual Regression Toggle Check
- **WHEN** the automated Playwright script targets the theme toggle button and clicks it
- **THEN** the test script SHALL verify that the document's HTML or body tag correctly sets the data attribute `data-theme="blueprint"`.

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
