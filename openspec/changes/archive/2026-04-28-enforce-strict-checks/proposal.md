# Proposal: Enforce Strict Checks

## What are we doing?
Removing all comments and commands that disable checks (like `// biome-ignore`, `@ts-ignore`, etc.) and preventing their future use by AI agents or developers.

## Why are we doing this?
To maintain high code quality and prevent the AI or developers from bypassing linting and typing checks instead of fixing the underlying architectural issues.

## Scope
1. Fix underlying Vue SFC Biome parsing issues in `biome.json` (`noUnusedVariables`, `noUnusedImports`).
2. Remove all 14 `// biome-ignore` comments across the codebase.
3. Add a programmatic `check:avoidance` npm script to enforce this in CI/locally.
4. Update `.agent/AGENT.md` to forbid AI agents from using these bypasses.
