## MODIFIED Requirements

### Requirement: Dark Mode (Finished Product)
The system MUST support a dark mode state acting as the default "Finished Product" look. This state MUST display neon glow box shadows on elements and dark/deep dark backgrounds. All theme-related colors and shadows MUST be defined using native CSS variables on the `:root` element rather than hardcoded Tailwind utility classes. The active theme state MUST be persisted globally via a dedicated state manager (Pinia) to prevent resets during navigation or keypresses.

#### Scenario: User visits the portfolio initially
- **WHEN** the user initially loads the site
- **THEN** it renders in dark mode with styled glows, and the Pinia `useThemeStore` initializes the state.

#### Scenario: Theme persistence
- **WHEN** the user navigates between pages or presses the Escape key
- **THEN** the current theme state remains unchanged and correctly applied.
