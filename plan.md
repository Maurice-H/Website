1. **Optimize `ResilienceLayer.vue` (Vue Reactivity Thrashing)**
   - Modify `src/components/layout/ResilienceLayer.vue` to stop using reactive `ref` variables (`mouseX`, `mouseY`) for tracking `pointermove` events.
   - Use plain JS variables (`rawMouseX`, `rawMouseY`) and apply `requestAnimationFrame` to directly mutate the DOM style (`transform: translate(...)`) of the custom cursor `div` via a Vue template `ref`.
   - Update `cursorStyle` to a `baseCursorStyle` computed property that only handles background gradients, setting the initial transform purely via inline style or CSS.
   - *Impact*: Eliminates Virtual DOM re-rendering on every mouse movement, improving FPS on fallback (non-WebGL) environments and reducing CPU usage.
2. **Update Bolt's Journal**
   - If missing, create `.agent/journals/bolt.md`.
   - Document the critical learning about avoiding Vue reactivity for high-frequency events inside fallback layout layers to preserve 60 FPS hardware acceleration.
3. **Verify and Pre-commit Steps**
   - Run `npm run lint` and apply fixes if necessary (`npm run format`).
   - Run `npm run check:avoidance`.
   - Run Vitest unit tests (`npm run test:unit`) to ensure nothing breaks.
   - Run Playwright E2E tests (`npm run test:e2e`).
   - Run `npm run build` to verify the build process is successful.
4. **Submit Pull Request**
   - PR Title: `⚡ Bolt: Bypass Vue reactivity on pointermove in ResilienceLayer`
   - Message: "Moves fallback custom cursor logic out of Vue reactivity to achieve steady 60 FPS by mutating the DOM element's transform property directly via requestAnimationFrame."
