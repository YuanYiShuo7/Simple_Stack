<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { reqRegister, reqSendVerificationCode } from '@/api/user/index';
import { showToast } from '@/utils/feedback';
import ThemeToggle from '@/components/ThemeToggle.vue';

const router = useRouter();

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
});

const isLoading = ref(false);
const errorMessage = ref('');
const countdown = ref(0);
const countdownInterval = ref<number>();

// 发送验证码
const sendVerificationCode = async () => {
  if (!form.value.email) {
    showToast('Please enter your email first', 'error');
    return;
  }

  if (countdown.value > 0) return;

  try {
    await reqSendVerificationCode({ email: form.value.email, type:'register' });
    showToast('Verification code sent', 'success');
    startCountdown();
  } catch (error) {
    showToast('Failed to send verification code', 'error');
  }
};

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60;
  countdownInterval.value = window.setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval.value);
    }
  }, 1000);
};

// 注册提交
const handleSubmit = async () => {
  // 表单验证
  if (!form.value.username || !form.value.email || !form.value.password || 
      !form.value.confirmPassword || !form.value.verificationCode) {
    errorMessage.value = 'Please fill in all fields';
    showToast('Please fill in all fields', 'error');
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match';
    showToast('Passwords do not match', 'error');
    return;
  }

  if (form.value.verificationCode.length !== 6) {
    errorMessage.value = 'Verification code must be 6 digits';
    showToast('Verification code must be 6 digits', 'error');
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const registerRes = await reqRegister({
      username: form.value.username,
      password: form.value.password,
      email: form.value.email,
      verificationCode: form.value.verificationCode
    });

    if (registerRes.code !== 200) {
      throw new Error(registerRes.message || 'Registration failed');
    }

    showToast('Registration successful', 'success');
    router.push('/login');
  } catch (error: any) {
    errorMessage.value = error.message || 'Registration failed. Please try again.';
    showToast(error.message || 'Registration failed', 'error');
  } finally {
    isLoading.value = false;
  }
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
  }
});
</script>

<template>
  <div class="login-container">
    <ThemeToggle />
    
    <div class="login-card">
      <SvgIcon name="dog" size="60px"/>
      <div class="login-header">
        <h4>Create Your Account</h4>
        <p>Join Simple Stack today</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Choose a username"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Create a password"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="verificationCode">Verification Code</label>
          <div class="code-input-group">
            <input
              id="verificationCode"
              v-model="form.verificationCode"
              type="text"
              placeholder="Enter verification code"
              required
            >
            <button 
              type="button" 
              class="send-code-btn"
              :disabled="countdown > 0"
              @click="sendVerificationCode"
            >
              {{ countdown > 0 ? `${countdown}s` : 'Send Code' }}
            </button>
          </div>
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">Sign Up</span>
          <span v-else>Creating Account...</span>
        </button>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
      
      <div class="login-footer">
        <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
@import '@/styles/index';

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-unit;
  background-color: $background-alt;
}

.login-card {
  @include card;
  width: 100%;
  max-width: 420px;
  padding: $spacing-large;
  background-color: $background-color;
  
  .login-header {
    text-align: center;
    margin-bottom: $spacing-large;
    
    h4 {
      color: var(--color-primary);
      margin-bottom: $spacing-small;
    }
    
    p {
      color: $text-muted;
    }
  }
}

.login-form {
  .form-group {
    margin-bottom: $spacing-unit;
    
    label {
      display: block;
      margin-bottom: $spacing-small;
      font-weight: 600;
      color: $text-color;
    }
    
    input {
      width: 100%;
      padding: $spacing-small $spacing-unit;
      border: 1px solid $border-color;
      border-radius: $border-radius;
      font-size: 1rem;
      transition: border-color $transition-duration $transition-timing;
      
      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(var(--color-primary), 0.2);
      }
    }

    .code-input-group {
      display: flex;
      gap: $spacing-small;

      input {
        flex: 1;
      }

      .send-code-btn {
        @include button-variant(var(--color-primary), $text-light);
        white-space: nowrap;
        padding: 0 $spacing-unit;
        font-size: 0.875rem;
        min-width: 100px;

        &:disabled {
          background-color: $medium-gray;
          cursor: not-allowed;
        }
      }
    }
  }
  
  .login-button {
    @include button-variant(var(--color-primary), $text-light);
    width: 100%;
    padding: $spacing-unit;
    font-size: 1rem;
    font-weight: 600;
    margin-top: $spacing-unit;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
  
  .error-message {
    color: #e74c3c;
    margin-top: $spacing-unit;
    text-align: center;
    font-size: 0.875rem;
  }
}

.login-footer {
  text-align: center;
  margin-top: $spacing-large;
  padding-top: $spacing-unit;
  border-top: 1px solid $border-color;
  font-size: 0.875rem;
  
  a {
    color: var(--color-primary);
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

// 响应式调整
@media (max-width: $breakpoint-sm) {
  .login-card {
    padding: $spacing-unit;
  }
}
</style>