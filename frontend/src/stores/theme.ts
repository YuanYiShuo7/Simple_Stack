import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const themes = [
    { name: 'Yellow', primary: '#ffd700', secondary: '#ffdf40', accent: '#ffc000' },
    { name: 'Blue', primary: '#2196F3', secondary: '#64B5F6', accent: '#1976D2' },
    { name: 'Green', primary: '#4CAF50', secondary: '#81C784', accent: '#2E7D32' },
    { name: 'Purple', primary: '#9C27B0', secondary: '#BA68C8', accent: '#7B1FA2' }
  ];

  // 从 localStorage 初始化主题索引
  const currentThemeIndex = ref(
    Number(localStorage.getItem('themeIndex')) || 0
  );

  // 应用主题到 CSS 变量
  const applyTheme = (index: number) => {
    const theme = themes[index];
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
  };

  // 切换主题并保存偏好
  const switchTheme = () => {
    currentThemeIndex.value = (currentThemeIndex.value + 1) % themes.length;
  };

  // 监听主题变化并持久化
  watch(currentThemeIndex, (newIndex) => {
    localStorage.setItem('themeIndex', String(newIndex));
    applyTheme(newIndex);
  }, { immediate: true }); // 初始化时立即应用

  return { themes, currentThemeIndex, switchTheme };
});