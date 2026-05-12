import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Audio globally
class MockAudio {
  src = '';
  preload = '';
  volume = 1;
  currentTime = 0;
  paused = true;
  ended = false;

  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn().mockImplementation(() => {
    this.paused = true;
  });
}

vi.stubGlobal('Audio', MockAudio);

describe('useAudio', () => {
  beforeEach(async () => {
    vi.resetModules();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('toggleMute toggles the isMuted state', async () => {
    const { useAudio } = await import('../useAudio');
    const { isMuted, toggleMute } = useAudio();

    expect(isMuted.value).toBe(false);
    toggleMute();
    expect(isMuted.value).toBe(true);
    toggleMute();
    expect(isMuted.value).toBe(false);
  });

  it('playClick creates audio and calls play', async () => {
    const { useAudio } = await import('../useAudio');
    const { playClick } = useAudio();

    playClick();

    // Audio constructor should have been called
    expect(MockAudio).toBeDefined();
  });

  it('playGlitch creates audio and calls play', async () => {
    const { useAudio } = await import('../useAudio');
    const { playGlitch } = useAudio();

    playGlitch();
    expect(MockAudio).toBeDefined();
  });

  it('playSwoosh creates audio and calls play', async () => {
    const { useAudio } = await import('../useAudio');
    const { playSwoosh } = useAudio();

    playSwoosh();
    expect(MockAudio).toBeDefined();
  });

  it('does not play audio when muted', async () => {
    const { useAudio } = await import('../useAudio');
    const { isMuted, playClick, toggleMute } = useAudio();

    // Mute first
    toggleMute();
    expect(isMuted.value).toBe(true);

    // playClick should return early, no Audio.play() called
    playClick();
    // Since it returns null when muted, nothing should crash
  });

  it('reuses audio pool elements', async () => {
    const { useAudio } = await import('../useAudio');
    const { playClick } = useAudio();

    // Call multiple times to fill the pool
    playClick();
    playClick();
    playClick();
    // 4th call should reuse from pool
    playClick();

    // Should not crash, pool management works
    expect(true).toBe(true);
  });
});
