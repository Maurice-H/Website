import Tres from '@tresjs/core';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import './index.css';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.use(Tres);
app.mount('#app');
