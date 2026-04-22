## Context

The current repository lacks optimized CI/CD patterns and effective ignore rules for ephemeral agent data. This leads to slow pipelines and repository bloat.

## Goals / Non-Goals

**Goals:**
- **Performance**: Reduce CI runtime by caching heavy dependencies (Playwright browsers).
- **Consistency**: Build the application once and use that exact build for all subsequent tests and deployment.
- **Hygiene**: Ensure no debugging or temporary files are ever committed to the repository.
- **Environment Parity**: Run E2E tests against the production bundle.

**Non-Goals:**
- Setting up a staging environment.
- Changing the testing framework (Vitest/Playwright stay).
- Automating repository "pruning" of old branches.

## Decisions

1. **Playwright Caching**:
   - Rationale: Installing browsers on every run is the single largest bottleneck in the pipeline.
   - Implementation: Use `actions/cache` with a key derived from the `@playwright/test` version in `package-lock.json`.

2. **Single-Build Workflow**:
   - Rationale: Building twice (once for tests, once for deploy) is wasteful and introduces a risk of "deploying what you didn't test".
   - Implementation: 
     - Job 1 (`build-and-verify`): Lint, Type Check, Unit Test, Build. Upload `dist`.
     - Job 2 (`e2e-tests`): Download `dist`, run `npm run preview`, run Playwright.
     - Job 3 (`deploy`): Download `dist`, deploy to GitHub Pages.

3. **Production-Ready E2E**:
   - Rationale: Testing against `npm run dev` doesn't catch issues caused by minification or Vite's production bundling.
   - Implementation: Update `playwright.config.ts` or the CI command to use `npm run build` results via `npm run preview`.

4. **Strict `.gitignore`**:
   - Rationale: Clear separation between project code and agent-specific or debugging data.
   - Implementation: Add `artifacts/` and `scratch/` to the root `.gitignore`.

## Risks / Trade-offs

- **Artifact Storage**: Uploading/downloading the `dist` folder uses GitHub Action storage limits, though for this project size, it is negligible.
- **Cache Invalidation**: If Playwright is updated without updating the cache key logic, the CI might fail or use an old version (mitigated by using version-based keys).
