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

## 5. Testing & Quality Assurance

- [x] 5.1 Write Vitest unit tests for the WebGL integration logic and uniform bindings.
- [x] 5.2 Update Playwright E2E tests (using POM) to verify visual integrity and ensure the `<canvas>` layer does not block pointer events for the UI.
- [x] 5.3 POST-FLIGHT: Run `npx biome check ./src` and resolve any formatting/linting issues.
- [x] 5.4 POST-FLIGHT: Run `npm run test:unit` and verify all tests pass.

## 6. Verification Fixes

- [x] 6.1 [C1] Remove `useMouseGlare` from `BentoCard.vue` and delete `src/composables/useMouseGlare.ts`. Remove `--mouse-x`/`--mouse-y` CSS variable sets from viewport store (no remaining consumers).
- [x] 6.2 [C2] Migrate lamp volumetric cone from NavConveyor DOM (`.cone-light`, `.cone-core`) into the WebGL fragment shader. Add `uPhase` uniform. Make NavConveyor background transparent so the WebGL canvas shows through.
- [x] 6.3 [W1] Move the resize listener from `WebGLScene.vue` to the centralized `useViewportStore` (per project-bridge rule 19).
- [x] 6.4 [W2] Update `design.md` to reflect actual `useLoop` + `rawMouse` bridge architecture.
- [x] 6.5 [S2] Remove trivial `useLightingEngine.ts` composable wrapper — replace with direct `useLightingStore()` usage.
- [x] 6.6 POST-FLIGHT: Run `npx biome check ./src` and `npm run test:unit`.
