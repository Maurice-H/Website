## ADDED Requirements

### Requirement: Blur Filter Threshold
CSS `filter: blur()` declarations with a radius ≥ 50px SHALL be replaced with composited `radial-gradient` + opacity layering to reduce GPU compositing cost.

#### Scenario: NavConveyor glow replacement
- **WHEN** the NavConveyor ambient glow is rendered
- **THEN** it SHALL use a `radial-gradient` with transparent edges instead of `filter: blur(350px)`.

#### Scenario: VolumetricBeam soft-edge replacement
- **WHEN** the volumetric beam effect renders its outermost glow layer
- **THEN** it SHALL use a `radial-gradient` overlay instead of `filter: blur(250px)`.

#### Scenario: VolumetricBeam cone spread replacement
- **WHEN** the beam cone spread is applied via inline style
- **THEN** it SHALL use a `radial-gradient` instead of `filter: blur(50px)`.

### Requirement: Backdrop Filter Budget
`backdrop-filter: blur()` values SHALL NOT exceed 20px to maintain a responsive glassmorphism effect without excessive GPU cost.

#### Scenario: BentoCard glass effect
- **WHEN** a BentoCard renders with the blueprint theme active
- **THEN** the `backdrop-filter` blur radius SHALL be ≤ 20px.

### Requirement: GPU Compositing Hints
Elements that use animated or theme-dependent filters SHALL include `will-change: transform` to promote GPU layer compositing and avoid main-thread repaints.

#### Scenario: Gradient glow layer
- **WHEN** a glow element using `radial-gradient` is rendered
- **THEN** the element SHALL include `will-change: transform` in its computed style.

### Requirement: Visual Equivalence
The gradient replacements SHALL maintain perceptual equivalence (no visible "hard edges" or color banding) compared to the original blur-based effects.

#### Scenario: Visual regression check
- **WHEN** the landing page is rendered with the updated gradient-based glow
- **THEN** a Playwright screenshot comparison against the baseline SHALL show no perceptible difference (ΔE < 2 across sampled regions).
