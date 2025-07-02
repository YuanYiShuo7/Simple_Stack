<template>
  <nav class="app-sidebar">
    <ul class="nav-menu">
      <li 
        v-for="item in navItems" 
        :key="item.path"
        :class="{ active: activeNav === item.path }"
        @click="$emit('nav-change', item.path)"
      >
        <router-link :to="item.path" class="nav-link">
          <SvgIcon 
            :name="item.icon"  
            class="nav-icon" 
          />
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface NavItem {
  path: string;
  name: string;
  icon: string;
}

defineProps({
  navItems: {
    type: Array as () => NavItem[],
    required: true
  },
  activeNav: {
    type: String,
    default: '/'
  }
});

defineEmits(['nav-change']);
</script>

<style scoped lang="scss">
@import '@/styles/index';

.app-sidebar {
  width: 250px;
  background-color: $background-color;
  position: fixed;
  top: 48px;
  left: 0;
  bottom: 0;
  padding: $spacing-unit;
  border-right: 1px solid $border-color;
  overflow-y: auto;
  z-index: 900;

  .nav-menu {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: $spacing-small;
      border-radius: $border-radius;
      transition: background-color $transition-duration $transition-timing;

      &.active {
        background-color: $light-gray;
        .nav-link {
          color: $text-color;
          .nav-icon, .nav-text {
            color: inherit;
          }
        }
      }

      &:hover:not(.active) {
        background-color: $background-alt;
      }

      .nav-link {
        display: flex;
        align-items: center;
        padding: $spacing-small $spacing-unit;
        color: $text-color;
        text-decoration: none;

        .nav-icon {
          margin-right: $spacing-small;
          font-size: 1.2rem;
        }

        .nav-text {
          font-weight: 500;
        }
      }
    }
  }
}
</style>