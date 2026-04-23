## MODIFIED Requirements

### Requirement: Volumetric Beam Rendering
The system SHALL render a visual representation of the light beam (the "cone") that perfectly aligns with the functional mask revealing the content.

#### Scenario: Flashlight Beam Illumination
- **WHEN** a user moves the mouse in the `CONTENT` phase
- **THEN** the dark overlay SHALL become transparent specifically within the conical area defined by the flashlight's position and the calculated angle to the mouse cursor.

#### Scenario: Beam Distance Falloff
- **WHEN** the flashlight beam extends across the screen
- **THEN** the illumination SHALL smoothly fade out over distance, combining directional lighting with a natural radial falloff.
