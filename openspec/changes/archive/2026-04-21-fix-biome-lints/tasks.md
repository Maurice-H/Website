## 1. Automated Fixes & Cleanup

- [x] 1.1 Run `npx @biomejs/biome format ./src --write` to apply global formatting consistency.
- [x] 1.2 Run `npx @biomejs/biome check ./src --write` to automatically remove unused imports and fix basic lint errors.
- [x] 1.3 Audit all import and export statements in `src/` to ensure they are alphabetically ordered.

## 2. Manual Lint Fixes

- [x] 2.1 Identify and remove all `export` statements from test files (`src/**/*.spec.ts` or `src/**/*.test.ts`).
- [x] 2.2 Global search for `: any` in the `src/` directory.
- [x] 2.3 Replace `any` types in `useLightingEngine.ts` and `useViewportStore.ts` with specific interfaces (`LightingState`, `MousePosition`, etc.).
- [x] 2.4 Fix descending specificity warnings in `src/index.css` or component-level `<style>` blocks by reordering or nesting selectors.

## 3. Verification & Compliance

- [x] 3.1 Run `npm run test:unit` (Vitest) to ensure no regressions were introduced by type changes or test file refactoring.
- [x] 3.2 Run `npm run test:e2e` (Playwright) to verify visual stability and interaction consistency.
- [x] 3.3 Final run of `npx @biomejs/biome check ./src` to confirm zero remaining errors or warnings.
