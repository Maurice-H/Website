## Why

The UI/UX foundation for the premium developer portfolio is stable, making this the ideal time to establish a robust Quality Assurance (QA) pipeline. Currently, the project lacks unit testing, linting, end-to-end testing, continuous integration and continuous deployment. Building these systems using state-of-the-art tools ensures code quality scales with project complexity, prevents regressions, and catches bugs in Hot Module Replacement (HMR) speeds, while standardizing team formats.

## What Changes

- Add **Biome** as a unified Rust-based linter and formatter, replacing the slower ESLint and Prettier setup.
- Integrate **Vitest** for unit and component testing, utilizing the existing Vite configuration for instant feedback strings.
- Introduce **Playwright** for deep end-to-end visual and interaction testing, specifically for verifying the complex Blueprint/Theme toggle mechanics.
- Add a **GitHub Actions** pipeline that automatically verifies Biome formatting/linting, typechecking, runs Vitest on every Pull Request or push to main and deploys the website to GitHub Pages.

## Capabilities

### New Capabilities
- `quality-assurance`: Defines the tools, expectations, and CI/CD mechanisms for ensuring correctness and code formatting across the software lifecycle.

### Modified Capabilities
- *None*

## Impact

- All new Feature branches and PRs must pass the Biome format/lint checks, typechecks and Vitest automation.
- Adds new NPM devDependencies (`@biomejs/biome`, `vitest`, `@vue/test-utils`, `@playwright/test`).
- Extends the OpenSpec global configuration (`config.yaml`) to mandate tests and checks for future AI context limits.

## Non-goals

- Implementing full 100% test coverage retroactively over the entire application; this focuses purely on pipeline creation and setting up reference tests to guide future changes.
- Setting up automated production deployment endpoints (CD) right now; the current focus is entirely on Continuous Integration (CI) and pre-merge code QA.
