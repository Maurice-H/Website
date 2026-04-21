## MODIFIED Requirements

### Requirement: Blueprint Hover Interactions
In blueprint mode, hover interactions MUST visually reinforce the "blueprint" aesthetic rather than regular high-fidelity hovering effects. Elements MUST utilize a "Spotlight Reveal" mechanism where content visibility is dynamically controlled by proximity to the light source.

#### Scenario: Interactive Spotlight Reveal
- **WHEN** the user moves the spotlight over a bento grid card in blueprint mode
- **THEN** the hidden technical details and text content fade into view smoothly based on the proximity of the `--spotlight-x` and `--spotlight-y` coordinates.

#### Scenario: Blueprint Bio Reveal
- **WHEN** the spotlight passes over the About Me description in blueprint mode
- **THEN** the text transitions from a faint "ghosted" outline to high-contrast legible text.
