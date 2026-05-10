import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAudioFeedback } from '../useAudioFeedback';

describe('useAudioFeedback', () => {
  let originalAudio: typeof window.Audio;

  beforeEach(() => {
    originalAudio = window.Audio;
  });

  afterEach(() => {
    window.Audio = originalAudio;
    vi.restoreAllMocks();
  });

  it('initializes audio with default volume', () => {
    let capturedSrc: string | undefined;
    const mockAudioInstance: any = {
      play: vi.fn().mockResolvedValue(undefined),
      volume: 1,
      preload: '',
      currentTime: 10,
    };

    // Create a mock Audio class
    window.Audio = vi.fn().mockImplementation(function(this: any, src?: string) {
      capturedSrc = src;
      return mockAudioInstance;
    }) as any;

    const { play } = useAudioFeedback({ src: 'test.mp3' });

    expect(window.Audio).toHaveBeenCalledWith('test.mp3');
    expect(capturedSrc).toBe('test.mp3');
    expect(mockAudioInstance.volume).toBe(0.3);
    expect(mockAudioInstance.preload).toBe('auto');
  });

  it('initializes audio with custom volume', () => {
    const mockAudioInstance: any = {
      play: vi.fn().mockResolvedValue(undefined),
      volume: 1,
      preload: '',
      currentTime: 10,
    };

    window.Audio = vi.fn().mockImplementation(function() {
      return mockAudioInstance;
    }) as any;

    const { play } = useAudioFeedback({ src: 'test.mp3', volume: 0.8 });

    expect(mockAudioInstance.volume).toBe(0.8);
  });

  it('resets currentTime and calls play when play() is invoked', () => {
    const mockAudioInstance: any = {
      play: vi.fn().mockResolvedValue(undefined),
      volume: 1,
      preload: '',
      currentTime: 10,
    };

    window.Audio = vi.fn().mockImplementation(function() {
      return mockAudioInstance;
    }) as any;

    const { play } = useAudioFeedback({ src: 'test.mp3' });

    play();

    expect(mockAudioInstance.currentTime).toBe(0);
    expect(mockAudioInstance.play).toHaveBeenCalledTimes(1);
  });

  it('gracefully handles play() promise rejection (e.g. browser autoplay policy)', async () => {
    const mockAudioInstance: any = {
      play: vi.fn().mockRejectedValueOnce(new Error('Autoplay prevented')),
      volume: 1,
      preload: '',
      currentTime: 10,
    };

    window.Audio = vi.fn().mockImplementation(function() {
      return mockAudioInstance;
    }) as any;

    const { play } = useAudioFeedback({ src: 'test.mp3' });

    // Should not throw
    expect(() => play()).not.toThrow();

    // We need to wait a tick for the microtask to process the catch block
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  it('handles Audio constructor failing (e.g. SSR environment)', () => {
    window.Audio = vi.fn().mockImplementation(function() {
      throw new Error('Audio is not defined');
    }) as any;

    const { play } = useAudioFeedback({ src: 'test.mp3' });

    // Construction failed, so play should just return early and not throw
    expect(() => play()).not.toThrow();
  });
});
