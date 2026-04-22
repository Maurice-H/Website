---
name: ui-ux-pro-max
description: "UI/UX design intelligence. Optimized for the Premium Lamp Portfolio. Focuses on CSS Variables for theming, Vue 3 components, and the Blueprint/Finished dual-state architecture."
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide tailored for the Premium Lamp Portfolio's "Themed Nav Windows" and "Fused Rendering" architecture.

## Rule Categories by Priority

| Priority | Category | Impact | Domain |
|----------|----------|--------|--------|
| 1 | Accessibility | CRITICAL | `ux` |
| 2 | Theme Logic (CSS Vars) | CRITICAL | `theme` |
| 3 | Layout & Bento Grid | HIGH | `layout` |
| 4 | Performance | HIGH | `ux` |
| 5 | Animation & Glows | MEDIUM | `ux` |

## Project Bridge UI Standards (CRITICAL)

### 1. Theming via CSS Variables
**DO NOT** use hardcoded Tailwind classes for primary/secondary colors or visual states.
- **Blueprint State:** Use `var(--color-blueprint-line)` and `var(--color-blueprint-bg)`.
- **Finished State:** Use `var(--color-lamp-glow)` and `var(--color-surface)`.
- **Sync:** All transitions must use `var(--theme-transition-duration)`.

### 2. Bento Layouts
- Use a 12-column grid or standard bento-box wrappers.
- Encapsulate hover logic within `<BentoCard>` components to ensure consistent neon-glow behaviors.

### 3. Fused Rendering
- Ensure that any design requiring a "layered" look (Blueprint under Finished) uses the `<FusedReveal>` component to avoid template duplication.

## Quick Reference

### 1. Accessibility
- `color-contrast`: Minimum 4.5:1 ratio.
- `focus-states`: Use visible focus rings, styled with `var(--color-focus)`.
- `aria-labels`: Mandatory for icon-only buttons in the navigation windows.

### 2. Interaction
- `cursor-pointer`: Mandatory for all `BentoCard` and interactive nav elements.
- `hover-feedback`: Use `transition-all duration-[var(--theme-transition-duration)]`.
- `touch-targets`: Minimum 44x44px for mobile navigation.

### 3. Animation & Glows
- `neon-glow`: Use `box-shadow: 0 0 10px var(--color-glow-primary)`.
- `layer-transitions`: Coordinate via `opacity` and `transform` on the fused layers.

## Pre-Delivery Checklist (MANDATORY)

### Visual Quality
- [ ] NO hardcoded Tailwind colors (e.g., `bg-blue-500`). Use `var(--color-*)`.
- [ ] Blueprint vs Finished states verified in both Light/Dark modes.
- [ ] Neon glows are using the unified project palette variables.
- [ ] Icons are consistent (Lucide/Heroicons) and have fixed dimensions.

### Interaction
- [ ] All clickable elements have `cursor-pointer`.
- [ ] Hover states use the unified transition duration variable.
- [ ] Focus states are clearly visible for keyboard users.

### Architecture
- [ ] Layered visuals use `<FusedReveal>`.
- [ ] Sections are wrapped in `<BentoCard>`.
- [ ] Static text/data is imported from `src/data/`.

## Common Pitfalls
- **Ignoring CSS Variables:** Using `text-slate-900` instead of `var(--color-text-main)`. This breaks the theme engine.
- **Layout Shift:** Animating `width/height` instead of `transform/opacity`.
- **Local Event Listeners:** Adding `window.addEventListener('scroll', ...)` instead of using the `useViewportStore`.
