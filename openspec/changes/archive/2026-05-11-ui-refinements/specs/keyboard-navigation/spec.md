## ADDED Requirements

### Requirement: Reactive Navigation Prompts
The application SHALL dynamically display the current key binding for the "Back" action in the floating control UI, rather than a hardcoded string.

#### Scenario: Displaying current shortcut
- **WHEN** the `App.vue` component renders the back button
- **THEN** it displays the reactive `getDisplay('back')` value from the `useShortcutStore`

#### Scenario: Updating on rebind
- **WHEN** the user rebinds the back action to a different key
- **THEN** the text in the back button updates immediately to reflect the new key
