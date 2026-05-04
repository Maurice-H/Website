import { createPinia } from 'pinia';
import { createApp } from 'vue';
import './index.css';
import App from './App.vue';
import { usePerformanceStore } from './stores/usePerformanceStore';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Synchronously initialize performance tier from overrides before mounting
// This prevents the initial render from requesting WebGL resources in Tier 1.
const performance = usePerformanceStore(pinia);
performance.initTierFromOverrides();

app.mount('#app');
