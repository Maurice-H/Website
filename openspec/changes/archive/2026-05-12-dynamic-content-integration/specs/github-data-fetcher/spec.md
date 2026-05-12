# Capability: GitHub Data Fetcher

## ADDED Requirements

### Requirement: Fetch Public Repositories
The system SHALL fetch the top 5 most recently updated public repositories from `https://api.github.com/users/Maurice-H/repos?sort=updated&per_page=5` on component mount.

#### Scenario: Successful fetch
- **WHEN** the GitHub API responds successfully
- **THEN** the composable SHALL return an array of `PortfolioProject` objects with `id`, `title` (repo name), `description`, `tags` (from languages), `repoUrl`, and `stars`.

#### Scenario: API failure fallback
- **WHEN** the GitHub API request fails or times out
- **THEN** the composable SHALL return the static `PROJECTS` array from `src/data/portfolio.ts` with their manually defined `tags`.

### Requirement: Auto-detect Tech Stack via Languages
The system SHALL fetch `/repos/Maurice-H/{repo}/languages` for each returned repo in parallel using `Promise.allSettled` and map the top languages to the project's `tags` array.

#### Scenario: Languages endpoint succeeds
- **WHEN** the languages endpoint returns data for a repo
- **THEN** the top languages (by byte count) SHALL populate the `tags` array for that project.

#### Scenario: Single language call fails
- **WHEN** a single repo's languages call fails
- **THEN** that project SHALL render with an empty `tags` array. Other projects SHALL not be affected.

### Requirement: Session Cache
The system SHALL cache fetched results in `sessionStorage` with a 5-minute TTL key. Subsequent calls within the TTL SHALL return cached data without making API requests.

#### Scenario: Cache hit
- **WHEN** `sessionStorage` contains valid (non-expired) GitHub data
- **THEN** the composable SHALL return cached data immediately without a network request.

#### Scenario: Cache expired
- **WHEN** `sessionStorage` data is older than 5 minutes
- **THEN** the composable SHALL re-fetch from the API.

### Requirement: Reactive Loading and Error State
The composable SHALL expose reactive refs: `projects: Ref<PortfolioProject[]>`, `isLoading: Ref<boolean>`, `error: Ref<string | null>`.

#### Scenario: Loading state
- **WHEN** the API request is in-flight
- **THEN** `isLoading` SHALL be `true` and `projects` SHALL be an empty array.

#### Scenario: Error state
- **WHEN** the API request fails
- **THEN** `error` SHALL contain a descriptive message and `projects` SHALL contain the fallback static data.

### Requirement: "See More" Signal
The composable SHALL expose a reactive `hasMore: Ref<boolean>` that is `true` when the returned repo count equals the configured display limit (5).

#### Scenario: Repos at limit
- **WHEN** the API returns exactly 5 repos
- **THEN** `hasMore` SHALL be `true`, indicating a "See More" link should be rendered.
