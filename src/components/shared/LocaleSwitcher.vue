<template>
  <button
    type="button"
    class="locale-switcher"
    data-testid="locale-switcher"
    :title="locale === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'"
    :aria-label="locale === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'"
    @click="toggleLocale"
  >
    <span class="locale-option" :class="{ 'locale-option--active': locale === 'de' }">DE</span>
    <span class="locale-divider">/</span>
    <span class="locale-option" :class="{ 'locale-option--active': locale === 'en' }">EN</span>
  </button>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();

const toggleLocale = () => {
  locale.value = locale.value === 'de' ? 'en' : 'de';
};

watch(
  locale,
  (newLocale) => {
    document.documentElement.lang = newLocale;
    document.title = t('meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t('meta.description'));
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.locale-switcher {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  background: color-mix(in srgb, var(--finished-accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--finished-accent) 20%, transparent);
  border-radius: 3px;
  padding: 2px 6px;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.locale-switcher:hover {
  opacity: 1;
  border-color: color-mix(in srgb, var(--finished-accent) 40%, transparent);
  background: color-mix(in srgb, var(--finished-accent) 15%, transparent);
}

.locale-option {
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.2s ease;
}

.locale-option--active {
  color: var(--finished-accent);
  font-weight: 700;
}

.locale-divider {
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.15);
}
</style>
