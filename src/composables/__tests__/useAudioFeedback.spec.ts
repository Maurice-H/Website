import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAudioFeedback } from '../useAudioFeedback';

describe('useAudioFeedback', () => {
  let OriginalAudio: typeof Audio;

  beforeEach(() => {
    OriginalAudio = globalThis.Audio;
  });

  afterEach(() => {
    globalThis.Audio = OriginalAudio;
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('initializes Audio with correct src, volume and preload', () => {
      const mockPlay = vi.fn().mockResolvedValue(undefined);

      const MockAudioClass = vi.fn().mockImplementation(function(this: any) {
        this.volume = 1;
        this.preload = '';
        this.currentTime = 0;
        this.play = mockPlay;
      });
      globalThis.Audio = MockAudioClass as unknown as typeof Audio;

      useAudioFeedback({ src: '/test.mp3', volume: 0.5 });

      expect(MockAudioClass).toHaveBeenCalledWith('/test.mp3');

      // Get the instance created to verify properties
      const instance = MockAudioClass.mock.instances[0];
      expect(instance.volume).toBe(0.5);
      expect(instance.preload).toBe('auto');
    });

    it('uses default volume of 0.3 if not provided', () => {
      const mockPlay = vi.fn().mockResolvedValue(undefined);

      const MockAudioClass = vi.fn().mockImplementation(function(this: any) {
        this.volume = 1;
        this.preload = '';
        this.currentTime = 0;
        this.play = mockPlay;
      });
      globalThis.Audio = MockAudioClass as unknown as typeof Audio;

      useAudioFeedback({ src: '/test.mp3' });

      const instance = MockAudioClass.mock.instances[0];
      expect(instance.volume).toBe(0.3);
    });

    it('handles Audio constructor failure gracefully', () => {
      // Simulate SSR or unsupported environment where Audio throws
      const MockAudioClass = vi.fn().mockImplementation(function(this: any) {
        throw new Error('Audio is not defined');
      });
      globalThis.Audio = MockAudioClass as unknown as typeof Audio;

      const { play } = useAudioFeedback({ src: '/test.mp3' });

      // Should not throw when calling play
      expect(() => play()).not.toThrow();
    });
  });

  describe('play()', () => {
    it('resets currentTime and calls play() on the audio element', () => {
      const mockPlay = vi.fn().mockResolvedValue(undefined);

      const MockAudioClass = vi.fn().mockImplementation(function(this: any) {
        this.volume = 1;
        this.preload = '';
        this.currentTime = 10;
        this.play = mockPlay;
      });
      globalThis.Audio = MockAudioClass as unknown as typeof Audio;

      const { play } = useAudioFeedback({ src: '/test.mp3' });

      play();

      const instance = MockAudioClass.mock.instances[0];
      expect(instance.currentTime).toBe(0);
      expect(mockPlay).toHaveBeenCalled();
    });

    it('silently catches play() promise rejections (e.g. autoplay policy)', async () => {
      const mockPlay = vi.fn().mockRejectedValue(new Error('NotAllowedError'));

      const MockAudioClass = vi.fn().mockImplementation(function(this: any) {
        this.volume = 1;
        this.preload = '';
        this.currentTime = 10;
        this.play = mockPlay;
      });
      globalThis.Audio = MockAudioClass as unknown as typeof Audio;

      const { play } = useAudioFeedback({ src: '/test.mp3' });

      // We need to verify that play() does not throw even though the underlying audio.play() rejects
      expect(() => play()).not.toThrow();

      // We should also wait a tick to make sure the unhandled promise rejection is swallowed
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });
});
