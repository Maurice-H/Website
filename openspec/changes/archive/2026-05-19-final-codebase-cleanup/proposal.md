## Why

The codebase has accumulated dead code, duplicate patterns, and minor technical debt from iterative feature development (e.g., BootSequence→NavConveyor, FusedReveal→WebGL, standalone toggles→shortcut bar). Before disabling the automated Jules agent and merging a final stable baseline, we need a comprehensive cleanup to remove orphaned files, fix SEO/accessibility gaps, consolidate duplicate logic, and ensure clean code principles (DRY, MVVM) are upheld across all components.

## What Changes

### Dead Code Removal
- **BREAKING** Remove `BootSequence.vue` + `boot-sequence.json` (replaced by fixed values in NavConveyor)
- **BREAKING** Remove `FusedReveal.vue` (replaced by WebGL transition system)
- **BREAKING** Remove `StackedCard.vue` (functionality merged into BentoCard stack layers)
- **BREAKING** Remove `ShortcutHints.vue` (inlined into NavConveyor shortcut bar)
- **BREAKING** Remove `LightingToggle.vue` + `ThemeToggle.vue` (replaced by shortcut bar + BackToTop mobile toggles)
- **BREAKING** Remove `useAudioFeedback.ts` (superseded by `useAudio.ts`)
- **BREAKING** Remove `contacts.ts` (superseded by `SOCIAL_LINKS` in `portfolio.ts`)
- Remove 5 unused TypeScript interfaces: `BentoCardProps`, `BentoGridItem`, `MousePosition`, `HeroData`, `ToastOptions`
- Remove unused constant `SKILLS_DEFAULT_VISIBLE`
- Remove dead Flash-Overlay CSS from `index.css` (duplicate of scoped version in App.vue)
- Clean barrel exports (`shared/index.ts`, `navigation/index.ts`)
- Remove stale FusedReveal comment in App.vue

### SEO & Accessibility Fixes
- Fix heading hierarchy skip: `<h4>` → `<h3>` in SkillsAbout.vue
- Make `<html lang>` attribute dynamic based on active i18n locale

### DRY Consolidation
- Extract shared `isMobile` logic into `useResponsive()` composable (replaces 4 duplicate implementations with separate resize listeners)
- Fix `App.vue` computed `isMobile` bug (doesn't react to resize events)
- Unify import style to consistently use `@/` path aliases
- Resolve `composables/index.ts` (either complete or remove)

### Anti-Pattern Cleanup
- Audit for remaining anti-patterns: magic numbers, long methods, tightly coupled components
- Verify all event listeners have proper cleanup in `onUnmounted`
- Check for proper error boundary patterns

## Non-Goals
- No new features or visual changes
- No dependency upgrades
- No test refactoring (only test removal for deleted components)
- No ContactForm.vue split (stable enough, defer to separate change)

## Testing Strategy
- Run `npm run build` to verify no broken imports after deletions
- Run `npm run test:unit` to confirm no test regressions
- Run Lighthouse audit for SEO score improvement after semantic fixes
- Visual verification that the site renders correctly

## Capabilities

### New Capabilities
- `responsive-breakpoints`: Shared `useResponsive()` composable providing reactive `isMobile`, `isTablet` breakpoint state via a single resize listener

### Modified Capabilities
- `repo-hygiene`: Remove all identified dead code files, unused types, stale exports, and orphaned data files
- `quality-assurance`: Fix heading hierarchy, dynamic lang attribute, and import style consistency

## Impact

- **Deleted files**: 9 component/data files + associated test files
- **Modified files**: `types/index.ts`, `shared/index.ts`, `navigation/index.ts`, `portfolio.ts`, `index.css`, `App.vue`, `SkillsAbout.vue`, `NavConveyor.vue`, `BackToTop.vue`, `ContactForm.vue`, `ResilienceLayer.vue`
- **New files**: `src/composables/useResponsive.ts`
- **Bundle size**: Reduced (removing ~2KB of dead component code)
- **Tests**: Remove tests for deleted components (LightingToggle, ThemeToggle, BootSequence if any)
- **No runtime behavior changes** for end users (cleanup only)
