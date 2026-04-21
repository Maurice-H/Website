## ADDED Requirements

### Requirement: Themed Window Container
The system MUST render each navigation item within a rectangular "window" container that provides a content-specific visual preview.

#### Scenario: Nav item rendering
- **WHEN** the Nav Conveyor is populated
- **THEN** each item is wrapped in a container with a fixed aspect ratio and a themed background.

### Requirement: Interaction Feedback
Navigation windows MUST react visually when centered under the lamp fixture.

#### Scenario: Window entering focus
- **WHEN** a navigation window is scrolled into the center of the viewport
- **THEN** it increases in scale and activates its internal interactive elements (e.g., animations or higher detail text).
