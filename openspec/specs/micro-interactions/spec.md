# Capability: Micro-Interactions

## Purpose
Micro-interactions provide tactile feedback and polish to the portfolio's interactive elements, enhancing the user experience through subtle animations, hover effects, and audio cues.

## Requirements

### Requirement: Tactile Hover Feedback
Bento cards MUST provide subtle tactile feedback when hovered using 3D perspective tilts and glare effects. The background spotlight illuminating the cards SHALL be processed by a WebGL shader to prevent rendering jank during the hover interaction.

#### Scenario: User hovers over a bento card
- **WHEN** the user hovers the mouse over a bento card component
- **THEN** the card subtly tilts following the cursor position and displays a faint glare overlay, while the background lighting remains smooth at 60+ FPS.

### Requirement: Audio Feedback
The system SHALL provide subtle, satisfying audio feedback for primary global interactions.

#### Scenario: Theme Toggle Sound
- **WHEN** the user clicks the ThemeToggle button.
- **THEN** a futuristic mode-switch sound effect shall play at moderate volume.

#### Scenario: Lighting Toggle Sound
- **WHEN** the user clicks the LightingToggle button.
- **THEN** a lamp/power switch sound effect shall play at moderate volume.

#### Scenario: Audio Failure Graceful Degradation
- **WHEN** browser autoplay policy blocks audio or the audio file is missing.
- **THEN** the toggle shall function normally without any error displayed to the user.

### Requirement: Drone Patrol System
The companion drone shall follow a purposeful waypoint-based patrol path instead of random sinusoidal movement.

#### Scenario: Patrol Loop
- **WHEN** the CONTENT phase is active.
- **THEN** the drone shall interpolate between predefined 3D waypoints in a ~45-second loop, always facing its travel direction.

#### Scenario: Forward Light Beam
- **WHEN** the drone is visible in CONTENT phase.
- **THEN** a narrow accent-colored SpotLight with a visible cone mesh shall project forward-downward from the drone.

#### Scenario: Area Scan
- **WHEN** the drone reaches its scan waypoint (~every 30 seconds).
- **THEN** a sonar-style ring shall expand outward from the drone's position and fade over ~2 seconds.
