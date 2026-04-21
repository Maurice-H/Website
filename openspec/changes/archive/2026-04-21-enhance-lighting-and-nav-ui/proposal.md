## Why

The current landing page lighting is too shallow, preventing users from seeing the bottom half of the interactive conveyor. Additionally, the navigation items are text-based and lack the premium "physical weight" intended for the portfolio. The "About Me" section's blueprint phase is visually flat and confusing, using generic blue styling that doesn't align with the interactive flashlight concept.

## What Changes

- **Enhanced Lighting Reach**: Extend the vertical throw of the lamp's light cone to cover the full viewport height.
- **Themed Navigation Windows**: Transform text-only navigation labels into rectangular "themed windows" with unique backgrounds and micro-layouts.
- **Realistic Lamp Fixture**: Upgrade the lamp UI component to a conical/trapezoidal geometry to better match the light beam.
- **Interactive About Me Reveal**: Implement a "flashlight" discovery mode for the About Me section, replacing static blue-colored text with an illumination-based visibility system.
- **Non-Goals**: This change does not include adding new portfolio projects or changing the underlying grid system structure.

## Capabilities

### New Capabilities
- `themed-nav-windows`: Defines the visual and structural requirements for the navigation item window components.

### Modified Capabilities
- `theme-engine`: Extend lighting reach requirements and define the new lamp fixture geometry.
- `portfolio-content`: Update requirements for section previews within the new navigation windows.
- `bento-layout`: Add requirements for blueprint-mode "reveal" interactions for grid cards.

## Impact

- **Affected Components**: `NavConveyor.vue`, `SpotlightMask.vue`, `SkillsAbout.vue`, `BentoCard.vue`.
- **CSS**: Updates to `index.css` for new global lighting variables.
- **UX**: Significant improvement in landing page visibility and interactive discovery.
