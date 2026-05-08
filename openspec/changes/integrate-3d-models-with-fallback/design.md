## Context

The 3D model integration is partially complete: GLB models load via `GLTFLoader`, `normalizeModel` handles bounding-box sizing, and `prepareForScreenBlend` sets emissive materials for `mix-blend-screen` compositing. The CSP was updated to allow `blob:` URLs for texture extraction. The CSS fallback for Tier 1 devices is operational.

Remaining work focuses on three areas: (1) UFO accent colors reacting to the theme toggle, (2) the D.S.E.V. drone's patrol behavior and light beam, and (3) immersive audio for the navigation toggles.

## Goals / Non-Goals

**Goals:**
- Replace primitives with high-quality GLB models on Tier 2+ devices. *(done)*
- Implement CSS fallback for Tier 1 devices. *(done)*
- Ensure zero impact on main-thread performance during asset loading. *(done)*
- UFO green-emissive meshes shift to blue on Blueprint mode toggle.
- Drone follows a deliberate waypoint patrol path with forward-mounted spotlight.
- Drone performs a sonar-style area scan ring every ~30 seconds.
- ThemeToggle and LightingToggle play immersive, thematic sound effects.

**Non-Goals:**
- Creating the 3D models themselves (provided by user/Sketchfab).
- Complex PBR environment maps or ray tracing.
- Spatial audio / 3D positional sound.
- Sound effects for any controls beyond ThemeToggle and LightingToggle.

## Decisions

### Model Theme-Reactive Colors (UFO + Drone)
- **Approach**: Traverse both the UFO and Drone scenes after loading and identify meshes whose emissive color has a green hue (HSL h ≈ 100–180°). On theme toggle, shift their hue to the new accent color (`#10b981` green → `#38bdf8` blue) while preserving lightness/saturation ratios.
- **Why not replace all materials?** Both models have neutral surfaces (metallic hull, glass, plastic) that should stay untouched — only the accent-colored parts (neon strips, glowing eyes/thrusters) should react.
- **Reactive watcher**: A `watch(accentColorStr)` triggers the recolor function on both model scenes.

### Drone Patrol System
- **Patrol Path**: A predefined array of waypoints in 3D space. The drone interpolates between them using smooth easing (cubic bezier or `smoothstep`). The drone always faces its travel direction.
- **Waypoint Cycle** (45s total loop):
  1. Horizontal sweep left→right at mid-height (0-15s)
  2. Forward approach, scanning downward (15-25s)
  3. Hover in place → area scan trigger (25-30s)
  4. Return sweep right→left, slightly higher (30-45s)
- **Light Beam**: A `SpotLight` child of the drone group, pointing forward-downward with a narrow cone (~15°), accent-colored, with subtle intensity flicker. A transparent cone mesh provides the visible light volume.
- **Area Scan**: A flat torus geometry that spawns at the drone's position, scales outward, and fades out over ~2 seconds. Triggered every 30 seconds. Optionally triggers the existing `glitchPass` for a brief screen effect.

### Drone Model Fix
- The D.S.E.V. model (30MB) loads without console errors but may not render due to:
  - Being phase-gated to CONTENT only (user confirmed this is correct)
  - Non-standard materials that `prepareForScreenBlend` doesn't catch (e.g., `MeshBasicMaterial`, `ShaderMaterial`)
  - Extremely large native dimensions causing `normalizeModel` to produce a tiny scale factor
- **Fix**: Add diagnostic logging during loading (mesh count, material types, bounding box). Handle all material types in `prepareForScreenBlend`. Adjust `DRONE_TARGET_SIZE` if needed.

### Immersive Toggle Audio
- **Architecture**: Create a shared `src/composables/useAudioFeedback.ts` composable that centralizes audio playback with:
  - Preloading via `Audio` constructor (avoids fetch latency on first click)
  - Volume control (default 0.3 — subtle, not jarring)
  - Graceful failure (browser autoplay policy silently swallowed)
- **Sound Selection**: Different sounds per toggle:
  - ThemeToggle: A futuristic mode-switch sound (mechanical/digital click)
  - LightingToggle: A lamp/power switch sound (softer, analog feel)
- **Audio Files**: User to provide `.ogg` files in `public/audio/`. Existing `switch2.ogg` and `switch15.ogg` will be replaced or augmented.

## Risks / Trade-offs

- **Risk: Large Drone Model (30MB)**: Loading a 30MB model takes several seconds on slow connections.
  - *Mitigation*: The primitive fallback displays immediately. Consider adding a loading progress callback.
- **Risk: Audio Autoplay Blocking**: Browsers block audio until user interaction.
  - *Mitigation*: Audio is triggered by click events (user gesture), so autoplay policy is satisfied. The `.catch()` silently swallows any remaining issues.
- **Trade-off: Patrol Path Complexity**: A waypoint system adds ~50 lines of animation code.
  - *Decision*: Worth it for the immersive scanning behavior vs. random noise movement.
- **Trade-off: Scan Ring Performance**: Spawning geometry every 30s.
  - *Decision*: A single reused torus with scale/opacity animation is negligible cost.
