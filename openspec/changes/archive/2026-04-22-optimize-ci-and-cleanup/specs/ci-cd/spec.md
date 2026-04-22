## ADDED Requirements

### Requirement: Playwright Browser Caching
The CI pipeline must cache Playwright browsers to avoid redundant downloads in every run.

#### Scenario: Subsequent CI Runs
- **WHEN** a CI run starts and a cache for the current Playwright version exists
- **THEN** the pipeline should restore the browsers from cache instead of downloading them

### Requirement: Shared Build Artifact
The application must be built once and the resulting `dist` directory must be shared between all pipeline jobs.

#### Scenario: Production Deployment
- **WHEN** the deployment job starts
- **THEN** it must use the `dist` artifact generated and verified in the previous jobs

### Requirement: Environment Parity Testing
E2E tests must be executed against the actual production build.

#### Scenario: E2E Verification
- **WHEN** Playwright tests are executed in CI
- **THEN** they should run against the contents of the `dist` folder using `npm run preview`
