<template>
  <BentoCard id="contact-form" class="md:col-span-4 md:row-span-1 flex flex-col" with-window title="Get In Touch">
    <div class="p-10 flex flex-col h-full">
      <p class="text-finished-text/40 text-sm mb-8 font-mono tracking-wide">Establish direct channel for collaboration.</p>
      
      <form @submit.prevent class="flex flex-col gap-5 flex-1">
        <div class="input-wrapper">
          <input 
            type="text" 
            placeholder="Name" 
            class="contact-input w-full px-4 py-3 text-sm text-finished-text placeholder-finished-text/20 focus:outline-none transition-all"
          />
        </div>
        <div class="input-wrapper">
          <input 
            type="email" 
            placeholder="Email" 
            class="contact-input w-full px-4 py-3 text-sm text-finished-text placeholder-finished-text/20 focus:outline-none transition-all"
          />
        </div>
        <div class="input-wrapper flex-1">
          <textarea 
            placeholder="Message" 
            class="contact-input w-full h-full min-h-[120px] px-4 py-3 text-sm text-finished-text placeholder-finished-text/20 focus:outline-none transition-all resize-none"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          class="w-full py-4 px-6 bg-[var(--finished-accent)] text-finished-bg font-bold text-[10px] uppercase tracking-[0.3em] rounded border border-finished-text/10 hover:brightness-125 active:scale-[0.98] transition-all"
        >
          Send Transmission
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
  background: linear-gradient(to bottom, var(--finished-text-5, rgba(255, 255, 255, 0.05)), transparent);
  border: 1px solid var(--finished-border);
  border-top: none;
}

.contact-input:focus {
  background: linear-gradient(to bottom, var(--finished-border), transparent);
  border-color: var(--finished-accent);
}
</style>
