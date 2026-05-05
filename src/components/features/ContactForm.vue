<template>
  <BentoCard
    id="contact-form"
    class="md:col-span-4 md:row-span-1 flex flex-col"
    with-window
    title="Get In Touch"
    :is-low-end="performance.isLowEnd"
  >
    <div class="p-4 md:p-10 flex flex-col h-full">
      <p class="text-slate-400 text-xs md:text-sm mb-4 md:mb-8 font-mono tracking-wide">
        Establish direct channel for collaboration.
      </p>

      <form @submit.prevent class="flex flex-col gap-3 md:gap-4 flex-1">
        <div class="flex flex-col gap-1.5">
          <label for="contact-name" class="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">
            Name <span class="text-finished-accent" aria-hidden="true">*</span>
          </label>
          <div class="input-wrapper">
            <input
              id="contact-name"
              type="text"
              required
              placeholder="Enter your designation"
              class="contact-input w-full px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="contact-email" class="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">
            Email <span class="text-finished-accent" aria-hidden="true">*</span>
          </label>
          <div class="input-wrapper">
            <input
              id="contact-email"
              type="email"
              required
              placeholder="Enter comm-link"
              class="contact-input w-full px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5 flex-1">
          <label for="contact-message" class="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">
            Message <span class="text-finished-accent" aria-hidden="true">*</span>
          </label>
          <div class="input-wrapper h-full">
            <textarea
              id="contact-message"
              required
              placeholder="Transmit payload..."
              class="contact-input w-full h-full min-h-[100px] px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors resize-none"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          class="relative w-full py-3 md:py-4 px-6 overflow-hidden rounded border border-finished-accent/40 bg-black/40 text-white font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-finished-accent/15 hover:text-[var(--finished-accent)] hover:border-finished-accent/70 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-300 active:scale-[0.98] group"
        >
          <span class="relative z-10 group-hover:drop-shadow-[0_0_8px_currentColor]">Send Transmission</span>
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-finished-accent/60 group-hover:bg-finished-accent group-hover:h-full transition-all duration-300"></div>
        </button>
      </form>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import { usePerformanceStore } from '../../stores/usePerformanceStore';
import BentoCard from '../shared/BentoCard.vue';

const performance = usePerformanceStore();
</script>

<style scoped>
.input-wrapper {
  position: relative;
  border-top: 1px solid var(--finished-border);
  border-radius: 4px;
  overflow: hidden;
}

.contact-input {
  background: linear-gradient(
    to bottom,
    var(--finished-text-5, rgba(255, 255, 255, 0.05)),
    transparent
  );
  border: 1px solid var(--finished-border);
  border-top: none;
}

.contact-input:focus {
  background: linear-gradient(to bottom, var(--finished-border), transparent);
  border-color: var(--finished-accent);
}
</style>
