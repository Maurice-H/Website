# Fused Rendering Engine

## Purpose
This capability defines the centralized rendering and masking engine responsible for the "Fused" visual aesthetic (Blueprint vs. Finished parity) and high-performance viewport coordination across the portfolio.

## Requirements

### Requirement: Centralized Viewport Coordination
The system SHALL provide a centralized service (Store/Composables) that tracks the exact pixel coordinates and bounding boxes of interactive components using a single set of window event listeners.

#### Scenario: Element Registration
- **WHEN** a bento-style component is mounted
- **THEN** it SHALL register its element with the viewport coordinator to receive reactive offset updates.

### Requirement: Unified Dual-Layer Rendering
The system SHALL support a "Single Source of Truth" template pattern where the "Blueprint" and "Finished" visual states are generated from a single content definition.

#### Scenario: Slot-Based Reveal
- **WHEN** content is passed to the `<FusedReveal>` component
- **THEN** the system SHALL render the content twice internally (once as a base layer and once as a masked reveal layer) while ensuring all stateful attributes (IDs, accessibility labels) remain unique.

### Requirement: Phase-Aware Mask Sync
The system SHALL synchronize the CSS `--reveal-mask` variable across all active layers automatically when the `LightingPhase` changes.

#### Scenario: Transitioning to Content Phase
- **WHEN** the `setPhase(CONTENT)` action is triggered
- **THEN** all rendered layers SHALL update their mask positions relative to the absolute viewport origin within 300ms.
