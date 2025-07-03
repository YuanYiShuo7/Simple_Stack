<template>
  <div class="user-container">
    <AppHeader 
      :user-name="userStore.userInfo?.username || 'User'"
      :avatar="userStore.userInfo?.avatar || ''"
      @open-profile="showProfileCard = true"
    />
    
    <main class="user-main">
      <AppSidebar 
        :nav-items="userNavItems"
        :active-nav="activeNav"
        @nav-change="handleNavChange"
      />
      
      <div class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    
    <ProfileCard 
      :visible="showProfileCard" 
      :user="userStore.userInfo"
      @close="showProfileCard = false"
      @update-username="updateUsername"
      @update-avatar="updateAvatar"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import AppHeader from '@/components/AppHeader.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import ProfileCard from '@/components/ProfileCard.vue';
import { showToast } from '@/utils/feedback';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const showProfileCard = ref(false);

// Set active nav based on current route
const activeNav = computed(() => route.path);

// User-specific navigation items
const userNavItems = computed(() => [
  { path: '/user', name: 'Home', icon: 'home' },
  { path: '/user/settings', name: 'Settings', icon: 'settings' }
  // Add more user-specific routes here
]);

function handleNavChange(path: string) {
  router.push(path);
}

async function updateUsername(data: {username: string}) {
  try {
    await userStore.updateUsername(data);
    showProfileCard.value = false;
    showToast('Username updated successfully', 'success');
  } catch (error) {
    console.error('Failed to update username:', error);
    showToast('Failed to update username', 'error');
  }
}

async function updateAvatar(file: File) {
  try {
    await userStore.updateAvatar(file);
    showToast('Avatar updated successfully', 'success');
  } catch (error) {
    console.error('Avatar upload failed:', error);
    showToast('Failed to upload avatar', 'error');
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index';

.user-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.user-main {
  display: flex;
  flex: 1;
  width: 100%;
  margin-top: 48px; // Adjust based on header height
}

.content-area {
  flex: 1;
  margin-left: 250px; // Adjust based on sidebar width
  padding: $spacing-unit;
  min-height: calc(100vh - 48px);
  overflow-y: auto;
}

// Transition effects
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: $breakpoint-md) {
  .user-main {
    flex-direction: column;
  }

  .content-area {
    margin-left: 0;
    padding: $spacing-unit;
    min-height: auto;
  }
}
</style>