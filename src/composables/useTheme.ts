import { ref } from 'vue';

const isBlueprint = ref(false);

// Initialize synchronously so it's ready before components mount
if (typeof window !== 'undefined') {
  // Load initial state if needed or just sync with attribute
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'blueprint') {
    isBlueprint.value = true;
  }
}

export function useTheme() {
  const toggleTheme = () => {
    isBlueprint.value = !isBlueprint.value;

    // Imperatively update the DOM to guarantee it takes effect
    if (isBlueprint.value) {
      document.documentElement.setAttribute('data-theme', 'blueprint');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return {
    isBlueprint,
    toggleTheme,
  };
}
