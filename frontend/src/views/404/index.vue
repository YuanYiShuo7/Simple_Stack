<template>
  <div class="error-container">
    <div class="error-card">
      <SvgIcon name="warning" size="80px" color="var(--color-primary)" />
      <h2>404 - Page Not Found</h2>
      <p class="description">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="action-buttons">
        <router-link to="/" class="home-button">
          <SvgIcon name="home" size="16px" />
          Back to Home
        </router-link>
        <button @click="goBack" class="back-button">
          <SvgIcon name="arrow-left" size="16px" />
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
@import '@/styles/index';

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-unit;
  background-color: $background-alt;
}

.error-card {
  @include card;
  text-align: center;
  padding: $spacing-large * 2;
  max-width: 500px;
  width: 100%;
  
  h2 {
    color: var(--color-primary);
    margin: $spacing-unit 0;
  }

  .description {
    color: $text-muted;
    font-size: 1.1rem;
    margin-bottom: $spacing-large;
  }

  .action-buttons {
    display: flex;
    gap: $spacing-unit;
    justify-content: center;
    flex-wrap: wrap;

    .home-button, .back-button {
      @include button-variant(var(--color-primary), $text-light);
      display: flex;
      align-items: center;
      gap: $spacing-small;
      padding: $spacing-unit $spacing-large;
      font-weight: 600;
    }

    .back-button {
      @include button-variant($background-color, var(--color-primary));
      border: 1px solid var(--color-primary);
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .error-card {
    padding: $spacing-large;
    
    h1 {
      font-size: 2rem;
    }
  }
}
</style>