## MODIFIED Requirements

### Requirement: Static Code Quality Analysis
The system SHALL employ Biome to format and lint all source files, enforcing alphabetical import sorting and zero-unused-import policies.

#### Scenario: Alphabetical Import Check
- **WHEN** the `biome check` command is executed
- **THEN** it SHALL flag any imports or exports that are not alphabetically ordered within their respective groups.

#### Scenario: Zero Unused Imports
- **WHEN** an import statement is not referenced in the component logic or template
- **THEN** Biome SHALL report an error and, if run with `--write`, automatically remove the statement.

### Requirement: Granular Component Testing
Test files SHALL remain isolated and SHALL NOT export variables or functions to the rest of the application.

#### Scenario: Test File Export Check
- **WHEN** a `.spec.ts` or `.test.ts` file contains a named or default export
- **THEN** the linting check SHALL fail, requiring the export to be removed or moved to a shared utility.

### Requirement: Type Strictness
The system SHALL NOT use the `any` type for variable declarations, function parameters, or return types.

#### Scenario: specific typing enforcement
- **WHEN** a developer uses `any` in a TypeScript file
- **THEN** the compiler or linter SHALL flag it, requiring a specific type or interface to be defined.
