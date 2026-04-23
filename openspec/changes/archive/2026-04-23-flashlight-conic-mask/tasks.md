## 1. Setup & Pre-flight

- [x] 1.1 Read and apply all guidelines located in the `.docs/skills/` directory.
- [x] 1.2 Verify `stores/lighting.ts` provides the correct `lighting.angle` necessary for generating the CSS conic gradient (it should be accessible and reactive in `SpotlightMask.vue`).

## 2. Refactor SpotlightMask Overlay

- [x] 2.1 Update `contentGradient` in `SpotlightMask.vue`'s `overlayStyle` computed property.
- [x] 2.2 Change `contentGradient` to use a `conic-gradient` that originates at the flashlight's exact position (`calc(100% - 150px) calc(100% - 150px)` or equivalent based on `FlashlightSource` origin).
- [x] 2.3 Calculate the start and end angles for the transparent section of the conic gradient using `lighting.angle` and a defined spread angle (e.g. +/- 15 degrees).
- [x] 2.4 Add a `radial-gradient` to `contentGradient` to smoothly fade the beam into darkness at the edges of the screen, mimicking light falloff.
- [x] 2.5 Combine both gradients (e.g., using multiple backgrounds) to form the final `contentGradient`.

## 3. Post-Flight / Definition of Done

- [x] 3.1 Run Biome linter/formatter (e.g., `npm run lint`, `npm run format` or `biome check .`).
- [x] 3.2 Run Vitest unit/component tests (e.g., `npm run test:unit`).
- [x] 3.3 Run Playwright E2E tests if UI flows were affected (e.g., `npm run test:e2e`).
- [x] 3.4 Visually verify that the new conic mask perfectly overlaps with the `VolumetricBeam` and illuminates the UI exactly within the cone of light.
