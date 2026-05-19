## Context

The recent migration to a WebGL lighting engine using TresJS was highly successful in improving rendering performance. However, as is common during rapid iteration, the entire 3D pipeline was stuffed into a single `WebGLScene.vue` component (1300+ lines). This file currently handles global prototype patching, GLSL shader strings, complex math for drone flight paths, and Vue reactivity for the scene graph.

## Goals / Non-Goals

**Goals:**
- Architect a clean, modular WebGL folder structure `src/components/webgl/`.
- Decouple GLSL shaders from Vue component logic.
- Extract complex physics/math out of the Vue layer.
- Move global side-effects (like modifying `Object3D.prototype`) to an application bootstrapping phase.

**Non-Goals:**
- We are not changing the visual fidelity or the specific shader algorithms in this phase.
- We are not altering the overall application layout (the Bento grid outside the WebGL scene).

## Decisions

- **Global Bootstrapping**: We will create `src/utils/three-bootstrap.ts` to handle global Three.js modifications (e.g., the `traverse` monkey patch for GLB normalization). This function will be imported and executed once in `src/main.ts` before the Vue app mounts.
  - *Rationale*: Global prototype modifications within a component lifecycle are dangerous and unpredictable, especially during Hot Module Replacement (HMR).
- **Shader Management**: We will extract shader strings into dedicated files. Since Vite handles imports, we can use a custom Vite plugin (like `vite-plugin-glsl`) if desired, or simply export strings from `.ts` files (e.g., `src/shaders/lighting.vert.ts`). The latter is simpler and requires no build configuration changes, so we will start there.
- **Component Splitting (TresJS idiomatic)**: We will create separate Vue components for logical entities in the scene:
  - `DroneEntity.vue`: Handles loading the drone model and applying its specific shaders.
  - `EnvironmentLighting.vue`: Handles the custom GLSL fragment shader that replaced the CSS-variable lighting.
  - `WebGLScene.vue` will become a simple orchestration wrapper that imports these entities.
- **Physics Extraction**: The drone flight logic will be extracted into a pure TypeScript composable `useDroneFlight(config)`. It will return a `ref` or reactive object representing the drone's position and rotation, which the `DroneEntity.vue` will bind to.

## Risks / Trade-offs

- **Risk**: Splitting a large WebGL scene into multiple Vue components can introduce slight overhead due to Vue's reactivity tracking on the scene graph.
  - **Mitigation**: Use TresJS best practices: prefer `shallowRef` where deep reactivity is unnecessary, and use the `useRenderLoop` hook efficiently without triggering unnecessary Vue re-renders.
- **Risk**: Moving the monkey patch to `main.ts` might affect other non-Vue Three.js contexts if any exist.
  - **Mitigation**: In this specific application, Three.js is exclusively used via TresJS in the main view, so global patching at boot time is safe and preferred.
