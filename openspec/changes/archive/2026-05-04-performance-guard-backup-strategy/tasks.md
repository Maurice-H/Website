## 1. App.vue & Layout Resilience

- [x] 1.1 Update `isCustomCursorActive` logic to include `performance.isWebGLSupported` check.
- [x] 1.2 Implement `ResilienceLayer.vue` component with CSS-based lighting (NAV/CONTENT).
- [x] 1.3 Integrate `ResilienceLayer` into `App.vue` as a conditional fallback for `WebGLBackground`.

## 2. BentoCard Optimization

- [x] 2.1 Pass `isLowEnd` state (from `performanceStore`) to `BentoCard` components.
- [x] 2.2 Update `BentoCard.vue` styles to disable `backdrop-filter` and simplify stack layers on Tier 1.
- [x] 2.3 Verify that hover effects remain functional but lightweight in Tier 1.

## 3. Verification & Testing

- [x] 3.1 Verify Tier 1 behavior by forcing `isWebGLSupported = false` in dev tools.
- [x] 3.2 Ensure system cursor is visible and functional in CONTENT phase on Tier 1.
- [x] 3.3 Check performance on mobile/simulated low-end devices.
