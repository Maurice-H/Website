# Capability: Skeleton Loaders

## ADDED Requirements

### Requirement: Reusable Skeleton Component
The system SHALL provide a `SkeletonLoader.vue` component in `src/components/shared/` that accepts `shape` (`'text'` | `'card'` | `'circle'`), optional `width`, and optional `height` props.

#### Scenario: Card skeleton shape
- **WHEN** `<SkeletonLoader shape="card" />` is rendered
- **THEN** a rectangular placeholder with rounded corners and a shimmer animation SHALL appear.

#### Scenario: Text skeleton shape
- **WHEN** `<SkeletonLoader shape="text" />` is rendered
- **THEN** a single-line text placeholder with a shimmer animation SHALL appear.

### Requirement: Theme-Aware Shimmer
The skeleton shimmer gradient SHALL adapt to the active theme by reading CSS variables (`var(--finished-accent)` for Finished mode, `var(--color-blueprint-line)` for Blueprint mode).

#### Scenario: Finished theme skeleton
- **WHEN** the theme is "Finished"
- **THEN** the shimmer gradient SHALL use the `--finished-accent` color family.

#### Scenario: Blueprint theme skeleton
- **WHEN** the theme is "Blueprint"
- **THEN** the shimmer gradient SHALL use the `--color-blueprint-line` color family.
