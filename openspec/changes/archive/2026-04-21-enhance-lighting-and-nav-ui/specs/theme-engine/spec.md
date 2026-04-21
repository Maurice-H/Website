## MODIFIED Requirements

### Requirement: Light Mode (Blueprint/Architecture)
The system MUST support a light mode representing a technical draft. This state MUST replace glowing box-shadows with simple dashed or dotted outline borders, and a subtle graph paper grid background. The lamp fixture in this mode MUST display a trapezoidal/conical geometry with a light throw that extends to at least 120% of the viewport height.

#### Scenario: User toggles to blueprint
- **WHEN** the user interacts with the lamp toggle
- **THEN** the active CSS theme switches to data-theme="blueprint" mapping CSS variables to the blueprint styles, and the lamp fixture geometry updates to a conical polygon shape.

#### Scenario: Vertical beam reach
- **WHEN** the Nav Conveyor is active
- **THEN** the light cone MUST extend from the top of the viewport to past the bottom edge to ensure all conveyor content is illuminated.
