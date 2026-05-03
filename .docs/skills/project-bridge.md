# 🌉 Project Bridge: The Premium Lamp Portfolio

## Context
You are applying your senior development skills to a specific Vue 3 / Vite portfolio. Generic solutions must be adapted to the following strict project domains.
**MANDATORY BASELINE:** You MUST strictly adhere to the AI Behavioral Guidelines defined in `.agent/AGENT.md` (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution) for all tasks.

## 1. Theme Engine & Styling (CRITICAL)
- **CSS Variables over Tailwind:** While Tailwind will be used for utility spacing, layout, and typography, the core color theming and complex visual states (neon glows, dashed layout borders, graph paper backgrounds) will be purely managed by native CSS variables defined at the `:root` and `[data-theme="blueprint"]` levels. 
- **Transitions:** Rely on a unified timing variable `var(--theme-transition-duration)` in Vue/CSS transitions to coordinate the opacity, colors, and shadows synchronously. Do not use arbitrary Tailwind transition classes for theme switching.

## 2. Vue Component Architecture
- **Composition API:** Vue Composition API (`<script setup>`) for all components.
- **Fused Rendering:** Visual patterns requiring layer duplication (Blueprint/Finished) MUST use the `<FusedReveal>` abstraction to ensure DRY templates.
- **Bento Components:** The layout relies on a bento-box grid for various sections such as an About section, Portfolio Projects, Skills, and a Contact form. Encapsulate hover animations inside `BentoCard.vue` wrapper components.

## 3. Data & State Management
- **State Architecture:** We are using **Pinia** for global state management. The global theme toggle (Lamp) and the viewport/scroll state MUST be managed in dedicated Pinia stores (e.g., `useThemeStore`, `useViewportStore`).
- **Static Content:** All static content (Projects, Skills, etc.) SHALL be externalized into `src/data/` to keep component templates clean and data-driven.
- **Events:** Components MUST NOT add local scroll or resize listeners to the window. Use the `useViewportStore` coordinator.

## 4. Definition of Done (Checklist before completing a task)
- [ ] Is all static text/data extracted to `src/data/`?
- [ ] Are CSS variables used for all color/theme switching instead of hardcoded Tailwind classes?
- [ ] Is the Component using `<script setup lang="ts">` with no implicit `any` types?
- [ ] Are global events (scroll/resize) delegated to the Pinia stores instead of local listeners?

## 5. AI Tooling & Efficiency
- **Agent Bootstrap:** At the start of a session, ALWAYS run `npm run agent:boot`. This loads the structure, aliases, and store interfaces (`src/types/stores.d.ts`) into context in seconds.
- **Path Aliases:** ALWAYS use `@/*` aliases (e.g., `@components/`, `@stores/`) for imports. Avoid relative paths like `../../` to ensure robust, location-agnostic code.
- **Token Shielding:** When using the Playwright MCP to debug E2E tests, DO NOT request full HTML dumps or full console logs. Request ONLY the specific error locator and the exact assertion that failed. 
- **Large Context Handling:** Use the `token-optimizer` MCP to parse large outputs. Keep the context window as minimal as possible to prevent reasoning degradation during complex Vue/WebGL tasks.