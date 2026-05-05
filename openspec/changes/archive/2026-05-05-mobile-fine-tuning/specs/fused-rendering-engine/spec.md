## ADDED Requirements

### Requirement: Unified Pointer Input
The rendering engine must consume pointer events instead of mouse events to ensure parity across devices.

#### Scenario: Pointer Precision
- **WHEN** a pointer event is received.
- **THEN** the coordinates must be normalized relative to the canvas dimensions.
- **AND** the `uMouse` uniform must be updated in the main fragment shader.
