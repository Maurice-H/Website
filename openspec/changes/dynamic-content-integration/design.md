## Context

The portfolio renders two hardcoded placeholder projects and uses "Alex" throughout. The contact form submits to nothing. There are no loading states. The `PortfolioProject` interface exists with `id`, `title`, `description`, `tags`, `imageUrl`, and optional `link`/`repoUrl` fields. Projects are imported directly from `src/data/portfolio.ts` as a static array. The `ContactForm.vue` is a standard HTML form without functional actions for external profiles.

## Goals / Non-Goals

**Goals:**
- Fetch real projects from GitHub's public REST API (no auth token required for public repos).
- Auto-detect tech-stack tags by querying each repo's `/languages` endpoint.
- Provide themed skeleton loaders during data fetching that match Finished/Blueprint states.
- Make contact actions functional: open external links (LinkedIn, Xing) or copy identifiers (Discord, Email) to clipboard with toast feedback.
- Replace all "Alex" placeholder text with "Maurice".
- Keep hardcoded projects as a fallback if the API call fails.

**Non-Goals:**
- No authenticated GitHub API calls or PAT management.
- No backend/serverless functions — all fetching happens client-side.
- No contact form backend submission (form stays decorative for now).
- No pagination for GitHub repos — display a fixed limit (e.g., top 6 by stars/update date).
- No real-time data updates — fetch once on mount.

## Decisions

### 1. Composable over Pinia Store for GitHub data

**Decision**: Use a standalone Vue composable `useGitHubProjects()` instead of a new Pinia store.

**Rationale**: The GitHub data is read-only, component-scoped (only `ProjectsSection.vue` consumes it), and doesn't need to be shared globally. Adding a Pinia store would violate the "Simplicity First" guideline. If multiple components later need this data, it can be promoted to a store without breaking changes.

**Alternative considered**: Pinia store — rejected because it adds boilerplate for a single-consumer pattern.

### 2. Native `fetch` over Axios/ofetch

**Decision**: Use the browser's native `fetch` API.

**Rationale**: Zero new dependencies. The GitHub REST API returns simple JSON. Error handling is straightforward with `Response.ok` checks. Aligns with "No unrequested features" guideline.

### 3. Skeleton Loader as a shared component

**Decision**: Create a single `SkeletonLoader.vue` in `src/components/shared/` that accepts shape/size props and adapts to the current theme via CSS variables.

**Rationale**: Skeleton loaders will be reused by any future async content (skills, certifications, etc.). Theme-awareness is handled by reading `var(--finished-accent)` / `var(--color-blueprint-line)` for the shimmer gradient — no conditional class logic needed.

### 4. Toast via Vue `Teleport` to `<body>`

**Decision**: Create a `ToastNotification.vue` component teleported to `<body>`, managed by a lightweight composable `useToast()` that exposes `show(message, type)`.

**Rationale**: Teleporting avoids z-index stacking issues inside the bento grid. A composable keeps the API simple (no Pinia needed for ephemeral UI state). Auto-dismiss after ~3 seconds with a CSS transition.

**Alternative considered**: Third-party toast library — rejected per "No new npm packages" constraint.

### 5. Contact data externalized to `src/data/contacts.ts`

**Decision**: Define contact methods (type, label, value, url) in a static data file, consistent with the project bridge convention of externalizing all static content to `src/data/`.

**Rationale**: Keeps `ContactForm.vue` template clean and data-driven. Each contact entry declares its `action` type (`link` | `copy`) so the component logic is a simple switch. GitHub, LinkedIn, and Xing are `link` actions; Discord and Email are `copy` actions.

### 6. GitHub API strategy: repos + languages in two steps

**Decision**: First fetch `/users/{username}/repos?sort=updated&per_page=6`, then for each repo fetch `/repos/{owner}/{repo}/languages` in parallel. When the API returns repos at the configured limit, render a themed "See More" link pointing to `https://github.com/{username}`.

**Rationale**: The repos endpoint doesn't include detailed language breakdown. Fetching languages separately is a well-documented pattern. Using `Promise.allSettled` ensures a single failed language call doesn't break the entire grid. Rate limit: 60 req/hr for unauthenticated — 7 calls total is well within budget. The "See More" link signals to the visitor that additional work exists beyond the displayed set.

Fallback/static projects in `src/data/portfolio.ts` support a manually defined `tags` array so that tech-stack labels are always available, even when the API is unreachable.

## Risks / Trade-offs

- **GitHub API rate limiting (60 req/hr)** → Mitigation: Cache results in `sessionStorage` with a 5-minute TTL. Reloads within the same session don't re-fetch.
- **API unavailability** → Mitigation: Fall back to the hardcoded `PROJECTS` array from `src/data/portfolio.ts` and hide skeleton loaders.
- **Clipboard API requires HTTPS or localhost** → Mitigation: Wrap in try/catch; show a fallback toast "Copy failed — please copy manually" on insecure contexts.
- **Language detection may not reflect actual tech stack** → Mitigation: Supplement with a manual override map in `src/data/portfolio.ts` for repos where the primary language doesn't tell the full story.
