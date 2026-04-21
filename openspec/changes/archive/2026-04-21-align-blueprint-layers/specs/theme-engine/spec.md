## ADDED Requirements

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
