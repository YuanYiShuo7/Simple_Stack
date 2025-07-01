<script setup lang="ts">
import { ref } from 'vue';

const themes = [
  { name: 'Yellow', primary: '#ffd700', secondary: '#ffdf40', accent: '#ffc000' },
  { name: 'Blue', primary: '#2196F3', secondary: '#64B5F6', accent: '#1976D2' },
  { name: 'Green', primary: '#4CAF50', secondary: '#81C784', accent: '#2E7D32' },
  { name: 'Purple', primary: '#9C27B0', secondary: '#BA68C8', accent: '#7B1FA2' }
];

const currentTheme = ref(0);

const switchTheme = () => {
  currentTheme.value = (currentTheme.value + 1) % themes.length;
  const theme = themes[currentTheme.value];
  
  document.documentElement.style.setProperty('--color-primary', theme.primary);
  document.documentElement.style.setProperty('--color-secondary', theme.secondary);
  document.documentElement.style.setProperty('--color-accent', theme.accent);
};
</script>

<template>
  <button class="theme-toggle" @click="switchTheme">
    {{ themes[currentTheme].name }} Theme
  </button>
</template>

<style scoped lang="scss">
@import '@/styles/variables';

.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: $text-light;
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  font-weight: 600;
  z-index: 1000;
  transition: all $transition-duration $transition-timing;
  
  &:hover {
    background-color: var(--color-accent);
    transform: translateY(-2px);
  }
}
</style>