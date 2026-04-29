## Context

The portfolio uses a two-phase lighting model: a **NAV phase** (static overhead lamp illuminating the hero/navigation area) and a **CONTENT phase** (flashlight in the bottom-right corner, beam tracking the mouse). The current implementation has three independent components (`FlashlightSource`, `VolumetricBeam`, `SpotlightMask`) that each compute their own rotation and position offsets from `useLightingStore`, leading to subtle visual desync — the beam cone, the dark-area cutout, and the flashlight body don't perfectly overlap.

Additionally, the hero lamp (`hero.png`) is a placeholder icon, the flashlight source cannot be repositioned, and there's no depth illusion beyond the perspective grid.

## Goals / Non-Goals

**Goals:**
- Centralise all beam geometry (origin, rotation, spread angle) into a single computed state in `useLightingStore` so consumers become pure renderers.
- Replace the placeholder hero image with a 3D lamp render.
- Make the flashlight draggable/repositionable to improve interactivity.
- Add a smooth-trailing custom cursor that replaces the native pointer during CONTENT phase.
- Add subtle parallax depth layers to the hero section and atmospheric elements.
- Improve NAV-phase lamp lighting to feel more physically grounded.

**Non-Goals:**
- WebGL/Three.js — all effects remain CSS + composable-driven.
- Changing the theme engine or colour system.
- Mobile gestures for the flashlight (future change).

## Decisions

### 1. Centralised Beam Geometry State

**Decision**: All beam-dependent values (origin `{x, y}`, rotation in degrees, spread angle) are computed once in `useLightingStore` and exposed as readonly refs. Components consume these directly — no local `atan2` or offset calculations.

**Rationale**: Currently, `FlashlightSource` adds `+90` to rotation, `VolumetricBeam` subtracts `-90`, and `SpotlightMask` adds `+90 - halfSpread`. Each compensates for a different transform-origin. By computing the final rotation once with a consistent coordinate system, we eliminate the class of bugs where one component's offset doesn't match another's.

**Alternatives**:
- *Keep per-component offsets but add a shared constant* — still fragile, doesn't address the origin desync.
- *Move geometry to a composable instead of the store* — viable, but the store already manages mouse position and phase, keeping it together is simpler.

### 2. Draggable Flashlight via Pointer Events

**Decision**: The flashlight source position is stored as a reactive `{x, y}` ref in `useLightingStore`. A `useFlashlightDrag` composable handles `pointerdown`/`pointermove`/`pointerup` on the `FlashlightSource` element, updating the store position. The `FlashlightSource` component enables `pointer-events: auto` only on the flashlight body (overriding the global `pointer-events: none` on the overlay layer).

**Rationale**: Pointer Events API is the standard for drag interactions, works with touch, and avoids the need for a drag library. Constraining the draggable area to viewport bounds is trivial with `clamp()`.

**Alternatives**:
- *HTML Drag-and-Drop API* — poor visual control (ghost image), no touch support.
- *Third-party library (interact.js)* — unnecessary dependency for a single element.

### 3. Custom Cursor via CSS + Composable

**Decision**: A `useCustomCursor` composable listens for mouse position (via `useViewportStore.mousePosition`) and drives a GPU-accelerated `transform: translate3d()` on a dedicated `<CustomCursor>` component. The native cursor is hidden via `cursor: none` on `<body>` during CONTENT phase. Spring physics (`lerp` per `requestAnimationFrame`) create a trailing effect.

**Rationale**: CSS `transform` is compositor-only and doesn't trigger layout. Using `requestAnimationFrame` with simple lerp avoids a spring-physics library dependency while producing a smooth trail.

### 4. Parallax via CSS Transform Layers

**Decision**: Parallax is achieved by wrapping hero elements and atmospheric layers in data-attributed containers (`data-parallax-speed`). A `useParallaxEngine` composable reads the current `scrollY` from `useViewportStore` and applies `translateY(calc(scrollY * speed))` to each layer. Speed values range from `0.02` (barely moves, far) to `0.15` (moves fast, near).

**Rationale**: Transform-based parallax avoids reflow, works in any browser, and the `useViewportStore` already provides centralised scroll data. No additional event listeners needed.

**Alternatives**:
- *CSS `scroll-timeline`* — not yet supported in all target browsers.
- *Intersection Observer* — suited for enter/exit triggers, not continuous parallax.

### 5. Hero Lamp Asset

**Decision**: Generate a high-fidelity 3D-style lamp render via the image generation tool and replace `src/assets/hero.png`. The new image should be a dark, moody hanging lamp with emerald/teal accent lighting matching the `--finished-accent` colour, rendered on a transparent background (PNG).

**Rationale**: The lamp is the visual anchor of the NAV phase. A realistic render reinforces the "physical light source" illusion without introducing runtime 3D rendering overhead.

## Risks / Trade-offs

- **Draggable flashlight on mobile**: Dragging conflicts with scroll. Mitigated by scoping this change to desktop only (non-goal: mobile gestures).
- **Custom cursor jank on low-end devices**: The trailing lerp runs at 60fps. Mitigated by using `requestAnimationFrame` and `transform3d` (GPU layer). Fallback: disable trailing on devices where `navigator.hardwareConcurrency < 4`.
- **Parallax nauseation**: Some users are sensitive to motion. Mitigated by respecting `prefers-reduced-motion` media query — disable parallax and cursor trail when set.
- **Hero image size**: A high-quality PNG could be large. Mitigated by using WebP format if supported, keeping dimensions at 800×800 max, and lazy-loading.
