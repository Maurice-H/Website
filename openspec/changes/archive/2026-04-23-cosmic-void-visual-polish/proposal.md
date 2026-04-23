## Why

The architectural foundation of the "Cosmic Void" portfolio is complete (Pinia stores, phase transitions, component structure), but the visual output does not match the three design mockups. The current implementation uses a **violet/purple** accent palette instead of the intended **teal/emerald green**, the flashlight and lamp fixtures lack the physical fidelity shown in the mockups, and the bento cards do not achieve the premium glassmorphism feel. This change bridges the gap from "working prototype" to "mockup-accurate, portfolio-ready product."

## What Changes

- **Color System Overhaul**: Migrate the entire accent palette from violet (`#8b5cf6`) to emerald/teal (`#10b981` → `#22d3ee`) via CSS variable updates in `:root`.
- **Flashlight & Beam Refinement**: Redesign the `FlashlightSource` to render as a detailed, metallic, teal-tinted cylinder and tighten the `VolumetricBeam` cone to a focused, realistic teal-white gradient.
- **Lamp Fixture Upgrade**: Redesign the `NavConveyor` lamp to match the mockup's industrial ceiling lamp with bright cyan/teal glowing bulb and multi-layer glow shadows.
- **Perspective Grid Enhancement**: Make the grid only visible where the light hits (via radial mask), and show it in both NAV and CONTENT phases at appropriate intensities.
- **Bento Card Glassmorphism Polish**: Update all card components to use the teal accent for glows, borders, and pill badges.
- **Boot Sequence Update**: Rewrite terminal text to match mockup style (`> system.boot_sequence(91)...`).
- **Light Overlay Tuning**: Soften the dark vignette overlay for more natural light falloff in both phases.

## Capabilities

### New Capabilities
- `visual-theme-polish`: Covers the global color migration, glassmorphism standards, and atmospheric effect tuning across all components.

### Modified Capabilities
_(No spec-level behavior changes — all modifications are visual/styling within the existing component architecture.)_

## Impact

- **Affected Code**: `index.css`, all components in `src/components/layout/`, `src/components/shared/`, `src/components/features/`, `src/components/navigation/`, and `src/data/boot-sequence.json`.
- **Dependencies**: No new external dependencies. All changes are CSS variables, Tailwind classes, and inline styles.
- **Performance**: No impact — changes are purely cosmetic (colors, gradients, opacities).
- **State Management**: The existing Pinia stores and the global theme toggle remain unchanged. The blueprint theme override will be updated to complement the new teal accent.
- **Testing**: Visual verification via browser screenshots. Existing unit/E2E tests remain valid since no behavioral changes are made.
