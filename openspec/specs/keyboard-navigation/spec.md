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
