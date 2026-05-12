## Context

The portfolio renders two hardcoded fake projects, a generic bio, and a duplicate-containing skills list. The owner's real career data (from verified CV/application documents) is not represented. The site is English-only despite targeting both DE and EN markets. The `PortfolioProject` interface exists with `id`, `title`, `description`, `tags`, `imageUrl`, and optional `link`/`repoUrl` fields. Projects are statically imported from `src/data/portfolio.ts`. The `ContactForm.vue` is a standard HTML form without functional actions for external profiles. All user-facing strings are hardcoded in component templates.

Owner profile (from CV):
- **Name**: Maurice Hanl
- **Title (LinkedIn)**: Frontend Engineer (Vue/TS) | UI/UX Architecture | Backend (Node/Python) & Cloud DevOps (AWS/Terraform)
- **GitHub**: Maurice-H
- **Email**: maurice_hanl@outlook.de
- **Phone**: 017636315177
- **Discord**: mauzi_i
- **LinkedIn**: https://www.linkedin.com/in/maurice-hanl
- **Xing**: https://www.xing.com/profile/Maurice_Hanl
- **Location**: Hamburg, Germany
- **Languages**: German (native), English (advanced)
- **Core Stack**: Vue.js, TypeScript, Pinia, MVVM, Tailwind CSS, WebGL, Node.js, Python, C#, SQL, Docker, GitHub Actions, AWS (SQS, SNS, S3, IAM), Terraform, Playwright, Vitest, Cypress, Figma
- **Career**: Fachinformatiker Anwendungsentwicklung at EyeC GmbH (Mar 2023–Jul 2025, Berufsschulabschluss 1.2, IHK-Abschlussprojekt 92/100), Independent Software Engineer since Jul 2025

## Goals / Non-Goals

**Goals:**
- Fetch real projects from GitHub's public REST API (no auth token; unauthenticated, public repos only).
- Display top 5 repos sorted by most recently updated. Show a "See More" link to `https://github.com/Maurice-H` when the display limit is reached.
- Auto-detect tech-stack tags by querying each repo's `/languages` endpoint.
- Provide themed skeleton loaders during data fetching that match Finished/Blueprint states.
- Make contact actions functional: open external links (LinkedIn, Xing, GitHub) or copy identifiers (Discord, Email) to clipboard with toast feedback.
- Integrate `vue-i18n` for DE/EN locale switching with a UI toggle. Default locale: `de`.
- Replace all placeholder text with CV-sourced profile data, translated per locale.
- Show top 10 skills in the STACK tile with a "Show More" button to reveal the full list.
- Keep hardcoded projects as fallback if the GitHub API call fails.

**Non-Goals:**
- No authenticated GitHub API calls or PAT management.
- No LinkedIn API integration (requires OAuth partner program; blocked).
- No backend or serverless functions — all fetching happens client-side.
- No contact form backend submission (form stays decorative for now; email submission via Formspree already exists separately).
- No pagination for GitHub repos — display a fixed limit (top 5).
- No real-time data updates — fetch once on component mount.
- No SSR/SSG for i18n — client-side locale switching only.

## Decisions

### 1. vue-i18n for internationalization

**Decision**: Install `vue-i18n@latest` and configure it in `src/main.ts` with lazy-loaded locale JSON files in `src/locales/`.

**Rationale**: vue-i18n is the de-facto standard for Vue 3 i18n. It integrates natively with the Composition API via `useI18n()`. Locale files are JSON, easy to maintain, and support nested keys. The portfolio targets both German and English job markets, so a locale switcher is a practical feature, not a vanity one.

**Alternative considered**: Manual i18n via a reactive Pinia store + JSON lookup — rejected because vue-i18n provides interpolation, pluralization, date/number formatting, and tooling support out of the box.

### 2. Composable over Pinia Store for GitHub data

**Decision**: Use a standalone Vue composable `useGitHubProjects()` instead of a new Pinia store.

**Rationale**: The GitHub data is read-only, component-scoped (only `ProjectsSection.vue` consumes it), and doesn't need to be shared globally. Adding a Pinia store would violate the "Simplicity First" guideline. If multiple components later need this data, it can be promoted to a store without breaking changes.

### 3. Native `fetch` over Axios/ofetch

**Decision**: Use the browser's native `fetch` API.

**Rationale**: Zero new dependencies. The GitHub REST API returns simple JSON. Error handling is straightforward with `Response.ok` checks.

### 4. Skeleton Loader as a shared component

**Decision**: Create a single `SkeletonLoader.vue` in `src/components/shared/` that accepts shape/size props and adapts to the current theme via CSS variables.

**Rationale**: Skeleton loaders will be reused by any future async content. Theme-awareness is handled by reading `var(--finished-accent)` / `var(--color-blueprint-line)` for the shimmer gradient.

### 5. Toast via Vue `Teleport` to `<body>`

**Decision**: Create a `ToastNotification.vue` component teleported to `<body>`, managed by a lightweight composable `useToast()` that exposes `show(message, type)`.

**Rationale**: Teleporting avoids z-index stacking issues inside the bento grid. A composable keeps the API simple (no Pinia needed for ephemeral UI state). Auto-dismiss after ~3 seconds with a CSS transition.

### 6. Contact data externalized to `src/data/contacts.ts`

**Decision**: Define contact methods (type, label, value, url, action) in a static data file, consistent with the project convention of externalizing all static content to `src/data/`.

**Rationale**: Keeps `ContactForm.vue` template clean and data-driven. Each contact entry declares its `action` type (`link` | `copy`) so the component logic is a simple switch. GitHub, LinkedIn, and Xing are `link` actions; Discord and Email are `copy` actions.

### 7. GitHub API strategy: repos + languages in two steps

**Decision**: First fetch `/users/Maurice-H/repos?sort=updated&per_page=5`, then for each repo fetch `/repos/Maurice-H/{repo}/languages` in parallel. When the API returns repos at the configured limit (5), render a "See More" link pointing to `https://github.com/Maurice-H`.

**Rationale**: The repos endpoint doesn't include detailed language breakdown. Fetching languages separately is a well-documented pattern. Using `Promise.allSettled` ensures a single failed language call doesn't break the grid. Rate limit: 60 req/hr for unauthenticated — 6 calls total is well within budget.

### 8. Skills "Show More" pattern

**Decision**: Display the top 10 curated skills in the STACK tile by default. A "Show More" button (styled consistently with the terminal aesthetic) expands to reveal the complete list. The full list and sort order are defined in `src/data/portfolio.ts`, with the `top` count configurable.

**Rationale**: 10 skills gives a strong signal without overwhelming the card. The expansion pattern keeps the bento tile compact on first impression while allowing curious visitors to explore depth.

### 9. Locale Switcher UI placement

**Decision**: Place a minimal DE/EN toggle in the shortcut bar area (bottom of NAV phase), consistent with the existing keyboard shortcut display pattern. In CONTENT phase, place it in the footer or a fixed position.

**Rationale**: The shortcut bar already handles small utility controls (lighting toggle, theme toggle). A locale toggle fits the same pattern without requiring a new UI surface.

### 10. Static LinkedIn title, no API

**Decision**: Store the LinkedIn headline (`Frontend Engineer (Vue/TS) | UI/UX Architecture | Backend (Node/Python) & Cloud DevOps (AWS/Terraform)`) as a static i18n string in the locale files. Do not attempt to fetch it from LinkedIn's API.

**Rationale**: LinkedIn's API requires OAuth 2.0 and enterprise partner approval for profile data access. Scraping violates ToS and is unreliable. The headline changes rarely — a manual update in the locale file is sufficient and zero-risk.

## Risks / Trade-offs

- **GitHub API rate limiting (60 req/hr)** → Mitigation: Cache results in `sessionStorage` with a 5-minute TTL. Reloads within the same session don't re-fetch.
- **API unavailability** → Mitigation: Fall back to the hardcoded `PROJECTS` array from `src/data/portfolio.ts` and hide skeleton loaders.
- **Clipboard API requires HTTPS or localhost** → Mitigation: Wrap in try/catch; show a fallback toast "Copy failed — please copy manually" on insecure contexts.
- **Language detection may not reflect actual tech stack** → Mitigation: Allow a manual override map in `src/data/portfolio.ts` for repos where the primary language doesn't tell the full story.
- **vue-i18n bundle size** → Mitigation: Use tree-shakeable ESM import. The library adds ~15KB gzipped, acceptable for the feature value.
- **CSP update required** → Mitigation: Add `https://api.github.com` to `connect-src` in the Content-Security-Policy header in `index.html`.
- **i18n key maintenance** → Mitigation: Keep locale files flat and co-located. Use a consistent key naming convention (`section.element.property`).
