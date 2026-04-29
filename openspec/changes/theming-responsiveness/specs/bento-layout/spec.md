## MODIFIED Requirements

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
