## Context

The current `SpotlightMask.vue` implements a radial gradient mask centered around `--mask-x` and `--mask-y` (the mouse cursor coordinates). Meanwhile, `VolumetricBeam.vue` projects a visual light cone from a fixed origin (the flashlight component) toward the mouse. This discrepancy causes the "light beam" to render *over* darkness, instead of the beam itself being the source of illumination that reveals the UI cards.

## Goals / Non-Goals

**Goals:**
- Unify the visual light beam and the functional UI mask.
- Refactor the `CONTENT` phase overlay in `SpotlightMask.vue` to use a `conic-gradient` originating from the flashlight's exact position.
- Combine the `conic-gradient` with a `radial-gradient` falloff so the light fades out naturally in the distance.
- Maintain existing 60fps performance without introducing complex SVG masking or heavy JS calculations.

**Non-Goals:**
- We are not changing the `NAV` phase static ceiling lamp logic.
- We are not adding shadow-casting to individual bento items.
- We are not altering the flashlight asset itself, only the mask overlay.

## Decisions

- **CSS Background over `mask-image`:** We will implement this as a dark `div` with a complex `background` property instead of a `mask-image`. By using a CSS background, we can seamlessly mix a `radial-gradient` (for distance falloff) and a `conic-gradient` (for the directional cone) using multiple background layers or standard CSS compositing.
- **Conic-Gradient Logic:** The conic gradient will use `lighting.angle` (calculated in `stores/lighting.ts`) to center a transparent "pie slice" matching the exact spread of the `VolumetricBeam.vue`.
- **Fixed Origin:** The origin of the gradients will be locked to `bottom: 150px`, `right: 150px` (or whatever the exact `FlashlightSource` origin is), rather than following the mouse. Only the `angle` of the conic gradient will update on mouse move.

## Risks / Trade-offs

- **Risk:** Blending a `conic-gradient` and a `radial-gradient` to create a realistic beam shape might require careful tweaking of color stops to look natural.
- **Trade-off:** Hardcoding the origin coordinates in CSS (`at calc(100% - 150px) calc(100% - 150px)`) tightly couples `SpotlightMask.vue` to `FlashlightSource.vue`. If the flashlight moves, the mask origin must be updated. This is an acceptable trade-off for the performance gain over JS-calculated origins.
