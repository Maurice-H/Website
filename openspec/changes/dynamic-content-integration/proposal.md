## Why

The portfolio currently renders hardcoded placeholder projects ("Neon E-Commerce", "FlowState Dashboard") and displays "Hi. I'm Alex" instead of the owner's actual name. Contact buttons lack functional actions, and there are no loading states for any asynchronous data. This change replaces static dummy content with real, dynamic data and smart interactions — making the portfolio a living showcase instead of a template.

## What Changes

- **Dynamic GitHub Projects**: Replace the hardcoded `PROJECTS` array in `src/data/portfolio.ts` with a composable that fetches the user's public repositories from the GitHub REST API at runtime. Analyze each repo's languages to auto-generate tech-stack tags. Fallback/static projects support manually defined tech-stack tags. When the display limit (e.g., 6 repos) is reached, show a "See More" link that navigates to the user's GitHub profile.
- **Smart Contact Actions**: Transform contact buttons into functional elements — external profiles (GitHub, LinkedIn, Xing) open in new tabs; identifiers (Discord username, email) copy to clipboard with a success toast notification.
- **Placeholder Text Update**: Replace all "Alex" references with "Maurice" (hero section, meta tags, `<title>`, and any other global placeholders).
- **Skeleton Loaders**: Add themed skeleton placeholders for the projects section (and any other async data) that render while API calls are in-flight.

## Capabilities

### New Capabilities
- `github-data-fetcher`: Composable for fetching and transforming GitHub API data (repos, languages) into the existing `PortfolioProject` interface.
- `smart-contact-actions`: Clipboard copy, external link routing, and toast notification system for the contact section.
- `skeleton-loaders`: Reusable skeleton placeholder components that respect the current theme (Finished/Blueprint).

### Modified Capabilities
- `portfolio-content`: Requirements change from static-only rendering to supporting async data sources with loading/error states. Contact layout gains functional actions beyond form submission.

## Impact

- **Types**: `PortfolioProject` interface gains optional fields (`repoUrl`, `language`, `stars`) from GitHub API data.
- **Data Layer**: `src/data/portfolio.ts` static exports remain as fallback; a new `useGitHubProjects` composable becomes the primary data source.
- **Components**: `ProjectsSection.vue` gains loading/error states. `ContactForm.vue` is refactored to include action buttons. `HeroSection.vue` text updated.
- **New Files**: Toast component (`ToastNotification.vue`), skeleton component (`SkeletonLoader.vue`), GitHub composable (`useGitHubProjects.ts`), contact data file.
- **Dependencies**: No new npm packages — uses native `fetch`, `navigator.clipboard`, and Vue's `Teleport` for toasts.
- **SEO**: `<title>` and `<meta>` tags updated from placeholder to "Maurice".
