## Why

Currently, the `SpotlightMask.vue` uses a radial gradient centered on the mouse cursor to reveal content, while `VolumetricBeam.vue` renders a decorative 3D light cone over the content. This causes a visual disconnect: the light beam is visible, but it doesn't actually act as the light source illuminating the UI elements beneath it. The content is only revealed in a circle around the mouse, meaning the beam looks like "green fog" over a black background instead of a true light ray. We need to shift from a mouse-centric radial mask to a flashlight-centric conic mask to achieve true visual realism.

## What Changes

We will refactor the `SpotlightMask.vue` overlay to use a combination of a `conic-gradient` and `radial-gradient` that originates from the flashlight's exact position. This new dynamic mask will calculate its rotation and spread based on the flashlight's angle, effectively acting as the true light source that reveals the subpage content. The decorative `clip-path` in `VolumetricBeam.vue` will remain for the atmospheric haze, but the actual content visibility will now perfectly match the cone of light.

## Capabilities

### Modified Capabilities
- `dynamic-lighting-system`: Update the lighting engine mask from a cursor-following radial gradient to an origin-based directional conic gradient.

## Impact

- `src/components/layout/SpotlightMask.vue`: Significant refactoring of the `.light-overlay` background CSS.
- `src/stores/lighting.ts`: May need minor updates to expose exact flashlight coordinates or ensure the angle is correctly formatted for CSS `conic-gradient`.
- No new dependencies.

## Non-Goals
- We will not implement real-time 3D raytracing or shadow casting for individual UI elements.
- We will not change the `NAV` phase lighting, which relies on a fixed overhead lamp.

## Testing Strategy
- Manual visual verification to ensure the mask perfectly aligns with the volumetric beam at all angles.
- Verify transition states between `NAV` and `CONTENT` phases to ensure the mask switches smoothly.
