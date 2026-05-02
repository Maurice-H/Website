<template>
  <BentoCard
    id="contact-form"
    class="md:col-span-4 md:row-span-1 flex flex-col"
    with-window
    title="Get In Touch"
  >
    <div class="p-10 flex flex-col h-full">
      <p class="text-finished-text/40 text-sm mb-8 font-mono tracking-wide">
        Establish direct channel for collaboration.
      </p>

      <form @submit.prevent class="flex flex-col gap-5 flex-1">
        <div class="input-wrapper">
          <input
            type="text"
            placeholder="Name"
            class="contact-input w-full px-4 py-3 text-sm text-finished-text placeholder-finished-text/20 focus:outline-none transition-colors"
          />
        </div>
        <div class="input-wrapper">
          <input
            type="email"
            placeholder="Email"
            class="contact-input w-full px-4 py-3 text-sm text-finished-text placeholder-finished-text/20 focus:outline-none transition-colors"
          />
        </div>
        <div class="input-wrapper flex-1">
          <textarea
            placeholder="Message"
            class="contact-input w-full h-full min-h-[120px] px-4 py-3 text-sm text-finished-text placeholder-finished-text/20 focus:outline-none transition-colors resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          class="relative w-full py-4 px-6 overflow-hidden rounded border border-finished-accent/40 bg-black/40 text-white font-bold text-xs uppercase tracking-[0.3em] hover:bg-finished-accent/15 hover:text-[var(--finished-accent)] hover:border-finished-accent/70 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 active:scale-[0.98] group"
        >
          <span
            class="relative z-10 group-hover:drop-shadow-[0_0_8px_currentColor]"
            >Send Transmission</span
          >

          <!-- Der Tech-Akzent (wird beim Hovern über die ganze Höhe gezogen) -->
          <div
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-finished-accent/60 group-hover:bg-finished-accent group-hover:h-full transition-all duration-300"
          ></div>
        </button>
      </form>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import BentoCard from '../shared/BentoCard.vue';
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
