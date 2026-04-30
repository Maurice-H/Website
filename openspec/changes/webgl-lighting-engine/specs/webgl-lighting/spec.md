## ADDED Requirements

### Requirement: WebGL Background Lighting Engine
The system SHALL use a WebGL-based canvas to render the global background lighting, including ambient light and a mouse-tracking spotlight, instead of DOM elements.

#### Scenario: User moves the mouse across the viewport
- **WHEN** the user moves the mouse
- **THEN** the WebGL shader updates its spotlight position dynamically via a uniform without triggering DOM layout or repaint cycles.
