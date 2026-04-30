## Context

The portfolio is a Vue 3 SPA built with Vite, styled using a mix of Tailwind utilities and CSS custom properties. It features a distinctive "lamp" lighting mechanic that relies heavily on CSS `blur()` filters for glow/beam effects. Currently, 9 blur instances exist across 5 files, with radii as high as 350px (NavConveyor) and 250px (VolumetricBeam), causing significant GPU compositing overhead on integrated GPUs and mobile devices. The project ships with a bare `index.html` lacking SEO metadata, and no `robots.txt`. Biome linting reports formatting violations that have accumulated.

## Goals / Non-Goals

**Goals:**

- Reduce GPU compositing cost by replacing the heaviest `blur()` filters with visually equivalent `radial-gradient` + opacity layering.
- Achieve a clean `npx biome check` with zero diagnostics.
- Add foundational SEO tags so the site is indexable and has a meaningful search snippet.
- Establish a documented Lighthouse baseline against the production build.
- Audit and document current test coverage to identify gaps.

**Non-Goals:**

- No visual redesign — the "before/after" of glow effects must be perceptually identical.
- No SSR/prerendering (SPA SEO is limited to meta tags for this scope).
- No new test authoring (only audit; gap-filling is a follow-up).
- No Lighthouse CI pipeline integration (manual audit only for now).

## Decisions

### Decision 1: Blur Replacement Strategy — Tiered Approach

**Choice**: Replace only filters ≥ 50px; preserve smaller blurs as-is.

**Rationale**: CSS `blur()` cost scales quadratically with radius. A `blur(15px)` is cheap on any GPU, but `blur(350px)` forces a massive offscreen framebuffer. Replacing only the top offenders maximizes perf gain for minimal visual risk.

| File | Current | Action |
|------|---------|--------|
| `NavConveyor.vue` | `blur(350px)` | Replace with `radial-gradient` + opacity layer |
| `VolumetricBeam.vue` | `blur(250px)` | Replace with `radial-gradient` + opacity layer |
| `VolumetricBeam.vue` | `blur(50px)` (JS inline) | Replace with `radial-gradient` |
| `BentoCard.vue` | `backdrop-filter: blur(40px)` | Reduce to `blur(16px)` (perceptually similar at card scale) |
| `BentoCard.vue` | `backdrop-filter: blur(12px)` | Keep as-is |
| `VolumetricBeam.vue` | `blur(15px)` | Keep as-is |
| `VolumetricBeam.vue` | `blur(1px)` | Keep as-is |
| `FlashlightSource.vue` | `blur(15px)` | Keep as-is |
| `index.css` | `blur(20px)` variable | Keep as-is |

**Alternatives considered**:
- **`will-change: filter`**: Promotes element to own compositing layer but does not reduce the filter cost itself. Will use as supplemental hint on replaced elements.
- **SVG `<feGaussianBlur>`**: Gives more control but introduces SVG DOM overhead and is harder to theme with CSS variables.

### Decision 2: SEO Tags — Static HTML Injection

**Choice**: Add meta tags directly to `index.html` (not via `vue-meta` or `@unhead/vue`).

**Rationale**: For a single-page portfolio with one entry point, a runtime head manager is unnecessary overhead. Static tags in `index.html` are read by every crawler instantly and require zero JS execution.

### Decision 3: Biome Fix — Batch Auto-Fix

**Choice**: Run `npx biome check --write ./src` to auto-fix formatting, then manually fix any remaining lint errors.

**Rationale**: Biome's `--write` mode safely fixes formatting (whitespace, import order) without changing semantics. Lint errors (unused variables, etc.) require manual review.

### Decision 4: Coverage Reporting — Vitest c8

**Choice**: Use Vitest's built-in coverage with `@vitest/coverage-v8` (c8 provider), generating an LCOV report.

**Rationale**: Already part of the Vitest ecosystem, requires minimal config. LCOV output is human-readable and CI-compatible.

## Risks / Trade-offs

- **Visual Regression** → Mitigation: Side-by-side screenshot comparison (Playwright) of landing page glow before/after gradient swap. Accept if ΔE < 2 (perceptually identical).
- **Biome auto-fix may touch files under active development in other changes** → Mitigation: Run on a clean branch; conflicts are trivial merge issues (whitespace only).
- **Lighthouse scores vary between runs** → Mitigation: Run 3x and take the median. Only assert ≥ 95, not exactly 100.

## Open Questions

- Should coverage thresholds be enforced in CI immediately, or just documented as a baseline for now? (Recommend: baseline only for this change.)
