<template>
  <BentoCard id="contact-form" class="md:col-span-4 md:row-span-1 flex flex-col" with-window title="Get In Touch">
    <div class="p-10 flex flex-col h-full">
      <p class="text-finished-text/40 text-sm mb-8 font-mono tracking-wide">Establish direct channel for collaboration.</p>
      
      <form @submit.prevent class="flex flex-col gap-5 flex-1">
        <div class="input-wrapper flex flex-col">
          <label for="contact-name" class="sr-only">Name</label>
          <input 
            id="contact-name"
            type="text" 
            placeholder="Name"
            required
            class="contact-input w-full px-4 py-3 text-sm text-finished-text placeholder-finished-text/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--finished-accent)] transition-colors"
          />
        </div>
        <div class="input-wrapper flex flex-col">
          <label for="contact-email" class="sr-only">Email</label>
          <input 
            id="contact-email"
            type="email" 
            placeholder="Email"
            required
            class="contact-input w-full px-4 py-3 text-sm text-finished-text placeholder-finished-text/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--finished-accent)] transition-colors"
          />
        </div>
        <div class="input-wrapper flex-1 flex flex-col">
          <label for="contact-message" class="sr-only">Message</label>
          <textarea 
            id="contact-message"
            placeholder="Message" 
            required
            class="contact-input w-full h-full min-h-[120px] px-4 py-3 text-sm text-finished-text placeholder-finished-text/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--finished-accent)] transition-colors resize-none"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          class="w-full py-4 px-6 bg-[var(--finished-accent)] text-finished-bg font-bold text-[10px] uppercase tracking-[0.3em] rounded border border-finished-text/10 hover:brightness-125 active:scale-[0.98] transition-[filter,transform,colors]"
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
