# Capability: Theme Engine

## Purpose
The Theme Engine manages the visual state of the application, specifically the transition between the "Finished Product" (Dark Mode) and the "Blueprint Architecture" (Light Mode).

## Requirements

### Requirement: Dark Mode (Finished Product)
The system MUST support a dark mode state acting as the default "Finished Product" look. This state MUST display neon glow box shadows on elements and dark/deep dark backgrounds.

#### Scenario: User visits the portfolio initially
- **WHEN** the user initially loads the site
- **THEN** it renders in dark mode with styled glows.

### Requirement: Light Mode (Blueprint/Architecture)
The system MUST support a light mode representing a technical draft. This state MUST replace glowing box-shadows with simple dashed or dotted outline borders, and a subtle graph paper grid background. The lamp fixture in this mode MUST display a trapezoidal/conical geometry with a light throw that extends to at least 120% of the viewport height.

#### Scenario: User toggles to blueprint
- **WHEN** the user interacts with the lamp toggle
- **THEN** the active CSS theme switches to data-theme="blueprint" mapping CSS variables to the blueprint styles, and the lamp fixture geometry updates to a conical polygon shape.

#### Scenario: Vertical beam reach
- **WHEN** the Nav Conveyor is active
- **THEN** the light cone MUST extend from the top of the viewport to past the bottom edge to ensure all conveyor content is illuminated.

### Requirement: Smooth Transitions
All state changes between properties (borders, shadows, backgrounds) MUST be animated via a single global CSS transition variable to prevent disjointed rendering.

#### Scenario: CSS Transition triggers
- **WHEN** the theme shifts from regular to blueprint
- **THEN** the colors, border types, and shadows transition smoothly over ~300ms using CSS custom property interpolation.

### Requirement: Pixel-Perfect Layer Symmetry
The system SHALL ensure that both the "Finished" and "Blueprint" layers share an identical structural DOM skeleton. All layout-affecting elements (headers, wrappers, margins, padding, and gaps) MUST be replicated 1:1 between the two layers to guarantee perfect spatial alignment when using the spotlight reveal mask.

#### Scenario: Switching states at scroll position
- **WHEN** the user is at any vertical scroll position and the theme toggle is triggered
- **THEN** the active elements in the revealed mask SHALL perfectly overlap the hidden elements in the background, with 0px spatial displacement.

### Requirement: Blueprint Navigation Mirroring
The "Blueprint" phase SHALL include a visual representation of all functional UI components found in the "Finished" phase, including the Navigation Header. This "Blueprint Header" SHALL match the exact height and spacing of the functional header.

#### Scenario: Mask reveal over header
- **WHEN** the spotlight mask passes over the navigation header area in Blueprint mode
- **THEN** the functional "Back to Navigation" button SHALL appear exactly over its blueprint-sketched counterpart without shifting.
