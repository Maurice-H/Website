## ADDED Requirements

### Requirement: Centralized Coordinate Verification
The system SHALL support unit tests that verify the `useViewportStore` correctly calculates and broadcasts coordinate updates to registered components.

#### Scenario: Mocking Viewport Events
- **WHEN** a mock scroll event is dispatched to the centralized viewport service
- **THEN** all registered sub-components SHALL receive updated offset vectors via reactive subscriptions.

### Requirement: Fused Reveal Regression Testing
The system SHALL maintain E2E test coverage for the `<FusedReveal>` component to ensure that content parity between layers is preserved during visual transitions.

#### Scenario: Content Parity Check
- **WHEN** the Playwright suite inspects a Fused component
- **THEN** it SHALL verify that the text content of the Blueprint layer matches the text content of the Finished layer exactly.
