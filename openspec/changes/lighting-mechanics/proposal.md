## Why

The portfolio's signature lighting system — its core visual differentiator — has several rough edges that undermine the premium feel. The hero lamp image (`hero.png`) is a generic placeholder, the flashlight is fixed in the bottom-right corner making it feel static, VolumetricBeam and SpotlightMask calculate rotations independently causing visual desync, and there are no parallax depth cues to support the "Cosmic Void" spatial illusion. Fixing these together as one change ensures the lighting pipeline stays internally consistent.

## What Changes

- **Replace `hero.png`** with a high-quality 3D lamp render that visually anchors the NAV-phase overhead light source.
- **Make flashlight moveable** — allow the user to drag/reposition the flashlight source instead of keeping it permanently in the bottom-right. The beam, mask, and all dependent layers update in real-time.
- **Implement custom cursor** — replace the default cursor with a smooth-trailing flashlight-themed cursor in CONTENT phase, hiding the native pointer.
- **Fix state synchronisation** — centralise beam geometry (origin, rotation, spread) in `useLightingStore` so `VolumetricBeam`, `SpotlightMask`, `FlashlightSource`, and `PerspectiveGrid` all read from a single source of truth, eliminating visual disconnection.
- **Improve landing page lighting realism** — refine the NAV-phase overhead lamp gradient to feel more like a physical hanging light with natural falloff.
- **Explore parallax effects** — add subtle multi-layer parallax depth to hero text, perspective grid, and atmospheric layers to reinforce the 3D spatial aesthetic.

## Non-Goals

- Overhauling the theme engine or colour variables (covered by `theming-responsiveness`).
- Adding sound effects or bento-card hover mechanics (covered by `theming-responsiveness`).
- 3D WebGL / Three.js integration — all lighting remains pure CSS/composable-driven.
- Mobile-specific layouts (covered by `theming-responsiveness`).

## Capabilities

### New Capabilities
- `custom-cursor`: A smooth-trailing, flashlight-themed custom cursor that replaces the native pointer during CONTENT phase and visually connects the user's hand to the light source.
- `parallax-depth`: Multi-layer parallax scrolling applied to hero text, atmospheric layers, and the perspective grid to create a convincing depth-of-field spatial effect.

### Modified Capabilities
- `dynamic-lighting-system`: Add moveable flashlight source positioning, centralised beam geometry state, and improved NAV-phase lamp realism. Fix VolumetricBeam ↔ SpotlightMask rotation desync.

## Impact

- **Stores**: `src/stores/lighting.ts` — major refactor to centralise beam geometry (origin, rotation, spread angle) and add draggable source position.
- **Components**: `SpotlightMask.vue`, `VolumetricBeam.vue`, `FlashlightSource.vue`, `PerspectiveGrid.vue` — all will consume the new centralised state instead of computing independently.
- **Assets**: `src/assets/hero.png` — replaced with a new 3D lamp render.
- **HeroSection**: `HeroSection.vue` — needs to incorporate the lamp image and parallax layering.
- **New composable**: `useCustomCursor.ts` — manages cursor hide/show, trailing position, and spring physics.
- **Testing**: Existing `lighting.spec.ts` and `useViewportStore.spec.ts` tests will need updates to match the refactored store API.
