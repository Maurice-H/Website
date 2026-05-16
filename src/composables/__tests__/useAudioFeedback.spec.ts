import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAudioFeedback } from '../useAudioFeedback';

describe('useAudioFeedback', () => {
  let mockPlay: ReturnType<typeof vi.fn>;
  let createdAudioInstance: Record<string, unknown>;

  beforeEach(() => {
    mockPlay = vi.fn().mockImplementation(function (this: Record<string, unknown>) {
      this.paused = false;
      return Promise.resolve();
    });

    vi.stubGlobal(
      'Audio',
      vi.fn().mockImplementation(function (this: Record<string, unknown>, src: string) {
        this.src = src;
        this.volume = 1;
        this.preload = '';
        this.currentTime = 10;
        this.paused = true;
        this.play = mockPlay;
        createdAudioInstance = this;
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    createdAudioInstance = {};
  });

  it('initializes Audio with correct src and default options', () => {
    useAudioFeedback({ src: '/test-audio.mp3' });

    expect(globalThis.Audio).toHaveBeenCalledWith('/test-audio.mp3');
    expect(createdAudioInstance.volume).toBe(0.3); // default volume
    expect(createdAudioInstance.preload).toBe('auto');
  });

  it('respects custom volume', () => {
    useAudioFeedback({ src: '/test-audio.mp3', volume: 0.8 });

    expect(createdAudioInstance.volume).toBe(0.8);
  });

  it('play() resets currentTime and calls audio.play()', () => {
    const { play } = useAudioFeedback({ src: '/test-audio.mp3' });

    expect(createdAudioInstance.currentTime).toBe(10);
    play();

    expect(createdAudioInstance.currentTime).toBe(0);
    expect(mockPlay).toHaveBeenCalled();
    expect(createdAudioInstance.paused).toBe(false);
  });

  it('swallows play() promise rejections silently', async () => {
    mockPlay.mockImplementation(function (this: Record<string, unknown>) {
      return Promise.reject(new Error('Autoplay blocked'));
    });

    const { play } = useAudioFeedback({ src: '/test-audio.mp3' });

    // Should not throw
    expect(() => play()).not.toThrow();
  });

  it('handles Audio construction errors gracefully', () => {
    vi.stubGlobal(
      'Audio',
      vi.fn().mockImplementation(function (this: Record<string, unknown>) {
        throw new Error('Not supported');
      })
    );

    const { play } = useAudioFeedback({ src: '/test-audio.mp3' });

    // Should fail silently and play should do nothing
    expect(() => play()).not.toThrow();
  });
});
