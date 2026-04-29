## 1. Pre-Flight & Types

- [ ] 1.1 PRE-FLIGHT: Read and apply all guidelines from `.docs/skills/` directory.
- [ ] 1.2 Define TypeScript interfaces for centralised beam geometry state: `BeamGeometry { origin: Point; rotation: number; spreadAngle: number }`, `Point { x: number; y: number }`, and `DragState { isDragging: boolean; offset: Point }`.
- [ ] 1.3 Define TypeScript interface for custom cursor state: `CursorState { position: Point; targetPosition: Point; visible: boolean; trailing: boolean }`.

## 2. Centralise Beam Geometry in Lighting Store

- [ ] 2.1 Refactor `src/stores/lighting.ts` to store `sourcePosition` as a reactive `Point` ref (default: `{ x: window.innerWidth - 150, y: window.innerHeight - 150 }`), replacing the current `getSourcePosition()` function.
- [ ] 2.2 Add a `beamGeometry` computed ref that derives `{ origin, rotation, spreadAngle }` from `sourcePosition` and `viewport.mousePosition` — single `atan2` call, single source of truth.
- [ ] 2.3 Remove `flashlightRotation` ref and `updateFlashlightRotation()` method, replacing all consumers with `beamGeometry.rotation`.
- [ ] 2.4 Update `src/stores/viewport.ts` to remove the call to `lighting.updateFlashlightRotation()` — the computed ref handles this reactively.

## 3. Update Lighting Components to Consume Centralised State

- [ ] 3.1 Refactor `FlashlightSource.vue` to read `lighting.beamGeometry.origin` and `lighting.beamGeometry.rotation` instead of computing its own transform offsets.
- [ ] 3.2 Refactor `VolumetricBeam.vue` to read `lighting.beamGeometry` for position, rotation, and spread — remove all local offset calculations (`-90`, `transformOrigin: '0px 20px'`).
- [ ] 3.3 Refactor `SpotlightMask.vue` to read `lighting.beamGeometry` for cone origin and angles — remove local `+90 - halfSpread` calculations and `originX`/`originY` strings.
- [ ] 3.4 Refactor `PerspectiveGrid.vue` to read `lighting.beamGeometry.origin` for the mask center instead of raw `--mask-x`/`--mask-y` CSS variables.
- [ ] 3.5 Verify visual alignment: VolumetricBeam cone, SpotlightMask cutout, and FlashlightSource body all overlap perfectly when pointing at any screen corner.

## 4. Draggable Flashlight

- [ ] 4.1 Create `src/composables/useFlashlightDrag.ts` composable that manages `pointerdown`/`pointermove`/`pointerup` events and updates `lighting.sourcePosition`.
- [ ] 4.2 Add viewport boundary constraints (clamped to 50px from each edge) in the drag composable.
- [ ] 4.3 Integrate `useFlashlightDrag` into `FlashlightSource.vue` — enable `pointer-events: auto` on the flashlight body element only.
- [ ] 4.4 Add visual drag affordance: subtle scale-up and glow increase when the flashlight is being dragged.

## 5. Custom Cursor

- [ ] 5.1 Create `src/composables/useCustomCursor.ts` composable with lerp-based trailing logic using `requestAnimationFrame`.
- [ ] 5.2 Add `prefers-reduced-motion` detection — disable trailing (instant follow) when reduced motion is enabled.
- [ ] 5.3 Create `src/components/layout/CustomCursor.vue` component — a small flashlight-themed dot/circle rendered via GPU-accelerated `transform: translate3d()`.
- [ ] 5.4 Integrate `CustomCursor.vue` into `SpotlightMask.vue` (or `App.vue`) — show only during CONTENT phase.
- [ ] 5.5 Add `cursor: none` to `<body>` during CONTENT phase and restore on NAV phase transition.

## 6. Hero Lamp Asset & NAV Lighting

- [ ] 6.1 Generate a high-fidelity 3D hanging lamp render (dark, moody, emerald/teal accent, transparent PNG background) using the image generation tool.
- [ ] 6.2 Replace `src/assets/hero.png` with the generated lamp image.
- [ ] 6.3 Update `HeroSection.vue` to display the new lamp image as the visual anchor of the NAV phase, positioned to align with the overhead light gradient origin.
- [ ] 6.4 Refine the NAV-phase overlay gradient in `SpotlightMask.vue` to produce a softer, more physically-grounded light pool with gradual circular falloff (no hard gradient stops).

## 7. Parallax Depth

- [ ] 7.1 Create `src/composables/useParallaxEngine.ts` composable that reads `scrollY` from `useViewportStore` and applies `translateY` transforms to elements with `data-parallax-speed` attributes.
- [ ] 7.2 Add `prefers-reduced-motion` detection — disable all parallax when reduced motion is enabled.
- [ ] 7.3 Apply `data-parallax-speed` attributes to hero text elements in `HeroSection.vue` (speed: `0.08`–`0.12`).
- [ ] 7.4 Apply `data-parallax-speed` attributes to `PerspectiveGrid.vue` (speed: `0.02`–`0.04`) and atmospheric layers.
- [ ] 7.5 Verify depth illusion: foreground hero text moves faster than the perspective grid when scrolling.

## 8. Testing & Verification

- [ ] 8.1 Update `src/stores/__tests__/lighting.spec.ts` to test the new `beamGeometry` computed state and `sourcePosition` reactivity.
- [ ] 8.2 Update `src/composables/__tests__/useViewportStore.spec.ts` to remove assertions about `updateFlashlightRotation`.
- [ ] 8.3 Add unit tests for `useFlashlightDrag.ts` — drag start, move, end, and boundary constraints.
- [ ] 8.4 Add unit tests for `useCustomCursor.ts` — trailing interpolation, phase-based visibility, reduced-motion fallback.
- [ ] 8.5 Add unit tests for `useParallaxEngine.ts` — transform calculation, speed range, reduced-motion disable.
- [ ] 8.6 POST-FLIGHT: Run `npm run lint`, `npm run test:unit`, verify all pass.
