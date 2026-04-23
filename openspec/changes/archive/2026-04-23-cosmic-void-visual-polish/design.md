## Context

The Cosmic Void portfolio's architectural skeleton is complete: Pinia stores manage global state, phase transitions (NAV ↔ CONTENT) work reliably, and the bento grid/conveyor navigation structure is functional. However, the visual output diverges significantly from the three design mockups. The primary issues are: wrong accent color (violet vs teal/emerald), insufficient atmospheric fidelity in the flashlight/lamp fixtures, and bento cards that lack the premium glassmorphism feel shown in the mockups.

This is a pure **visual polish** pass. No architectural, behavioral, or state-management changes are needed.

## Goals / Non-Goals

**Goals:**
- Migrate the global accent color from violet (`#8b5cf6`) to emerald/teal (`#10b981`), cascading through all CSS variables.
- Refine the `FlashlightSource` and `VolumetricBeam` components to render a focused teal-white cone matching the mockup's physical flashlight.
- Upgrade the `NavConveyor` lamp fixture to an industrial ceiling lamp with bright cyan/teal glowing bulb.
- Make the `PerspectiveGrid` light-responsive — only visible where the beam hits, using a radial mask.
- Polish all bento cards with teal glassmorphism glows and frosted tag pills.
- Update the boot sequence terminal text to match mockup style.
- Soften the light overlay vignette for more natural light falloff.

**Non-Goals:**
- Changing any Pinia store logic or phase transition behavior.
- Adding new Vue components (all components already exist).
- Introducing external dependencies or libraries.
- Modifying the FusedReveal architecture or viewport store.
- Changing the number of NAV tabs (keeping all 4 as-is, visual adjustment only).

## Decisions

- **CSS Variable Cascade**: All color changes will be made exclusively in `index.css` `:root` block. Components already reference `var(--finished-accent)` etc., so the migration is a single-source change. Blueprint mode overrides will shift from blue to a complementary blue-teal.
- **Grid Visibility via Radial Mask**: Rather than toggling the grid between phases, apply a `mask-image: radial-gradient(...)` centered on `--mask-x`/`--mask-y` to the grid container. This makes the grid appear to "glow" only under the light source, matching all three mockups.
- **Beam Cone Tightening**: The current beam uses a wide `clip-path: polygon(50% 0%, 0% 100%, 100% 100%)` which is too broad. Will narrow it and reduce blur from 40px to ~15px for a crisper, more defined cone.
- **Flashlight Body CSS-Only**: The physical flashlight will remain CSS-only (gradients + borders), but with more detail: metallic teal tint, defined grip texture, emitter lens glow in accent color.

## Risks / Trade-offs

- **Color Consistency**: Hardcoded Tailwind color classes (e.g., `text-violet-400`, `from-blue-500`) exist in some components and must be found and replaced. Risk: missing one instance. Mitigation: use `grep` to find all violet/blue color references.
- **Grid Performance**: Adding a radial mask to the perspective grid adds one more GPU-composited layer. Low risk given the grid is already a composited element.
- **Blueprint Mode**: Shifting the accent will affect blueprint theme aesthetics. Mitigation: test both themes after the migration.
