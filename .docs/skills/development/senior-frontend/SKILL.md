---
name: senior-frontend
description: Comprehensive frontend development skill for building modern, performant web applications using Vue 3, Vite, TypeScript, and Tailwind CSS. Focuses on Composition API (<script setup>), Pinia state management, and the 'Project Bridge' theme architecture. Use when developing Vue components, optimizing Vite builds, or implementing complex UI/UX designs.
---

# Senior Frontend (Vue 3 + Vite)

Complete toolkit for senior frontend development tailored for the Premium Lamp Portfolio.

## Quick Start

### Main Capabilities

This skill provides core capabilities through automated scripts and strict adherence to the **Project Bridge** standards.

```bash
# Script 1: Vue Component Generator
python scripts/component_generator.py [options]

# Script 2: Vite Bundle Analyzer
python scripts/bundle_analyzer.py [options]

# Script 3: Data Scaffolder (src/data/)
python scripts/frontend_scaffolder.py [options]
```

## Core Capabilities

### 1. Component Generator
Automated tool for Vue 3 component scaffolding.

**Features:**
- Generates `<script setup lang="ts">` components.
- Automatically includes `<FusedReveal>` wrappers where needed.
- Enforces co-location of styles and logic.

### 2. Bundle Analyzer
Comprehensive analysis and optimization for Vite/Rollup.

**Features:**
- Identifies large dependencies.
- Recommends code-splitting strategies for Vue components.
- Analyzes CSS variable usage impact.

## Project Bridge Standards (MANDATORY)

### 1. Theming & Styling
- **CSS Variables First:** Core colors and visual states (neon, blueprint) MUST use native CSS variables.
- **Tailwind for Layout:** Use Tailwind for spacing, grid, and typography, but NOT for core theme colors.
- **Transitions:** Use `var(--theme-transition-duration)` for all theme-related animations.

### 2. Vue Architecture
- **Script Setup:** Always use `<script setup lang="ts">`.
- **Abstractions:** Use `<FusedReveal>` for layered visual patterns.
- **Bento Grid:** Wrap section content in `<BentoCard>` components.

### 3. State & Events
- **Pinia Stores:** Use `useThemeStore` for lighting/theme and `useViewportStore` for scroll/resize events.
- **Data Externalization:** Move all static content to `src/data/`.

## Tech Stack
**Frontend:** Vue 3, Vite, Pinia, TypeScript, Tailwind CSS v4.
**Tooling:** Biome (Lint/Format), Vitest, Playwright.
**Patterns:** Fused Rendering, Bento Grid, Composition API.

## Development Workflow

### 1. Component Scaffolding
```bash
python scripts/component_generator.py src/components/NewFeature.vue --fused
```

### 2. Quality Checks
```bash
# Run Biome linting
npm run lint

# Run type checks
npm run type-check
```

### 3. Performance Audit
```bash
# Run Vite bundle analysis
npm run build -- --report
```

## Best Practices Summary

### Code Quality
- No implicit `any` types.
- Strict use of `src/data/` for all text/static assets.
- Explicit prop types and emits in Vue components.

### Maintainability
- Keep components focused and small.
- Use `useViewportStore` instead of adding window listeners.
- Document complex CSS variable dependencies.

## Resources
- Project Bridge: `.docs/skills/project-bridge.md`
- Vue 3 Docs: [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- Pinia Docs: [Store Pattern](https://pinia.vuejs.org/)

