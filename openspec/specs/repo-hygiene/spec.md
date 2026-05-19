# Repository Hygiene

## Purpose
This capability defines the rules for maintaining a clean and efficient repository structure, ensuring that only necessary source code and configuration files are tracked by version control, while ephemeral or sensitive data is consistently excluded.

## Requirements

### Requirement: Debug Artifact Exclusion
The repository must not track local debugging artifacts such as screenshots or logs.

#### Scenario: Local Debugging
- **WHEN** a developer or agent creates files in the `artifacts/` directory
- **THEN** Git should ignore these files and they should not appear in `git status`

### Requirement: Agent Scratch Space Exclusion
Temporary scratch files used by the AI agent must be excluded from version control.

#### Scenario: Agent Exploration
- **WHEN** the agent creates scripts or temporary data in the `scratch/` directory
- **THEN** these files must be ignored by Git

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
