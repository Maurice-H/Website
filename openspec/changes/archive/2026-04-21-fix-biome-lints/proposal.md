## Why

The current codebase contains several code quality issues, including unsorted imports/exports, unused imports, loose `any` types, and formatting mismatches. These issues increase maintenance debt, reduce readability, and can lead to runtime regressions. Aligning the codebase with Biome's strict linting and formatting standards is essential for long-term project stability.

## What Changes

- **Automated Formatting**: Apply Biome's `format` and `check` fixes globally across the `./src` directory.
- **Import/Export Hygiene**: Enforce alphabetical sorting for all import and export statements.
- **Dependency Cleanup**: Remove all unused imports identified by the linting engine.
- **Type Safety**: Replace `any` type annotations with specific interfaces or union types to ensure type safety.
- **Test File Standardization**: Remove accidental exports from `.spec.ts` files to maintain clear boundaries between test code and source code.
- **CSS Maintenance**: Resolve descending specificity issues in CSS selectors to ensure predictable styling behavior.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `quality-assurance`: Enhancing the existing QA capability by enforcing stricter rules for import sorting, type safety, and test file isolation.

## Impact

- **Codebase-wide**: All Vue and TypeScript files in `src/` will undergo formatting and linting adjustments.
- **Developer Workflow**: Developers must now adhere to alphabetical import sorting and strict typing.
- **Build System**: The Biome CI gate will now enforce these stricter standards, ensuring no regressions enter the main branch.
