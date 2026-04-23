# High-Fidelity UI Components

## Purpose
This capability defines the suite of premium, atmospheric UI components that leverage the dynamic lighting system to create depth and immersion.

## ADDED Requirements

### Requirement: Tonal Layering (Stacked Cards)
The system SHALL provide a `StackedCard` container that simulates physical depth through multiple offset background layers.

#### Scenario: Visual Depth Effect
- **WHEN** a component is wrapped in `<StackedCard>`
- **THEN** it SHALL render at least two underlying "ghost" layers with decreasing opacity and increasing offsets (1-2px) to simulate a stacked glass/paper effect.

### Requirement: Reactive Perspective Grid
The system SHALL provide a background grid that reacts to the lighting engine's variables.

#### Scenario: Grid Glow Hotspot
- **WHEN** the light source moves
- **THEN** the grid pattern SHALL exhibit a higher opacity and brightness at the mask's center point, simulating a light "hotspot" hitting the surface.

### Requirement: Boot Sequence Simulation
The system SHALL support an animated terminal-style text component for "experience" data.

#### Scenario: System Boot Sequence
- **WHEN** the "Experience" card is focused or revealed
- **THEN** it SHALL display a line-by-line typing animation that simulates a system boot-up (e.g., `> loading system...`).

### Requirement: Glassmorphic Surface Standards
All high-fidelity components SHALL adhere to a glassmorphism standard using `backdrop-filter: blur()` and low-opacity borders.

#### Scenario: Glass Card Consistency
- **WHEN** a card is rendered in the `CONTENT` phase
- **THEN** it SHALL have a `backdrop-filter: blur(20px)` and a `1px` border using the `--finished-border` color at 15% opacity.
