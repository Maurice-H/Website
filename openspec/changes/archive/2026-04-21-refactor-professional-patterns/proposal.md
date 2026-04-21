## Why

The current codebase, while visually advanced, suffers from significant architectural issues that hinder performance and maintainability. Multiple components independently track viewport coordinates using redundant event listeners, causing "layout thrashing." Furthermore, the "fused" visual pattern is implemented by manually duplicating templates, creating a high risk of desynchronized content and massive maintenance debt.

## What Changes

- **Centralized Coordinate Tracking**: Replace scattered `getBoundingClientRect` calls on scroll/resize with a single, high-performance IntersectionObserver and ResizeObserver service.
- **DRY Fused Pattern**: Implement a generic `<FusedReveal>` wrapper component to handle the dual-rendering (Blueprint vs. Finished) of any content via slots.
- **Feature-Based Architecture**: Transition from a flat component folder to a structured hierarchy (e.g., `layout/`, `features/`, `navigation/`).
- **Data Externalization**: Move hardcoded content (Projects, Skills, Nav items) into a centralized data directory.
- **Coding Standards Update**: Formalize guidelines for state management, component isolation, and typing in `openspec/config.yaml`.

## Capabilities

### New Capabilities
- `fused-rendering-engine`: Defines the standards and requirements for synchronized multi-layer rendering and viewport coordinate orchestration.

### Modified Capabilities
- `quality-assurance`: Update testing requirements to cover centralized rendering services and component logic isolation.

## Impact

- **Components**: Wholesale refactor of all Vue components to use the new `<FusedReveal>` and centralized offsets.
- **Composables**: Major update to `useLightingEngine.ts` to act as a singleton event bus.
- **Data Layer**: Migration of hardcoded strings into JSON/TS data structures.
- **Performance**: Significant reduction in main-thread blocking during scroll and resize events.

## Non-Goals
- Adding new visual features or changing the existing design.
- Implementing a full CMS.
- Changing the primary tech stack (Vue 3, TS, Vite).
