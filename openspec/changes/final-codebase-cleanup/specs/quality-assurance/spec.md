## MODIFIED Requirements

### Requirement: Heading Hierarchy Compliance
All pages SHALL maintain a valid heading hierarchy without skipping levels (e.g., `h1` → `h2` → `h3`, never `h1` → `h4`).

#### Scenario: SkillsAbout heading level
- **WHEN** the SkillsAbout component renders skill category headers
- **THEN** category names SHALL use `<h3>` elements (not `<h4>`), since they are children of `<h2>` section titles rendered by WindowFrame

#### Scenario: Full page heading hierarchy
- **WHEN** the complete page is rendered with Hero, Skills, Projects, and Contact sections
- **THEN** the heading hierarchy SHALL be: `h1` (Hero) → `h2` (WindowFrame section titles) → `h3` (sub-headings within sections)

### Requirement: Dynamic HTML Lang Attribute
The `<html>` element's `lang` attribute SHALL dynamically reflect the active i18n locale.

#### Scenario: Language switch to German
- **WHEN** the user switches locale from `en` to `de`
- **THEN** `document.documentElement.lang` SHALL be `de`

#### Scenario: Initial page load
- **WHEN** the application mounts with default locale `en`
- **THEN** `document.documentElement.lang` SHALL be `en`

### Requirement: Test Cleanup for Deleted Components
Test files for removed components SHALL be deleted alongside the component files.

#### Scenario: No orphaned test files
- **WHEN** `npm run test:unit` is executed after cleanup
- **THEN** no test file SHALL reference or import a deleted component
- **THEN** all remaining tests SHALL pass

### Requirement: Build Integrity After Cleanup
The application SHALL build successfully with zero TypeScript errors after all deletions.

#### Scenario: Clean build
- **WHEN** `npm run build` is executed after all cleanup changes
- **THEN** the build SHALL complete with exit code 0

#### Scenario: No runtime errors
- **WHEN** the application is served and navigated through all phases (NAV → CONTENT)
- **THEN** the browser console SHALL show no errors related to missing components or imports
