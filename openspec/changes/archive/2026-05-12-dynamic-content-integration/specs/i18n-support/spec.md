# Capability: i18n Support

## Purpose
This capability provides internationalization (DE/EN) for all user-facing strings in the portfolio, enabling locale switching and ensuring content is displayed in the visitor's preferred language.

## ADDED Requirements

### Requirement: Locale Message Catalogs
The system SHALL maintain JSON locale files (`src/locales/de.json`, `src/locales/en.json`) containing all user-facing strings organized by section (hero, nav, skills, projects, contact, meta).

#### Scenario: German locale loaded
- **WHEN** the locale is set to `de`
- **THEN** all user-facing text (hero tagline, bio, nav labels, skill section titles, contact labels, button text) SHALL render in German.

#### Scenario: English locale loaded
- **WHEN** the locale is set to `en`
- **THEN** all user-facing text SHALL render in English.

### Requirement: Locale Switcher UI
The system SHALL provide a visible DE/EN toggle that allows the visitor to switch locale at any time.

#### Scenario: Switcher in NAV phase
- **WHEN** the portfolio is in the NAV phase
- **THEN** a locale toggle (DE/EN) SHALL be visible in or near the shortcut bar area.

#### Scenario: Locale switch applies immediately
- **WHEN** the visitor toggles the locale
- **THEN** all visible text SHALL update to the new locale without a page reload.

### Requirement: Dynamic HTML lang Attribute
The system SHALL set the `<html lang>` attribute to match the active locale (`de` or `en`).

#### Scenario: Lang attribute updates
- **WHEN** the locale changes
- **THEN** `document.documentElement.lang` SHALL be set to the new locale code.

### Requirement: SEO Meta Tags per Locale
The system SHALL update `<title>` and `<meta name="description">` content to match the active locale.

#### Scenario: German meta tags
- **WHEN** locale is `de`
- **THEN** the page title SHALL be "Maurice H. — Frontend Engineer | Portfolio" and the meta description SHALL be in German.

#### Scenario: English meta tags
- **WHEN** locale is `en`
- **THEN** the page title and meta description SHALL render in English.

### Requirement: Default Locale
The system SHALL default to `de` as the initial locale.

#### Scenario: First visit
- **WHEN** a visitor loads the portfolio for the first time
- **THEN** the locale SHALL be `de`.
