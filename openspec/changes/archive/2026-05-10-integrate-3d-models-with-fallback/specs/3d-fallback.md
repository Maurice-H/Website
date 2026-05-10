## ADDED Requirements

### Requirement: 3d-asset-pipeline
The system shall support external GLB models with automatic scale and rotation adjustment to fit the existing scene hierarchy.

#### Scenario: UFO Model Loading
- **WHEN** the application is in NAV phase and a valid `ufo.glb` exists.
- **THEN** the GLB model shall be rendered at position `[0, 1.6, 0]`, replacing the cylinder primitive.

#### Scenario: CSP Blob Access
- **WHEN** the GLTFLoader extracts embedded textures as blob URLs.
- **THEN** the CSP `connect-src` directive shall include `blob:` to allow texture fetching.

### Requirement: css-cinematic-fallback
Low-end devices (Tier 1) shall display an equivalent visual experience using DOM elements and CSS animations.

#### Scenario: Phase Transition in CSS
- **WHEN** the `lightingStore.phase` changes from NAV to CONTENT on a Tier 1 device.
- **THEN** the CSS UFO shall fade out and the CSS Drone shall fade in and begin its orbital path.

### Requirement: performance-switching
The application shall dynamically choose the rendering engine at runtime based on the detected GPU tier.

#### Scenario: Tier 1 Detection
- **WHEN** `gpuTier` is 1 or `isWebGLSupported` is false.
- **THEN** the `WebGLBackground` component shall render `CSSBackground` instead of `TresCanvas`.

### Requirement: model-theme-reactive-colors
The UFO and Drone models' accent-colored emissive meshes shall change color when the theme toggles.

#### Scenario: UFO Theme Toggle to Blueprint
- **WHEN** `themeStore.isBlueprintMode` becomes `true`.
- **THEN** all UFO meshes with green-hue emissive color (HSL h ≈ 100-180°) shall shift their emissive to match `#38bdf8` (blue).

#### Scenario: UFO Theme Toggle to Default
- **WHEN** `themeStore.isBlueprintMode` becomes `false`.
- **THEN** the UFO accent meshes shall revert to their original green emissive colors.

#### Scenario: Drone Theme Toggle to Blueprint
- **WHEN** `themeStore.isBlueprintMode` becomes `true`.
- **THEN** all Drone meshes with green-hue emissive color shall shift their emissive to match `#38bdf8` (blue).

#### Scenario: Drone Theme Toggle to Default
- **WHEN** `themeStore.isBlueprintMode` becomes `false`.
- **THEN** the Drone accent meshes shall revert to their original emissive colors.

### Requirement: drone-patrol-system
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

### Requirement: immersive-toggle-audio
Navigation toggle controls shall play immersive sound effects on user interaction.

#### Scenario: Theme Toggle Sound
- **WHEN** the user clicks the ThemeToggle button.
- **THEN** a futuristic mode-switch sound effect shall play at moderate volume.

#### Scenario: Lighting Toggle Sound
- **WHEN** the user clicks the LightingToggle button.
- **THEN** a lamp/power switch sound effect shall play at moderate volume.

#### Scenario: Audio Failure Graceful Degradation
- **WHEN** browser autoplay policy blocks audio or the audio file is missing.
- **THEN** the toggle shall function normally without any error displayed to the user.
