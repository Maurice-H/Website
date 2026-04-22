<template>
  <BentoCard id="contact-form" :colSpan="2" :rowSpan="2" class="flex flex-col">
    <div class="relative mb-6">
       <!-- Header: Fused -->
       <FusedReveal id="contact-header">
         <template #blueprint>
            <h3 class="text-2xl font-bold mb-2 text-white/10">Get In Touch</h3>
            <p class="text-white/5">Have an exciting idea? Let's build it together.</p>
         </template>
         <template #finished>
            <h3 class="text-2xl font-bold mb-2 text-finished-accent">Get In Touch</h3>
            <p class="text-finished-text/70">Have an exciting idea? Let's build it together.</p>
         </template>
       </FusedReveal>
    </div>
    
    <form @submit.prevent class="flex flex-col gap-4 flex-1">
      <!-- Name Field -->
      <FusedReveal id="form-name">
        <template #blueprint>
          <div class="relative overflow-hidden bg-white/5 rounded-lg border border-dashed border-white/5">
              <input 
                type="text" 
                placeholder="Name" 
                class="w-full px-4 py-3 bg-transparent text-white/20 placeholder-white/5 focus:outline-none transition-colors relative z-10"
              />
          </div>
        </template>
        <template #finished>
          <div class="relative overflow-hidden rounded-lg border border-finished-border/30">
              <input 
                type="text" 
                placeholder="Name" 
                class="w-full px-4 py-3 bg-finished-bg text-finished-text placeholder-finished-text/30 focus:outline-none transition-colors relative z-10"
              />
          </div>
        </template>
      </FusedReveal>

      <!-- Email Field -->
      <FusedReveal id="form-email">
        <template #blueprint>
          <div class="relative overflow-hidden bg-white/5 rounded-lg border border-dashed border-white/5">
              <input 
                type="email" 
                placeholder="Email address" 
                class="w-full px-4 py-3 bg-transparent text-white/20 placeholder-white/5 focus:outline-none transition-colors relative z-10"
              />
          </div>
        </template>
        <template #finished>
          <div class="relative overflow-hidden rounded-lg border border-finished-border/30">
              <input 
                type="email" 
                placeholder="Email address" 
                class="w-full px-4 py-3 bg-finished-bg text-finished-text placeholder-finished-text/30 focus:outline-none transition-colors relative z-10"
              />
          </div>
        </template>
      </FusedReveal>

      <!-- Message Field -->
      <FusedReveal id="form-message" class="flex-1">
        <template #blueprint>
          <div class="relative h-full overflow-hidden bg-white/5 rounded-lg border border-dashed border-white/5">
              <textarea 
                placeholder="Your message..." 
                class="w-full h-full min-h-[120px] px-4 py-3 bg-transparent text-white/20 placeholder-white/5 resize-none focus:outline-none relative z-10"
              ></textarea>
          </div>
        </template>
        <template #finished>
          <div class="relative h-full overflow-hidden rounded-lg border border-finished-border/30">
              <textarea 
                placeholder="Your message..." 
                class="w-full h-full min-h-[120px] px-4 py-3 bg-finished-bg text-finished-text placeholder-finished-text/30 resize-none focus:outline-none relative z-10"
              ></textarea>
          </div>
        </template>
      </FusedReveal>

      <!-- Submit Button -->
      <FusedReveal id="form-submit">
        <template #blueprint>
          <button 
            type="submit" 
            class="w-full py-4 px-6 font-bold tracking-wide rounded-lg border border-dashed border-white/5 text-white/5 cursor-not-allowed"
          >
            Send Message
          </button>
        </template>
        <template #finished>
          <button 
            type="submit" 
            class="w-full py-4 px-6 font-bold tracking-wide rounded-lg bg-finished-accent text-finished-bg"
          >
            Send Message
          </button>
        </template>
      </FusedReveal>
    </form>
  </BentoCard>
</template>

<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: template-use
import BentoCard from '../shared/BentoCard.vue';
// biome-ignore lint/correctness/noUnusedImports: template-use
import FusedReveal from '../shared/FusedReveal.vue';
</script>
