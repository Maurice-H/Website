## Context

The current background features (CSS drone and WebGL drone) have some minor UX issues affecting transition smoothness and usability across different devices and themes. 
- Mobile devices incorrectly show the CSS drone "scanner" which acts as a cursor, taking up screen space unnecessarily.
- The `App.vue` 'Back' button uses static text `[ ESC ] Back`, which breaks the illusion of a fully dynamic, user-configurable system.
- The Blueprint theme (`isBlueprintMode`) relies on a CSS variable (`--drone-accent-glow: rgba(56, 189, 248, 0.15)`) that is far too subtle, making the CSS fallback drone nearly invisible.
- The `WebGLScene.vue` strictly waits for `phase === 'CONTENT'` to begin loading `drone.glb`. Because WebGL model parsing blocks slightly and takes time, this results in a ~3s flash of a primitive fallback shape.

## Goals / Non-Goals

**Goals:**
- Eliminate the 3-second primitive model flash during the NAV -> CONTENT transition.
- Make the 'Back' button text fully reactive to the user's `useShortcutStore` bindings.
- Improve the visual clarity of the CSS fallback drone, specifically on desktop and in Blueprint mode.
- Prevent the CSS drone scanner from rendering on touch devices.

**Non-Goals:**
- Introducing a global loading screen for all assets.
- Changing the fundamental WebGL fallback primitive logic (it's still a good safety net).

## Decisions

1. **WebGL Loading Lifecycle Refactor**: 
   - *Alternative Considered*: Keep the watch effect but preload the GLB into the browser cache only.
   - *Decision*: We will invoke `loadDroneModel()` inside the `onMounted` hook of `WebGLScene.vue`, specifically inside the `gltfLoader.load` callback for `ufo.glb`.
   - *Rationale*: This guarantees that the heavy UFO model (which is needed immediately on page load) parses first. Once the UFO is ready, the Drone will quietly parse in the background. By the time the user transitions to the CONTENT phase, `droneScene` will already be populated.

2. **Reactive Shortcut Text**:
   - *Decision*: Use `useShortcutStore().getDisplay('back')` directly in the `App.vue` template.
   - *Rationale*: Vue's reactivity system will automatically update the template if the store value changes.

3. **CSS & WebGL Drone Mobile/Theme Fixes**:
   - *Decision*: Wrap `.drone-scanner` in a media query `@media (hover: hover) and (pointer: fine)` in `CSSBackground.vue` to hide it on mobile.
   - *Decision*: Update `isCustomCursorActive` in `App.vue` to include a `!isMobile` check.
   - *Decision*: Pass `uIsMobile` uniform to `main.frag.glsl` and wrap the `HUD Scanner` in a `!uIsMobile` check.
   - *Decision*: Add a `v-if="!isMobile"` to the `cursor-glow` in `ResilienceLayer.vue`.
   - *Rationale*: Even if a mobile device has a high-tier GPU (Tier 2/3), it uses touch interaction. Hiding the system cursor or showing "cursor-locked" HUD elements on touch devices is confusing and breaks standard OS interaction metaphors.
   - *Decision*: Increase `--drone-accent-glow` to `0.6` in `.drone-blueprint` and amplify `drone-glow-pulse` max opacity to 1.0 and scale to 1.4 via a desktop media query.

## Risks / Trade-offs

- [Risk] Loading the drone model earlier could theoretically cause a small main-thread stutter immediately after the initial page load.
  → *Mitigation*: We place it inside the `ufo.glb` success callback. The initial "First Contentful Paint" and "Time to Interactive" for the NAV phase will remain unaffected because the UFO loads first.

- [Risk] Media queries for hover/pointer might fail on older devices or weird edge cases (e.g., stylus).
  → *Mitigation*: Standard `@media (hover: hover)` is well supported and is the exact CSS standard designed to solve this problem.
