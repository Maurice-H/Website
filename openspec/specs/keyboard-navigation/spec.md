## ADDED Requirements

### Requirement: Global Keyboard Navigation
Users must be able to navigate the main view and dismiss overlays using their keyboard.

#### Scenario: Pressing W/A/S/D keys
- **WHEN** the user presses W, A, S, or D and `document.activeElement` is NOT an `<input>`, `<textarea>`, or `[contenteditable]` element
- **THEN** the viewport scrolls or navigates horizontally/vertically in the respective direction.

#### Scenario: Pressing W/A/S/D keys while typing in a form
- **WHEN** the user presses W, A, S, or D and `document.activeElement` IS an `<input>`, `<textarea>`, or `[contenteditable]` element
- **THEN** the keystroke is NOT intercepted and the character is typed normally.

#### Scenario: Pressing ESC key
- **WHEN** the user presses the Escape key
- **THEN** any active overlay, modal, or focused element is dismissed/unfocused.

### Requirement: Reactive Navigation Prompts
The application SHALL dynamically display the current key binding for the "Back" action in the floating control UI, rather than a hardcoded string.

#### Scenario: Displaying current shortcut
- **WHEN** the `App.vue` component renders the back button
- **THEN** it displays the reactive `getDisplay('back')` value from the `useShortcutStore`

#### Scenario: Updating on rebind
- **WHEN** the user rebinds the back action to a different key
- **THEN** the text in the back button updates immediately to reflect the new key

