/**
 * Composable for centralized audio feedback with preloading,
 * volume control, and graceful failure handling.
 */
export function useAudioFeedback(options) {
    const { src, volume = 0.3 } = options;
    let audio = null;
    // Preload audio on creation (avoids fetch latency on first click)
    try {
        audio = new Audio(src);
        audio.volume = volume;
        audio.preload = 'auto';
    }
    catch {
        // Audio construction failed (e.g., SSR or unsupported environment)
        audio = null;
    }
    function play() {
        if (!audio)
            return;
        // Reset to start if currently playing
        audio.currentTime = 0;
        audio.play().catch(() => {
            // Silently swallow autoplay policy errors
        });
    }
    return { play };
}
