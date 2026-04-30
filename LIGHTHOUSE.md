# Lighthouse Audit Report

**Date:** 2026-04-30
**Environment:** Local Preview (`npm run preview`)
**Tool:** Lighthouse MCP (v12.8.2)

## Scores

### Mobile (default)
- **Performance:** 100 / 100
- **Accessibility:** 100 / 100
- **Best Practices:** 96 / 100
- **SEO:** 100 / 100

### Desktop
- **Performance:** 92 / 100
- **Accessibility:** 100 / 100
- **Best Practices:** 100 / 100
- **SEO:** 100 / 100

## Key Metrics (Mobile)
| Metric | Value | Score |
|--------|-------|-------|
| First Contentful Paint | 1.2s | 99 |
| Largest Contentful Paint | 1.3s | 100 |
| Total Blocking Time | 50ms | 100 |
| Cumulative Layout Shift | 0 | 100 |
| Speed Index | 1.5s | 100 |
| Time to Interactive | 1.3s | 100 |

## Performance Optimizations Applied
- Removed all `filter: blur()` from VolumetricBeam (250px, 50px, 15px, 1px)
- Removed all `filter: blur()` from NavConveyor (350px)
- Removed `filter: blur(15px)` from FlashlightSource
- Removed `filter: drop-shadow()` from FlashlightSource body
- Replaced blurs with GPU-accelerated `clip-path`, `radial-gradient`, and `linear-gradient`
- Removed infinite `particles-float` animation (continuous GPU compositing on 100vw element)
- Removed oversized `beam-haze` layer (800px with border-radius compositing)
- Reduced global glassmorphism blur from 20px to 16px
- Added `will-change: transform` on animated elements
