## 1. Unified Pointer Input (WebGL Tracking)

- [x] 1.1 Update `WebGLBackground.vue` to replace `mousemove` listeners with `pointermove` to capture both touch and mouse events.
- [x] 1.2 Update the coordinate normalization logic to ensure touch points are correctly projected into the shader's `uMouse` uniform.
- [x] 1.3 Ensure `pointerleave` or `touchcancel` events reset the light position or handle it gracefully to avoid stuck highlights.

## 2. Mobile Layout & Spacing

- [x] 2.1 Refactor `NavConveyor.vue`: Replace hardcoded paddings in the `conveyor-track` with responsive CSS variables or Tailwind classes (e.g., `px-4 md:px-[calc(50vw-240px)]`).
- [x] 2.2 Update `BentoLayout.vue`: Ensure the grid columns transition to a single column on mobile (max-width: 768px).
- [x] 2.3 Audit `App.vue`: Check if the `100vh` container causes jitter on mobile browsers and consider using `100dvh`.

## 3. Visual Polish & Immersion

- [x] 3.1 Adjust the `--reveal-mask` in `App.vue` for mobile viewports to ensure the "Technical DNA" background text is correctly masked.
- [x] 3.2 Verify z-index hierarchy between `content-stage` and `WebGLBackground` to ensure touch events are not blocked.

## 4. Quality Assurance (Jules Standard)

- [x] 4.1 Run Biome linter/formatter (`npm run lint` / `npm run format`).
- [x] 4.2 Run Vitest unit tests for the lighting store and projection math.
- [x] 4.3 Manual verification using Chrome DevTools mobile emulation (iPhone/Pixel).
