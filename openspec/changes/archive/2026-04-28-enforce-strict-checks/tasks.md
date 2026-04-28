# Tasks: Enforce Strict Checks

- [x] 1. Update `biome.json` with an override for `*.vue` files to disable `noUnusedVariables` and `noUnusedImports`.
- [x] 2. Find and remove all 14 `// biome-ignore` comments from Vue components (`FusedReveal.vue`, `ThemeToggle.vue`, `NavConveyor.vue`, `App.vue`).
- [x] 3. Add a `check:avoidance` script to `package.json` that fails if it finds `biome-ignore`, `@ts-ignore`, etc.
- [x] 4. Update `.agent/AGENT.md` to explicitly forbid AI from adding bypass comments.
