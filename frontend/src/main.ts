import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import '@/styles/index.scss';
import globalComponents from '@/components';
import router from '@/router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(globalComponents);

const userStore = useUserStore();
userStore.initUser();

app.mount('#app');