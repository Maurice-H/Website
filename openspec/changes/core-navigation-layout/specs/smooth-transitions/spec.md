## ADDED Requirements

### Requirement: Smooth Page Transitions
Global page transitions must be smooth and aligned with the theme transitions.

#### Scenario: Navigating between routes
- **WHEN** the user clicks a link that changes the route
- **THEN** the current page fades out and the new page fades in smoothly using `<Transition mode="out-in">` with the `var(--theme-transition-duration)` timing.
