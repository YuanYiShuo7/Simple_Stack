<template>
  <div class="home-container">
    <!-- 顶部主题色边栏 -->
    <header class="home-header">
      <div class="header-content">
        <div class="user-avatar" @click="goToProfile">
          <img 
            v-if="userStore.userInfo?.avatar" 
            :src="userStore.userInfo.avatar" 
            alt="User Avatar"
            class="avatar-img"
          >
          <div v-else class="avatar-fallback">
            {{ userInitial }}
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="home-main">
      <!-- 左侧导航栏 -->
      <nav class="sidebar">
        <ul class="nav-menu">
          <li 
            v-for="item in navItems" 
            :key="item.path"
            :class="{ active: activeNav === item.path }"
            @click="activeNav = item.path"
          >
            <router-link :to="item.path" class="nav-link">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-text">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <div class="construction-card">
          <h3>Under Construction</h3>
          <p>This section is currently being developed.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const activeNav = ref('/');

const navItems = [
  { path: '/', name: 'Home', icon: '🏠' },
  { path: '/settings', name: 'Settings', icon: '⚙️' }
];

const userInitial = computed(() => {
  return userStore.userInfo?.username?.charAt(0).toUpperCase() || 'U';
});

const goToProfile = () => {
  router.push('/profile');
};
</script>

<style scoped lang="scss">
@import '@/styles/index';

.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.home-header {
  background-color: var(--color-primary);
  color: $text-light;
  padding: 0 $spacing-unit; // 减少垂直padding使顶栏更窄
  height: 48px; // 固定高度使顶栏更窄
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end; // 使内容靠右对齐
  align-items: center;

  .user-avatar {
    width: 36px; // 稍微缩小头像尺寸
    height: 36px;
    border-radius: 50%;
    background-color: rgba($white, 0.2);
    cursor: pointer;
    transition: transform $transition-duration $transition-timing;
    margin-left: auto; // 确保头像在最右侧

    &:hover {
      transform: scale(1.1);
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .avatar-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: $white;
    }
  }
}

.home-main {
  display: flex;
  flex: 1;
  width: 100%;
  margin-top: 48px; // 调整与窄顶栏匹配
}

.sidebar {
  width: 220px;
  background-color: $background-color;
  position: fixed;
  top: 48px; // 调整与窄顶栏匹配
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
        background-color: rgba(var(--color-primary), 0.1);
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

.content-area {
  flex: 1;
  margin-left: 220px;
  padding: $spacing-unit;
  min-height: calc(100vh - 48px); // 调整与窄顶栏匹配
  display: flex;
  align-items: center;
  justify-content: center;

  .construction-card {
    @include card;
    text-align: center;
    padding: $spacing-large;
    width: 100%;
    max-width: 500px;

    h3 {
      color: var(--color-primary);
      margin-bottom: $spacing-small;
    }

    p {
      color: $text-muted;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .home-main {
    flex-direction: column;
    margin-top: 48px;
  }

  .sidebar {
    width: 100%;
    position: static;
    border-right: none;
    border-bottom: 1px solid $border-color;
    padding: $spacing-unit;
    margin-bottom: 0;
    height: auto;
  }

  .content-area {
    margin-left: 0;
    padding: $spacing-unit;
    min-height: auto;
  }
}
</style>