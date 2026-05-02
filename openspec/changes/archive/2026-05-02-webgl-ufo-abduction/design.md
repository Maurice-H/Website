## Context

The current iteration of the portfolio uses a "dark industrial room" aesthetic, where the primary light source is an industrial lamp built entirely with HTML and CSS gradients in `NavConveyor.vue`. While visually striking, the CSS masks and volumetric light approximations are extremely expensive for the browser's compositor, leading to layout thrashing and an inability to maintain a stable 60-144 FPS framerate. 

To resolve this, we are pivoting the visual narrative to an "Alien UFO Abduction / Cockpit HUD" concept. This allows us to move the lighting and central visual element (the UFO) entirely into the WebGL pipeline using TresJS, drastically improving performance while aligning with our "Cosmic Void" theme.

## Goals / Non-Goals

**Goals:**
- Eliminate layout thrashing by removing the CSS-based `.lamp-fixture` from `NavConveyor.vue`.
- Create a performant, procedural UFO shape using basic TresJS geometries (`TresCylinderGeometry` and `TresTorusGeometry`) in `WebGLScene.vue`.
- Implement a custom "Tractor Beam" fragment shader in `WebGLScene.vue` to replace the old volumetric cone.
- Maintain high performance by bypassing Vue's reactivity system for the UFO's hovering animation (updating directly in the `onBeforeRender` loop).

**Non-Goals:**
- We are *not* loading external 3D models (`.glb` or `.gltf` files) for the UFO at this stage. Procedural geometry ensures a smaller bundle size and faster load times.
- We are *not* overhauling the content or layout of the `NavConveyor` cards themselves, only the surrounding environment.

## Decisions

- **DOM Cleanup (`NavConveyor.vue`)**: We will completely remove the `.lamp-fixture` and all associated CSS (wire, head, dome, rim, bulb). The component will be strictly responsible for the scrollable conveyor track UI.
- **UFO Geometry (`WebGLScene.vue`)**: The UFO will be built inside a `<TresMesh>` positioned near the top-center of the scene. It will consist of a dark, metallic cylinder (`TresCylinderGeometry`) for the hull and a torus (`TresTorusGeometry`) for the glowing rim.
- **Hover Animation**: Inside the `useLoop` hook's `onBeforeRender` callback, we will animate the UFO's Y-position using a slow sine wave (e.g., `Math.sin(elapsed * 2) * 0.1`). This prevents Vue reactivity overhead while providing an organic breathing effect.
- **Tractor Beam Shader**: The custom GLSL `fragmentShader` will be updated. When `uPhase` is 0.0 (Landing Page phase) and `uLightingEnabled` is true, the shader will draw an intense emerald/cyan beam emanating from the UFO's screen-space coordinates straight down to the bottom of the screen.
- **UFO Illumination (WebGLScene.vue)**: Since the procedural UFO uses a `<TresMeshStandardMaterial>` (which reacts to light), we MUST add a `<TresDirectionalLight>` and a `<TresAmbientLight>` to the scene. Without these lights, the dark metallic hull of the UFO will render completely black and invisible against the void.
- **Strict Import Paths**: All pure Three.js classes (like `Vector2` or `MathUtils`) must be imported directly from `'three'`. TresJS components will be utilized via their Vue-wrapper syntax (e.g., `<TresMesh>`).

## Risks / Trade-offs

- **Visual Fidelity vs. Asset Size**: By not using a `.glb` model, we trade intricate 3D detailing for faster load times. We will mitigate this by using a high-quality `<TresMeshStandardMaterial>` (high metalness, low roughness) to make the procedural geometry look cinematic and premium.
- **GLSL Complexity**: Replacing the soft lamp cone with a Tractor Beam requires precise GLSL adjustments to align the shader's origin point with the physical TresJS mesh on screen. We will calculate the emitter position based on aspect ratio and fixed offsets to ensure they match up perfectly.
