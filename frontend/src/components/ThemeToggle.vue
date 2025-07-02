<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

defineProps({
  class: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'fixed', // 'fixed' | 'relative'
    validator: (value: string) => ['fixed', 'relative'].includes(value)
  }
});
</script>

<template>
  <button 
    class="theme-toggle"
    :class="position"
    @click="themeStore.switchTheme"
  >
    {{ themeStore.themes[themeStore.currentThemeIndex].name }} Theme
  </button>
</template>

<style scoped lang="scss">
@import '@/styles/index';

.theme-toggle {
  padding: $spacing-small $spacing-unit;
  border-radius: $border-radius;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  border: none;
  font-weight: 600;
  background-color: var(--color-primary);
  color: $text-light;
  
  &:hover {
    background-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: $box-shadow-hover;
  }

  &:active {
    transform: translateY(0);
  }

  &.fixed {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
  }

  &.relative {
    position: relative;
    display: inline-block;
  }
}
</style>