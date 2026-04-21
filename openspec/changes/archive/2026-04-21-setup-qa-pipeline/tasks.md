## 1. Package Initialization & Formatting

- [x] 1.1 Add dependencies: `@biomejs/biome`, `vitest`, `@vue/test-utils`, `@playwright/test` to devDependencies.
- [x] 1.2 Initialize Biome via CLI (`npx @biomejs/biome init`) to scaffold the baseline `biome.json`.
- [x] 1.3 Execute a global codebase sanitization (`biome format --write ./src` and `biome lint --apply ./src`) to establish a zero-warning baseline state.
- [x] 1.4 Build the CI Action Pipeline: Create `.github/workflows/ci.yml` configuring `ubuntu-latest`, node setup, biome check, and vitest execution.

## 2. Component Testing Structure (Vitest)

- [x] 2.1 Update the local `vite.config.ts` context to natively support Vitest parameters and mappings.
- [x] 2.2 Define TS Types/Mocks: Setup a helper file or internal interface declaring mock states specifically for `LightingConfig` objects during execution contexts.
- [x] 2.3 Create `src/composables/__tests__/useLightingEngine.spec.ts` and import the lighting engine logic.
- [x] 2.4 Construct component tests validating that `getFusedMaskStyle()` calculates specific pixel matrices correctly when fed string CSS variables (`var(--el-left)`).

## 3. End-to-End Visual Integration (Playwright)

- [x] 3.1 Bootstrap the Playwright config via `npx playwright install` and assign standard Chromium tracking logic into a new `playwright.config.ts`.
- [x] 3.2 Define TS Interfaces for Playwright POM (Page Object Model) structures simulating standard User/Viewport boundaries.
- [x] 3.3 Create the core `tests/theme-toggle.spec.ts` regression sequence.
- [x] 3.4 Build Playwright Task: Load `http://localhost:5173`, query the DOM for the "Toggle Theme" interactive button, script a pointer click, and assert that `document.documentElement` receives `data-theme="blueprint"`.
