import { ref } from 'vue';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import { envConfig } from '@/utils/env';

const isMuted = ref(false);

// Cache for audio instances
const audioCache: Record<string, HTMLAudioElement[]> = {};
const POOL_SIZE = 3; // Allow overlapping sounds by keeping a small pool

function getAudioFromPool(path: string, volume: number = 1.0): HTMLAudioElement | null {
  // Respect performance mode or explicit mute
  if (isMuted.value) return null;
  const perfStore = usePerformanceStore();
  if (perfStore.isCiMode) return null; // No audio in CI

  if (!audioCache[path]) {
    audioCache[path] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audioCache[path].push(audio);
    }
  }

  // Find a free audio element in the pool
  const pool = audioCache[path];
  let audio = pool.find((a) => a.paused || a.currentTime === 0 || a.ended);

  // If all are playing, reuse the oldest one
  if (!audio) {
    audio = pool[0];
    audio.pause();
    audio.currentTime = 0;
  }

  audio.volume = volume;
  return audio;
}

export function useAudio() {
  const toggleMute = () => {
    isMuted.value = !isMuted.value;
  };

  const playClick = () => {
    const audio = getAudioFromPool(`${envConfig.BASE_URL}audio/sci-fi-light-click.ogg`, 0.05);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.warn('Audio play failed:', e));
    }
  };

  const playGlitch = () => {
    const audio = getAudioFromPool(
      `${envConfig.BASE_URL}audio/sci-fi-theme-glitch-click.ogg`,
      0.05
    );
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.warn('Audio play failed:', e));
    }
  };

  const playSwoosh = () => {
    const audio = getAudioFromPool(`${envConfig.BASE_URL}audio/sci-fi-swoosh.ogg`, 0.05);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.warn('Audio play failed:', e));
    }
  };

  return {
    isMuted,
    toggleMute,
    playClick,
    playGlitch,
    playSwoosh,
  };
}
