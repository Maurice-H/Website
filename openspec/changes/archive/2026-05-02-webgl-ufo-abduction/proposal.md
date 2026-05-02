## Why

The portfolio's current "dark industrial room" aesthetic relies on heavy CSS gradients and filters for lighting (the industrial lamp). This causes layout thrashing and prevents us from hitting a smooth 60-144 FPS target. Pivoting to an "Alien UFO Abduction / Cockpit HUD" concept not only fits perfectly with the established "Cosmic Void" theme but also enables us to move the lighting logic entirely to the GPU via WebGL and TresJS. This architectural shift eliminates layout thrashing and ensures butter-smooth performance on all devices.

## What Changes

- **DOM Cleanup**: The industrial lamp HTML and CSS (`.lamp-fixture`, `.lamp-wire`, `.lamp-head`, etc.) will be completely removed from `NavConveyor.vue`. The DOM will only handle the conveyor track.
- **UFO Geometry**: A sleek, sci-fi UFO shape will be added near the top-center of `WebGLScene.vue` using basic TresJS geometries (`TresCylinderGeometry` + `TresTorusGeometry`) with a dark, metallic `TresMeshStandardMaterial`.
- **UFO Animation**: The UFO will hover organically using a sine wave directly in the render loop to bypass Vue's proxy overhead.
- **Tractor Beam Shader**: The GLSL fragment shader will be rewritten. When `uPhase` is 0.0, an intense emerald/cyan "Tractor Beam" will emanate from the UFO to the bottom of the screen, replacing the current soft volumetric cone.
- **Performance Constraints**: We will maintain `pixelRatio: Math.min(window.devicePixelRatio, 2)` to prevent GPU crashes on Retina displays, and uniformly push data into the shader bypassing Vue reactivity.

## Capabilities

### New Capabilities
- `ufo-tractor-beam`: High-performance WebGL-based UFO geometry and glowing tractor beam shader.
- `dom-cleanup`: A simplified DOM structure for `NavConveyor.vue` devoid of heavy CSS lighting effects.

### Modified Capabilities

## Impact

- `src/components/navigation/NavConveyor.vue`: Significant DOM and CSS reduction.
- `src/components/layout/WebGLScene.vue`: Introduction of TresJS geometries and an overhauled fragment shader.
- Performance: Expected to significantly increase and stabilize the framerate by delegating lighting to the GPU.
