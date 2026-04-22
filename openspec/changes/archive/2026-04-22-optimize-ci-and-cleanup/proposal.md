## Why

The current CI pipeline is slow and inefficient because it lacks caching for Playwright browsers and performs redundant builds across jobs. Additionally, the repository is becoming cluttered with debugging screenshots and temporary agent files that should not be part of the version history.

## What Changes

1. **CI Pipeline Optimization**:
   - Implement caching for Playwright browsers to reduce runtime by ~1-2 minutes.
   - Refactor the workflow to build the application once and share the `dist` artifact between verification and deployment jobs.
   - Update E2E tests to run against the production build (`npm run preview`) to ensure environment parity.
   - Configure Playwright to only upload reports/traces on failure to save storage and keep the UI clean.

2. **Repository Hygiene**:
   - Update `.gitignore` to strictly exclude local debugging artifacts (`artifacts/`), temporary scratch files (`scratch/`), and other non-essential files.
   - Clean up existing untracked files from the local workspace.

## Capabilities

### New Capabilities
- `ci-cd`: Enhanced CI/CD pipeline with browser caching and artifact sharing.
- `repo-hygiene`: Standardized repository cleanup rules and ignore patterns.

### Modified Capabilities
- None

## Impact

- **CI/CD**: `.github/workflows/ci.yml` will be restructured.
- **Git**: `.gitignore` will be updated.
- **Local Workspace**: `artifacts/` and `scratch/` folders will no longer be tracked.
