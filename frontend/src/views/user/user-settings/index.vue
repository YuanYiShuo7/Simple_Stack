<template>
  <div class="settings-container">
    <div class="settings-card">
      <h3 class="settings-title">Settings</h3>
      
      <div class="settings-section">
        <h4>Appearance</h4>
        <div class="settings-item">
          <ThemeToggle position="relative"/>
        </div>
      </div>
      
      <div class="settings-section">
        <h4>Account</h4>
        <div class="settings-item">
          <button class="logout-button" @click="handleLogout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { showToast } from '@/utils/feedback';

const router = useRouter();
const userStore = useUserStore();

const handleLogout = async () => {
  try {
    await userStore.logout();
    showToast('Logged out successfully', 'success');
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    showToast('Logout failed', 'error');
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/index';

.settings-container {
  width: 100%;
  height: 100%;
  padding: $spacing-unit;
}

.settings-card {
  @include card;
  padding: $spacing-large;
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}

.settings-title {
  color: var(--color-primary);
  margin-bottom: $spacing-large;
  font-size: 1.5rem;
  border-bottom: 1px solid $border-color;
  padding-bottom: $spacing-small;
}

.settings-section {
  margin-bottom: $spacing-large;
  
  h4 {
    color: $text-color;
    margin-bottom: $spacing-unit;
    font-weight: 600;
    font-size: 1.1rem;
  }
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-unit 0;
  border-bottom: 1px solid $border-color;
  
  &:last-child {
    border-bottom: none;
  }
}

.logout-button {
  @include button-variant(var(--color-primary), $text-light);
  padding: $spacing-small $spacing-medium;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: $box-shadow-hover;
  }

  &:active {
    transform: translateY(0);
  }
}

@media (max-width: $breakpoint-md) {
  .settings-container {
    padding: $spacing-unit;
  }

  .settings-card {
    padding: $spacing-unit;
  }
}
</style>