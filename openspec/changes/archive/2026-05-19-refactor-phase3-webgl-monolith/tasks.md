## 1. Bootstrapping & Global Setup

- [x] 1.1 Create `src/utils/three-bootstrap.ts`
- [x] 1.2 Move the `Object3D.prototype.traverse` monkey patch from `WebGLScene.vue` into `three-bootstrap.ts`
- [x] 1.3 Import and execute `three-bootstrap.ts` in `src/main.ts` before the Vue application is mounted

## 2. Shader & Math Utilities Extraction

- [x] 2.1 Create a new directory `src/shaders/` if it doesn't exist
- [x] 2.2 Extract the custom lighting fragment and vertex shaders from `WebGLScene.vue` into `src/shaders/lighting.vert.ts` and `src/shaders/lighting.frag.ts` (exporting them as template strings)
- [x] 2.3 Create `src/composables/useDroneFlight.ts`
- [x] 2.4 Migrate the math and physics logic (position/rotation calculations based on time and scroll) from `WebGLScene.vue` into `useDroneFlight.ts`
- [x] 2.5 Write basic unit tests for `useDroneFlight.ts` to verify math outputs

## 3. Component Hierarchy Split

- [x] 3.1 Create `src/components/webgl/DroneEntity.vue`
- [x] 3.2 Move the `useGLTF` loading logic for the drone and its material application into `DroneEntity.vue`
- [x] 3.3 Create `src/components/webgl/UfoEntity.vue` and move UFO loading logic into it
- [x] 3.4 Create `src/components/webgl/EnvironmentLighting.vue` and move the custom TresJS mesh with the custom shader material into it
- [x] 3.5 Refactor the main `WebGLScene.vue` to simply import and compose these new entities (e.g., `<TresCanvas><EnvironmentLighting /><DroneEntity /><UfoEntity /></TresCanvas>`)

## 4. Verification

- [x] 4.1 Run Biome formatter and linter (`npx biome check .`)
- [x] 4.2 Run Vitest test suite (`npm run test:unit`)
- [x] 4.3 Manually verify in the browser that the WebGL scene renders identically to the previous monolithic version (no regressions in lighting, model positioning, or animations)
