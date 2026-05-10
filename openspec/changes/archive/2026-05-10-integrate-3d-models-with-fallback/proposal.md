## Why

Replace the current geometric placeholders (primitive spheres/cylinders) for the UFO and Companion Drone with high-quality 3D models from Sketchfab to enhance the visual premium feel of the landing page. Additionally, implement a robust CSS-only fallback for low-end devices (GPUTier 1) to maintain the "cinematic" experience without the performance overhead of WebGL.

**Phase 2 (current):** With models now loading, extend the integration to include theme-reactive accent colors on the UFO, a purposeful scanning patrol path for the drone with a light beam, and immersive toggle sounds for the ThemeToggle and LightingToggle controls.

## What Changes

- **Asset Management**: Introduction of a `public/models` directory for `.glb` files and `public/audio` for sound effects.
- **3D Integration**: Update `WebGLScene.vue` to use `GLTFLoader` from `three-stdlib` for loading external models with `normalizeModel` bounding-box scaling and `prepareForScreenBlend` emissive material preparation.
- **Performance Fallback**: New `CSSBackground.vue` component that replicates the UFO and Drone visual and motion using pure HTML/CSS.
- **Conditional Rendering**: Logic in `WebGLBackground.vue` to toggle between the WebGL scene and the CSS fallback based on `isWebGLSupported`.
- **UFO Theme Colors**: Green emissive meshes on the UFO shift to blue when toggling to Blueprint mode and back.
- **Drone Patrol Behavior**: Replace random sinusoidal flight with a deliberate waypoint-based scanning patrol path, a forward-mounted spotlight beam, and a periodic sonar-style area scan ring effect.
- **Drone Model Fix**: Debug and fix the D.S.E.V. drone model (30MB, Sketchfab) which loads without errors but doesn't render correctly in the CONTENT phase.
- **Immersive Audio**: Replace the basic switch sounds on ThemeToggle and LightingToggle with immersive, thematic audio effects.

## Capabilities

### New Capabilities
- `3d-asset-pipeline`: Standards for loading, scaling, and animating external 3D models in the WebGL scene.
- `css-cinematic-fallback`: A lightweight CSS-driven animation system that replicates 3D behavior for low-end hardware.
- `drone-patrol-system`: Waypoint-based drone patrol with scanning behavior, light beam, and periodic sonar effect.
- `immersive-toggle-audio`: Thematic sound effects for the ThemeToggle and LightingToggle navigation controls.

### Modified Capabilities
- `fused-rendering-engine`: Updated to handle external asset dependencies and hybrid (WebGL/DOM) background states.
- `performance-resilience`: Integration of the background fallback into the performance tiering logic.

## Impact

- **Affected Code**: `WebGLScene.vue`, `WebGLBackground.vue`, `ThemeToggle.vue`, `LightingToggle.vue`, `usePerformanceStore.ts`, `index.html` (CSP).
- **Dependencies**: Requires `ufo.glb` and `drone.glb` in `public/models/`, audio files in `public/audio/`.
- **Performance**: Improved experience on Tier 1 devices; increased visual fidelity on Tier 2/3. Audio plays with graceful failure on autoplay-blocked browsers.
- **Security**: CSP `connect-src` directive updated to allow `blob:` URLs for GLTFLoader texture extraction.
