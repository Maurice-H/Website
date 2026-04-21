## 1. Foundation & Data Extraction

- [x] 1.1 Extract hardcoded content from `ProjectsSection.vue`, `SkillsAbout.vue`, and `NavConveyor.vue` into `src/data/portfolio.ts`.
- [x] 1.2 Define strict TS interfaces for the new data structures in `src/types/index.ts`.
- [x] 1.3 Create the new directory structure: `src/components/{layout,features,navigation,shared}`.

## 2. Shared Rendering Engine

- [x] 2.1 Implement `src/composables/useViewportStore.ts` as a singleton using ResizeObserver/IntersectionObserver.
- [x] 2.2 Create `src/components/shared/FusedReveal.vue` abstraction for dual-layer template rendering.
- [x] 2.3 Refactor `src/components/shared/BentoCard.vue` to use the centralized viewport store instead of local listeners.
- [x] 2.4 Add Vitest unit tests for the observer registration logic in `src/composables/__tests__/useViewportStore.spec.ts`.

## 3. Feature Migration

- [x] 3.1 Migrate Navigation components to `src/components/navigation/` and refactor `NavWindow.vue` into a slot-based architecture.
- [x] 3.2 Refactor `HeroSection.vue` to use `<FusedReveal>` and the centralized state.
- [x] 3.3 Refactor `SkillsAbout.vue` and `ProjectsSection.vue` to use the unified data mapping.
- [x] 3.4 Refactor `ContactForm.vue` to utilize the standard Fused component for all reveal effects.

## 4. Policy & Cleanup

- [x] 4.1 Update `src/composables/useLightingEngine.ts` to remove redundant mousemove listeners (coordinating with the new viewport store).
- [x] 4.2 Update `openspec/config.yaml` to include the new **Coding Guidelines** (no local listeners, DRY visuals, data extraction).
- [x] 4.3 Execute a global cleanup to remove any legacy "offset" tracking logic from individual components.
- [x] 4.4 Verify all E2E tests in Playwright (updating the POM if necessary to handle the new `FusedReveal` DOM tree).
