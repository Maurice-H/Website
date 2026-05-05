## ADDED Requirements

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
