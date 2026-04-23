# Visual Theme Polish

## Purpose
This capability defines the visual fidelity standards for the Cosmic Void portfolio, ensuring all components match the three design mockups in terms of color palette, atmospheric effects, glassmorphism, and light fixture rendering.

## Requirements

### Requirement: Emerald/Teal Accent Palette
The system SHALL use an emerald/teal color palette (`#10b981` base) as the primary accent color, replacing any violet/purple references.

#### Scenario: Default theme accent
- **WHEN** the application loads in default (non-blueprint) mode
- **THEN** all accent-colored elements (text, borders, glows, pills) SHALL render in emerald/teal tones

#### Scenario: Blueprint theme accent
- **WHEN** the user activates blueprint mode via the theme toggle
- **THEN** the accent color SHALL shift to a complementary blue-teal tone

### Requirement: Focused Volumetric Beam
The volumetric beam SHALL render as a focused, teal-tinted cone of light with a crisp spread angle and subtle atmospheric haze.

#### Scenario: CONTENT phase beam rendering
- **WHEN** the system is in the CONTENT phase
- **THEN** the volumetric beam SHALL render a teal-to-transparent gradient cone originating from the flashlight source with reduced blur (≤15px) and narrower spread than the current implementation

### Requirement: Light-Responsive Perspective Grid
The perspective grid SHALL be visible only in areas illuminated by the active light source, achieved via a radial gradient mask.

#### Scenario: Grid visibility under flashlight
- **WHEN** the system is in the CONTENT phase and the flashlight is active
- **THEN** the perspective grid SHALL be visible with a radial glow centered on the flashlight's target position, fading to transparent beyond the beam radius

#### Scenario: Grid visibility under lamp
- **WHEN** the system is in the NAV phase with the ceiling lamp active
- **THEN** the perspective grid SHALL be visible with a downward-facing illumination pattern centered below the lamp fixture

### Requirement: Industrial Lamp Fixture
The NAV phase ceiling lamp SHALL render as a detailed industrial fixture with visible wire, housing, and a bright teal/cyan glowing bulb.

#### Scenario: Lamp bulb glow
- **WHEN** the NAV phase is active
- **THEN** the lamp bulb SHALL emit a multi-layered box-shadow glow using the accent color with at least 3 shadow layers at increasing radii

### Requirement: Glassmorphic Surface Consistency
All bento cards and interactive elements SHALL use the accent color for glows, borders, and hover states instead of hardcoded violet values.

#### Scenario: Card hover glow
- **WHEN** a user hovers over a bento card
- **THEN** the card border SHALL transition to `var(--finished-accent)` with an opacity increase, using CSS variable-driven colors (not hardcoded rgba values)

### Requirement: Terminal Boot Sequence Style
The boot sequence animation SHALL display text matching the mockup's terminal aesthetic.

#### Scenario: Boot sequence text content
- **WHEN** the Experience/career nav window is visible
- **THEN** the terminal SHALL display lines matching the style: `> system.boot_sequence(91)...`, `LOADING DATA...`, `2024: FRONTEND DEV - SYSTEM ARCHITECT...`

### Requirement: Softened Light Overlay
The dark vignette overlay SHALL provide a softer, more natural light falloff that does not over-darken the content area.

#### Scenario: CONTENT phase overlay
- **WHEN** the CONTENT phase is active
- **THEN** the radial gradient overlay SHALL use a wider transparent center area and gentler opacity transition to dark edges
