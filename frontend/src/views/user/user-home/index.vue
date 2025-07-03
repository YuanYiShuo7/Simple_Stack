<template>
  <div class="home-content">
    <h1>欢迎回来, {{ userStore.userInfo?.username || '用户' }}!</h1>
    
    <div class="stats-cards">
      <div class="card" v-for="item in stats" :key="item.title">
        <h3>{{ item.value }}</h3>
        <p>{{ item.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const stats = [
  { title: '项目数量', value: '12' },
  { title: '消息通知', value: '3' },
  { title: '待办事项', value: '5' }
];
</script>

<style scoped lang="scss">
@import '@/styles/index';

.home-content {
  padding: $spacing-unit;
  
  h1 {
    color: var(--color-primary);
    margin-bottom: $spacing-large;
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-unit;
  
  .card {
    @include card;
    padding: $spacing-large;
    text-align: center;
    
    h3 {
      font-size: 1.8rem;
      color: var(--color-primary);
      margin-bottom: $spacing-small;
    }
    
    p {
      color: $text-muted;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>