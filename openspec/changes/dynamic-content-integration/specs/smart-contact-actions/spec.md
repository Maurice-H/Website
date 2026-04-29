## ADDED Requirements

### Requirement: External Profile Links
The system SHALL open external profile URLs (GitHub, LinkedIn, Xing) in a new browser tab when the user clicks the corresponding contact action button.

#### Scenario: User clicks GitHub button
- **WHEN** the user clicks the GitHub contact action
- **THEN** the system SHALL open the configured GitHub profile URL in a new tab via `window.open`.

#### Scenario: User clicks LinkedIn button
- **WHEN** the user clicks the LinkedIn contact action
- **THEN** the system SHALL open the configured LinkedIn profile URL in a new tab via `window.open`.

### Requirement: Clipboard Copy Actions
The system SHALL copy identifiers (Discord username, email address) to the user's clipboard when the corresponding contact action button is clicked.

#### Scenario: Successful clipboard copy
- **WHEN** the user clicks the Discord contact action and the Clipboard API is available
- **THEN** the system SHALL copy the Discord username to the clipboard and display a success toast notification.

#### Scenario: Clipboard API unavailable
- **WHEN** the user clicks a copy action but the Clipboard API is not available (insecure context)
- **THEN** the system SHALL display a fallback toast instructing the user to copy manually.

### Requirement: Toast Notification System
The system SHALL provide a reusable toast notification component that displays ephemeral feedback messages with auto-dismiss.

#### Scenario: Toast appears on action
- **WHEN** a contact action triggers a toast via `useToast().show()`
- **THEN** a toast notification SHALL appear at the bottom-center of the viewport, styled with the current theme's accent color.

#### Scenario: Toast auto-dismisses
- **WHEN** a toast is displayed
- **THEN** it SHALL automatically dismiss after 3 seconds with a fade-out transition.

#### Scenario: Toast theme awareness
- **WHEN** the theme is toggled while a toast is visible
- **THEN** the toast SHALL transition its colors to match the new theme using CSS variables.
