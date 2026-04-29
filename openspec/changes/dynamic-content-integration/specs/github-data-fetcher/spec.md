## ADDED Requirements

### Requirement: Fetch Public Repositories
The system SHALL fetch public repositories from the GitHub REST API for a configured username and transform them into the existing `PortfolioProject` interface.

#### Scenario: Successful fetch
- **WHEN** the projects section mounts
- **THEN** the system SHALL fetch up to 6 repositories sorted by most recently updated and display their title, description, and repository URL.

#### Scenario: Language detection
- **WHEN** repositories are successfully fetched
- **THEN** the system SHALL query each repository's languages endpoint in parallel and populate the `tags` field with the top languages (sorted by byte count).

#### Scenario: API rate limit or failure
- **WHEN** the GitHub API returns an error or is unreachable
- **THEN** the system SHALL fall back to the hardcoded `PROJECTS` array from `src/data/portfolio.ts` (including their manually defined `tags`) without showing an error to the user.

### Requirement: See More Link
The system SHALL render a themed "See More" link below the project grid when the number of fetched repositories reaches the configured display limit.

#### Scenario: Display limit reached
- **WHEN** the API returns repositories equal to or exceeding the configured limit (e.g., 6)
- **THEN** the system SHALL display a "See More" link that navigates to the user's GitHub profile in a new tab.

#### Scenario: Display limit not reached
- **WHEN** fewer repositories than the configured limit are returned
- **THEN** the "See More" link SHALL NOT be rendered.

### Requirement: Session-Level Caching
The system SHALL cache fetched GitHub data in `sessionStorage` with a configurable TTL to avoid redundant API calls.

#### Scenario: Cached data available
- **WHEN** the composable initializes and valid cached data exists within the TTL window
- **THEN** the system SHALL return cached data immediately without making API calls.

#### Scenario: Cache expired
- **WHEN** the cached data is older than the TTL
- **THEN** the system SHALL re-fetch from the API and update the cache.
