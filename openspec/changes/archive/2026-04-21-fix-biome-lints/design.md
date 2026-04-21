## Context

The portfolio codebase was recently refactored to professional standards, but the rapid implementation has left some "lint debt." Biome's static analysis identifies inconsistent import sorting, unused variables, and loose typing that violate our quality-assurance standards.

## Goals / Non-Goals

**Goals:**
- Zero linting errors or warnings in the `src/` directory.
- Consistent formatting and import ordering across all files.
- Improved type safety by eliminating `any`.

**Non-Goals:**
- Refactoring business logic or visual components (unless required to fix a type error).
- Adding new features or capabilities.

## Decisions

- **Decision: Biome Fix Priority**: We will run `biome check --write` as the first step to catch automated fixes (unused imports, formatting).
- **Decision: Import Sorting**: Biome's sorting rules will be enforced. If manual sorting is required for complex cases, we will adhere to alphabetical grouping (External -> Internal).
- **Decision: Test Isolation**: Any `export` keyword found in `.spec.ts` or `.test.ts` files will be removed. If a test file needs to share logic, that logic must be moved to a shared utility in `src/utils/` or `src/composables/`.
- **Decision: Specific Typing**: For every `any` found, we will trace the data source and apply a specific interface (e.g., `LightingState`, `PortfolioProject`) or use generics where appropriate.

## Risks / Trade-offs

- **Merge Conflicts**: Global formatting changes may cause merge conflicts if other feature branches are active. (Mitigation: Perform this fix on a clean state and merge immediately).
- **Runtime Breakage**: Removing exports from test files or changing types could theoretically break some dynamic imports or loose typing elsewhere. (Mitigation: Run full Vitest/Playwright suite after changes).
