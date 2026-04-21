## 1. Preparation & Layout Foundation

- [x] 1.1 Update `src/types/index.ts` to include interfaces for NavWindow layouts and themed content data.
- [x] 1.2 Adjust `index.css` global variables for `--spotlight-size` and initialize secondary lighting transition speeds.

## 2. Core Lighting & Lamp Upgrades

- [x] 2.1 Update `SpotlightMask.vue` computed mask logic: Extend vertical reach of the Phase 1 ellipse to 120%.
- [x] 2.2 Refactor `NavConveyor.vue` lamp fixture: Apply `clip-path` to `.lamp-housing` to create the trapezoidal shade.
- [x] 2.3 Enhance `.lamp-bulb` and `.lamp-housing` shadowing to match the new conical geometry.

## 3. Themed Navigation Windows

- [x] 3.1 Create `NavWindow.vue` component or refactor `.conveyor-tab` to support structured window containers.
- [x] 3.2 Implement themed background styles for "About", "Projects", "Skills", and "Contact" windows.
- [x] 3.3 Add proximity-based scaling and glow effects to windows as they pass the center focal point.

## 4. Interactive About Me Reveal

- [x] 4.1 Update `SkillsAbout.vue`: Implement the "Spotlight Reveal" mechanism using CSS masking or opacity linked to spotlight variables.
- [x] 4.2 Fine-tune the "ghosting" effect for non-illuminated text in blueprint mode to ensure subtle technical aesthetic.
- [x] 4.3 Replace the static blue text styling with the dynamic visibility logic.

## 5. Verification & Polish

- [x] 5.1 Test navigation scroll performance with the new window layouts.
- [x] 5.2 Verify lamp beam alignment across different viewport widths.
- [x] 5.3 Ensure the transition between Phase 1 and Phase 2 remains seamless with the new mask sizes.

## 6. Repair Phase (Refinements)

- [x] 6.1 Restore `onWheel` functionality in `NavConveyor.vue`.
- [x] 6.2 Fix card clipping in `NavConveyor.vue` by adjusting track padding/height.
- [x] 6.3 Reduce Phase 1 mask width in `SpotlightMask.vue` to 25%.
- [x] 6.4 Implement element-local masking logic in `SkillsAbout.vue` for scroll-locked reveal.
- [x] 6.5 Synchronize blueprint and finished layer scroll positions in `SpotlightMask.vue`.
