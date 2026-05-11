## ADDED Requirements

### Requirement: Custom Cursor Mobile Handling
The application SHALL NOT hide the system cursor or render custom "scanner" cursor effects on mobile touch devices, regardless of GPU performance tier.

#### Scenario: Mobile viewport viewing
- **WHEN** the application is loaded on a mobile device (touch-based)
- **THEN** the CSS `.drone-scanner` is hidden
- **AND** the system cursor remains visible even in `CONTENT` phase with lighting enabled

### Requirement: Blueprint Mode Drone Intensity
The CSS fallback drone glow SHALL be distinctly visible even when Blueprint mode (light theme) is active.

#### Scenario: Blueprint theme active
- **WHEN** `isBlueprintMode` is true on desktop
- **THEN** the `.drone-blueprint` base glow opacity is increased (e.g., to 0.35) and its scale pulse is amplified

### Requirement: Preemptive WebGL Drone Loading
The WebGL drone asset (`drone.glb`) SHALL be loaded in the background immediately after the `ufo.glb` is loaded, eliminating the transition delay.

#### Scenario: Application initialization
- **WHEN** the UFO model successfully loads during the `NAV` phase
- **THEN** the `loadDroneModel()` is invoked so the model is cached and ready before the user transitions to the `CONTENT` phase
