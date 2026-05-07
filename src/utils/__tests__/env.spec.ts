import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('env.ts', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should parse true correctly', async () => {
    vi.stubEnv('VITE_CI_MODE', 'true');
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-key');
    vi.stubEnv('VITE_FORMSPREE_ID', 'test-id');
    const { envConfig } = await import('../env');
    expect(envConfig.isCiMode).toBe(true);
    expect(envConfig.VITE_TURNSTILE_SITE_KEY).toBe('test-key');
    expect(envConfig.VITE_FORMSPREE_ID).toBe('test-id');
    vi.unstubAllEnvs();
  });

  it('should parse false correctly', async () => {
    vi.stubEnv('VITE_CI_MODE', 'false');
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-key');
    vi.stubEnv('VITE_FORMSPREE_ID', 'test-id');
    const { envConfig } = await import('../env');
    expect(envConfig.isCiMode).toBe(false);
    vi.unstubAllEnvs();
  });

  it('should warn on invalid value', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubEnv('VITE_CI_MODE', 'invalid');
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-key');
    vi.stubEnv('VITE_FORMSPREE_ID', 'test-id');
    const { envConfig } = await import('../env');
    expect(envConfig.isCiMode).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      "[Env] VITE_CI_MODE is set to an unexpected value: invalid. Expected 'true' or 'false'."
    );
    warnSpy.mockRestore();
    vi.unstubAllEnvs();
  });
});
