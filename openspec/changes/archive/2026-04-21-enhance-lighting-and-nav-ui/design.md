## Context

The portfolio uses a two-phase lighting system. Phase 1 (Navigation) uses a static top-down beam, and Phase 2 (Content) uses a mouse-following spotlight. Currently, Phase 1 fails to reach the conveyor items adequately, and the items themselves are just unstyled text. The transition between the high-fidelity "Finished" state and the technical "Blueprint" state is too subtle in the About Me section.

## Goals / Non-Goals

**Goals:**
- Extend the Phase 1 light cone to 120% viewport height to ensure full visibility.
- Implement a "Windows" UI for navigation that uses the "Physical Workbench" aesthetic discussed in discovery.
- Create a conical lamp fixture that visually justifies the beam geometry.
- Implementation of a "reveal" mechanic for About Me text based on spotlight proximity.

**Non-Goals:**
- Modifying the underlying `useLightingEngine` state (phases/positions remain as is).
- Adding complex 3D models (pure CSS/SVG remains the focus).

## Decisions

### 1. Light Cone Geometry
- **Rationale**: The current 55% height ellipse is too short.
- **Decision**: Update `SpotlightMask.vue` to use `ellipse 40% 120% at 50% 0%`. This ensures the light reaches the bottom of the screen while maintaining a realistic "beam" spread.

### 2. Nav Window Components
- **Rationale**: Text-only labels lack visual interest and don't provide a "preview" of the destination.
- **Decision**: Wrap the `NavConveyor` items in a new `.nav-window` class.
- **Theming Strategy**: 
    - `Career`: Terminal-like aesthetics (monospaced text, subtle code snippets).
    - `About`: Personal card/folder aesthetic.
    - `Projects`: Mock grid preview.
    - `Contact`: Envelope/Form preview.

### 3. Lamp Fixture Upgrades
- **Rationale**: The current rounded housing doesn't match a directed beam.
- **Decision**: Use `clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)` for the `.lamp-housing` to create a trapezoidal/conical shade.

### 4. Interactive Reveal Logic (About Me)
- **Rationale**: The blue text in blueprint mode is distracting and non-diegetic.
- **Decision**: Use a CSS variable-driven mask on the `SkillsAbout.vue` text. We will leverage the existing `--spotlight-x` and `--spotlight-y` to reveal the high-contrast text only when illuminated, while showing a faint "technical drawing" ghosting in the dark areas.

## Risks / Trade-offs

- **Risk**: Performance of multiple CSS masks on content-heavy sections. 
- **Mitigation**: Use `will-change: mask-image` and keep gradients simple to ensure 60fps.
- **Trade-off**: The navigation items will take up more horizontal space on the conveyor belt. 
- **Mitigation**: Adjust the `gap` and `padding` in `NavConveyor.vue` to allow for wider windows.
