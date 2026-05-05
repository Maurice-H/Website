# Capability: Bento Box layout

## Purpose
The Bento Box layout provides a structured, multi-column grid system for presenting portfolio content in a modern, organized fashion.

## Requirements

### Requirement: Bento Box Grid Interface
The system MUST implement a scalable CSS Grid representing a standard multi-column bento box layout for portfolio sections. The layout MUST utilize encapsulated generic wrapper components (e.g. `BentoCard.vue`) for all grid items to ensure consistent border rendering and hover states.

#### Scenario: Desktop layout
- **WHEN** the portfolio is loaded on screens wider than 1024px
- **THEN** a responsive 4-column, multi-row grid is structured to fit distinct sections (Hero, About, Projects, Skills, Contact) efficiently.

#### Scenario: Mobile Layout
- **WHEN** the portfolio is loaded on screens narrower than 768px
- **THEN** the grid strictly collapses into a single stack or 2-column layout to maintain readability without horizontal scrolling.

#### Scenario: Ultra-wide layout
- **WHEN** the portfolio is loaded on screens wider than 2000px (4K/HDR)
- **THEN** the grid scales fluidly, and absolute/fixed background elements (like light rays) extend infinitely without breaking visual boundaries.

### Requirement: Responsive Bento Spacing
The Bento Grid must adjust its gaps and internal paddings based on the device viewport width to prevent content overflow.

#### Scenario: Small Screen Layout
- **WHEN** the viewport width is less than 768px.
- **THEN** the grid columns must stack vertically.
- **AND** the container padding must reduce to `--spacing-md` (1rem).

### Requirement: Z-Index Hierarchy Correctness
The z-index of interactive elements in the bento cards must be higher than the WebGL background but lower than global overlays.

#### Scenario: Card Interaction on Mobile
- **WHEN** a user taps a project card on mobile.
- **THEN** the tap event must be captured by the card component and not be intercepted by the WebGL background layer.


### Requirement: Blueprint Hover Interactions
In blueprint mode, hover interactions MUST visually reinforce the "blueprint" aesthetic rather than regular high-fidelity hovering effects. Elements MUST utilize a "Spotlight Reveal" mechanism where content visibility is dynamically controlled by proximity to the light source.

#### Scenario: Interactive Spotlight Reveal
- **WHEN** the user moves the spotlight over a bento grid card in blueprint mode
- **THEN** the hidden technical details and text content fade into view smoothly based on the proximity of the `--spotlight-x` and `--spotlight-y` coordinates.

#### Scenario: Blueprint Bio Reveal
- **WHEN** the spotlight passes over the About Me description in blueprint mode
- **THEN** the text transitions from a faint "ghosted" outline to high-contrast legible text.
