## Context

The "Physical Discovery" aesthetic originally attempted to use two identical DOM layers (Blueprint and Finished) stacked with a mask. However, browser anti-aliasing and sub-pixel rounding inconsistencies created visible "ghosting" and "blurring" (parallax artifacts), even with 1:1 pixel alignment.

## Goals / Non-Goals

**Goals:**
- Eliminate all rendering artifacts (blurring/ghosting) by using a **Single DOM tree**.
- Implement "Fused" components that change their style (dashed-to-solid borders, ghost-to-legible text) based on spotlight proximity.
- Simplify the architecture by removing global layer synchronization.

**Non-Goals:**
- Changing the layout or section content.

## Decisions

### 1. Fused Component Architecture
**Decision**: Every UI element will exist only once in the DOM.
- **Implementation**: We will use CSS `mask-image` on specific properties (like border pseudo-elements) to reveal high-fidelity styles over a low-fidelity base.

### 2. Pseudo-Element Layering for Borders
**Decision**: Borders will transition from `dashed` to `solid` using a masked `::after` element.
- **Rationale**: Since the `::after` is a child of the same DOM node, it is locked to the same pixel grid, preventing any shift.

### 3. Gradient Reveal for Text
**Decision**: Text will use a `radial-gradient` for color and `background-clip: text`.
- **Rationale**: This allows the text to "discover" its finished color smoothly as the beam passes over it while remaining perfectly crisp.

## Risks / Trade-offs

- **[Risk]** Complex CSS gradients on many elements.
  - **Mitigation**: Use hardware-accelerated properties (`opacity`, `transform`, `background-position`) where possible.
- **[Trade-off]** Losing the ability to have radically different content between Blueprint and Finished.
  - **Selected Approach**: We accept this as the current portfolio content is 1:1 between states anyway.
