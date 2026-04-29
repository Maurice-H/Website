## MODIFIED Requirements

### Requirement: Render Case Studies
The system MUST dynamically render portfolio projects from a runtime data source (GitHub API composable) inside the bento grid cards, falling back to static data on failure. Projects SHALL display title, description, tech-stack tags (derived from language analysis), and a link to the repository.

#### Scenario: Display Projects from API
- **WHEN** the projects section engages and GitHub data is successfully fetched
- **THEN** a list containing repository names as titles, descriptions, auto-detected language tags, and repository links is displayed inside each project card.

#### Scenario: Display Projects Fallback
- **WHEN** the projects section engages and GitHub data is unavailable
- **THEN** the hardcoded `PROJECTS` array from `src/data/portfolio.ts` is rendered as a fallback.

#### Scenario: Display Projects in Nav
- **WHEN** the projects section is viewed in the Nav Conveyor window
- **THEN** a miniature grid preview of project thumbnails is displayed within the window boundaries.

### Requirement: Contact Layout
The system MUST display multiple contact methods as action buttons within the contact bento card. Each button SHALL perform a context-appropriate action: opening an external URL in a new tab or copying an identifier to the clipboard with toast feedback.

#### Scenario: Contact action buttons
- **WHEN** rendering the Contact section
- **THEN** the system SHALL display action buttons for each configured contact method (Email, LinkedIn, Xing, Discord) with appropriate icons and labels.

#### Scenario: Contact Preview in Nav
- **WHEN** the contact section is viewed in the Nav Conveyor window
- **THEN** an iconographic representation of an envelope or communication portal is displayed.
