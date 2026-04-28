# Design: Enforce Strict Checks

## Architecture & Approach

1.  **Biome Configuration Update:**
    Update `biome.json` to include an `overrides` section specifically targeting `*.vue` files. Disable `lint/correctness/noUnusedVariables` and `lint/correctness/noUnusedImports` for these files to stop false positives from template usage.

2.  **Bypass Removal:**
    Delete all occurrences of `// biome-ignore lint/correctness/noUnusedVariables: template-use` and `// biome-ignore lint/correctness/noUnusedImports: template-use`.

3.  **Programmatic Enforcement:**
    Create a new npm script in `package.json` named `check:avoidance`.
    This script will use a robust command to check for avoidance keywords: `biome-ignore`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `it.skip`, `test.skip`, `describe.skip`.

4.  **Behavioral Enforcement:**
    Add explicit rules to `.agent/AGENT.md` instructing AI assistants to never use bypass comments to circumvent errors.
