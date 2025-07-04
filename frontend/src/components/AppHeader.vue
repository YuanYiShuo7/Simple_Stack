<template>
  <header class="app-header">
    <div class="header-content">
      <div class="user-info" @click="emit('open-profile')">
        <span class="username">{{ userName }}</span>
        <div class="user-avatar">
          <img 
            :src="avatarUrl" 
            alt="User Avatar"
            class="avatar-img"
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import defaultAvatar from '@/assets/imgs/default.png'; // 导入默认头像

const props = defineProps({
  userName: {
    type: String,
    default: 'User'
  },
  avatar: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['open-profile']);

const avatarUrl = computed(() => {
  return props.avatar || defaultAvatar;
});
</script>

<style scoped lang="scss">
@import '@/styles/index';

.app-header {
  background-color: var(--color-primary);
  color: $text-light;
  padding: 0 $spacing-unit;
  height: 48px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .header-content {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-end;
  }

  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 4px 8px;
    border-radius: 4px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .username {
      margin-right: 10px;
      font-weight: 500;
      color: white;
    }
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background-color: rgba($white, 0.2);
    overflow: hidden;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  }
}
</style>