# Dynamic Lighting System

## Purpose
This capability defines the advanced lighting engine that manages realistic light sources (flashlight, hanging lamp), their spatial orientations, and the volumetric beam effects that drive the portfolio's "Cosmic Void" aesthetic.

## Requirements

### Requirement: Light Source Object Management
The system SHALL support multiple distinct light source types, each with its own visual asset and projection logic.

#### Scenario: Flashlight Mode
- **WHEN** the system is in the `CONTENT` phase
- **THEN** a flashlight asset SHALL be rendered in the bottom right corner, following the mouse cursor.

### Requirement: Angular Tracking
The system SHALL calculate and provide the rotation angle (in degrees or radians) from the light source's origin to the current mouse cursor position.

#### Scenario: Pointing at Cursor
- **WHEN** the mouse moves
- **THEN** the flashlight asset SHALL rotate to point its "emitter" exactly at the cursor coordinates.

### Requirement: Volumetric Beam Rendering
The system SHALL render a visual representation of the light beam (the "cone") that perfectly aligns with the functional mask revealing the content.

#### Scenario: Beam Visibility
- **WHEN** a light source is active
- **THEN** a semi-transparent, gradient-filled beam SHALL be rendered, matching the rotation and spread of the functional mask.

#### Scenario: Flashlight Beam Illumination
- **WHEN** a user moves the mouse in the `CONTENT` phase
- **THEN** the dark overlay SHALL become transparent specifically within the conical area defined by the flashlight's position and the calculated angle to the mouse cursor.

#### Scenario: Beam Distance Falloff
- **WHEN** the flashlight beam extends across the screen
- **THEN** the illumination SHALL smoothly fade out over distance, combining directional lighting with a natural radial falloff.

### Requirement: Phase-Synchronized Transitions
The system SHALL provide smooth transitions between light sources during phase changes.

#### Scenario: Swapping Sources
- **WHEN** switching from `NAV` to `CONTENT`
- **THEN** the hanging lamp SHALL dim while the flashlight "switches on" and rotates into position over a period of 400ms.
