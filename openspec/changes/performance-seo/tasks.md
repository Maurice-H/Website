## 1. Pre-Flight & Setup

- [ ] 1.1 PRE-FLIGHT: Read and apply all guidelines from `.docs/skills/` directory.
- [ ] 1.2 Install `@vitest/coverage-v8` as a dev dependency for coverage reporting.

## 2. SEO Metadata (seo-metadata spec)

- [ ] 2.1 Add `<meta name="description">` tag to `index.html` with a keyword-rich summary (50–160 chars).
- [ ] 2.2 Add `<meta name="author" content="Maurice ...">` tag to `index.html`.
- [ ] 2.3 Update `<title>` to descriptive format: `Name — Role | Domain`.
- [ ] 2.4 Add Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`) to `index.html`.
- [ ] 2.5 Create `public/robots.txt` with `User-agent: *` and `Allow: /`.

## 3. CSS Performance — Blur Replacement (css-performance spec)

- [ ] 3.1 **NavConveyor.vue**: Replace `filter: blur(350px)` with a `radial-gradient` + opacity layer. Add `will-change: transform`.
- [ ] 3.2 **VolumetricBeam.vue**: Replace `filter: blur(250px)` (static CSS) with `radial-gradient` overlay. Add `will-change: transform`.
- [ ] 3.3 **VolumetricBeam.vue**: Replace inline `filter: 'blur(50px)'` (JS) with a `radial-gradient` approach.
- [ ] 3.4 **BentoCard.vue**: Reduce `backdrop-filter: blur(40px)` to `blur(16px)` (≤ 20px budget).
- [ ] 3.5 Verify all replaced elements include `will-change: transform` compositing hint.
- [ ] 3.6 Take Playwright baseline screenshots before and after changes for visual regression check.

## 4. Biome Compliance (quality-assurance spec)

- [ ] 4.1 Run `npx biome check --write ./src` to auto-fix formatting issues.
- [ ] 4.2 Manually fix any remaining lint errors that `--write` cannot auto-resolve.
- [ ] 4.3 Verify `npx biome check ./src` exits with zero diagnostics.

## 5. Test Coverage Audit (quality-assurance spec)

- [ ] 5.1 Configure Vitest for `@vitest/coverage-v8` provider in `vite.config.ts` or `vitest.config.ts`.
- [ ] 5.2 Run `npx vitest run --coverage` and capture the text summary.
- [ ] 5.3 Document the coverage baseline (line/branch/function percentages) in a `COVERAGE.md` file.

## 6. Lighthouse Production Audit (quality-assurance spec)

- [ ] 6.1 Run `npm run build` and verify clean build output.
- [ ] 6.2 Run `npm run preview` and execute a Lighthouse audit against the preview URL.
- [ ] 6.3 Document the Lighthouse scores (Performance ≥ 95, Accessibility ≥ 90, SEO = 100).
- [ ] 6.4 If any score is below threshold, identify and fix the top-priority issues, then re-audit.

## 7. Post-Flight Verification

- [ ] 7.1 Run `npx biome check ./src` — must exit cleanly.
- [ ] 7.2 Run `npm run test:unit` — all tests must pass.
- [ ] 7.3 Run Playwright E2E tests to confirm visual regression is within tolerance.
- [ ] 7.4 Verify `robots.txt` is served correctly from the built `dist/` output.
