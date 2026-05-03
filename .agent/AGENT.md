# AI Agent Guidelines

Derived from Andrej Karpathy's observations on LLM coding pitfalls, adapted for high-efficiency Spec-Driven Development (SDD). All AI agents (including Cursor, Claude Code, Jules, Bolt, Palette, and Antigravity) must strictly adhere to these principles.

<CRITICAL_DIRECTIVES>
## 1. Context Efficiency & Output Format
Your context window is a limited, expensive resource. Protect it at all costs.
- **Context Efficiency**: At the start of a new session, ALWAYS run `npm run agent:boot` to load the compact project context (structure, aliases, and store APIs) in seconds.
- **Strict Surgical Output**: Output ONLY unified diffs or search/replace blocks. NEVER rewrite full files unless explicitly requested.
- **Absolute Zero Yapping**: Skip pleasantries. Do not say "Here is the code" or "Let me know if you need changes." Start immediately with the code block. End immediately after the code block.
- **Targeted Reading**: Do not read entire files if a specific symbol, function name, or line range is provided. Use AST/search tools (like `grep_search`, `Token Savior`, or `claude-context`) to extract only the necessary context.
- **Interface-First**: Always check `src/types/stores.d.ts` or index files for store/component contracts before reading full implementation files.
- **Path Aliases**: Use `@/*` aliases (e.g., `@components/`, `@stores/`) for all imports to ensure position-agnostic and robust paths.
- **Avoid Data Bloat**: NEVER load large `.csv` or `.md` documentation files into context. Use the provided search tool via `npm run search "<query>" [domain]` to query design tokens or guidelines on demand.
- **Surgical Reading**: Use `index.ts` files to survey directory capabilities before deep-diving into individual implementations.
</CRITICAL_DIRECTIVES>

## 2. Persona Boundaries (Role Discipline)
Respect your specific domain to avoid context contamination:
- **Palette (UI/UX)**: Do NOT load or modify `src/shaders/*.glsl` or heavy WebGL logic. Focus strictly on Vue templates, Tailwind, and CSS variables.
- **Bolt (Performance/WebGL)**: Do NOT modify UI layouts or Tailwind classes unless directly related to canvas positioning. Focus on raw WebGL, TresJS, and Shaders.
- **Jules / Sentinel (QA/Sec)**: Focus purely on tests, pipeline stability, and security sanitization.

## 3. Think Before Coding
- **State assumptions explicitly**: If uncertain about requirements or context, ask rather than guess.
- **Present multiple interpretations**: Don't pick a path silently when ambiguity exists.
- **Push back when warranted**: If a simpler approach exists or a requirement seems contradictory, say so.
- **Stop when confused**: Name what's unclear and ask for clarification.

## 4. Simplicity First
- **Minimum viable code**: Write only the code that solves the problem. Nothing speculative.
- **No unrequested features**: Do not add flexibility, configurability, or features beyond what was explicitly asked.
- **No premature abstractions**: Do not create abstractions for single-use code.
- **If 200 lines could be 50, rewrite it**: Keep the implementation as simple as a senior engineer would expect.

## 5. Surgical Changes
- **Touch only what you must**: Clean up only your own mess.
- **No drive-by refactoring**: Don't "improve" adjacent code, comments, or formatting if it's not broken.
- **Match existing style**: Even if you'd prefer a different style, adapt to the existing codebase.
- **Dead code**: If you notice unrelated dead code, mention it — don't delete it unless asked. If YOUR changes create unused imports/variables, clean them up immediately.

## 6. Strict Quality & Architecture
- **Fix, never bypass**: NEVER use comments or commands to suppress linter, type, or test errors (e.g., `// biome-ignore`, `@ts-ignore`, `@ts-expect-error`, `test.skip()`). The `check:avoidance` pipeline will block your commit.
- **Solve the root cause**: If the linter or compiler complains, fix the underlying architectural or typing issue, or adjust the global configuration appropriately. Do not pollute the codebase with inline ignores.
- **Maintain Boundaries**: Keep WebGL/GLSL math strictly in `src/shaders/*.glsl`. Vue components should only handle the UI template and reactivity. Do not mix heavy math into Vue templates.

## 7. Optimized Tool Usage
- **Playwright MCP**: When using Playwright to debug E2E tests, DO NOT request full HTML dumps or full console logs. Request ONLY the specific error locator and the exact assertion that failed. 
- **Token Optimization**: Always prefer using the `token-optimizer` MCP to parse large outputs.

## 8. Goal-Driven Execution
- **Define success criteria**: Transform imperative tasks into verifiable goals.
- **Loop until verified**: Use a clear plan with verification steps (e.g., `1. [Step] -> verify: [check]`).
- **Align with OpenSpec**: Ensure that any changes map directly to defined OpenSpec tasks and delta specs.