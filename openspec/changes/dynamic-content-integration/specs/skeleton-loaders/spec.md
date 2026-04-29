## ADDED Requirements

### Requirement: Skeleton Placeholder Component
The system SHALL provide a reusable `SkeletonLoader.vue` component in `src/components/shared/` that renders animated placeholders during async data loading.

#### Scenario: Skeleton renders during loading
- **WHEN** the `ProjectsSection` is in a loading state (GitHub data not yet resolved)
- **THEN** the system SHALL render skeleton cards matching the dimensions of real project cards with a shimmer animation.

#### Scenario: Skeleton respects theme
- **WHEN** the skeleton renders in the Finished (dark) theme
- **THEN** the shimmer gradient SHALL use `var(--finished-accent)` at low opacity.

#### Scenario: Skeleton renders in Blueprint theme
- **WHEN** the skeleton renders in the Blueprint (light) theme
- **THEN** the shimmer gradient SHALL use `var(--color-blueprint-line)` at low opacity.

### Requirement: Skeleton Shape Variants
The system SHALL support configurable skeleton shapes via props: `text`, `card`, and `circle`.

#### Scenario: Card-shaped skeleton
- **WHEN** the `SkeletonLoader` is rendered with `shape="card"`
- **THEN** it SHALL render a rectangular placeholder matching the bento card's border radius and aspect ratio.

#### Scenario: Text-shaped skeleton
- **WHEN** the `SkeletonLoader` is rendered with `shape="text"`
- **THEN** it SHALL render a narrow horizontal bar simulating a line of text.
