## 1. Dead Code Removal — Components

- [x] 1.1 Delete `src/components/shared/BootSequence.vue`
- [x] 1.2 Delete `src/components/shared/FusedReveal.vue`
- [x] 1.3 Delete `src/components/shared/StackedCard.vue`
- [x] 1.4 Delete `src/components/navigation/ShortcutHints.vue`
- [x] 1.5 Delete `src/components/navigation/LightingToggle.vue`
- [x] 1.6 Delete `src/components/navigation/ThemeToggle.vue`

## 2. Dead Code Removal — Composables & Data

- [x] 2.1 Delete `src/composables/useAudioFeedback.ts`
- [x] 2.2 Delete `src/data/boot-sequence.json`
- [x] 2.3 Delete `src/data/contacts.ts`

## 3. Dead Code Removal — Tests for Deleted Components

- [x] 3.1 Delete test files for `LightingToggle.vue`
- [x] 3.2 Delete test files for `ThemeToggle.vue`
- [x] 3.3 Delete test files for `BootSequence.vue` (none found)
- [x] 3.4 Remove remaining imports/references to deleted files (App.spec.ts stubs)

## 4. Barrel Export Cleanup

- [x] 4.1 Remove `BootSequence`, `FusedReveal`, `StackedCard` exports from `src/components/shared/index.ts`
- [x] 4.2 Remove `LightingToggle`, `ThemeToggle` exports from `src/components/navigation/index.ts`
- [x] 4.3 Remove stale FusedReveal comment from `src/App.vue`

## 5. Unused Types & Constants

- [x] 5.1 Remove `BentoCardProps` interface from `src/types/index.ts`
- [x] 5.2 Remove `BentoGridItem` interface from `src/types/index.ts`
- [x] 5.3 Remove `MousePosition` interface from `src/types/index.ts`
- [x] 5.4 Remove `HeroData` interface from `src/types/index.ts`
- [x] 5.5 Remove `ToastOptions` interface from `src/types/index.ts`
- [x] 5.6 Remove `SKILLS_DEFAULT_VISIBLE` constant from `src/data/portfolio.ts`

## 6. Flash-Overlay CSS Deduplication

- [x] 6.1 Remove `.flash-overlay` and `.flash-active` rules from `src/index.css`

## 7. Build Verification Checkpoint

- [x] 7.1 Run `npm run build` — zero errors
- [x] 7.2 Run `npm run test:unit` — all tests pass

## 8. Create `useResponsive()` Composable

- [x] 8.1 Define the TypeScript interface for `useResponsive()` return type
- [x] 8.2 Implement `src/composables/useResponsive.ts` as singleton composable
- [x] 8.3 Add SSR guard (`typeof window !== 'undefined'`)

## 9. Replace Duplicate `isMobile` Implementations

- [x] 9.1 Replace `isMobile` in NavConveyor.vue with `useResponsive()`
- [x] 9.2 Replace `isMobile` in BackToTop.vue with `useResponsive()`
- [x] 9.3 Replace `isMobile` in App.vue with `useResponsive()`
- [x] 9.4 Replace `isMobile` in ContactForm.vue with `useResponsive()`
- [x] 9.5 Replace `isMobile` in ResilienceLayer.vue with `useResponsive()`

## 10. SEO & Accessibility Fixes

- [x] 10.1 Change `<h4>` to `<h3>` in SkillsAbout.vue
- [x] 10.2 Dynamic `document.documentElement.lang` sync — already handled by LocaleSwitcher.vue

## 11. Import Path Unification

- [x] 11.1 Convert all relative imports to `@/` alias imports

## 12. Composables Barrel Completion

- [x] 12.1 Update `src/composables/index.ts` with all public composables

## 13. Anti-Pattern Final Audit

- [x] 13.1 Magic numbers — no actionable instances found
- [x] 13.2 Event listener cleanup — all verified ✓
- [x] 13.3 No Options API usage — verified ✓
- [x] 13.4 No `any` types — verified ✓
- [x] 13.5 All form inputs have labels — verified ✓

## 14. Final Verification

- [x] 14.1 Run `npm run build` — zero errors ✓
- [x] 14.2 Run `npm run test:unit` — 31 files, 204 tests pass ✓
- [x] 14.3 Lighthouse audit — SEO: 100, Accessibility: 96, Best Practices: 100 ✓
- [x] 14.4 Visual smoke test — NAV→CONTENT, theme, locale all working ✓
- [x] 14.5 Browser console — zero application errors ✓
