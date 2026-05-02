## Context

The previous lighting implementation pushed CSS and DOM manipulation to their limits. While performance was significantly improved by minimizing repaints and enforcing strict compositor isolation, heavy interaction (e.g., hovering over the glassmorphic Bento cards) still triggers layout thrashing due to the sheer cost of dynamic `backdrop-filter` and `radial-gradient` recalculations over multiple elements. 

To achieve an uncompromised 60-144 FPS experience, we are decoupling the global background lighting from the DOM completely.

## Goals / Non-Goals

**Goals:**
- Render the entire background lighting system (ambient glow, beam tracking, lamp cone, flashlight effect) on a single WebGL `<canvas>`.
- Use a custom Fragment Shader (GLSL) to calculate light attenuation and color mixing per-pixel.
- Achieve O(1) performance scaling (constant rendering time regardless of DOM complexity).
- Sync the existing centralized mouse tracker (`useViewportStore`) with the shader uniforms seamlessly.
- Migrate the NavConveyor's volumetric lamp cone from DOM gradients to the WebGL shader.
- Remove DOM-based `useMouseGlare` from BentoCards to eliminate per-card gradient repaints.

**Non-Goals:**
- Creating complex 3D meshes or scenes. The canvas will render a simple 2D Plane/Quad covering the screen.

## Decisions

- **Framework Choice (`@tresjs/core` & `three`)**: We chose TresJS because it provides a declarative Vue 3 wrapper around Three.js, matching our existing component architecture. Writing bare WebGL would increase boilerplate significantly.
- **Shader-Driven Architecture**: Instead of instantiating PointLights or SpotLights in Three.js (which still have overhead), we will use a `ShaderMaterial` on a full-screen `PlaneGeometry`. The Fragment Shader will handle the math for distance from the mouse to simulate the flashlight cone, allowing for perfect control over gradient falloff and noise/grain effects without the browser's CSS limits.
- **Component Split (TresJS v5 Context Requirement)**: TresJS v4+ requires `useLoop()` to be called inside a child of `<TresCanvas>`, not in the canvas component itself. We split the implementation into:
  - `WebGLBackground.vue` — Thin wrapper containing `<TresCanvas>` with camera and render config.
  - `WebGLScene.vue` — Child component holding the scene graph (`TresMesh`, `TresShaderMaterial`) and the `useLoop().onBeforeRender()` render callback.
- **Non-Reactive Mouse Bridge (`rawMouse`)**: Instead of updating shader uniforms from the `requestAnimationFrame` loop in `viewport.ts` (as originally planned), we use a plain JS object (`rawMouse`) on the viewport store. The `mousemove` handler writes to it directly (no Vue reactivity), and the TresJS render loop in `WebGLScene.vue` reads from it every frame via `useLoop().onBeforeRender()`. This achieves the same zero-overhead goal while respecting TresJS's context boundaries.
- **Phase-Driven Shader**: The fragment shader uses a `uPhase` uniform (0.0 = NAV, 1.0 = CONTENT) to switch between:
  - **NAV phase**: Volumetric lamp cone from top-center (replaces DOM `.cone-light` / `.cone-core`).
  - **CONTENT phase**: Mouse-following spotlight with ambient glow.
- **Resolution Updates in Render Loop**: Instead of a separate `resize` event listener (which violates the project-bridge convention), the resolution uniform is updated every frame inside `onBeforeRender()` from `window.innerWidth`/`window.innerHeight`. The cost is negligible (two float reads per frame).

## Risks / Trade-offs

- **Bundle Size**: Three.js is a large library.
  - *Mitigation*: Ensure Vite's tree-shaking is active. We will only import core modules and avoid the heavy `three/examples` if possible.
- **WebGL Support**: Some older mobile devices or specific configurations might have WebGL disabled.
  - *Mitigation*: Maintain a basic, static CSS background color as a fallback behind the canvas.
- **Coordinate Mapping**: Mapping CSS pixel coordinates to WebGL Normalized Device Coordinates (NDC) can be tricky.
  - *Mitigation*: We will pass `uResolution` (width/height) and the exact `px` coordinates of the mouse. The shader will calculate NDC internally: `vec2 uv = gl_FragCoord.xy / uResolution.xy;` and correct for aspect ratio.
