// components/index.ts
import type { App } from 'vue'

const modules = import.meta.glob('./**/index.vue', { eager: true });

export default {
  install(app: App) {
    Object.entries(modules).forEach(([fileName, componentConfig]: [string, any]) => {
      // 获取组件的 PascalCase 命名
      const componentName = fileName
        .split('/')[1]
        .replace(/\.\w+$/, '');

      // 注册组件
      app.component(
        componentName,
        componentConfig.default || componentConfig
      );
    });
  }
}