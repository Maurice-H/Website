## Context

The previous lighting implementation pushed CSS and DOM manipulation to their limits. While performance was significantly improved by minimizing repaints and enforcing strict compositor isolation, heavy interaction (e.g., hovering over the glassmorphic Bento cards) still triggers layout thrashing due to the sheer cost of dynamic `backdrop-filter` and `radial-gradient` recalculations over multiple elements. 

To achieve an uncompromised 60-144 FPS experience, we are decoupling the global background lighting from the DOM completely.

## Goals / Non-Goals

**Goals:**
- Render the entire background lighting system (ambient glow, beam tracking, flashlight effect) on a single WebGL `<canvas>`.
- Use a custom Fragment Shader (GLSL) to calculate light attenuation and color mixing per-pixel.
- Achieve O(1) performance scaling (constant rendering time regardless of DOM complexity).
- Sync the existing centralized mouse tracker (`useViewportStore`) with the shader uniforms seamlessly.

**Non-Goals:**
- Creating complex 3D meshes or scenes. The canvas will render a simple 2D Plane/Quad covering the screen.
- Changing the foreground DOM structure or replacing CSS-based hover effects on individual `BentoCard`s.

## Decisions

- **Framework Choice (`@tresjs/core` & `three`)**: We chose TresJS because it provides a declarative Vue 3 wrapper around Three.js, matching our existing component architecture. Writing bare WebGL would increase boilerplate significantly.
- **Shader-Driven Architecture**: Instead of instantiating PointLights or SpotLights in Three.js (which still have overhead), we will use a `ShaderMaterial` on a full-screen `PlaneGeometry`. The Fragment Shader will handle the math for distance from the mouse to simulate the flashlight cone, allowing for perfect control over gradient falloff and noise/grain effects without the browser's CSS limits.
- **Uniform Updates**: To bypass Vue's reactivity overhead during high-frequency mouse movements, we will grab a direct reference to the `ShaderMaterial` instance in `WebGLBackground.vue` and update `uniforms.uMouse.value` directly inside the existing `requestAnimationFrame` loop defined in `viewport.ts` (or an equivalent direct bridge).

## Tiered Rendering Strategy (Graceful Degradation)

To ensure a premium experience across all devices, we implement a 3-tier strategy powered by `detect-gpu`:

1.  **Tier 3 (High-End / Desktop GPU):**
    - Full experience: Bloom, Glitch, RGB Shift, high particle density (200+).
    - Multi-pass post-processing active.
2.  **Tier 2 (Mid-Range / Mobile / Integrated GPU):**
    - Optimized WebGL: Bloom and complex Glitch passes are disabled.
    - Reduced particle density (~50).
    - Simplified fragment shader path (lower noise complexity).
3.  **Tier 1 (Low-End / Software Rendering / CI):**
    - WebGL is completely disabled.
    - `WebGLBackground.vue` does not mount the `TresCanvas`.
    - Reverts to static CSS-based background fallback.

### FOUC (Flash of Unlit Content) Mitigation

The GPU benchmark is asynchronous. To prevent a "flash" of the unlit fallback before WebGL initializes:
- The `usePerformanceStore` must initialize the benchmark during the early `NAV` phase.
- `WebGLBackground.vue` will only render the canvas once the tier is determined.
- Content reveal animations (Phase `CONTENT`) must be gated by the completion of the `performance.checkPerformance()` benchmark.

## Risks / Trade-offs

- **Bundle Size**: Three.js is a large library.
  - *Mitigation*: Ensure Vite's tree-shaking is active. We will only import core modules and avoid the heavy `three/examples` if possible.
- **WebGL Support**: Some older mobile devices or specific configurations might have WebGL disabled.
  - *Mitigation*: Maintain a basic, static CSS background color as a fallback behind the canvas.
- **Coordinate Mapping**: Mapping CSS pixel coordinates to WebGL Normalized Device Coordinates (NDC) can be tricky.
  - *Mitigation*: We will pass `uResolution` (width/height) and the exact `px` coordinates of the mouse. The shader will calculate NDC internally: `vec2 uv = gl_FragCoord.xy / uResolution.xy;` and correct for aspect ratio.
