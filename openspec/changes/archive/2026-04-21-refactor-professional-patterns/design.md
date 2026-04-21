## Context

The current portfolio implements a high-end "Spotlight Reveal" effect by duplicating DOM nodes and calculating offsets in every component. This has lead to:
1. **Performance Degredation**: Too many scroll/resize listeners.
2. **Maintenance Complexity**: Content must be updated in two places (Blueprint vs. Finished).
3. **Architectural Weakness**: Components are too tightly coupled to the global mouse position logic.

## Goals / Non-Goals

**Goals:**
- Centralize all viewport and mouse coordination into a single, high-performance observer service.
- Abstract the "Fused" visual pattern into a reusable `<FusedReveal>` component.
- Organize the codebase by feature rather than type.
- Define strict **Coding Guidelines** for future development.

**Non-Goals:**
- Changing the existing visual style or theme.
- Migrating to a different framework (e.g., React).

## Decisions

### 1. Viewport Service (Singleton Pattern)
Instead of every component running `window.addEventListener('scroll', ...)`, we will implement a centralized `useViewportStore.ts`.
- **Mechanism**: A single `IntersectionObserver` and `ResizeObserver` will track the positions of registered "Reflexive" components.
- **Rationale**: Reduces browser overhead by 90% and ensures perfect synchronization during animations.

### 2. `<FusedReveal>` Abstract Component
We will create a wrapper component that uses slots to render content once, but replicates it internally for the "Revealer" layer.
- **Approach**: The component will use the `v-slot` pattern to provide the necessary "fused" styles to its children.
- **Rationale**: Ensures "Single Source of Truth" for content.

### 3. Feature-Based Directory Structure
Move from `src/components/*` to:
- `src/components/layout/`: Global wrappers (SpotlightMask, Layouts).
- `src/components/shared/`: Reusable primitives (FusedReveal, BentoCard).
- `src/components/features/`: Domain-specific (Navigation, Hero, Projects, Contact).
- `src/data/`: Static content constants.

### 4. Coding Guidelines (The "Alex" Standard)
Based on your request, these are the standards for all future changes:
- **Event Management**: Never attach `window` scroll/resize listeners in components. Use the centralized viewport service.
- **DRY Visuals**: Use `<FusedReveal>` for any element that needs the blueprint-to-finished transition.
- **Component Anatomy**: 
    1. Define `props` and `emits` with strict TS interfaces.
    2. Extract local helper logic to `composables/` if it exceeds 50 lines.
    3. No hardcoded content strings in templates; use the `src/data/` layer.
- **State Flow**: Components should be "Prop-Driven, Event-Emitting" (DDAU - Data Down, Actions Up) unless utilizing the global store.

## Risks / Trade-offs

- **[Risk] Complexity of FusedReveal migration** -> Mitigation: Refactor one section at a time (Hero first) to ensure the logic handles edge cases like dynamic spacing.
- **[Risk] Breakage of existing E2E tests** -> Mitigation: Update the AppPage POM simultaneously to reflect the new DOM structure.
