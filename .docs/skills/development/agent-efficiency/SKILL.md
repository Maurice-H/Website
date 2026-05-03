# Agent Efficiency & Context Management

Guidelines for AI agents to maintain high performance and low token usage through automated context loading and structured API reading.

## Core Tools

### 1. Agent Bootstrap Script
**Command**: `npm run agent:boot`
**Purpose**: Quickly ingest the entire project architecture.
**Output**: 
- Technology stack (Vue 3, Vite, etc.)
- Directory structure (src subdirs)
- Configured Path Aliases
- Centralized Store Typings (`src/types/stores.d.ts`)

### 2. Path Aliases
**Pattern**: `@/*`
**Usage**: Always prefer aliases over relative paths (`../../`).
- `@components/*` -> `src/components/*`
- `@stores/*` -> `src/stores/*`
- `@data/*` -> `src/data/*`
- `@utils/*` -> `src/utils/*`

## Workflow for New Sessions

1.  **Immediate Boot**: Run `npm run agent:boot` as the very first step.
2.  **API Check**: If you need to interact with state, read `src/types/stores.d.ts` before looking at the store implementation.
3.  **Search First**: Use `npm run search "<query>"` to find design patterns or specific requirements instead of browsing large documentation files.

## Best Practices

- **Never rewrite full files**: Use surgical diffs.
- **Ignore non-relevant logic**: If you are a UI agent, ignore `.glsl` math.
- **Maintain store interfaces**: If you modify a store, ensure `src/types/stores.d.ts` is updated to reflect public API changes.
