## 2024-05-02 - Layout Thrashing in CSS Animations
 **Learning:** Animating `color`, `text-shadow`, `border-color`, and `box-shadow` properties on Vue components triggers `non-composited-animations` warnings and causes severe layout thrashing on the main thread.
 **Action:** Refactored CSS to use hardware-accelerated properties. Instead of animating the complex properties directly, create overlapping pseudo-elements (or extra wrapper elements) that hold the final styled state, and animate their `opacity` from 0 to 1 during state transitions.
## 2024-05-02 - WebGL Render Loop Performance
 **Learning:** Accessing reactive Vue proxy objects (like Pinia state properties that aren't marked as raw) inside a high-frequency WebGL render loop (like TresJS `useLoop().onBeforeRender`) triggers Vue's dependency tracking every frame (60+ times per second), leading to massive CPU overhead and garbage collection pauses.
 **Action:** Isolate high-frequency data structures using `markRaw` in Pinia. The viewport store's mouse pointer coordinates (`rawMouse`) must be passed to the WebGL context as a plain JavaScript object without reactivity proxies, while a debounced/rAF-gated reactive version (`mousePosition`) handles standard DOM updates.
## 2024-05-03 - Layout Thrashing & GC Pressure in Loops
 **Learning:** Calling `getBoundingClientRect()` within scroll event handlers causes layout thrashing, and using `.clone()` on Three.js primitives (like `Vector3`) within high-frequency WebGL render loops causes severe garbage collection pressure.
 **Action:** Instead of querying the DOM in scroll listeners, calculate necessary metrics using pure math and known layout constants. In WebGL loops, pre-allocate module-scoped instances (e.g., `const _workingVector = new Vector3()`) and modify them in-place using `.copy()` to bypass object creation overhead.
## 2024-05-04 - Vue Reactivity in WebGL Render Loops
 **Learning:** Accessing reactive Vue proxy objects (like Pinia state or `ref`s) directly inside a high-frequency WebGL render loop (like TresJS `useLoop().onBeforeRender`) triggers Vue's dependency tracking getters on every single frame (60+ FPS). This causes massive CPU overhead and garbage collection pauses.
 **Action:** Isolate the render loop from Vue reactivity. Create a plain JavaScript object (e.g., `renderState`) outside the loop, update it asynchronously via a `watchEffect`, and read strictly from this plain object inside `onBeforeRender`.

## 2024-05-05 - Vue Reactivity Thrashing in Fallback Layers
**Learning:** Using reactive variables (`ref`) to track high-frequency events like `pointermove` for simple layout transitions (e.g. a custom cursor) forces unnecessary virtual DOM re-renders and degrades performance, which is especially problematic on lower-tier hardware lacking WebGL support.
**Action:** Always bypass Vue reactivity for high-frequency coordinate tracking if it only drives DOM styles. Cache coordinates in plain JS variables and mutate DOM elements directly via a Vue template `ref` inside a `requestAnimationFrame` loop.
## 2026-05-06 - requestAnimationFrame closure staleness
 **Learning:** When using requestAnimationFrame to throttle high-frequency events (like pointermove), caching coordinates directly in the callback closure can lead to stale data. If multiple events fire before the frame renders, the RAF uses the coordinates from the *first* event, not the latest.
 **Action:** Store the latest coordinates in plain variables defined outside the RAF closure. Update these variables immediately in the event handler, and have the RAF read from them. This ensures the frame always renders the most up-to-date position.
