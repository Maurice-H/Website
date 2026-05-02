## 1. Pre-Flight & Setup

- [ ] 1.1 PRE-FLIGHT: Read and apply all guidelines from `.docs/skills/` directory.
- [ ] 1.2 Install `@tresjs/core` and `three` as dependencies. Install `@types/three` as a dev dependency.

## 2. WebGL Canvas Implementation

- [ ] 2.1 Create TypeScript interfaces in `src/types/webgl.ts` (or similar) for the shader uniforms (e.g., `LightingUniforms`).
- [ ] 2.2 Create `src/components/layout/WebGLBackground.vue`. Use TresJS to set up a `TresCanvas`, a full-screen `PlaneGeometry`, and a `ShaderMaterial`.
- [ ] 2.3 Write the GLSL Fragment and Vertex Shaders within or alongside the component to simulate the spotlight, ambient light, and grain effect based on the `uMouse` uniform.

## 3. State & Mouse Integration

- [ ] 3.1 Establish a high-performance bridge between `WebGLBackground.vue` and the global mouse tracking loop.
- [ ] 3.2 Update `src/stores/viewport.ts` to update the `uMouse` uniform of the TresJS shader material directly during the `requestAnimationFrame` loop, bypassing Vue's VDOM diffing.

## 4. Cleanup & Decommissioning

- [ ] 4.1 Remove `src/components/layout/SpotlightMask.vue`.
- [ ] 4.2 Remove `src/components/layout/PerspectiveGrid.vue` (if visual grid features are migrated to the shader).
- [ ] 4.3 Remove `src/components/layout/VolumetricBeam.vue`.
- [ ] 4.4 Remove `src/components/layout/FlashlightSource.vue`.
- [ ] 4.5 Clean up legacy CSS variables from `src/index.css` that were solely used for DOM-based lighting.

## 5. Testing & Quality Assurance

- [ ] 5.1 Write Vitest unit tests for the WebGL integration logic and uniform bindings.
- [ ] 5.2 Update Playwright E2E tests (using POM) to verify visual integrity and ensure the `<canvas>` layer does not block pointer events for the UI.
- [ ] 5.3 POST-FLIGHT: Run `npx biome check ./src` and resolve any formatting/linting issues.
- [ ] 5.4 POST-FLIGHT: Run `npm run test:unit` and verify all tests pass.
