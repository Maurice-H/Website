## ADDED Requirements

### Requirement: Tier-1 Fallback Rendering
The system must provide a visual lighting fallback using standard CSS when WebGL is disabled by the Performance Guard.

#### Scenario: NAV Phase Fallback
- **WHEN** `performance.isWebGLSupported` is `false` AND `lighting.phase` is `NAV`
- **THEN** The app must render a static `radial-gradient` background in the top center to simulate the UFO beam.

#### Scenario: CONTENT Phase Fallback
- **WHEN** `performance.isWebGLSupported` is `false` AND `lighting.phase` is `CONTENT`
- **THEN** The app must render a dynamic CSS spotlight tracking the mouse coordinates via `--mask-x/y`.

### Requirement: System Cursor Guard
The system cursor must be visible on all interactive elements unless a functional custom cursor (WebGL) is active and tracking correctly.

#### Scenario: Cursor visibility on low-end hardware
- **WHEN** `performance.isWebGLSupported` is `false`
- **THEN** The `hide-system-cursor` class must never be applied to the app root, even if `lightingEnabled` is `true`.
