## Context

The portfolio codebase has grown through iterative feature development over multiple milestones. Several components were superseded by newer implementations but never removed:
- `BootSequence.vue` → values hardcoded into `NavConveyor.vue`
- `FusedReveal.vue` → replaced by WebGL transition system
- `StackedCard.vue` → stack layer effect merged into `BentoCard.vue`
- `ShortcutHints.vue` → inlined into `NavConveyor.vue` shortcut bar
- `LightingToggle.vue` / `ThemeToggle.vue` → replaced by shortcut bar + BackToTop mobile toggles
- `useAudioFeedback.ts` → superseded by `useAudio.ts`
- `contacts.ts` → superseded by `SOCIAL_LINKS` in `portfolio.ts`

Additionally, a DRY violation has been identified: `isMobile` detection is implemented 4 times independently, with `App.vue`'s version containing a bug (doesn't react to resize). SEO heading hierarchy has a gap (`h1` → `h4`, skipping `h2`/`h3`), and `<html lang>` is hardcoded despite i18n support.

## Goals / Non-Goals

**Goals:**
- Remove all orphaned files and their barrel exports
- Remove unused TypeScript interfaces and constants
- Extract a shared `useResponsive()` composable to replace 4 duplicate `isMobile` implementations
- Fix SEO heading hierarchy (`h4` → `h3` in SkillsAbout)
- Make `<html lang>` reactive to i18n locale changes
- Unify import paths to `@/` alias convention
- Ensure zero test regressions after cleanup

**Non-Goals:**
- No ContactForm.vue split (stable, defer to future change)
- No new features or visual changes
- No dependency upgrades
- No test refactoring beyond removing tests for deleted components
- No changes to WebGL pipeline or shader code

## Decisions

### D1: `useResponsive()` as a Singleton Composable (not Pinia Store)

**Decision**: Implement `useResponsive()` as a module-level singleton composable using shared `ref()` instances, not a Pinia store.

**Rationale**: The project already has `useViewportStore` for element visibility tracking, but breakpoint state is a simpler concern. A singleton composable avoids polluting Pinia devtools with trivial state, and the shared `ref()` pattern is idiomatic Vue 3. The single `resize` listener is registered on first import and never removed (lives for app lifetime).

**Alternative considered**: Extending `useViewportStore` — rejected because viewport store manages DOM element registration/intersection, which is a different concern. Adding breakpoint logic would violate SRP.

### D2: Delete-First Approach

**Decision**: Delete all dead files first, then fix imports/exports, then run tests.

**Rationale**: Clean deletions can be verified immediately via `npm run build`. If any import is missed, the build fails with a clear error pointing to the broken reference. This is safer than trying to simultaneously refactor and delete.

### D3: Keep `composables/index.ts` but Complete It

**Decision**: Retain the barrel file and add all public composables to it, rather than deleting it.

**Rationale**: The barrel exists but is incomplete. Completing it establishes a consistent import pattern (`@/composables`) matching the existing `@/components/shared` and `@/components/navigation` barrels.

### D4: Preserve `console.warn`/`console.error` Calls

**Decision**: Keep existing `console.warn` and `console.error` calls.

**Rationale**: These are all in legitimate error-handling paths (GPU detection failure, audio play failure, DNS verification failure, 3D model loading failure). They provide useful debugging information in production without being noise. `console.log` (debug-level) is already absent.

### D5: Dynamic `lang` via i18n `watch`

**Decision**: Add a `watchEffect` in `main.ts` (or `App.vue`) that sets `document.documentElement.lang` whenever the i18n locale changes.

**Rationale**: This is the simplest approach — 2 lines of code in the app root. No new component needed.

## Risks / Trade-offs

**[Risk] Deleting components that are used in untested paths** → Mitigation: `npm run build` will catch any broken imports. We've verified all references via grep across the entire `src/` tree.

**[Risk] Tests for deleted components fail in CI** → Mitigation: Delete test files for removed components in the same commit. Verify via `npm run test:unit`.

**[Risk] `useResponsive()` singleton may not SSR-safe** → Mitigation: Project is an SPA (no SSR). The `typeof window !== 'undefined'` guard already exists in current implementations and will be preserved.

**[Risk] Import path unification creates large diff** → Mitigation: This is purely a search-and-replace of relative paths to `@/` aliases. No logic changes. Can be verified by build + tests.

## Open Questions

None — all decisions are resolved based on the audit findings.
