## ADDED Requirements

### Requirement: Custom Cursor Rendering
The system SHALL render a custom cursor element that replaces the native pointer during CONTENT phase.

#### Scenario: Cursor appears on phase transition
- **WHEN** the lighting phase transitions from NAV to CONTENT
- **THEN** the native cursor SHALL be hidden and a custom cursor element SHALL appear at the current mouse position.

#### Scenario: Cursor trails with spring physics
- **WHEN** the user moves the mouse during CONTENT phase
- **THEN** the custom cursor SHALL follow the mouse position with a smooth trailing spring effect (lerp-based interpolation at 60fps).

#### Scenario: Cursor disappears on phase transition back
- **WHEN** the lighting phase transitions from CONTENT to NAV
- **THEN** the custom cursor SHALL be removed and the native pointer SHALL be restored.

#### Scenario: Accessibility — reduced motion
- **WHEN** the user's OS has `prefers-reduced-motion: reduce` enabled
- **THEN** the custom cursor SHALL follow the mouse position instantly without trailing animation.

### Requirement: Parallax Depth Layers
The system SHALL apply multi-layer parallax scrolling to designated elements to create a convincing depth-of-field spatial effect.

#### Scenario: Hero text parallax
- **WHEN** the user scrolls the page
- **THEN** the hero text elements SHALL translate vertically at a speed proportional to their `data-parallax-speed` attribute, creating a depth separation from the background.

#### Scenario: Atmospheric layer parallax
- **WHEN** the user scrolls the page
- **THEN** atmospheric layers (perspective grid, volumetric beam haze) SHALL translate at slower speeds than foreground content, reinforcing the spatial depth illusion.

#### Scenario: Accessibility — reduced motion
- **WHEN** the user's OS has `prefers-reduced-motion: reduce` enabled
- **THEN** all parallax effects SHALL be disabled and elements SHALL remain in their default static positions.
