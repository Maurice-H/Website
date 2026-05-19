import { createPinia } from 'pinia';
import { createApp } from 'vue';
import './index.css';
import i18n from '@/i18n';
import { bootstrapThreeJS } from '@/utils/three-bootstrap';
import App from './App.vue';
import { usePerformanceStore } from './stores/usePerformanceStore';

// Apply global Three.js patches before any Vue component is parsed
bootstrapThreeJS();

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(i18n);

// Synchronously initialize performance tier from overrides before mounting
// This prevents the initial render from requesting WebGL resources in Tier 1.
const performance = usePerformanceStore(pinia);
performance.initTierFromOverrides();

app.mount('#app');
