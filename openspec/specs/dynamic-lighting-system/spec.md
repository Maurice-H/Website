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

### Requirement: WebGL Background Lighting Engine
The system SHALL use a WebGL-based canvas to render the global background lighting, including ambient light and a mouse-tracking spotlight, instead of DOM elements.

#### Scenario: User moves the mouse across the viewport
- **WHEN** the user moves the mouse
- **THEN** the WebGL shader updates its spotlight position dynamically via a uniform without triggering DOM layout or repaint cycles.

### Requirement: Volumetric Beam Rendering
The system SHALL render a visual representation of the light beam (the "cone") within the WebGL fragment shader to ensure high-performance rendering.

#### Scenario: Beam Visibility
- **WHEN** a light source is active
- **THEN** a semi-transparent, gradient-filled beam SHALL be rendered by the shader, matching the rotation and spread of the lighting logic.

#### Scenario: Flashlight Beam Illumination
- **WHEN** a user moves the mouse in the `CONTENT` phase
- **THEN** the shader SHALL calculate the spotlight illumination specifically within the conical area defined by the mouse position.

#### Scenario: Beam Distance Falloff
- **WHEN** the flashlight beam extends across the screen
- **THEN** the shader SHALL apply a natural radial and directional falloff.

### Requirement: Phase-Synchronized Transitions
The system SHALL provide smooth transitions between light sources during phase changes using shader uniforms (e.g., `uPhase`).

#### Scenario: Swapping Sources
- **WHEN** switching from `NAV` to `CONTENT`
- **THEN** the `uPhase` uniform SHALL lerp from 0.0 to 1.0, transitioning the lighting from the hanging lamp to the flashlight over a period of 400ms.
