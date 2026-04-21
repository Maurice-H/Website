## ADDED Requirements

### Requirement: Dark Mode (Finished Product)
The system MUST support a dark mode state acting as the default "Finished Product" look. This state MUST display neon glow box shadows on elements and dark/deep dark backgrounds.

#### Scenario: User visits the portfolio initially
- **WHEN** the user initially loads the site
- **THEN** it renders in dark mode with styled glows.

### Requirement: Light Mode (Blueprint/Architecture)
The system MUST support a light mode representing a technical draft. This state MUST replace glowing box-shadows with simple dashed or dotted outline borders, and a subtle graph paper grid background.

#### Scenario: User toggles to blueprint
- **WHEN** the user interacts with the lamp toggle
- **THEN** the active CSS theme switches to data-theme="blueprint" mapping CSS variables to the blueprint styles.

### Requirement: Smooth Transitions
All state changes between properties (borders, shadows, backgrounds) MUST be animated via a single global CSS transition variable to prevent disjointed rendering.

#### Scenario: CSS Transition triggers
- **WHEN** the theme shifts from regular to blueprint
- **THEN** the colors, border types, and shadows transition smoothly over ~300ms using CSS custom property interpolation.
