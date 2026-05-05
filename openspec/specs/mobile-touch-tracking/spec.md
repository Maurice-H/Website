# Specification: Mobile Touch Tracking

## Purpose
TBD: Handles touch input normalization and WebGL uniform updates on mobile devices.

## Requirements

### Requirement: Capturing Touch Input
The system must listen for touch events on the main viewport and translate them into normalized coordinates for the WebGL background.

#### Scenario: Touch Move
- **WHEN** a user moves their finger across the screen in the NAV or CONTENT phase.
- **THEN** the `WebGLBackground` uniforms must update to reflect the touch position.
- **AND** the HUD-scanner (custom cursor) must follow the touch point.

### Requirement: Multi-input Support
The system must seamlessly switch between mouse and touch input without losing tracking state.

#### Scenario: Switching from Mouse to Touch
- **WHEN** a user stops using a mouse and starts using a touch screen.
- **THEN** the `lightingStore` must prioritize the most recent input source.
- **AND** no visual "jump" should occur in the light position.
