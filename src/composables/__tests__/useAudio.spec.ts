import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Audio class
const mockPlay = vi.fn().mockResolvedValue(undefined);
const mockPause = vi.fn();

class MockAudio {
  play = mockPlay;
  pause = mockPause;
  currentTime = 0;
  volume = 1;
  preload = 'auto';
  paused = true;
  ended = false;
  src: string;
  constructor(src: string) {
    this.src = src;
  }
}

vi.stubGlobal('Audio', MockAudio);

describe('useAudio', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetModules();
    vi.clearAllMocks();
    mockPlay.mockResolvedValue(undefined);

    // Mock import.meta.env.BASE_URL if needed,
    // but usually vitest handles this or it defaults to /
  });

  it('should initialize with isMuted = false', async () => {
    const { useAudio } = await import('../useAudio');
    const { isMuted } = useAudio();
    expect(isMuted.value).toBe(false);
  });

  it('should toggle mute state', async () => {
    const { useAudio } = await import('../useAudio');
    const { isMuted, toggleMute } = useAudio();

    toggleMute();
    expect(isMuted.value).toBe(true);

    toggleMute();
    expect(isMuted.value).toBe(false);
  });

  it('should play audio when not muted and not in CI mode', async () => {
    const { usePerformanceStore } = await import('../../stores/usePerformanceStore');
    const perfStore = usePerformanceStore();
    vi.spyOn(perfStore, 'isCiMode', 'get').mockReturnValue(false);

    const { useAudio } = await import('../useAudio');
    const { playClick } = useAudio();

    playClick();

    expect(mockPlay).toHaveBeenCalled();
  });

  it('should NOT play audio when muted', async () => {
    const { usePerformanceStore } = await import('../../stores/usePerformanceStore');
    const perfStore = usePerformanceStore();
    vi.spyOn(perfStore, 'isCiMode', 'get').mockReturnValue(false);

    const { useAudio } = await import('../useAudio');
    const { playClick, toggleMute } = useAudio();

    toggleMute(); // Mute
    playClick();

    expect(mockPlay).not.toHaveBeenCalled();
  });

  it('should NOT play audio when in CI mode', async () => {
    const { usePerformanceStore } = await import('../../stores/usePerformanceStore');
    const perfStore = usePerformanceStore();
    vi.spyOn(perfStore, 'isCiMode', 'get').mockReturnValue(true);

    const { useAudio } = await import('../useAudio');
    const { playClick } = useAudio();

    playClick();

    expect(mockPlay).not.toHaveBeenCalled();
  });

  it('should handle play errors gracefully', async () => {
    const { usePerformanceStore } = await import('../../stores/usePerformanceStore');
    const perfStore = usePerformanceStore();
    vi.spyOn(perfStore, 'isCiMode', 'get').mockReturnValue(false);

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockPlay.mockRejectedValue(new Error('AbortError'));

    const { useAudio } = await import('../useAudio');
    const { playClick } = useAudio();

    playClick();

    expect(mockPlay).toHaveBeenCalled();
    // Wait for the promise rejection to be handled
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(consoleSpy).toHaveBeenCalledWith('Audio play failed:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should reuse audio elements from pool', async () => {
    const { usePerformanceStore } = await import('../../stores/usePerformanceStore');
    const perfStore = usePerformanceStore();
    vi.spyOn(perfStore, 'isCiMode', 'get').mockReturnValue(false);

    // Reset modules to ensure pool is empty
    vi.resetModules();

    const audioConstructorSpy = vi.spyOn(globalThis, 'Audio');

    const { useAudio } = await import('../useAudio');
    const { playClick } = useAudio();

    playClick();
    expect(audioConstructorSpy).toHaveBeenCalledTimes(3); // POOL_SIZE

    playClick();
    expect(audioConstructorSpy).toHaveBeenCalledTimes(3); // Should not create more for the same path
  });

  it('should play different sounds', async () => {
    const { usePerformanceStore } = await import('../../stores/usePerformanceStore');
    const perfStore = usePerformanceStore();
    vi.spyOn(perfStore, 'isCiMode', 'get').mockReturnValue(false);

    const { useAudio } = await import('../useAudio');
    const { playGlitch, playSwoosh } = useAudio();

    playGlitch();
    expect(mockPlay).toHaveBeenCalledTimes(1);

    playSwoosh();
    expect(mockPlay).toHaveBeenCalledTimes(2);
  });
});
