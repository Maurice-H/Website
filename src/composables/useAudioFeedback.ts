/**
 * Composable for centralized audio feedback with preloading,
 * volume control, and graceful failure handling.
 */

interface AudioFeedbackOptions {
  /** Path to the audio file (relative to public/) */
  src: string;
  /** Playback volume (0-1), defaults to 0.3 */
  volume?: number;
}

interface AudioFeedback {
  /** Play the preloaded audio. Silently fails if blocked by browser policy. */
  play: () => void;
}

export function useAudioFeedback(options: AudioFeedbackOptions): AudioFeedback {
  const { src, volume = 0.3 } = options;
  let audio: HTMLAudioElement | null = null;

  // Preload audio on creation (avoids fetch latency on first click)
  try {
    audio = new Audio(src);
    audio.volume = volume;
    audio.preload = 'auto';
  } catch {
    // Audio construction failed (e.g., SSR or unsupported environment)
    audio = null;
  }

  function play(): void {
    if (!audio) return;

    // Reset to start if currently playing
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Silently swallow autoplay policy errors
    });
  }

  return { play };
}
