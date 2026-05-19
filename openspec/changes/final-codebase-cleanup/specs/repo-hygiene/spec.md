## REMOVED Requirements

### Requirement: BootSequence Component
**Reason**: Component was superseded by hardcoded values in NavConveyor.vue. Never rendered in the application.
**Migration**: No migration needed — component was already unused.

### Requirement: FusedReveal Transition Component
**Reason**: Visual reveal effect was replaced by WebGL-based transition system during the rendering pipeline migration.
**Migration**: No migration needed — component was already unused.

### Requirement: StackedCard Component
**Reason**: Stack layer visual effect was integrated directly into BentoCard.vue as CSS-only stack layers (`.layer-1`, `.layer-2`, `.layer-3`).
**Migration**: No migration needed — component was already unused.

### Requirement: ShortcutHints Display Component
**Reason**: Shortcut display functionality was inlined into the NavConveyor.vue shortcut bar (L122-L207).
**Migration**: No migration needed — component was already unused.

### Requirement: LightingToggle Standalone Widget
**Reason**: Lighting toggle functionality was absorbed by the NavConveyor shortcut bar (desktop) and BackToTop mobile toggles.
**Migration**: No migration needed — component was already unused.

### Requirement: ThemeToggle Standalone Widget
**Reason**: Theme toggle functionality was absorbed by the NavConveyor shortcut bar (desktop) and BackToTop mobile toggles.
**Migration**: No migration needed — component was already unused.

### Requirement: useAudioFeedback Composable
**Reason**: Superseded by the more capable `useAudio.ts` composable which supports multiple sound types (click, glitch, swoosh).
**Migration**: No migration needed — composable was already unused.

### Requirement: Contacts Data File
**Reason**: `CONTACT_METHODS` constant was superseded by `SOCIAL_LINKS` in `portfolio.ts`, which is already used by ContactForm.vue.
**Migration**: No migration needed — data file was already unused.

## MODIFIED Requirements

### Requirement: Barrel Export Integrity
All barrel export files (`index.ts`) SHALL only export components that are actively used in the application. Dead exports SHALL be removed.

#### Scenario: shared/index.ts after cleanup
- **WHEN** the `shared/index.ts` barrel is imported
- **THEN** it SHALL NOT export `BootSequence`, `FusedReveal`, or `StackedCard`

#### Scenario: navigation/index.ts after cleanup
- **WHEN** the `navigation/index.ts` barrel is imported
- **THEN** it SHALL NOT export `LightingToggle` or `ThemeToggle`

### Requirement: Type Definition Hygiene
The `types/index.ts` file SHALL only contain TypeScript interfaces that are actively imported by at least one source file.

#### Scenario: Unused interfaces removed
- **WHEN** the build completes after cleanup
- **THEN** the following interfaces SHALL NOT exist in `types/index.ts`: `BentoCardProps`, `BentoGridItem`, `MousePosition`, `HeroData`, `ToastOptions`

### Requirement: Unused Constants Removed
Data files SHALL NOT export constants that are never imported.

#### Scenario: SKILLS_DEFAULT_VISIBLE removed
- **WHEN** `portfolio.ts` is inspected after cleanup
- **THEN** the `SKILLS_DEFAULT_VISIBLE` constant SHALL NOT exist

### Requirement: Import Path Consistency
All source files SHALL use the `@/` path alias for imports from `src/`, instead of relative paths (`../../`).

#### Scenario: Consistent alias usage
- **WHEN** any `.vue` or `.ts` file imports from another `src/` directory
- **THEN** the import SHALL use `@/` prefix (e.g., `@/stores/lighting` instead of `../../stores/lighting`)

### Requirement: Flash-Overlay CSS Deduplication
The flash-overlay CSS rules SHALL exist in only one location.

#### Scenario: No duplicate flash-overlay
- **WHEN** the application CSS is inspected
- **THEN** `.flash-overlay` and `.flash-active` SHALL be defined only in `App.vue` (scoped), not in `index.css`

### Requirement: Composables Barrel Completeness
The `composables/index.ts` barrel file SHALL export all public composables.

#### Scenario: All composables exported
- **WHEN** `composables/index.ts` is inspected
- **THEN** it SHALL export `useAudio`, `useGitHubProjects`, `useKeyboardShortcuts`, `useResponsive`, `useTheme`, `useToast`, and `useViewportStore`

### Requirement: Stale Comments Removed
Source files SHALL NOT contain comments referencing deleted components.

#### Scenario: FusedReveal comment removed from App.vue
- **WHEN** `App.vue` is inspected
- **THEN** no comments SHALL reference `FusedReveal`
