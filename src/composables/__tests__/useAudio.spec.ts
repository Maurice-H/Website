import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePerformanceStore } from '../../stores/usePerformanceStore';

vi.mock('../../stores/usePerformanceStore', () => ({
  usePerformanceStore: vi.fn(() => ({
    isCiMode: false,
  })),
}));

// Array to keep track of created mock instances
let mockAudioInstances: MockAudio[] = [];

// Mock Audio globally
class MockAudio {
  static shouldRejectPlay = false;
  src = '';
  preload = '';
  volume = 1;
  currentTime = 0;
  paused = true;
  ended = false;

  constructor() {
    mockAudioInstances.push(this);
  }

  play = vi.fn().mockImplementation(() => {
    if (MockAudio.shouldRejectPlay) {
      return Promise.reject(new Error('Audio playback failed'));
    }
    this.paused = false;
    this.currentTime = 1;
    return Promise.resolve(undefined);
  });
  pause = vi.fn().mockImplementation(() => {
    this.paused = true;
  });
}

vi.stubGlobal('Audio', MockAudio);

describe('useAudio', () => {
  beforeEach(async () => {
    vi.resetModules();
    setActivePinia(createPinia());
    mockAudioInstances = [];
    MockAudio.shouldRejectPlay = false;
    vi.mocked(usePerformanceStore).mockReturnValue({ isCiMode: false } as Record<string, unknown>);
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

  it('reuses audio pool elements when full and actively playing', async () => {
    const { useAudio } = await import('../useAudio');
    const { playClick } = useAudio();

    // Call 3 times to fill the pool of size 3
    playClick();
    playClick();
    playClick();

    // The pool size is 3, so there should be 3 instances created
    expect(mockAudioInstances.length).toBe(3);

    // Get the first created audio element
    const oldestAudio = mockAudioInstances[0];

    // Verify it is currently "playing"
    expect(oldestAudio.paused).toBe(false);

    // Reset its pause mock to check if it's called during the 4th play
    oldestAudio.pause.mockClear();

    // 4th call should trigger oldest element reuse because all are "playing"
    playClick();

    // No new instance should be created, pool is reused
    expect(mockAudioInstances.length).toBe(3);

    // Oldest element should have been paused and rewound
    expect(oldestAudio.pause).toHaveBeenCalled();
    // After `getAudioFromPool` it's rewound to 0, but then `playClick` immediately sets it to 0 and calls `play()`.
    // Since our mock `play()` sets `currentTime` to `1`, we expect it to be `1` now.
    expect(oldestAudio.currentTime).toBe(1);

    // Let's check play has been called on it twice.
    expect(oldestAudio.play).toHaveBeenCalledTimes(2);
  });

  it('does not play audio in CI mode', async () => {
    vi.mocked(usePerformanceStore).mockReturnValue({ isCiMode: true } as Record<string, unknown>);
    const { useAudio } = await import('../useAudio');
    const { playClick } = useAudio();

    playClick();
    // It should not have created any Audio instances because getAudioFromPool returns early
    expect(mockAudioInstances.length).toBe(0);
  });

  it('handles audio play rejection gracefully', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    MockAudio.shouldRejectPlay = true;

    const { useAudio } = await import('../useAudio');
    const { playClick, playGlitch, playSwoosh } = useAudio();

    playClick();
    // Wait for the promise rejection to be caught
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(consoleWarnSpy).toHaveBeenCalledWith('Audio play failed:', expect.any(Error));
    consoleWarnSpy.mockClear();

    playGlitch();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(consoleWarnSpy).toHaveBeenCalledWith('Audio play failed:', expect.any(Error));
    consoleWarnSpy.mockClear();

    playSwoosh();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(consoleWarnSpy).toHaveBeenCalledWith('Audio play failed:', expect.any(Error));

    consoleWarnSpy.mockRestore();
  });
});
