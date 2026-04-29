## ADDED Requirements

### Requirement: Parallax Depth Layers
The system SHALL apply multi-layer parallax scrolling to designated elements to create a convincing depth-of-field spatial effect.

#### Scenario: Hero text parallax
- **WHEN** the user scrolls the page
- **THEN** the hero text elements SHALL translate vertically at a speed proportional to their `data-parallax-speed` attribute, creating a depth separation from the background.

#### Scenario: Atmospheric layer parallax
- **WHEN** the user scrolls the page
- **THEN** atmospheric layers (perspective grid, volumetric beam haze) SHALL translate at slower speeds than foreground content, reinforcing the spatial depth illusion.

#### Scenario: Parallax speed range
- **WHEN** parallax layers are configured
- **THEN** speed values SHALL range from `0.02` (far/slow) to `0.15` (near/fast), with the perspective grid at the slowest end and hero text at the fastest.

#### Scenario: Accessibility — reduced motion
- **WHEN** the user's OS has `prefers-reduced-motion: reduce` enabled
- **THEN** all parallax effects SHALL be disabled and elements SHALL remain in their default static positions.
