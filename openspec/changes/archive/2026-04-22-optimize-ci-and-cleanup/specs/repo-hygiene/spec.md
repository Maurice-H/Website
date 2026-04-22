## ADDED Requirements

### Requirement: Debug Artifact Exclusion
The repository must not track local debugging artifacts such as screenshots or logs.

#### Scenario: Local Debugging
- **WHEN** a developer or agent creates files in the `artifacts/` directory
- **THEN** Git should ignore these files and they should not appear in `git status`

### Requirement: Agent Scratch Space Exclusion
Temporary scratch files used by the AI agent must be excluded from version control.

#### Scenario: Agent Exploration
- **WHEN** the agent creates scripts or temporary data in the `scratch/` directory
- **THEN** these files must be ignored by Git
