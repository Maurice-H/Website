# Store DOM Sync

## Purpose
TBD: Decouple Pinia stores from DOM manipulation.

## Requirements

### Requirement: DOM Synchronization Decoupling
The system SHALL synchronize Pinia store state (e.g., theme, lighting phase) with the DOM without executing direct DOM manipulations within the store's action methods.

#### Scenario: Theme State Change
- **WHEN** the theme store state changes from 'Blueprint' to 'Finished'
- **THEN** a dedicated observer or composable outside the store SHALL apply the corresponding class to the `document.documentElement`
