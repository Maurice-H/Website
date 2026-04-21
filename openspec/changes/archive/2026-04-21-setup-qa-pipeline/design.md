## Context

The portfolio is growing in complexity, heavily leveraging Vue 3's Composition API and a custom global "Lighting Engine" for the dark/light toggle. Currently, there is an absolute lack of automated quality assurance. Formatting is unstructured, there are no tests ensuring the composable logic behaves correctly under scaling, and there is no automated pipeline checking incoming code. Setting up these foundational tools now prevents massive technical debt later.

## Goals / Non-Goals

**Goals:**
- Provide instant, standardized formatting and bug-catching using Biome.
- Establish a unit and component testing structure using Vitest that plugs directly into the existing Vite config.
- Prepare a robust E2E testing framework using Playwright for visual tests on the "Blueprint" feature.
- Set up a baseline CI/CD loop (GitHub Actions) preventing regressions and Deploying via GitHub Pages.

**Non-Goals:**
- Creating a strict test-driven development (TDD) culture immediately. We are providing the *tools*, not enforcing 100% test coverage retroactively yet.

## Decisions

- **Use Biome instead of ESLint + Prettier:** Biome is written in Rust, acts as both a linter and a formatter, executes in milliseconds, and eliminates the frequent rule conflicts between ESLint and Prettier. It requires a singular `biome.json` which is trivial to maintain.
- **Use Vitest instead of Jest:** Since the project uses Vite, Vitest works entirely out-of-the-box by consuming the same `vite.config.ts`, handling Vue SFCs natively. It comes with full HMR (Hot Module Replacement) out of the box.
- **Use Playwright instead of Cypress for E2E:** Playwright offers natively deep integration with modern browser context generation and handles shadow DOMs efficiently. It guarantees faster parallel execution which becomes critical for visual regression testing of the dark/light theme switch.
- **Use GitHub Actions specifically:** The ecosystem relies heavily on Open Source, and GitHub Actions is free and ubiquitous.

## Risks / Trade-offs

- **[Risk] High initial learning curve for Playwright.**
  - **Mitigation:** Start with a single, highly documented "Happy Path" test that toggles the theme and checks the URL layout so developers have an explicit reference.
- **[Risk] Biome catching hundreds of legacy formatting offenses upon instantiation.**
  - **Mitigation:** Run `biome format --write` and `biome lint --apply` as a massive one-off commit to sanitize the entire codebase before turning the CI rules strictly on.
