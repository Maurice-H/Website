## Context

The current portfolio architecture relies heavily on mouse interaction (`mousemove`) for its WebGL "HUD scanner" effect and uses desktop-centric layout rules (e.g., fixed large paddings in `NavConveyor` and `BentoLayout`). On mobile devices, this leads to a "dead" background where the light doesn't follow the finger, and UI elements that feel cramped or misaligned.

## Goals / Non-Goals

**Goals:**
- Implement unified pointer handling (`pointerdown`, `pointermove`) to support both touch and mouse interaction for the WebGL uniforms.
- Refactor `NavConveyor.vue` and `BentoLayout.vue` to use responsive spacing tokens.
- Fix z-index and overflow issues on mobile browsers (addressing the "100vh" issue if necessary).

**Non-Goals:**
- Changing the underlying 3D models or shader logic.
- Adding new content sections or features.

## Decisions

- **Unified Pointer Logic:** We will switch from `mousemove` listeners to `pointermove` to handle both touch and mouse inputs in a single stream.
- **Normalized Coordinates:** Touch/Pointer coordinates will be normalized (0 to 1) before being sent as uniforms to the `WebGLBackground` to keep the shader logic resolution-independent.
- **Responsive Padding Tokens:** We will introduce CSS variables (e.g., `--content-px`) that change based on media queries to avoid hardcoded `calc(50vw - 240px)` logic on small screens.
- **Z-Index Sanitization:** We will audit the `ResilienceLayer` and `App.vue` overlays to ensure touch interactions are not blocked by invisible layers.

## Risks / Trade-offs

- **Event Frequency:** Pointer events on high-refresh-rate mobile screens can be very frequent. We may need to throttle uniform updates to 60fps to avoid main-thread jank.
- **Address Bar Jitter:** The shifting height of mobile address bars can cause layout shifts. We will use `min-height: 100dvh` where supported to mitigate this.
