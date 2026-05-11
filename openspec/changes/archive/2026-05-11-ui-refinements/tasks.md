## 1. CSS Background Refinements

- [x] 1.1 Update `CSSBackground.vue` to conditionally hide `.drone-scanner` on mobile devices using `@media (hover: none) and (pointer: coarse)`.
- [x] 1.2 Update `CSSBackground.vue` styles to increase `.drone-blueprint` glow opacity to 0.6 (from 0.35) for better visibility.
- [x] 1.3 Update desktop media query in `CSSBackground.vue` to set `drone-glow-pulse` max opacity to 1.0 and scale to 1.4.
- [x] 1.4 Add a `drone-status-light` to `CSSBackground.vue` that glows with the accent color when lighting is enabled to serve as a mode indicator.

## 2. App Navigation Refinements

- [x] 2.1 Import `useShortcutStore` in `App.vue`.
- [x] 2.2 Update the hardcoded `[ ESC ]` string in the `App.vue` template to use the dynamic `shortcutStore.getDisplay('back')` method.
- [x] 2.3 Update `isCustomCursorActive` in `App.vue` to return false on mobile devices to prevent hiding the system cursor.
- [x] 2.4 Update `App.vue` to hide the keyboard shortcut prefix in the "Back" button on mobile devices.
- [x] 2.5 Implement `resetAll()` in `useShortcutStore.ts` and rename `resetDefaults` to it.
- [x] 2.6 Add "Reset All" button to `NavConveyor.vue` UI with circular arrow icon.
- [x] 2.7 Fix `useKeyboardShortcuts.ts` to allow rebinding the `back` action to `Escape`.

## 3. WebGL & Fallback Scene Refinements

- [x] 3.1 Refactor `loadDroneModel()` in `WebGLScene.vue`. Move its invocation from the `CONTENT` phase watcher to the `gltfLoader.load` success callback for the `ufo.glb` model to ensure immediate background preloading.
- [x] 3.2 Add `uIsMobile` uniform to `WebGLScene.vue` and update `main.frag.glsl` to suppress the Cyber-Optic HUD Scanner on mobile.
- [x] 3.3 Update `ResilienceLayer.vue` to hide the `cursor-glow` on mobile devices.

## 4. Quality Assurance

- [x] 4.1 Run Biome linter/formatter (`npm run format` or `biome check .`) and fix any issues.
- [x] 4.2 Run Vitest unit tests (`npm run test:unit`) to ensure components render correctly.
- [x] 4.3 Run Playwright E2E tests (`npm run test:e2e`) to verify no visual regressions occurred.
