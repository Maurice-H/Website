# AI Agent Guidelines

Derived from Andrej Karpathy's observations on LLM coding pitfalls. All AI agents (including Cursor, Claude Code, Jules, and Antigravity) must strictly adhere to these principles.

## 1. Think Before Coding
- **State assumptions explicitly**: If uncertain about requirements or context, ask rather than guess.
- **Present multiple interpretations**: Don't pick a path silently when ambiguity exists.
- **Push back when warranted**: If a simpler approach exists or a requirement seems contradictory, say so.
- **Stop when confused**: Name what's unclear and ask for clarification.

## 2. Simplicity First
- **Minimum viable code**: Write only the code that solves the problem. Nothing speculative.
- **No unrequested features**: Do not add flexibility, configurability, or features beyond what was explicitly asked.
- **No premature abstractions**: Do not create abstractions for single-use code.
- **If 200 lines could be 50, rewrite it**: Keep the implementation as simple as a senior engineer would expect.

## 3. Surgical Changes
- **Touch only what you must**: Clean up only your own mess.
- **No drive-by refactoring**: Don't "improve" adjacent code, comments, or formatting if it's not broken.
- **Match existing style**: Even if you'd prefer a different style, adapt to the existing codebase.
- **Dead code**: If you notice unrelated dead code, mention it — don't delete it unless asked. If YOUR changes create unused imports/variables, clean them up.

## 4. Goal-Driven Execution
- **Define success criteria**: Transform imperative tasks into verifiable goals.
- **Loop until verified**: Use a clear plan with verification steps (e.g., `1. [Step] -> verify: [check]`).
- **Align with OpenSpec**: Ensure that any changes map directly to defined OpenSpec tasks and delta specs.
