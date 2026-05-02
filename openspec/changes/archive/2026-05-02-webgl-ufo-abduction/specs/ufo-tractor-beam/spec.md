## ADDED Requirements

### Requirement: Procedural UFO Geometry
A UFO model must be rendered using basic TresJS primitives (`TresCylinderGeometry` for the hull and `TresTorusGeometry` for the rim) within `WebGLScene.vue`.

#### Scenario: Scene Initialization
- **WHEN** the WebGL background initializes
- **THEN** a procedural UFO mesh with a `TresMeshStandardMaterial` should be visible near the top-center of the screen.

### Requirement: Organic Hover Animation
The UFO must smoothly animate its vertical position to simulate an organic hover, entirely within the WebGL render loop.

#### Scenario: Rendering Frames
- **WHEN** the application is running
- **THEN** the UFO's Y-position oscillates smoothly based on the elapsed time (`Math.sin(elapsed * 2) * 0.1`) without triggering Vue reactivity.

### Requirement: Tractor Beam Shader
The fragment shader must render an intense Tractor Beam originating from the UFO's screen position and extending downwards when the application is in the NAV phase.

#### Scenario: NAV Phase Active
- **WHEN** `uPhase` is set to 0.0 and `uLightingEnabled` is true
- **THEN** the shader displays a strong, glowing core and soft translucent edges (emerald/cyan) acting as a tractor beam from the UFO.

#### Scenario: Lighting Disabled
- **WHEN** `uLightingEnabled` is toggled off
- **THEN** the tractor beam opacity fades to 0, leaving only the dark UFO floating in the scene.
