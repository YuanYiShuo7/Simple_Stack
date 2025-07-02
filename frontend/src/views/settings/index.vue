<template>
  <div class="settings-container">
    <AppHeader 
      :user-name="userStore.userInfo?.username || 'User'"
      :avatar="userStore.userInfo?.avatar || ''"
      @open-profile="showProfileCard = true"
    />
    
    <main class="settings-main">
      <AppSidebar 
        :nav-items="navItems"
        :active-nav="activeNav"
        @nav-change="activeNav = $event"
      />
      
      <div class="content-area">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import AppHeader from '@/components/AppHeader.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import ProfileCard from '@/components/ProfileCard.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { showToast } from '@/utils/feedback';

const router = useRouter();
const userStore = useUserStore();
const activeNav = ref('/settings');
const showProfileCard = ref(false);

const navItems = [
  { path: '/', name: 'Home', icon: 'home' },
  { path: '/settings', name: 'Settings', icon: 'set' }
];

const updateUsername = async (data: { username: string }) => {
  try {
    await userStore.updateUserInfo(data);
    showProfileCard.value = false;
  } catch (error) {
    console.error('Failed to update user:', error);
    showToast('Failed to update user information', 'error');
  }
};

const updateAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await reqUpdateAvatar(formData);

    userStore.userInfo.avatar = response.data.avatarUrl;
  } catch (error) {
    console.error('Avatar upload failed:', error);
    showToast('Failed to upload avatar', 'error');
  }
};

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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.settings-main {
  display: flex;
  flex: 1;
  width: 100%;
  margin-top: 48px;
}

.content-area {
  flex: 1;
  margin-left: 250px;
  padding: $spacing-unit;
  min-height: calc(100vh - 48px);
}

.settings-card {
  @include card;
  padding: $spacing-large;
  text-align: left;
  max-width: 800px;
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
  
  span {
    color: $text-color;
  }
}

.logout-button {
  @include button-variant(var(--color-primary), $text-light);
  padding: $spacing-small $spacing-medium;
  
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
  .settings-main {
    flex-direction: column;
    margin-top: 48px;
  }

  .content-area {
    margin-left: 0;
    padding: $spacing-unit;
    min-height: auto;
  }
}
</style>