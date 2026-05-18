import { onMounted, ref } from 'vue';
import type { PortfolioProject } from '@/types';
import type { GitHubLanguages, GitHubRepo } from '@/types/github';

const GITHUB_USERNAME = 'Maurice-H';
const REPOS_LIMIT = 4;
const CACHE_KEY = 'gh-projects-cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  timestamp: number;
  projects: PortfolioProject[];
  hasMore: boolean;
}

function isCachedData(data: unknown): data is CachedData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.timestamp === 'number' &&
    typeof d.hasMore === 'boolean' &&
    Array.isArray(d.projects) &&
    d.projects.every(
      (p: unknown) =>
        p &&
        typeof p === 'object' &&
        typeof (p as Record<string, unknown>).id === 'string' &&
        typeof (p as Record<string, unknown>).title === 'string'
    )
  );
}

function getCachedData(): CachedData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;

    if (!isCachedData(parsed)) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }

    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed as CachedData;
  } catch {
    return null;
  }
}

function setCachedData(projects: PortfolioProject[], hasMore: boolean): void {
  const data: CachedData = { timestamp: Date.now(), projects, hasMore };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage full or unavailable — silently skip caching
  }
}

async function fetchLanguages(repoName: string): Promise<string[]> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/languages`);
  if (!res.ok) return [];
  const langs: GitHubLanguages = await res.json();
  return Object.entries(langs)
    .sort(([, a], [, b]) => b - a)
    .map(([name]) => name);
}

function mapRepoToProject(repo: GitHubRepo, languages: string[]): PortfolioProject {
  return {
    id: String(repo.id),
    title: repo.name,
    description: repo.description ?? '',
    tags: languages,
    imageUrl: '',
    repoUrl: repo.html_url,
    language: repo.language ?? undefined,
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
  };
}

export function useGitHubProjects() {
  const projects = ref<PortfolioProject[]>([]);
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const hasMore = ref(false);

  onMounted(async () => {
    // Check cache first
    const cached = getCachedData();
    if (cached) {
      projects.value = cached.projects;
      hasMore.value = cached.hasMore;
      isLoading.value = false;
      return;
    }

    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${REPOS_LIMIT}`
      );

      if (!res.ok) {
        throw new Error(`GitHub API responded with ${res.status}`);
      }

      const repos: GitHubRepo[] = await res.json();
      hasMore.value = repos.length >= REPOS_LIMIT;

      // Fetch languages for each repo in parallel
      const languageResults = await Promise.allSettled(
        repos.map((repo) => fetchLanguages(repo.name))
      );

      projects.value = repos.map((repo, i) => {
        const langResult = languageResults[i];
        const languages = langResult.status === 'fulfilled' ? langResult.value : [];
        return mapRepoToProject(repo, languages);
      });

      setCachedData(projects.value, hasMore.value);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch projects';
      // Fallback to empty array
      projects.value = [];
      hasMore.value = false;
    } finally {
      isLoading.value = false;
    }
  });

  return { projects, isLoading, error, hasMore };
}
