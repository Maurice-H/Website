## Why

The portfolio currently ships without any SEO metadata (`<meta name="description">`, `robots.txt`) and uses extremely heavy CSS `blur()` filters (up to 350px) that cause measurable GPU strain on weaker devices. Additionally, Biome reports formatting violations, test coverage has not been audited, and no production Lighthouse baseline exists. This change bundles the "final polish" pass to push the production build toward a 100/100 Lighthouse score.

## What Changes

- **GPU Performance**: Audit all CSS `blur()` usage (9 occurrences across `VolumetricBeam`, `NavConveyor`, `BentoCard`, `FlashlightSource`, and `index.css`). Replace the heaviest filters (≥50px) with composited `radial-gradient` alternatives or reduce blur radii while preserving visual intent.
- **SEO Meta Tags**: Add a `<meta name="description">` and `<meta name="author">` to `index.html`. Update `<title>` to a keyword-rich format.
- **Robots.txt**: Create a `public/robots.txt` allowing all crawlers and pointing to the future sitemap.
- **Biome Compliance**: Fix all Biome formatting and lint violations project-wide (currently flagged: formatting in test files, potential unused imports).
- **Test Coverage Audit**: Run Vitest with coverage reporting, identify untested components, and document the baseline.
- **Lighthouse Audit**: Run a production Lighthouse audit (`npm run build && npm run preview`) and document the baseline score, targeting 100/100 across all four categories.

## Non-Goals

- No new visual features or component refactors beyond what is needed for performance fixes.
- No sitemap generation (deferred to deployment infrastructure).
- No server-side rendering or prerendering for SEO (out of scope for a Vite SPA).

## Capabilities

### New Capabilities

- `seo-metadata`: SEO meta tags, robots.txt, and HTML head optimization for search engine discoverability.
- `css-performance`: CSS filter performance audit, blur-to-gradient replacement strategy, and GPU compositing optimizations.

### Modified Capabilities

- `quality-assurance`: Extend existing QA spec with Biome auto-fix enforcement, coverage threshold requirements, and Lighthouse CI gate.

## Impact

- **Files touched**: `index.html`, `public/robots.txt` (new), `src/components/layout/VolumetricBeam.vue`, `src/components/navigation/NavConveyor.vue`, `src/components/shared/BentoCard.vue`, `src/components/layout/FlashlightSource.vue`, `src/index.css`, various test/source files for Biome fixes.
- **Dependencies**: None added.
- **Risk**: Replacing blur filters with gradients may subtly alter the visual "softness" of glow effects — requires visual QA.

## Testing Strategy

- **Unit**: Verify CSS variable fallback values render correctly in Vitest component snapshots.
- **E2E**: Playwright visual regression on landing page glow effects before/after gradient swap.
- **Lighthouse**: Automated Lighthouse CI run against `npm run preview` output with assertions on performance ≥ 95.
- **Biome**: `npx biome check ./src` must exit cleanly with zero diagnostics.
