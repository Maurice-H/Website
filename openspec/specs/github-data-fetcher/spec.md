# Capability: GitHub Data Fetcher

## Purpose
Provides a robust integration with the GitHub REST API to dynamically populate the portfolio's project list with the owner's real-world repositories.

## Requirements

### Requirement: Fetch Public Repositories
The system SHALL fetch the top 5 most recently updated public repositories from the GitHub API on component mount.

#### Scenario: Successful fetch
- **WHEN** the GitHub API responds successfully
- **THEN** the system SHALL return an array of project objects with metadata (id, title, description, repoUrl, etc.).

#### Scenario: API failure
- **WHEN** the GitHub API request fails
- **THEN** an error state SHALL be exposed to the UI for graceful degradation (message + profile link).

### Requirement: Tech Stack Detection
The system SHALL fetch languages for each repo in parallel and map the results to project tags.

### Requirement: Session Cache
The system SHALL cache fetched results in `sessionStorage` with a 5-minute TTL to respect API rate limits.
