<template>
  <!-- About Tile (Discovery Path) -->
  <BentoCard
    id="about-discovery"
    data-testid="discovery-card"
    class="md:col-span-2 md:row-span-1"
    with-window
    :title="$t('skills.discoveryPath')"
    :is-low-end="performance.isLowEnd"
  >
    <div class="p-4 md:p-6 flex flex-col">
      <p
        class="whitespace-pre-wrap text-finished-text/50 text-sm md:text-base leading-relaxed max-w-2xl transition-colors duration-[var(--theme-transition-duration)]"
      >
        {{ $t("skills.bio") }}
      </p>
    </div>
  </BentoCard>

  <!-- Skills Tile (STACK) -->
  <BentoCard
    id="skills-stack"
    class="md:col-span-2 md:row-span-1"
    with-window
    :title="$t('skills.stackTitle')"
    :is-low-end="performance.isLowEnd"
  >
    <div ref="skillsContainerRef" class="p-4 md:p-6 flex flex-col h-full">
      <div
        ref="skillsWrapRef"
        id="skills-wrapper"
        class="flex flex-col gap-4 overflow-hidden relative transition-[max-height] duration-300"
        :style="[
          wrapStyle,
          !showAll && !allFit
            ? {
                maskImage:
                  'linear-gradient(to bottom, black 80%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 80%, transparent 100%)',
              }
            : {},
        ]"
      >
        <div
          v-for="category in categories"
          :key="category.name"
          class="flex flex-col gap-2 pb-2 border-b border-finished-text/5 last:border-0 last:pb-0"
        >
          <button
            type="button"
            class="flex items-center justify-between w-full text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded px-1 -mx-1"
            :aria-expanded="expandedCategories.has(category.name)"
            :aria-controls="`category-content-${category.name.replace(/\s+/g, '-')}`"
            @click="toggleCategory(category.name)"
          >
            <h3
              class="text-[0.7rem] md:text-sm text-finished-accent uppercase tracking-widest font-mono font-bold transition-colors duration-[var(--theme-transition-duration)] group-hover:opacity-80"
            >
              {{ $t(category.name) }}
            </h3>
            <span
              class="text-finished-accent/50 group-hover:text-finished-accent transition-transform duration-300"
              :class="{ 'rotate-180': expandedCategories.has(category.name) }"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>

          <div
            :id="`category-content-${category.name.replace(/\s+/g, '-')}`"
            class="grid transition-all duration-300 ease-in-out"
            :class="
              expandedCategories.has(category.name)
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            "
          >
            <div class="overflow-hidden">
              <div class="flex flex-wrap gap-1.5 md:gap-2 pt-1">
                <span
                  v-for="skill in category.skills"
                  :key="skill"
                  class="px-2 py-0.5 md:px-2.5 md:py-1 border border-finished-text/5 bg-finished-text/[0.03] rounded-full text-xs md:text-xs uppercase tracking-widest text-finished-text/40 hover:border-finished-accent/30 hover:text-finished-text/80 transition-colors duration-[var(--theme-transition-duration)]"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="showToggle"
        type="button"
        class="mt-4 self-start text-xs font-mono tracking-widest uppercase text-finished-accent/50 hover:text-finished-accent transition-colors duration-200 cursor-pointer z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded px-2 py-1 -ml-2"
        :aria-expanded="showAll"
        aria-controls="skills-stack"
        @click="showAll = !showAll"
      >
        {{ showAll ? $t("skills.showLess") : $t("skills.showMore") }}
      </button>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import BentoCard from '@/components/shared/BentoCard.vue';
import { SKILL_SECTIONS } from '@/data/portfolio';
import { usePerformanceStore } from '@/stores/usePerformanceStore';

const performance = usePerformanceStore();
const stack = SKILL_SECTIONS.find((s) => s.id === 'stack') || SKILL_SECTIONS[0];
const categories = stack.categories || [];

const showAll = ref(false);
const allFit = ref(true);
const skillsContainerRef = ref<HTMLElement | null>(null);
const skillsWrapRef = ref<HTMLElement | null>(null);

// Initialize with no categories expanded (folded by default)
const expandedCategories = ref<Set<string>>(new Set());

function toggleCategory(name: string) {
  const newSet = new Set(expandedCategories.value);
  if (newSet.has(name)) {
    newSet.delete(name);
  } else {
    newSet.add(name);
  }
  expandedCategories.value = newSet;

  // Recalculate max-height after transition
  setTimeout(() => {
    if (!showAll.value) calculateVisibleSkills();
  }, 350);
}

const maxContentHeight = ref<number | null>(null);

function calculateVisibleSkills() {
  if (showAll.value) return;
  if (!skillsContainerRef.value || !skillsWrapRef.value) return;

  const stackCard = skillsContainerRef.value.closest('#skills-stack');
  const discoveryCard = document.getElementById('about-discovery');

  if (!discoveryCard || !stackCard) {
    allFit.value = true;
    maxContentHeight.value = null;
    return;
  }

  const discoveryHeight = discoveryCard.getBoundingClientRect().height;
  const stackCardRect = stackCard.getBoundingClientRect();

  const containerStyle = getComputedStyle(skillsContainerRef.value);
  const containerPadding =
    parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom);

  const containerRect = skillsContainerRef.value.getBoundingClientRect();
  const headerHeight = containerRect.top - stackCardRect.top;

  const buttonSpace = 40;
  const availableContentHeight = discoveryHeight - headerHeight - containerPadding - buttonSpace;

  const realHeight = skillsWrapRef.value.scrollHeight;

  if (realHeight <= availableContentHeight + buttonSpace) {
    allFit.value = true;
    maxContentHeight.value = null;
  } else {
    allFit.value = false;
    maxContentHeight.value = availableContentHeight;
  }
}

const showToggle = computed(() => {
  if (showAll.value) return true;
  return !allFit.value;
});

const wrapStyle = computed(() => {
  if (showAll.value || allFit.value || maxContentHeight.value === null) {
    return { maxHeight: 'none' };
  }
  return { maxHeight: `${maxContentHeight.value}px` };
});

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  nextTick(() => {
    requestAnimationFrame(() => {
      calculateVisibleSkills();
    });
  });

  const discoveryCard = document.getElementById('about-discovery');
  if (discoveryCard) {
    resizeObserver = new ResizeObserver(() => {
      if (!showAll.value) {
        calculateVisibleSkills();
      }
    });
    resizeObserver.observe(discoveryCard);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

watch(showAll, (expanded) => {
  if (!expanded) {
    nextTick(() => {
      requestAnimationFrame(() => {
        calculateVisibleSkills();
      });
    });
  }
});
</script>
