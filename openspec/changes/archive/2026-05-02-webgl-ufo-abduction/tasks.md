## 1. Pre-Flight

- [x] 1.1 Read and apply all architectural and UI guidelines from `.docs/skills/` directory (e.g. `project-bridge.md`, `ui-ux-pro-max.md`).

## 2. DOM Cleanup (NavConveyor.vue)

- [x] 2.1 Remove the `<div class="lamp-fixture">` HTML block completely from `src/components/navigation/NavConveyor.vue`.
- [x] 2.2 Remove all CSS classes related to the lamp from the `<style>` block (`.lamp-fixture`, `.lamp-wire`, `.lamp-head`, `.lamp-top-cap`, `.lamp-dome`, `.ridge`, `.lamp-rim`, `.lamp-bulb`, `.is-emitting`).

## 3. UFO Geometry Implementation (WebGLScene.vue)

- [x] 3.1 In `src/components/layout/WebGLScene.vue`, add a `ufoRef` using `shallowRef()`.
- [x] 3.2 Add a new `<TresMesh ref="ufoRef">` to the template.
- [x] 3.3 Inside the `<TresMesh>`, add a `<TresCylinderGeometry>` and a `<TresMeshStandardMaterial>` (dark, high metalness) for the UFO hull.
- [x] 3.4 Add a nested `<TresMesh>` with a `<TresTorusGeometry>` to act as the glowing rim (using `uAccentColor`).
- [x] 3.5 Add a `<TresDirectionalLight>` (e.g., positioned at `[5, 10, 5]` with intensity `2`) and a `<TresAmbientLight>` (intensity `0.5`) to the template to ensure the UFO's `TresMeshStandardMaterial` is visible and properly shaded.
- [x] 3.6 Ensure that `Vector2` and any other required core Three.js math classes are explicitly imported from `'three'`.

## 4. Tractor Beam Shader & Animation (WebGLScene.vue)

- [x] 4.1 Update the `onBeforeRender` callback inside `WebGLScene.vue` to dynamically update `ufoRef.value.position.y` with a sine wave (e.g., `2.5 + Math.sin(elapsed * 2) * 0.1`) to create a breathing hover effect.
- [x] 4.2 Update the `fragmentShader`'s NAV phase logic (`uPhase < 0.5`). Replace the old volumetric cone with a "Tractor Beam" that calculates distance from the UFO's screen-space coordinates.
- [x] 4.3 Ensure the Tractor Beam has a hard glowing core (`smoothstep(0.15, 0.0, dist)`) and a soft translucent aura (`smoothstep(1.0, 0.0, dist)`), fading vertically as it reaches the bottom of the screen.

## 5. Post-Flight / Verification

- [x] 5.1 Run Biome linter/formatter (`npm run lint`, `npm run format` or `biome check .`).
- [x] 5.2 Run Vitest unit/component tests (`npm run test:unit`).
- [x] 5.3 Verify locally in the browser that the UFO hovers smoothly and the Tractor Beam accurately matches the UFO's position without layout thrashing.
