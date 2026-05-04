## 1. Pre-Flight & Setup

- [x] 1.1 PRE-FLIGHT: Read and apply all guidelines from `.docs/skills/` directory.
- [x] 1.2 Install `@tresjs/core` and `three` as dependencies. Install `@types/three` as a dev dependency.

## 2. WebGL Canvas Implementation

- [x] 2.1 Create TypeScript interfaces in `src/types/webgl.ts` (or similar) for the shader uniforms (e.g., `LightingUniforms`).
- [x] 2.2 Create `src/components/layout/WebGLBackground.vue`. Use TresJS to set up a `TresCanvas`, a full-screen `PlaneGeometry`, and a `ShaderMaterial`.
- [x] 2.3 Write the GLSL Fragment and Vertex Shaders within or alongside the component to simulate the spotlight, ambient light, and grain effect based on the `uMouse` uniform.

## 3. State & Mouse Integration

- [x] 3.1 Establish a high-performance bridge between `WebGLBackground.vue` and the global mouse tracking loop.
- [x] 3.2 Update `src/stores/viewport.ts` to update the `uMouse` uniform of the TresJS shader material directly during the `requestAnimationFrame` loop, bypassing Vue's VDOM diffing.

## 4. Cleanup & Decommissioning

- [x] 4.1 Remove `src/components/layout/SpotlightMask.vue`.
- [x] 4.2 Remove `src/components/layout/PerspectiveGrid.vue` (if visual grid features are migrated to the shader).
- [x] 4.3 Remove `src/components/layout/VolumetricBeam.vue`.
- [x] 4.4 Remove `src/components/layout/FlashlightSource.vue`.
- [x] 4.5 Clean up legacy CSS variables from `src/index.css` that were solely used for DOM-based lighting.

## 5. Performance Guard & Tiered Rendering

- [x] 5.1 Install `detect-gpu` and create `src/stores/usePerformanceStore.ts`. Implement GPU tier detection logic.
- [x] 5.2 Update `WebGLBackground.vue` to gate the `TresCanvas` with a `v-if` based on the detected tier.
- [x] 5.3 Update `WebGLScene.vue` to conditionally enable/disable post-processing passes (Bloom, Glitch) and adjust particle counts based on the performance tier.
- [x] 5.4 Ensure the initial loading phase (`NAV`) blocks until the GPU benchmark is complete to prevent FOUC.

## 6. Testing & Quality Assurance

- [x] 6.1 Write Vitest unit tests for the `usePerformanceStore` and WebGL integration logic.
- [x] 6.2 Update Playwright E2E tests (using POM) to verify visual integrity across simulated performance tiers.
- [x] 6.3 POST-FLIGHT: Run `npx biome check ./src` and resolve any issues.
- [x] 6.4 POST-FLIGHT: Run `npm run test:unit` and verify all tests pass.
