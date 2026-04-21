## 1. Core Structural Refactor

- [x] 1.1 Refactor `SpotlightMask.vue`: Remove the `blueprint` and `finished` slots and the manual scroll sync logic.
- [x] 1.2 Refactor `App.vue`: Collapse the dual-slot content into a single main content block.
- [x] 1.3 Update `useLightingEngine.ts`: Ensure global spotlight variables are correctly broadcast to all child components.

## 2. Fused Component Implementation

- [x] 2.1 Update `BentoCard.vue`: Implement the "Fused Border" logic using a masked `::after` pseudo-element.
- [x] 2.2 Update `HeroSection.vue`: Implement single-node gradient reveal for the main title and subtext.
- [x] 2.3 Update `SkillsAbout.vue`: Implement single-node gradient reveal for the biography text and skill pills.
- [x] 2.4 Update `ProjectsSection.vue`: Implement internal fused reveal for project cards.
- [x] 2.5 Update `ContactForm.vue`: Implement internal fused reveal for form fields.

## 3. Style Cleanup & Verification

- [x] 3.1 Clean up `index.css`: Remove the absolute positioning and layer-specific stacking styles.
- [x] 3.2 Verify that the "Back to Navigation" button and "Conveyor" logic still function correctly in the new architecture.
- [x] 3.3 Conduct a final browser audit to confirm 0px drift and superior performance.

## 4. Lighting Engine Repair

- [x] 4.1 Update `useLightingEngine.ts` to broadcast absolute pixel coordinates.
- [x] 4.2 Fix `SpotlightMask.vue`: Apply `NAV` phase reveal mask to the correct container scope.
- [x] 4.3 Refactor `BentoCard.vue` with coordinate normalization (Absolute Subtraction).
- [x] 4.4 Update components (`HeroSection`, `SkillsAbout`, etc.) with coordinate normalization.

### Repair Status: VERIFIED
The coordinate offset math is active. All components now sync to the global viewport-fixed spotlight.

## 6. Emergency Build Recovery

- [x] 6.1 Clean `index.css`: Remove problematic custom utility and consolidate root vars.
- [x] 6.2 Stabilize `BentoCard.vue`: Apply masking via inline style to bypass Tailwind scanning; enforce width stability.
- [x] 6.3 Solve Lighting Continuity: Adjust `SpotlightMask` and `NavConveyor` to prevent light cone clipping.

All tasks complete! Reference the `walkthrough_fused.md` for visual evidence.
