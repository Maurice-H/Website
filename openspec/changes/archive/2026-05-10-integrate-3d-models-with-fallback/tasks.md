## 1. Environment & Setup

- [x] 1.1 Create `public/models` directory for 3D assets.
- [x] 1.2 Add documentation note about required GLB files (`ufo.glb` and `drone.glb`).
- [x] 1.3 Update CSP `connect-src` in `index.html` to allow `blob:` URLs for GLTFLoader texture extraction.

## 2. CSS Fallback Implementation

- [x] 2.1 Create `src/components/layout/CSSBackground.vue` component.
- [x] 2.2 Implement CSS-based UFO with hovering animation.
- [x] 2.3 Implement CSS-based Drone with orbital path animation.
- [x] 2.4 Synchronize CSS animations with `lightingStore.phase`.

## 3. WebGL Scene Update

- [x] 3.1 Modify `src/components/layout/WebGLScene.vue` to use `GLTFLoader` from `three-stdlib`.
- [x] 3.2 Add `normalizeModel` function for bounding-box-based scaling and centering.
- [x] 3.3 Add `prepareForScreenBlend` function for emissive material preparation.
- [x] 3.4 Implement `v-if/primitive` fallback pattern for UFO and Drone in template.

## 4. Conditional Rendering

- [x] 4.1 Update `src/components/layout/WebGLBackground.vue` to import `CSSBackground.vue`.
- [x] 4.2 Implement `v-if/v-else` logic to switch between `TresCanvas` and `CSSBackground`.

## 5. Model Theme-Reactive Accent Colors (UFO + Drone)

- [x] 5.1 Add `recolorAccentMeshes(scene, newColorHex)` function in `WebGLScene.vue` that traverses meshes with green-hue emissive (HSL h ≈ 100-180°) and shifts to the new accent color.
- [x] 5.2 Store original emissive colors on first load for accurate reversion.
- [x] 5.3 Call `recolorAccentMeshes` on both UFO and Drone scenes after loading.
- [x] 5.4 Add `watch(accentColorStr)` to reactively call `recolorAccentMeshes` on both the UFO and Drone scenes when theme toggles.
- [x] 5.5 Verify: UFO green accents change to blue on Blueprint toggle, revert on Default.
- [x] 5.6 Verify: Drone accent-colored parts change to blue on Blueprint toggle, revert on Default.

## 6. Drone Model Debug & Fix

- [x] 6.1 Add diagnostic logging after drone model loads: mesh count, material types, bounding box dimensions.
- [x] 6.2 Extend `prepareForScreenBlend` to handle `MeshBasicMaterial` and other non-standard material types.
- [x] 6.3 Adjust `DRONE_TARGET_SIZE` if the model is too small/large after normalization.
- [x] 6.4 Verify: Drone model is visible in CONTENT phase with correct textures and scale.

## 7. Drone Patrol Path System

- [x] 7.1 Define a waypoint array of 3D positions representing the patrol loop (horizontal sweep, forward approach, scan hover, return sweep).
- [x] 7.2 Implement smooth interpolation between waypoints using lerp/smoothstep with elapsed time.
- [x] 7.3 Add `lookAt`-based or quaternion heading so the drone always faces its travel direction.
- [x] 7.4 Replace the current sinusoidal animation in `onBeforeRender` with the waypoint system.

## 8. Drone Light Beam

- [x] 8.1 Add a `TresSpotLight` in the template as a child of the drone group, pointing forward-downward, accent-colored, narrow cone (~15°).
- [x] 8.2 Add a transparent cone mesh geometry for the visible light volume.
- [x] 8.3 Animate subtle intensity flicker/breathing on the spotlight per frame.
- [x] 8.4 Wire spotlight color to `accentColorStr` for theme-reactive beam color.

## 9. Drone Area Scan Effect

- [x] 9.1 Add a reusable scan ring mesh (flat torus) to the template, initially invisible.
- [x] 9.2 Implement scan trigger logic: every ~30 seconds, spawn the ring at the drone's position.
- [x] 9.3 Animate the ring: scale outward, fade opacity over ~2 seconds, then hide.
- [x] 9.4 Optionally trigger the existing `glitchPass` for a brief visual effect during scan.

## 10. Immersive Toggle Audio

- [x] 10.1 Create `src/composables/useAudioFeedback.ts` composable with preloaded audio, volume control, and graceful failure.
- [x] 10.2 Source or generate immersive sound effects: futuristic mode-switch (theme), lamp power switch (lighting).
- [x] 10.3 Update `ThemeToggle.vue` to use the new composable instead of inline `new Audio()`.
- [x] 10.4 Update `LightingToggle.vue` to use the new composable instead of inline `new Audio()`.
- [x] 10.5 Verify: Sounds play on click without errors, and degrade gracefully when blocked.

## 11. Verification & Quality

- [x] 11.1 Run `npm run format` and `npm run lint` — fix all issues.
- [x] 11.2 Run `npm run test:unit` — ensure no regressions.
- [x] 11.3 Test Tier 1 fallback by appending `?forceTier=1` to the URL.
- [x] 11.4 Test Tier 3 rendering by appending `?forceTier=3` — verify all new features visually.
- [x] 11.5 Test theme toggle: UFO colors shift, drone beam color changes, sounds play.
