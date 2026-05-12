# Capability: Portfolio Content

## Purpose
This capability handles the rendering of real profile data, including GitHub-integrated project lists, CV-sourced bio and skills, and functional contact actions within the bento grid and navigation system.

## Requirements

### Requirement: Render Case Studies
The system MUST render portfolio projects from an async data source (GitHub API via `useGitHubProjects` composable) with loading, error, and success states. The system SHALL display a maximum of 5 project cards. When the display limit is reached, a themed "See More" link pointing to `https://github.com/Maurice-H` SHALL be rendered below the project grid. Each project card SHALL include a repository link button/icon that opens `repoUrl` in a new tab.

#### Scenario: Display Projects (loading)
- **WHEN** the projects section mounts and the GitHub API request is in-flight
- **THEN** skeleton loader cards SHALL be displayed in place of real project cards.

#### Scenario: Display Projects (loaded)
- **WHEN** the GitHub API returns project data
- **THEN** real project cards with title, description, tags, and repo link SHALL replace the skeleton loaders.

#### Scenario: Display Projects (error/fallback)
- **WHEN** the GitHub API request fails
- **THEN** an informative error message with a direct link to the GitHub profile SHALL be rendered.

#### Scenario: "See More" link
- **WHEN** the fetched repo count equals the display limit (5)
- **THEN** a "See More" link to `https://github.com/Maurice-H` SHALL appear below the project grid.

### Requirement: Skills Display with Expansion
The system MUST render the top 10 skills from the curated skills array in the STACK bento tile. A "Show More" button SHALL expand the tile to reveal the complete skill list.

#### Scenario: Initial skills view
- **WHEN** the skills section renders
- **THEN** only the top 10 skills SHALL be visible.

#### Scenario: Expand skills
- **WHEN** the visitor clicks "Show More"
- **THEN** all remaining skills SHALL be revealed with a smooth transition.

### Requirement: Contact Layout
The system MUST embed functional contact action buttons rendered from the `CONTACT_METHODS` data array. Each button SHALL execute its defined action (`link` opens URL in new tab, `copy` copies value to clipboard with toast feedback). The existing contact form (Formspree submission) SHALL remain alongside the action buttons.

#### Scenario: Contact actions render
- **WHEN** the Contact section renders
- **THEN** action buttons for GitHub, Email, LinkedIn, Xing, and Discord SHALL be displayed alongside the contact form.

### Requirement: Internationalized Content
All user-facing text in portfolio content sections (hero, bio, nav labels, skill titles, contact labels) MUST be sourced from vue-i18n locale files, not hardcoded in templates.

#### Scenario: Hero section i18n
- **WHEN** the hero section renders
- **THEN** the greeting, name, and tagline SHALL be sourced from the active locale's message catalog.

#### Scenario: Bio section i18n
- **WHEN** the discovery path (bio) section renders
- **THEN** the bio text SHALL be sourced from the active locale's message catalog (CV-based content, translated per locale).
