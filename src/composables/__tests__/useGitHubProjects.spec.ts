import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

/** Mount a tiny app that calls useGitHubProjects inside setup() so onMounted fires. */
async function mountWithComposable() {
  const { createApp, defineComponent } = await import('vue');
  const { createPinia } = await import('pinia');
  const { useGitHubProjects } = await import('../useGitHubProjects');

  let result: ReturnType<typeof useGitHubProjects> | undefined;

  const App = defineComponent({
    setup() {
      result = useGitHubProjects();
      return {};
    },
    render() {
      return null;
    },
  });

  const app = createApp(App);
  app.use(createPinia());
  const div = document.createElement('div');
  app.mount(div);
  await flushPromises();

  if (!result) throw new Error('useGitHubProjects did not initialise');
  return { result, app };
}

describe('useGitHubProjects', () => {
  beforeEach(() => {
    vi.resetModules();
    sessionStorageMock.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches repos and languages on mount (no cache)', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'test-repo',
        full_name: 'Maurice-H/test-repo',
        description: 'A test repo',
        html_url: 'https://github.com/Maurice-H/test-repo',
        stargazers_count: 5,
        updated_at: '2026-01-01T00:00:00Z',
        language: 'TypeScript',
        fork: false,
        archived: false,
      },
    ];

    const mockLanguages = { TypeScript: 5000, JavaScript: 2000 };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/repos?')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockRepos),
          });
        }
        if (url.includes('/languages')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockLanguages),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      })
    );

    const { result, app } = await mountWithComposable();

    expect(result.projects.value).toHaveLength(1);
    expect(result.projects.value[0].title).toBe('test-repo');
    expect(result.projects.value[0].tags).toEqual(['TypeScript', 'JavaScript']);
    expect(result.isLoading.value).toBe(false);
    expect(result.error.value).toBeNull();
    expect(result.hasMore.value).toBe(false);

    app.unmount();
    vi.unstubAllGlobals();
  });

  it('returns cached data if cache is valid', async () => {
    const cachedProjects = [
      {
        id: '1',
        title: 'cached-repo',
        description: 'cached',
        tags: ['JS'],
        imageUrl: '',
        repoUrl: 'https://github.com/test',
        language: 'JavaScript',
        stars: 10,
        updatedAt: '2026-01-01',
      },
    ];

    sessionStorageMock.setItem(
      'gh-projects-cache',
      JSON.stringify({
        timestamp: Date.now(),
        projects: cachedProjects,
        hasMore: true,
      })
    );

    vi.stubGlobal('fetch', vi.fn());

    const { result, app } = await mountWithComposable();

    expect(result.projects.value).toHaveLength(1);
    expect(result.projects.value[0].title).toBe('cached-repo');
    expect(result.isLoading.value).toBe(false);
    expect(result.hasMore.value).toBe(true);
    expect(fetch).not.toHaveBeenCalled();

    app.unmount();
    vi.unstubAllGlobals();
  });

  it('ignores expired cache and fetches fresh data', async () => {
    sessionStorageMock.setItem(
      'gh-projects-cache',
      JSON.stringify({
        timestamp: Date.now() - 10 * 60 * 1000,
        projects: [],
        hasMore: false,
      })
    );

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/repos?')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    const { result, app } = await mountWithComposable();

    expect(fetch).toHaveBeenCalled();
    expect(result.isLoading.value).toBe(false);

    app.unmount();
    vi.unstubAllGlobals();
  });

  it('handles API error gracefully', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
      })
    );

    const { result, app } = await mountWithComposable();

    expect(result.error.value).toContain('403');
    expect(result.projects.value).toEqual([]);
    expect(result.hasMore.value).toBe(false);
    expect(result.isLoading.value).toBe(false);

    app.unmount();
    vi.unstubAllGlobals();
  });

  it('handles network error gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')));

    const { result, app } = await mountWithComposable();

    expect(result.error.value).toBe('Network failure');
    expect(result.projects.value).toEqual([]);
    expect(result.isLoading.value).toBe(false);

    app.unmount();
    vi.unstubAllGlobals();
  });

  it('handles failed language fetch via allSettled', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'repo-1',
        full_name: 'Maurice-H/repo-1',
        description: null,
        html_url: 'https://github.com/Maurice-H/repo-1',
        stargazers_count: 0,
        updated_at: '2026-01-01T00:00:00Z',
        language: null,
        fork: false,
        archived: false,
      },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/repos?')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockRepos),
          });
        }
        if (url.includes('/languages')) {
          return Promise.resolve({
            ok: false,
            status: 404,
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      })
    );

    const { result, app } = await mountWithComposable();

    expect(result.projects.value).toHaveLength(1);
    expect(result.projects.value[0].tags).toEqual([]);
    expect(result.error.value).toBeNull();

    app.unmount();
    vi.unstubAllGlobals();
  });

  it('sets hasMore to true when repos count equals limit', async () => {
    const mockRepos = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `repo-${i}`,
      full_name: `Maurice-H/repo-${i}`,
      description: `Repo ${i}`,
      html_url: `https://github.com/Maurice-H/repo-${i}`,
      stargazers_count: i,
      updated_at: '2026-01-01T00:00:00Z',
      language: 'TypeScript',
      fork: false,
      archived: false,
    }));

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/repos?')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockRepos),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ TypeScript: 1000 }),
        });
      })
    );

    const { result, app } = await mountWithComposable();

    expect(result.hasMore.value).toBe(true);
    expect(result.projects.value).toHaveLength(5);

    app.unmount();
    vi.unstubAllGlobals();
  });

  it('handles corrupt cached JSON gracefully', async () => {
    sessionStorageMock.setItem('gh-projects-cache', '{invalid json!!!');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/repos?')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    const { result, app } = await mountWithComposable();

    expect(fetch).toHaveBeenCalled();
    expect(result.isLoading.value).toBe(false);

    app.unmount();
    vi.unstubAllGlobals();
  });
});
