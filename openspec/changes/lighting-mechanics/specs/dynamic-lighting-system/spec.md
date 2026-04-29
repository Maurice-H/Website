## MODIFIED Requirements

### Requirement: Light Source Object Management
The system SHALL support multiple distinct light source types, each with its own visual asset and projection logic. The flashlight source SHALL be repositionable by the user via drag interaction.

#### Scenario: Flashlight Mode
- **WHEN** the system is in the `CONTENT` phase
- **THEN** a flashlight asset SHALL be rendered at the stored source position (defaulting to 150px from the right and 150px from the bottom), following the mouse cursor for rotation.

#### Scenario: Flashlight Drag Repositioning
- **WHEN** the user presses and holds on the flashlight body during CONTENT phase
- **THEN** the flashlight source position SHALL follow the pointer, updating in real-time, and the beam/mask/grid SHALL re-orient from the new position.

#### Scenario: Flashlight Drag Constraints
- **WHEN** the user drags the flashlight
- **THEN** the flashlight position SHALL be constrained to within the visible viewport bounds (min 50px from any edge).

#### Scenario: NAV Phase Lamp Asset
- **WHEN** the system is in the `NAV` phase
- **THEN** a high-fidelity 3D-style lamp image SHALL be rendered as the hero visual anchor, replacing the placeholder asset.

### Requirement: Angular Tracking
The system SHALL calculate and provide the rotation angle (in degrees) from the light source's origin to the current mouse cursor position.

#### Scenario: Pointing at Cursor
- **WHEN** the mouse moves
- **THEN** the flashlight asset SHALL rotate to point its "emitter" exactly at the cursor coordinates, with the rotation calculated from the current (possibly dragged) source position.

### Requirement: Volumetric Beam Rendering
The system SHALL render a visual representation of the light beam (the "cone") that perfectly aligns with the functional mask revealing the content. All beam geometry (origin, rotation, spread) SHALL be consumed from a single centralised state in `useLightingStore`.

#### Scenario: Beam Visibility
- **WHEN** a light source is active
- **THEN** a semi-transparent, gradient-filled beam SHALL be rendered, matching the rotation and spread of the functional mask.

#### Scenario: Flashlight Beam Illumination
- **WHEN** a user moves the mouse in the `CONTENT` phase
- **THEN** the dark overlay SHALL become transparent specifically within the conical area defined by the flashlight's current position and the calculated angle to the mouse cursor.

#### Scenario: Beam Distance Falloff
- **WHEN** the flashlight beam extends across the screen
- **THEN** the illumination SHALL smoothly fade out over distance, combining directional lighting with a natural radial falloff.

#### Scenario: Beam ↔ Mask Synchronisation
- **WHEN** the VolumetricBeam and SpotlightMask are both rendering
- **THEN** both components SHALL read origin, rotation, and spread from the same `useLightingStore` computed state, ensuring zero visual offset between the illuminated cone and the dark-area cutout.

### Requirement: Phase-Synchronized Transitions
The system SHALL provide smooth transitions between light sources during phase changes.

#### Scenario: Swapping Sources
- **WHEN** switching from `NAV` to `CONTENT`
- **THEN** the hanging lamp SHALL dim while the flashlight "switches on" and rotates into position over a period of 400ms.

### Requirement: NAV Phase Lighting Realism
The system SHALL render the NAV-phase overhead lamp illumination with natural falloff that simulates a physical hanging light.

#### Scenario: Realistic Lamp Falloff
- **WHEN** the system is in `NAV` phase
- **THEN** the overlay gradient SHALL produce a soft, physically-grounded light pool with brighter center and gradual circular falloff, avoiding hard gradient stops.
