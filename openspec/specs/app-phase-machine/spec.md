# Capability: App Phase Machine

## Purpose
Manages application-level transition phases and view routing dynamically.

## Requirements

### Requirement: Application Phase Routing
The system SHALL manage application-level view states (e.g., Navigation view vs. Content view) through a dedicated state machine composable, separating transition logic from the root application component layout.

#### Scenario: Phase Transition Timing
- **WHEN** the application transitions between phases
- **THEN** the system SHALL rely on deterministic DOM readiness checks (e.g., `nextTick` or `onMounted` hooks) rather than arbitrary time delays to trigger subsequent animations or layouts
